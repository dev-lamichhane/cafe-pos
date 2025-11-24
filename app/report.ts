import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

export const runtime = 'nodejs'

// Helper: get start/end of "today" in ms
function getTodayRange() {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0).getTime()
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).getTime()
  return { start, end }
}

export async function GET() {
  try {
    const { start, end } = getTodayRange()

    // 1) BASIC TOTALS
    const totalsStmt = db.prepare(`
      SELECT payment_type, SUM(final_total) as total
      FROM sales
      WHERE timestamp BETWEEN ? AND ?
      GROUP BY payment_type
    `)

    const totalsRows = totalsStmt.all(start, end)

    let cash = 0
    let qr = 0
    let credit = 0

    for (const row of totalsRows as any[]) {
      if (row.payment_type === 'cash') cash = row.total || 0
      if (row.payment_type === 'qr') qr = row.total || 0
      if (row.payment_type === 'credit') credit = row.total || 0
    }

    const totalSales = cash + qr + credit

    // 2) TOTAL ORDERS & ITEMS + BEST SELLERS
    const salesStmt = db.prepare(`
      SELECT items_json, timestamp
      FROM sales
      WHERE timestamp BETWEEN ? AND ?
      ORDER BY timestamp ASC
    `)
    const salesRows = salesStmt.all(start, end) as { items_json: string; timestamp: number }[]

    let totalItems = 0
    const itemMap: Record<number, number> = {}

    for (const row of salesRows) {
      const items = JSON.parse(row.items_json) as { itemId: number; qty: number }[]
      for (const it of items) {
        totalItems += it.qty
        itemMap[it.itemId] = (itemMap[it.itemId] || 0) + it.qty
      }
    }

    const bestSellers = Object.entries(itemMap)
      .map(([itemId, qty]) => ({ itemId: Number(itemId), qty }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 10)

    const orderCount = salesRows.length

    // 3) BUSY HOURS
    const hourMap: Record<number, number> = {}
    for (const row of salesRows) {
      const d = new Date(row.timestamp)
      const hour = d.getHours()
      hourMap[hour] = (hourMap[hour] || 0) + 1
    }

    const busyHours = Object.entries(hourMap)
      .map(([hour, count]) => ({ hour: Number(hour), count }))
      .sort((a, b) => a.hour - b.hour)

    // 4) CREATE PDF
    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([595.28, 841.89]) // A4 portrait
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

    let y = 800

    const drawText = (
      text: string,
      opts: { x?: number; y?: number; bold?: boolean; size?: number } = {}
    ) => {
      const size = opts.size ?? 12
      const usedFont = opts.bold ? fontBold : font
      const x = opts.x ?? 50
      const yy = opts.y ?? y

      page.drawText(text, {
        x,
        y: yy,
        size,
        font: usedFont,
        color: rgb(0, 0, 0),
      })

      y = yy - size - 4
    }

    const todayStr = new Date().toLocaleDateString()

    drawText('Kund Coffee', { bold: true, size: 20, x: 50, y })
    drawText('End of Day Report', { bold: true, size: 16 })
    drawText(`Date: ${todayStr}`, { size: 12 })
    y -= 10

    drawText('------------------------', { size: 12 })

    // SUMMARY SECTION
    drawText('Summary', { bold: true, size: 14 })
    drawText(`Total Sales: Rs ${totalSales.toFixed(2)}`)
    drawText(`Cash: Rs ${cash.toFixed(2)}`)
    drawText(`QR: Rs ${qr.toFixed(2)}`)
    drawText(`Credit Collected: Rs ${credit.toFixed(2)}`)
    drawText(`Total Orders: ${orderCount}`)
    drawText(`Total Items Sold: ${totalItems}`)

    y -= 10
    drawText('------------------------', { size: 12 })

    // BEST SELLERS
    drawText('Best Selling Items (Top 10)', { bold: true, size: 14 })

    if (bestSellers.length === 0) {
      drawText('No sales today.')
    } else {
      for (const b of bestSellers) {
        drawText(`Item ID ${b.itemId} - Qty: ${b.qty}`)
        if (y < 100) {
          // new page if too low
          y = 800
          pdfDoc.addPage(page)
        }
      }
    }

    y -= 10
    drawText('------------------------', { size: 12 })

    // BUSY HOURS
    drawText('Busy Hours', { bold: true, size: 14 })

    if (busyHours.length === 0) {
      drawText('No orders today.')
    } else {
      for (const h of busyHours) {
        drawText(`${h.hour}:00 - ${h.hour + 1}:00  →  ${h.count} orders`)
        if (y < 100) {
          y = 800
          pdfDoc.addPage(page)
        }
      }
    }

    const pdfBytes = await pdfDoc.save()
    const pdfBase64 = Buffer.from(pdfBytes).toString('base64')

    // 5) EMAIL TO MANAGER (optional, if env vars present)
    const apiKey = process.env.RESEND_API_KEY
    const managerEmail = process.env.MANAGER_EMAIL

    if (apiKey && managerEmail) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Kund Coffee POS <noreply@kundcoffee.local>',
            to: [managerEmail],
            subject: `End of Day Report - ${todayStr}`,
            text: `Attached is the end-of-day report for ${todayStr}.`,
            attachments: [
              {
                filename: `end-of-day-${todayStr}.pdf`,
                content: pdfBase64,
              },
            ],
          }),
        })
      } catch (e) {
        console.error('Failed to send end-of-day email:', e)
        // we still return the PDF even if email fails
      }
    }

    // 6) RETURN PDF TO BROWSER
    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="end-of-day-${todayStr}.pdf"`,
      },
    })
  } catch (err) {
    console.error('End-of-day report error:', err)
    return NextResponse.json({ error: 'Failed to generate end-of-day report' }, { status: 500 })
  }
}
