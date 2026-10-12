// Telegram Bot Integration for Labs Stdio Agency
export interface TelegramSendResult {
  success: boolean;
  simulated?: boolean;
  messageId?: number;
  error?: string;
}

export async function sendTelegramAlert(
  text: string,
  parseMode: "HTML" | "MarkdownV2" = "HTML"
): Promise<TelegramSendResult> {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();

  // Safe fallback if credentials not yet set in .env
  if (!token || !chatId) {
    console.log("[TELEGRAM_DISPATCH_SIMULATED]", {
      reason: "Credentials pending in .env (TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID)",
      textPreview: text.substring(0, 120) + "...",
    });
    return {
      success: true,
      simulated: true,
      messageId: Math.floor(Math.random() * 100000),
    };
  }

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: parseMode,
        disable_web_page_preview: false,
      }),
    });

    const data = await res.json();
    if (!res.ok || !data.ok) {
      console.error("[TELEGRAM_API_ERROR]", data);
      return { success: false, error: data.description || "Failed to send Telegram message" };
    }

    return { success: true, messageId: data.result?.message_id };
  } catch (error: any) {
    console.error("[TELEGRAM_DISPATCH_EXCEPTION]", error);
    return { success: false, error: error?.message || "Telegram network error" };
  }
}
