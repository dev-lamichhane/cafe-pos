export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { recordSale, recordCreditCustomer } from "@/lib/sales";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { tableId, items, total, discount, finalTotal, paymentType, creditInfo } =
      body;

    // Validate required fields
    if (!tableId || !items || total === undefined || finalTotal === undefined || !paymentType) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Save sale in SQLite
    recordSale({
      tableId,
      itemsJson: JSON.stringify(items),
      total,
      discountAmount: discount?.amount || 0,
      discountPercent: discount?.percent || 0,
      finalTotal,
      paymentType,
    });

    // If credit payment, save customer info
    if (paymentType === "credit" && creditInfo) {
      if (!creditInfo.name || !creditInfo.phone) {
        return NextResponse.json(
          { success: false, error: "Credit customer info incomplete" },
          { status: 400 }
        );
      }
      recordCreditCustomer({
        name: creditInfo.name,
        phone: creditInfo.phone,
        itemsJson: JSON.stringify(items),
        amount: finalTotal,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

