import { db } from "./db";

export type Expense = {
  id: number;
  description: string;
  amount: number;
  timestamp: number;
};

export function recordExpense({
  description,
  amount,
  timestamp = Date.now(),
}: {
  description: string;
  amount: number;
  timestamp?: number;
}) {
  const stmt = db.prepare(
    `
    INSERT INTO expenses (description, amount, timestamp)
    VALUES (?, ?, ?)
  `
  );

  const info = stmt.run(description, amount, timestamp);
  return info.lastInsertRowid;
}

export function getExpensesInRange(from: number, to: number): Expense[] {
  const stmt = db.prepare(
    `
    SELECT id, description, amount, timestamp
    FROM expenses
    WHERE timestamp BETWEEN ? AND ?
    ORDER BY timestamp DESC
  `
  );

  return stmt.all(from, to) as Expense[];
}

export function getExpenseTotal(from: number, to: number): number {
  const stmt = db.prepare(
    `
    SELECT SUM(amount) as total
    FROM expenses
    WHERE timestamp BETWEEN ? AND ?
  `
  );

  const row = stmt.get(from, to) as { total: number | null } | undefined;
  return row?.total ?? 0;
}

export function deleteExpense(id: number) {
  const stmt = db.prepare(
    `
    DELETE FROM expenses
    WHERE id = ?
  `
  );

  return stmt.run(id);
}

