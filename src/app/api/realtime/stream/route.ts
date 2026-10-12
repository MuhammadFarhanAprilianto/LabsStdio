import { NextRequest } from "next/server";
import { subscribeRealtimeEvents, RealtimeEvent } from "@/lib/realtime/events";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Server-Sent Events (SSE) Streaming Route
 * Pushes live platform updates (Invoice paid, Milestone approved, New leads)
 * directly to the connected browser clients with zero page reload.
 */
export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // 1. Send initial connection handshake
      const initialPayload = JSON.stringify({
        type: "CONNECTED",
        timestamp: new Date().toISOString(),
        message: "Real-time SSE link established with Labs Stdio event bus.",
      });
      controller.enqueue(encoder.encode(`data: ${initialPayload}\n\n`));

      // 2. Subscribe to internal event bus
      const unsubscribe = subscribeRealtimeEvents((event: RealtimeEvent) => {
        try {
          const payload = `data: ${JSON.stringify(event)}\n\n`;
          controller.enqueue(encoder.encode(payload));
        } catch (err) {
          console.error("[SSE_ENQUEUE_ERROR]", err);
        }
      });

      // 3. Heartbeat keepalive every 15s to keep connection open through proxies/CDN
      const heartbeatInterval = setInterval(() => {
        try {
          const pingPayload = JSON.stringify({
            type: "PING",
            timestamp: new Date().toISOString(),
          });
          controller.enqueue(encoder.encode(`data: ${pingPayload}\n\n`));
        } catch {
          clearInterval(heartbeatInterval);
        }
      }, 15000);

      // 4. Cleanup on client disconnect
      request.signal.addEventListener("abort", () => {
        clearInterval(heartbeatInterval);
        unsubscribe();
        try {
          controller.close();
        } catch {
          // Stream already closed
        }
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no", // Disables proxy buffering (NGINX/Cloudflare)
    },
  });
}
