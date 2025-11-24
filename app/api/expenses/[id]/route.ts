export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { deleteExpense } from "@/lib/expenses";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        { success: false, error: "Invalid expense id" },
        { status: 400 }
      );
    }

    const result = deleteExpense(id);
    if (result.changes === 0) {
      return NextResponse.json(
        { success: false, error: "Expense not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Expense delete error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to delete expense" },
      { status: 500 }
    );
  }
}

