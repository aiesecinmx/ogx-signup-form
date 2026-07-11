CREATE TABLE signups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  age TEXT NOT NULL,
  major TEXT NOT NULL,
  schooling_level TEXT NOT NULL,
  english_proficiency TEXT NOT NULL,
  referral_source TEXT NOT NULL,
  expa_status INTEGER,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
