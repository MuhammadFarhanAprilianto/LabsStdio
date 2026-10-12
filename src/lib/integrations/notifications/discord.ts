// Discord / Slack Webhook Integration for Labs Stdio Agency
export interface DiscordEmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

export interface DiscordEmbedPayload {
  title: string;
  description?: string;
  color?: number; // e.g. 10941197 for #a6f30d (Labs neon green)
  fields?: DiscordEmbedField[];
  url?: string;
  footer?: { text: string };
  timestamp?: string;
}

export interface DiscordSendResult {
  success: boolean;
  simulated?: boolean;
  error?: string;
}

export async function sendDiscordWebhook(
  embed: DiscordEmbedPayload,
  content?: string
): Promise<DiscordSendResult> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL?.trim();

  // Safe fallback if webhook URL not yet configured
  if (!webhookUrl) {
    console.log("[DISCORD_DISPATCH_SIMULATED]", {
      reason: "Webhook pending in .env (DISCORD_WEBHOOK_URL)",
      title: embed.title,
    });
    return {
      success: true,
      simulated: true,
    };
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "Labs Stdio Command Center",
        avatar_url: "https://labsstdio.com/favicon.ico",
        content: content,
        embeds: [
          {
            ...embed,
            color: embed.color ?? 10941197, // default #a6f30d
            timestamp: embed.timestamp ?? new Date().toISOString(),
            footer: embed.footer ?? { text: "Labs Stdio Agency OS • Realtime Alerts" },
          },
        ],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("[DISCORD_WEBHOOK_ERROR]", errText);
      return { success: false, error: errText };
    }

    return { success: true };
  } catch (error: any) {
    console.error("[DISCORD_DISPATCH_EXCEPTION]", error);
    return { success: false, error: error?.message || "Discord network error" };
  }
}
