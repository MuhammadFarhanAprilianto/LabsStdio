import { EventEmitter } from "events";

export interface RealtimeEvent {
  type: "INVOICE_PAID" | "MILESTONE_APPROVED" | "NEW_INQUIRY" | "SCOPE_REQUEST_CREATED" | "PING";
  timestamp: string;
  payload: any;
  organizationId?: string | null;
}

// Global process-wide singleton event emitter
declare global {
  var __realtimeEmitter: EventEmitter | undefined;
}

const emitter: EventEmitter = global.__realtimeEmitter || new EventEmitter();
emitter.setMaxListeners(100);

if (process.env.NODE_ENV !== "production") {
  global.__realtimeEmitter = emitter;
}

/**
 * Publish a real-time event across all active Server-Sent Events (SSE) connections
 */
export function publishRealtimeEvent(event: Omit<RealtimeEvent, "timestamp">) {
  const fullEvent: RealtimeEvent = {
    ...event,
    timestamp: new Date().toISOString(),
  };

  try {
    emitter.emit("realtime", fullEvent);
  } catch (err) {
    console.error("[REALTIME_EMIT_ERROR]", err);
  }
}

/**
 * Subscribe to real-time events
 */
export function subscribeRealtimeEvents(listener: (event: RealtimeEvent) => void): () => void {
  emitter.on("realtime", listener);
  return () => {
    emitter.off("realtime", listener);
  };
}
