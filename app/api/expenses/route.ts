export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getExpenseTotal, getExpensesInRange, recordExpense } from "@/lib/expenses";

function getRange(searchParams: URLSearchParams) {
  const fromParam = searchParams.get("from");
  const toParam = searchParams.get("to");

  if (fromParam && toParam) {
    const from = new Date(fromParam);
    const to = new Date(toParam);

    if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
      throw new Error("Invalid date range");
    }

    if (from > to) {
      throw new Error("From date must be before to date");
    }

    return {
      from: from.setHours(0, 0, 0, 0),
      to: to.setHours(23, 59, 59, 999),
    };
  }

  // default to today
  const now = new Date();
  const start = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0,
    0
  ).getTime();
  const end = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
    999
  ).getTime();

  return { from: start, to: end };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const range = getRange(searchParams);

    const expenses = getExpensesInRange(range.from, range.to);
    const total = getExpenseTotal(range.from, range.to);

    return NextResponse.json({ expenses, total });
  } catch (err) {
    console.error("Expenses GET error:", err);
    return NextResponse.json(
      { error: (err as Error).message ?? "Failed to fetch expenses" },
      { status: 400 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const description = String(body.description ?? "").trim();
    const amount = Number(body.amount);

    if (!description) {
      return NextResponse.json(
        { success: false, error: "Description is required" },
        { status: 400 }
      );
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        { success: false, error: "Amount must be a positive number" },
        { status: 400 }
      );
    }

    const timestamp = Date.now();
    const id = recordExpense({ description, amount, timestamp });

    return NextResponse.json({
      success: true,
      expense: { id: Number(id), description, amount, timestamp },
    });
  } catch (err) {
    console.error("Expenses POST error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to save expense" },
      { status: 500 }
    );
  }
}

