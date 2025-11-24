import { db } from './db'

// Get all sales for today
export function getTodaySales() {
  const start = new Date()
  start.setHours(0, 0, 0, 0)

  const stmt = db.prepare(`
    SELECT *
    FROM sales
    WHERE timestamp >= ?
    ORDER BY timestamp DESC
  `)

  return stmt.all(start.getTime())
}

// Payment type totals
export function getPaymentTotals() {
  const stmt = db.prepare(`
    SELECT payment_type, SUM(final_total) as total
    FROM sales
    GROUP BY payment_type
  `)

  return stmt.all()
}

// Total items sold
export function getTotalItemsSold() {
  const stmt = db.prepare(`
    SELECT items_json
    FROM sales
  `)

  const rows = stmt.all()
  let count = 0

  for (const row of rows) {
    const items = JSON.parse(row.items_json)
    for (const it of items) {
      count += it.qty
    }
  }

  return count
}

// Best selling items (returns array of { itemId, qty })
export function getBestSellingItems() {
  const stmt = db.prepare(`
    SELECT items_json
    FROM sales
  `)

  const rows = stmt.all()
  const map: Record<string, number> = {}

  for (const row of rows) {
    const items = JSON.parse(row.items_json)
    for (const it of items) {
      if (!map[it.itemId]) map[it.itemId] = 0
      map[it.itemId] += it.qty
    }
  }

  // Convert to array sorted by qty descending
  return Object.entries(map)
    .map(([itemId, qty]) => ({ itemId: Number(itemId), qty }))
    .sort((a, b) => b.qty - a.qty)
}

// Busy hours (returns { hour, count })
export function getHourlySales() {
  const stmt = db.prepare(`
    SELECT timestamp FROM sales
  `)

  const rows = stmt.all()
  const map: Record<number, number> = {}

  for (const row of rows) {
    const date = new Date(row.timestamp)
    const hour = date.getHours() // 0–23

    if (!map[hour]) map[hour] = 0
    map[hour] += 1
  }

  return Object.entries(map)
    .map(([hour, count]) => ({ hour: Number(hour), count }))
    .sort((a, b) => a.hour - b.hour)
}
// ----- NEW FUNCTIONS FOR HISTORICAL REPORTS -----

// Payment totals from rows
export function getPaymentTotalsFromRows(rows: any[]) {
  let cash = 0,
    qr = 0,
    credit = 0

  for (const row of rows) {
    if (row.payment_type === 'cash') cash += row.final_total
    if (row.payment_type === 'qr') qr += row.final_total
    if (row.payment_type === 'credit') credit += row.final_total
  }

  return {
    cash,
    qr,
    credit,
    totalSales: cash + qr + credit,
  }
}

// Total items from rows
export function getTotalItemsSoldFromRows(rows: any[]) {
  let total = 0

  for (const row of rows) {
    const items = JSON.parse(row.items_json)
    for (const it of items) total += it.qty
  }

  return total
}

// Best sellers from rows
export function getBestSellingItemsFromRows(rows: any[]) {
  const map: Record<string, number> = {}

  for (const row of rows) {
    const items = JSON.parse(row.items_json)

    for (const it of items) {
      if (!map[it.itemId]) map[it.itemId] = 0
      map[it.itemId] += it.qty
    }
  }

  return Object.entries(map)
    .map(([itemId, qty]) => ({ itemId: Number(itemId), qty }))
    .sort((a, b) => b.qty - a.qty)
}

// Busy hours from rows
export function getHourlySalesFromRows(rows: any[]) {
  const map: Record<number, number> = {}

  for (const row of rows) {
    const hour = new Date(row.timestamp).getHours()
    if (!map[hour]) map[hour] = 0
    map[hour] += 1
  }

  return Object.entries(map)
    .map(([hour, count]) => ({ hour: Number(hour), count }))
    .sort((a, b) => a.hour - b.hour)
}
