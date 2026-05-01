import { NextResponse, type NextRequest } from "next/server";
import { appendOrderToSheet } from "@/lib/google-sheets";
import { createOrderRecord, orderInputSchema } from "@/lib/order-schema";
import { sendOrderEmails } from "@/lib/email";

function originAllowed(request: NextRequest) {
  const configured = process.env.FRONTEND_URL;
  if (!configured) return true;

  const origin = request.headers.get("origin");
  if (!origin) return true;

  return origin === configured;
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

    await appendOrderToSheet(order);
    await sendOrderEmails(order);

    return NextResponse.json({ success: true, order });
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
