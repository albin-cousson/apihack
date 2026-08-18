// target-range is intentionally vulnerable — see README.md. LOCAL PRACTICE ONLY.
//
// Resets data.db to a clean seed state. Passwords are stored in PLAINTEXT
// on purpose (this is a practice target, not a template — never do this in
// real code).
import { db } from "./db";

db.run("DROP TABLE IF EXISTS users");
db.run("DROP TABLE IF EXISTS comments");

db.run(`
  CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user'
  )
`);

db.run(`
  CREATE TABLE comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    body TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

const insertUser = db.query(
  "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
);
insertUser.run("admin", "correct-horse-battery-staple", "admin");
insertUser.run("guest", "password123", "user");

const insertComment = db.query("INSERT INTO comments (body) VALUES (?)");
insertComment.run("Welcome to target-range. Try breaking something.");

console.log("[target-range] Seeded data.db with 2 users and 1 comment.");
