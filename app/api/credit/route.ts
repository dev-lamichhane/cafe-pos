import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const stmt = db.prepare(`
      SELECT *
      FROM credit_customers
      WHERE paid = 0
      ORDER BY timestamp DESC
    `)

    const customers = stmt.all()

    return NextResponse.json(customers)
  } catch (err) {
    console.error("Credit API error:", err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
