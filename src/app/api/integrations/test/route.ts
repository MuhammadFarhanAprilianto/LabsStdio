import { NextResponse } from "next/server";
import { dispatchNotification } from "@/lib/integrations/dispatcher";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const channel = body.channel || "all";

    const testLead = {
      inquiryId: `test_lead_${Date.now()}`,
      fullName: body.fullName || "Alexander Wright",
      email: body.email || "alexander@fintechinnovations.io",
      company: body.company || "Fintech Innovations Global",
      productName: body.productName || "Autonomous Trading AI Terminal",
      selectedFeatures: ["Microservices Architecture", "Realtime WebSockets", "Enterprise SSO", "Custom AI Engine"],
      sprintSpeed: "Hyper-Speed (2x)",
      estimatedWeeks: 4,
      estimatedCost: 38500,
      projectDetails: "Verification test of Pilar 6 Notification Dispatcher across Telegram, Discord, and Email.",
    };

    const results = await dispatchNotification({
      type: "NEW_INQUIRY",
      data: testLead,
    });

    return NextResponse.json({
      success: true,
      message: "Test notification dispatched across integration channels.",
      dispatchedData: testLead,
      channelResults: results,
    });
  } catch (error: any) {
    console.error("[INTEGRATIONS_TEST_ERROR]", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to trigger test notification" },
      { status: 500 }
    );
  }
}
