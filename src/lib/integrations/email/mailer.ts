// Resend Email Integration for Labs Stdio
export interface EmailPayload {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}

export interface EmailSendResult {
  success: boolean;
  simulated?: boolean;
  id?: string;
  error?: string;
}

export async function sendEmail(payload: EmailPayload): Promise<EmailSendResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const defaultFrom = process.env.RESEND_FROM_EMAIL?.trim() || "Labs Stdio <onboarding@resend.dev>";

  // Safe fallback if Resend API key is not configured in .env
  if (!apiKey) {
    console.log("[EMAIL_DISPATCH_SIMULATED]", {
      reason: "API key pending in .env (RESEND_API_KEY)",
      to: payload.to,
      subject: payload.subject,
    });
    return {
      success: true,
      simulated: true,
      id: `sim_email_${Date.now()}`,
    };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: payload.from || defaultFrom,
        to: Array.isArray(payload.to) ? payload.to : [payload.to],
        subject: payload.subject,
        html: payload.html,
        reply_to: payload.replyTo,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("[RESEND_API_ERROR]", data);
      return { success: false, error: data.message || "Failed to deliver email" };
    }

    return { success: true, id: data.id };
  } catch (error: any) {
    console.error("[EMAIL_DISPATCH_EXCEPTION]", error);
    return { success: false, error: error?.message || "Email network error" };
  }
}
