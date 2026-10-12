import { NextResponse } from "next/server";
import { getSystemHealth, getRecentIncidents } from "@/lib/observability/telemetry";

export const dynamic = "force-dynamic";

/**
 * Enterprise Health Check & Telemetry Monitoring Endpoint
 * Compatible with Datadog, Prometheus, UptimeRobot, and AWS ALB health checks.
 */
export async function GET() {
  try {
    const health = await getSystemHealth();
    const recentIncidents = getRecentIncidents();

    const statusCode = health.status === "HEALTHY" ? 200 : 503;

    return NextResponse.json(
      {
        success: health.status === "HEALTHY",
        data: {
          ...health,
          incidentsCount: recentIncidents.length,
          lastIncident: recentIncidents[0] || null,
        },
      },
      {
        status: statusCode,
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "X-Health-Status": health.status,
          "X-DB-Latency-MS": String(health.database.latencyMs),
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        status: "UNHEALTHY",
        error: "Health check probe failed",
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
