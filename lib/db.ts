import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "data", "sales.db");

// open connection
export const db = new Database(dbPath);

// create tables if not exists
db.exec(`
CREATE TABLE IF NOT EXISTS sales (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  table_id TEXT,
  items_json TEXT,
  total INTEGER,
  discount_amount INTEGER,
  discount_percent INTEGER,
  final_total INTEGER,
  payment_type TEXT,
  timestamp INTEGER
);

  CREATE TABLE IF NOT EXISTS credit_customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    phone TEXT,
    items_json TEXT,
    amount REAL,
    paid INTEGER DEFAULT 0,
    timestamp INTEGER
  );

  CREATE TABLE IF NOT EXISTS sync_queue (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    payload_json TEXT,
    timestamp INTEGER
  );
`);

