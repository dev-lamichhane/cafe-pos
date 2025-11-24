import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { recordSale } from "@/lib/sales";

export async function POST(req: Request) {
  try {
    const { id, paymentType } = await req.json();

    if (!id || !paymentType) {
      return NextResponse.json(
        { success: false, error: "Missing id or paymentType" },
        { status: 400 }
      );
    }

    if (paymentType !== "cash" && paymentType !== "qr") {
      return NextResponse.json(
        { success: false, error: "Invalid payment type" },
        { status: 400 }
      );
    }

    // 1️⃣ Fetch credit record
    const getStmt = db.prepare(`
      SELECT *
      FROM credit_customers
      WHERE id = ?
    `);

    const credit = getStmt.get(id) as
      | {
          id: number;
          name: string;
          phone: string;
          items_json: string;
          amount: number;
          paid: number;
          timestamp: number;
        }
      | undefined;

    if (!credit) {
      return NextResponse.json(
        { success: false, error: "Credit record not found" },
        { status: 404 }
      );
    }

    if (credit.paid) {
      return NextResponse.json(
        { success: false, error: "Already marked as paid" },
        { status: 400 }
      );
    }

    // 2️⃣ Insert phantom sale into sales table
    recordSale({
      tableId: `credit-${credit.id}`,
      itemsJson: credit.items_json,
      total: credit.amount,
      discountAmount: 0,
      discountPercent: 0,
      finalTotal: credit.amount,
      paymentType,
    });

    // 3️⃣ Mark credit as paid
    const updateStmt = db.prepare(`
      UPDATE credit_customers
      SET paid = 1
      WHERE id = ?
    `);

    updateStmt.run(id);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error in /api/credit/pay:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

