export const CREATE_ASSETS_TABLE = `
  CREATE TABLE IF NOT EXISTS assets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    url TEXT NOT NULL,
    category TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`;

export const CREATE_INDEXES = `
  CREATE INDEX IF NOT EXISTS idx_assets_category ON assets(category);
  CREATE INDEX IF NOT EXISTS idx_assets_coordinates ON assets(latitude, longitude);
`;
