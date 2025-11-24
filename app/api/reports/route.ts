export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

import {
  getPaymentTotalsFromRows,
  getTotalItemsSoldFromRows,
  getBestSellingItemsFromRows,
  getHourlySalesFromRows,
} from '@/lib/salesQueries'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    const fromParam = searchParams.get('from')
    const toParam = searchParams.get('to')

    let dayStart: number
    let dayEnd: number

    if (fromParam && toParam) {
      // User selected a range
      const fromDate = new Date(fromParam)
      const toDate = new Date(toParam)
      
      // Validate dates
      if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
        return NextResponse.json(
          { error: "Invalid date format" },
          { status: 400 }
        )
      }
      
      if (fromDate > toDate) {
        return NextResponse.json(
          { error: "From date must be before to date" },
          { status: 400 }
        )
      }
      
      dayStart = fromDate.setHours(0, 0, 0, 0)
      dayEnd = toDate.setHours(23, 59, 59, 999)
    } else {
      // Default → today's report
      const targetDate = new Date()
      dayStart = new Date(
        targetDate.getFullYear(),
        targetDate.getMonth(),
        targetDate.getDate(),
        0,
        0,
        0,
        0
      ).getTime()

      dayEnd = new Date(
        targetDate.getFullYear(),
        targetDate.getMonth(),
        targetDate.getDate(),
        23,
        59,
        59,
        999
      ).getTime()
    }

    // Query DB for this day or range
    const stmt = db.prepare(`
      SELECT *
      FROM sales
      WHERE timestamp BETWEEN ? AND ?
      ORDER BY timestamp DESC
    `)

    const rows = stmt.all(dayStart, dayEnd)

    // Calculations
    const { cash, qr, credit, totalSales } = getPaymentTotalsFromRows(rows)
    const totalItems = getTotalItemsSoldFromRows(rows)
    const bestSellers = getBestSellingItemsFromRows(rows)
    const hourly = getHourlySalesFromRows(rows)

    return NextResponse.json({
      totalSales,
      cash,
      qr,
      credit,
      totalItems,
      todayCount: rows.length,
      bestSellers,
      hourly,
    })
  } catch (err) {
    console.error("Reports API error:", err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
