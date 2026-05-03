import { NextResponse, type NextRequest } from "next/server";
import { appendOrderToSheet } from "@/lib/google-sheets";
import { createOrderRecord, orderInputSchema } from "@/lib/order-schema";
import { sendOrderEmails } from "@/lib/email";

export const maxDuration = 60;

function originAllowed(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  const currentRequestOrigin = request.nextUrl.origin;
  const configuredOrigins = [process.env.FRONTEND_URL, process.env.NEXT_PUBLIC_SITE_URL]
    .flatMap((value) => (value ? value.split(",") : []))
    .map((value) => value.trim().replace(/\/$/, ""))
    .filter(Boolean);

  const allowedOrigins = new Set([
    currentRequestOrigin.replace(/\/$/, ""),
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://branivaoils.tejnarayantharu.com.np",
    "http://branivaoils.tejnarayantharu.com.np",
    ...configuredOrigins
  ]);

  return allowedOrigins.has(origin.replace(/\/$/, ""));
}

export async function POST(request: NextRequest) {
  try {
    if (!originAllowed(request)) {
      return NextResponse.json({ success: false, error: "Request origin is not allowed." }, { status: 403 });
    }

    const payload = await request.json();
    const parsed = orderInputSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Please correct the highlighted fields.",
          fields: parsed.error.flatten().fieldErrors
        },
        { status: 400 }
      );
    }

    const expectedTotal = parsed.data.quantity * parsed.data.pricePerPiece;
    if (Math.abs(expectedTotal - parsed.data.totalPrice) > 0.01) {
      return NextResponse.json({ success: false, error: "Total price does not match quantity and price." }, { status: 400 });
    }

    const order = createOrderRecord(parsed.data);

    try {
      await appendOrderToSheet(order);
    } catch (error) {
      console.error("Google Sheets order save failed:", error);
      return NextResponse.json(
        {
          success: false,
          error: "Order could not be saved to Google Spreadsheet. Please check Google Sheet environment variables and sharing permissions."
        },
        { status: 500 }
      );
    }

    try {
      await sendOrderEmails(order);
    } catch (error) {
      console.error("Order email notification failed:", error);
      return NextResponse.json({
        success: true,
        order,
        emailStatus: "failed",
        warning: "Order was saved successfully, but email notification failed."
      });
    }

    return NextResponse.json({ success: true, order, emailStatus: "sent" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Order submission failed.";
    console.error("Order submission failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: message.includes("Missing environment variable")
          ? message
          : "Order submission failed. Please try again or contact support."
      },
      { status: 500 }
    );
  }
}
