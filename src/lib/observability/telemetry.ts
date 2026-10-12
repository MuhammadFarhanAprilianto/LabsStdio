import { prisma } from "@/lib/prisma";

export interface TelemetryEvent {
  id: string;
  level: "INFO" | "WARN" | "ERROR" | "FATAL";
  message: string;
  source: string;
  stackTrace?: string;
  context?: Record<string, any>;
  timestamp: string;
}

export interface SystemHealthMetrics {
  status: "HEALTHY" | "DEGRADED" | "UNHEALTHY";
  uptimeSeconds: number;
  database: {
    connected: boolean;
    latencyMs: number;
  };
  memory: {
    rssMb: number;
    heapUsedMb: number;
    heapTotalMb: number;
  };
  environment: string;
  timestamp: string;
}

// In-memory sliding telemetry ring buffer (last 50 events)
const telemetryBuffer: TelemetryEvent[] = [];
const MAX_BUFFER_SIZE = 50;

/**
 * Capture an error or incident with full observability context
 */
export async function captureException(
  error: unknown,
  context: {
    source: string;
    route?: string;
    userId?: string;
    extra?: Record<string, any>;
  }
): Promise<TelemetryEvent> {
  const errObj = error instanceof Error ? error : new Error(String(error));
  const eventId = "err_" + Math.random().toString(36).substring(2, 9);

  // Mask sensitive credentials
  const sanitizedExtra = { ...(context.extra || {}) };
  for (const key of Object.keys(sanitizedExtra)) {
    if (/password|token|secret|authorization|cookie/i.test(key)) {
      sanitizedExtra[key] = "[REDACTED_BY_OBSERVABILITY]";
    }
  }

  const event: TelemetryEvent = {
    id: eventId,
    level: "ERROR",
    message: errObj.message || "Unknown Runtime Exception",
    source: context.source,
    stackTrace: errObj.stack,
    context: {
      route: context.route,
      userId: context.userId,
      ...sanitizedExtra,
    },
    timestamp: new Date().toISOString(),
  };

  telemetryBuffer.unshift(event);
  if (telemetryBuffer.length > MAX_BUFFER_SIZE) {
    telemetryBuffer.pop();
  }

  console.error(`[OBSERVABILITY_EXCEPTION][${event.id}] ${event.source}: ${event.message}`);

  // Persist to ActivityLog asynchronously without blocking user response
  try {
    await prisma.activityLog.create({
      data: {
        action: "OBSERVABILITY_ERROR_CAPTURED",
        entityType: "SystemIncident",
        entityId: event.id,
        actorName: "Observability Telemetry Engine",
        details: JSON.stringify({
          source: event.source,
          message: event.message,
          route: context.route,
          timestamp: event.timestamp,
        }),
      },
    });
  } catch {
    // Failsafe: Never let telemetry logging crash the main application
  }

  return event;
}

/**
 * Get system health, database latency, and memory telemetry
 */
export async function getSystemHealth(): Promise<SystemHealthMetrics> {
  const dbStart = performance.now();
  let dbConnected = false;
  let dbLatencyMs = 0;

  try {
    // Ping database with lightweight query
    await prisma.$queryRaw`SELECT 1`;
    dbLatencyMs = Math.round((performance.now() - dbStart) * 100) / 100;
    dbConnected = true;
  } catch (err) {
    dbConnected = false;
    dbLatencyMs = -1;
  }

  const mem = process.memoryUsage();
  const bytesToMb = (b: number) => Math.round((b / 1024 / 1024) * 100) / 100;

  const isHealthy = dbConnected && dbLatencyMs < 1000;

  return {
    status: isHealthy ? "HEALTHY" : "DEGRADED",
    uptimeSeconds: Math.floor(process.uptime()),
    database: {
      connected: dbConnected,
      latencyMs: dbLatencyMs,
    },
    memory: {
      rssMb: bytesToMb(mem.rss),
      heapUsedMb: bytesToMb(mem.heapUsed),
      heapTotalMb: bytesToMb(mem.heapTotal),
    },
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  };
}

/**
 * Retrieve recent telemetry incident buffer
 */
export function getRecentIncidents(): TelemetryEvent[] {
  return [...telemetryBuffer];
}
