import { db } from "./db";

export function recordSale(data: {
  tableId: string;
  itemsJson: string;
  total: number;
  discountAmount: number;
  discountPercent: number;
  finalTotal: number;
  paymentType: string;
}) {
  const stmt = db.prepare(`
    INSERT INTO sales (
      table_id,
      items_json,
      total,
      discount_amount,
      discount_percent,
      final_total,
      payment_type,
      timestamp
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    data.tableId,
    data.itemsJson,
    data.total,
    data.discountAmount,
    data.discountPercent,
    data.finalTotal,
    data.paymentType,
    Date.now()
  );
}

export function recordCreditCustomer(data: {
  name: string;
  phone: string;
  itemsJson: string;
  amount: number;
}) {
  const stmt = db.prepare(`
    INSERT INTO credit_customers (name, phone, items_json, amount, paid, timestamp)
    VALUES (?, ?, ?, ?, 0, ?)
  `);

  stmt.run(
    data.name,
    data.phone,
    data.itemsJson,
    data.amount,
    Date.now()
  );
}
