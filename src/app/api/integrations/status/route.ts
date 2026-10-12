import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { sendTelegramAlert } from "@/lib/integrations/notifications/telegram";
import { sendDiscordWebhook } from "@/lib/integrations/notifications/discord";
import { sendEmail } from "@/lib/integrations/email/mailer";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || (session.role !== "SUPER_ADMIN" && session.role !== "PROJECT_MANAGER")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const hasTelegram = !!(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID);
    const hasDiscord = !!process.env.DISCORD_WEBHOOK_URL;
    const hasResend = !!process.env.RESEND_API_KEY;
    const hasStripe = !!process.env.STRIPE_WEBHOOK_SECRET;
    const hasMidtrans = !!process.env.MIDTRANS_SERVER_KEY;

    // Fetch recent integration activity logs
    const recentLogs = await prisma.activityLog.findMany({
      where: {
        OR: [
          { action: { contains: "NOTIFICATION" } },
          { action: { contains: "WEBHOOK" } },
          { action: { contains: "INVOICE" } },
          { action: { contains: "MIDTRANS" } },
        ],
      },
      orderBy: { createdAt: "desc" },
      take: 8,
    });

    return NextResponse.json({
      success: true,
      channels: {
        telegram: {
          name: "Telegram Bot",
          status: hasTelegram ? "CONNECTED" : "SIMULATED",
          envConfigured: hasTelegram,
          targetChatId: process.env.TELEGRAM_CHAT_ID ? `${process.env.TELEGRAM_CHAT_ID.substring(0, 4)}***` : "Simulation Mode",
        },
        discord: {
          name: "Discord Webhook",
          status: hasDiscord ? "CONNECTED" : "SIMULATED",
          envConfigured: hasDiscord,
        },
        resend: {
          name: "Resend Email",
          status: hasResend ? "CONNECTED" : "SIMULATED",
          envConfigured: hasResend,
          sender: process.env.RESEND_FROM_EMAIL || "Labs Stdio <onboarding@resend.dev>",
        },
        stripe: {
          name: "Stripe Webhook (Global / USD)",
          status: hasStripe ? "LISTENING_SECURE" : "LISTENING_DEV",
          envConfigured: hasStripe,
          endpointUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/webhooks/stripe`,
        },
        midtrans: {
          name: "Midtrans Webhook (Indonesia QRIS & VA)",
          status: hasMidtrans ? "LISTENING_PRODUCTION" : "LISTENING_SANDBOX",
          envConfigured: hasMidtrans,
          endpointUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/webhooks/midtrans`,
        },
      },
      recentLogs: recentLogs.map((l) => ({
        id: l.id,
        action: l.action,
        actorName: l.actorName,
        details: l.details,
        createdAt: l.createdAt.toISOString(),
      })),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to fetch status" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "SUPER_ADMIN" && session.role !== "PROJECT_MANAGER")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { target } = body; // 'telegram' | 'discord' | 'email' | 'all'

    const startTime = Date.now();
    const results: Record<string, { success: boolean; latencyMs: number; error?: string }> = {};

    if (target === "telegram" || target === "all") {
      const tStart = Date.now();
      const res = await sendTelegramAlert(
        `<b>⚡ Labs Stdio Ping Test</b>\nKoneksi bot Telegram aktif dan responsif.\nWaktu: ${new Date().toLocaleTimeString()}`
      );
      results.telegram = {
        success: res.success,
        latencyMs: Date.now() - tStart,
        error: res.error,
      };
    }

    if (target === "discord" || target === "all") {
      const dStart = Date.now();
      const res = await sendDiscordWebhook({
        title: "⚡ Labs Stdio Ping Test",
        description: "Webhook channel test ping berhasil diverifikasi.",
        color: 10941197,
      });
      results.discord = {
        success: res.success,
        latencyMs: Date.now() - dStart,
        error: res.error,
      };
    }

    if (target === "email" || target === "all") {
      const eStart = Date.now();
      const adminEmail = process.env.AGENCY_NOTIFICATION_EMAIL || session.email;
      const res = await sendEmail({
        to: adminEmail,
        subject: "⚡ Labs Stdio Integration Health Ping",
        html: `<p>Uji koneksi email transaksional berhasil pada ${new Date().toLocaleString()}.</p>`,
      });
      results.email = {
        success: res.success,
        latencyMs: Date.now() - eStart,
        error: res.error,
      };
    }

    // Log this ping to ActivityLog
    await prisma.activityLog.create({
      data: {
        action: "INTEGRATION_HEALTH_PING",
        entityType: "Integration",
        entityId: target,
        actorName: session.name || "Admin",
        details: `Ping test target: ${target}. Total latency: ${Date.now() - startTime}ms`,
      },
    });

    return NextResponse.json({
      success: true,
      totalLatencyMs: Date.now() - startTime,
      results,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Ping test failed" }, { status: 500 });
  }
}
