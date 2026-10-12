import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createInquirySchema } from "@/lib/validations/inquiry";
import { applySecurityShield, shieldError } from "@/lib/security";

export async function POST(request: Request) {
  try {
    const shield = await applySecurityShield(request, {
      maxBodyBytes: 512 * 1024,
      rateLimitKey: "inquiry",
      rateLimitMax: 10,
      rateLimitWindowMs: 60000,
    });
    if (!shield.success) return shield.response!;

    const result = createInquirySchema.safeParse(shield.data);

    if (!result.success) {
      const errorMessages = result.error.issues.map((issue) => issue.message);
      return NextResponse.json(
        {
          success: false,
          error: errorMessages[0] || "Invalid request payload",
          details: result.error.issues,
        },
        { status: 400 }
      );
    }

    const {
      fullName,
      email,
      company,
      projectDetails,
      productType,
      productName,
      selectedFeatures,
      velocity,
      estimatedPriceMin,
      estimatedPriceMax,
      estimatedWeeks,
    } = result.data;

    // Persist inquiry to database
    const inquiry = await prisma.inquiry.create({
      data: {
        fullName,
        email: email.toLowerCase(),
        company: company || null,
        projectDetails: projectDetails || null,
        productType,
        productName,
        selectedFeatures: JSON.stringify(selectedFeatures),
        velocity,
        estimatedPriceMin,
        estimatedPriceMax,
        estimatedWeeks,
        status: "NEW",
      },
    });

    // Trigger asynchronous notification dispatcher (Telegram, Discord, Resend Email)
    import("@/lib/integrations/dispatcher").then(({ dispatchNotification }) => {
      dispatchNotification({
        type: "NEW_INQUIRY",
        data: {
          inquiryId: inquiry.id,
          fullName: inquiry.fullName,
          email: inquiry.email,
          company: inquiry.company,
          productName: inquiry.productName,
          selectedFeatures,
          sprintSpeed: velocity,
          estimatedWeeks,
          estimatedCost: estimatedPriceMax,
          projectDetails,
        },
      }).catch((e) => console.error("[DISPATCH_ERROR]", e));
    });

    return NextResponse.json(
      {
        success: true,
        message: "Your project scope inquiry has been received successfully.",
        data: {
          id: inquiry.id,
          fullName: inquiry.fullName,
          productName: inquiry.productName,
          estimatedPriceMin: inquiry.estimatedPriceMin,
          estimatedPriceMax: inquiry.estimatedPriceMax,
          createdAt: inquiry.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return shieldError(error, "Internal server error. Failed to record your inquiry.");
  }
}

export async function GET() {
  try {
    const inquiries = await prisma.inquiry.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const parsedInquiries = inquiries.map((item) => ({
      ...item,
      selectedFeatures: (() => {
        try {
          return JSON.parse(item.selectedFeatures);
        } catch {
          return [];
        }
      })(),
    }));

    return NextResponse.json(
      {
        success: true,
        count: parsedInquiries.length,
        data: parsedInquiries,
      },
      { status: 200 }
    );
  } catch (error) {
    return shieldError(error, "Failed to fetch inquiries.");
  }
}
