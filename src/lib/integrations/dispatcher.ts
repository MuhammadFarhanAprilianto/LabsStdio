import { sendTelegramAlert } from "./notifications/telegram";
import { sendDiscordWebhook } from "./notifications/discord";
import { sendEmail } from "./email/mailer";
import {
  renderClientInquiryConfirmationEmail,
  renderAdminLeadAlertEmail,
} from "./email/templates";
import { prisma } from "@/lib/prisma";
import { withRetry } from "./retry";
import { publishRealtimeEvent } from "@/lib/realtime/events";

export type NotificationEventType =
  | "NEW_INQUIRY"
  | "SCOPE_REQUEST"
  | "INVOICE_PAID"
  | "MILESTONE_APPROVED";

export interface NewInquiryPayload {
  inquiryId: string;
  fullName: string;
  email: string;
  company?: string | null;
  productName: string;
  selectedFeatures: string[];
  sprintSpeed: string;
  estimatedWeeks: number;
  estimatedCost: number;
  projectDetails?: string | null;
}

export interface ScopeRequestPayload {
  requestId: string;
  organizationId: string;
  orgName: string;
  title: string;
  category?: string;
  priority?: string;
  estimatedWeeks?: number;
  requesterName: string;
}

export interface InvoicePaidPayload {
  invoiceId: string;
  invoiceNumber: string;
  orgName: string;
  amount: number;
  currency: string;
  paidAt: string;
  payerName?: string;
  paymentMethod?: string;
}

export interface MilestoneApprovedPayload {
  milestoneId: string;
  milestoneTitle: string;
  projectTitle: string;
  orgName: string;
  approvedBy: string;
  approvalNotes?: string | null;
}

export interface DispatchNotificationEvent {
  type: NotificationEventType;
  data:
    | NewInquiryPayload
    | ScopeRequestPayload
    | InvoicePaidPayload
    | MilestoneApprovedPayload;
}

/**
 * Asynchronous Notification Dispatcher
 * Dispatches to Telegram, Discord, Resend Email, and Activity Logs concurrently
 */
export async function dispatchNotification(event: DispatchNotificationEvent): Promise<{
  success: boolean;
  telegram?: boolean;
  discord?: boolean;
  emailClient?: boolean;
  emailAdmin?: boolean;
}> {
  const adminEmail = process.env.AGENCY_NOTIFICATION_EMAIL || "admin@labsstdio.com";
  const results = {
    success: true,
    telegram: false,
    discord: false,
    emailClient: false,
    emailAdmin: false,
  };

  try {
    switch (event.type) {
      case "NEW_INQUIRY": {
        const d = event.data as NewInquiryPayload;

        // Publish live SSE event
        publishRealtimeEvent({
          type: "NEW_INQUIRY",
          payload: d,
        });

        // 1. Telegram Message
        const tgText = `
🚨 <b>NEW INCOMING LEAD ALERT</b>
━━━━━━━━━━━━━━━━━━━━
👤 <b>Klien:</b> ${d.fullName}
🏢 <b>Perusahaan:</b> ${d.company || "Direct Individual"}
📧 <b>Email:</b> <code>${d.email}</code>
📦 <b>Produk:</b> ${d.productName}
💰 <b>Estimasi Budget:</b> $${d.estimatedCost.toLocaleString()}
⏱ <b>Timeline:</b> ${d.estimatedWeeks} Minggu (${d.sprintSpeed})
━━━━━━━━━━━━━━━━━━━━
🔗 <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin">Buka di Admin CRM</a>
        `.trim();

        // 2. Discord Webhook Embed
        const discordEmbed = {
          title: `🚨 New Lead: ${d.productName}`,
          description: `Calon klien baru saja mengajukan brief via Scope Estimator.`,
          color: 10941197, // #a6f30d
          fields: [
            { name: "Klien", value: d.fullName, inline: true },
            { name: "Perusahaan", value: d.company || "Direct", inline: true },
            { name: "Email", value: d.email, inline: true },
            { name: "Estimasi Budget", value: `$${d.estimatedCost.toLocaleString()}`, inline: true },
            { name: "Durasi Sprint", value: `${d.estimatedWeeks} Minggu (${d.sprintSpeed})`, inline: true },
          ],
          url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin`,
        };

        // Fire all notifications in parallel with automatic exponential backoff retry (Non-blocking)
        const [tgRes, discRes, emailClientRes, emailAdminRes] = await Promise.all([
          withRetry(() => sendTelegramAlert(tgText), { maxAttempts: 3, initialDelayMs: 300 }),
          withRetry(() => sendDiscordWebhook(discordEmbed), { maxAttempts: 3, initialDelayMs: 300 }),
          withRetry(
            () =>
              sendEmail({
                to: d.email,
                subject: `Kalkulasi & Brief Diterima: ${d.productName} - Labs Stdio`,
                html: renderClientInquiryConfirmationEmail(d),
              }),
            { maxAttempts: 3, initialDelayMs: 300 }
          ),
          withRetry(
            () =>
              sendEmail({
                to: adminEmail,
                subject: `🚨 [NEW LEAD] ${d.fullName} - ${d.productName} ($${d.estimatedCost.toLocaleString()})`,
                html: renderAdminLeadAlertEmail(d),
              }),
            { maxAttempts: 3, initialDelayMs: 300 }
          ),
        ]);

        results.telegram = tgRes.success;
        results.discord = discRes.success;
        results.emailClient = emailClientRes.success;
        results.emailAdmin = emailAdminRes.success;

        // Create Activity Log in DB
        await prisma.activityLog.create({
          data: {
            action: "NOTIFICATION_DISPATCHED",
            entityType: "Inquiry",
            entityId: d.inquiryId,
            actorName: "System Automation Dispatcher",
            details: JSON.stringify({
              type: "NEW_INQUIRY",
              telegram: tgRes.success,
              discord: discRes.success,
              emailClient: emailClientRes.success,
            }),
          },
        }).catch(() => null);

        break;
      }

      case "SCOPE_REQUEST": {
        const d = event.data as ScopeRequestPayload;

        // Publish live SSE event
        publishRealtimeEvent({
          type: "SCOPE_REQUEST_CREATED",
          organizationId: d.organizationId,
          payload: d,
        });
        const tgText = `
📌 <b>NEW SCOPE CHANGE REQUEST</b>
━━━━━━━━━━━━━━━━━━━━
🏢 <b>Klien:</b> ${d.orgName}
👤 <b>Diajukan Oleh:</b> ${d.requesterName}
📝 <b>Judul:</b> ${d.title}
🏷 <b>Kategori:</b> ${d.category || "General Add-on"}
⚡ <b>Prioritas:</b> ${d.priority || "NORMAL"}
⏱ <b>Estimasi:</b> ${d.estimatedWeeks || 1} Minggu
━━━━━━━━━━━━━━━━━━━━
🔗 <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin">Tinjau di Admin Dashboard</a>
        `.trim();

        const [tgRes, discRes] = await Promise.all([
          withRetry(() => sendTelegramAlert(tgText), { maxAttempts: 3, initialDelayMs: 300 }),
          withRetry(
            () =>
              sendDiscordWebhook({
                title: `📌 Scope Request: ${d.title}`,
                description: `Permohonan penambahan scope fitur dari ${d.orgName}.`,
                color: 3801087, // Blue
                fields: [
                  { name: "Organisasi", value: d.orgName, inline: true },
                  { name: "Pemohon", value: d.requesterName, inline: true },
                  { name: "Prioritas", value: d.priority || "NORMAL", inline: true },
                ],
              }),
            { maxAttempts: 3, initialDelayMs: 300 }
          ),
        ]);

        results.telegram = tgRes.success;
        results.discord = discRes.success;
        break;
      }

      case "INVOICE_PAID": {
        const d = event.data as InvoicePaidPayload;

        // Publish live SSE event
        publishRealtimeEvent({
          type: "INVOICE_PAID",
          payload: d,
        });
        const tgText = `
💵 <b>INVOICE SETTLED / PAID</b>
━━━━━━━━━━━━━━━━━━━━
🏢 <b>Klien:</b> ${d.orgName}
🧾 <b>No. Invoice:</b> ${d.invoiceNumber}
💰 <b>Jumlah:</b> ${d.currency} ${d.amount.toLocaleString()}
💳 <b>Gateway:</b> ${d.paymentMethod || "International Gateway (Stripe/Midtrans)"}
📅 <b>Waktu Bayar:</b> ${new Date(d.paidAt).toLocaleDateString()}
━━━━━━━━━━━━━━━━━━━━
        `.trim();

        const [tgRes, discRes] = await Promise.all([
          withRetry(() => sendTelegramAlert(tgText), { maxAttempts: 3, initialDelayMs: 300 }),
          withRetry(
            () =>
              sendDiscordWebhook({
                title: `💵 Invoice Paid: ${d.invoiceNumber}`,
                description: `Pembayaran sebesar **${d.currency} ${d.amount.toLocaleString()}** dari **${d.orgName}** berhasil diselesaikan via **${d.paymentMethod || "International Gateway"}**.`,
                color: 10941197, // #a6f30d
              }),
            { maxAttempts: 3, initialDelayMs: 300 }
          ),
        ]);

        results.telegram = tgRes.success;
        results.discord = discRes.success;
        break;
      }

      case "MILESTONE_APPROVED": {
        const d = event.data as MilestoneApprovedPayload;

        // Publish live SSE event
        publishRealtimeEvent({
          type: "MILESTONE_APPROVED",
          payload: d,
        });
        const tgText = `
✅ <b>MILESTONE SIGN-OFF COMPLETED</b>
━━━━━━━━━━━━━━━━━━━━
🏢 <b>Klien:</b> ${d.orgName}
📦 <b>Proyek:</b> ${d.projectTitle}
🎯 <b>Milestone:</b> ${d.milestoneTitle}
✍️ <b>Disetujui Oleh:</b> ${d.approvedBy}
💬 <b>Catatan:</b> ${d.approvalNotes || "Tidak ada catatan."}
━━━━━━━━━━━━━━━━━━━━
        `.trim();

        const [tgRes, discRes] = await Promise.all([
          withRetry(() => sendTelegramAlert(tgText), { maxAttempts: 3, initialDelayMs: 300 }),
          withRetry(
            () =>
              sendDiscordWebhook({
                title: `✅ Milestone Approved: ${d.milestoneTitle}`,
                description: `${d.orgName} telah memberikan sign-off pada milestone ini.`,
                color: 10941197,
                fields: [
                  { name: "Proyek", value: d.projectTitle, inline: true },
                  { name: "Signee", value: d.approvedBy, inline: true },
                ],
              }),
            { maxAttempts: 3, initialDelayMs: 300 }
          ),
        ]);

        results.telegram = tgRes.success;
        results.discord = discRes.success;
        break;
      }
    }
  } catch (error) {
    console.error("[NOTIFICATION_DISPATCHER_ERROR]", error);
  }

  return results;
}
