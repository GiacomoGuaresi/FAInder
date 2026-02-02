import * as SQLite from 'expo-sqlite';
import { Asset } from '../types';
import { CREATE_ASSETS_TABLE } from './schema';
import seedData from '../data/seed.json';

const DATABASE_NAME = 'assets.db';

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;
  db = await SQLite.openDatabaseAsync(DATABASE_NAME);
  return db;
}

export async function initializeDatabase(): Promise<void> {
  const database = await getDatabase();
  
  await database.execAsync(CREATE_ASSETS_TABLE);
  
  const result = await database.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM assets'
  );
  
  if (result && result.count === 0) {
    await seedDatabase(database);
  }
}

async function seedDatabase(database: SQLite.SQLiteDatabase): Promise<void> {
  const insertStatement = await database.prepareAsync(
    `INSERT INTO assets (id, name, description, latitude, longitude, url, category)
     VALUES ($id, $name, $description, $latitude, $longitude, $url, $category)`
  );

  try {
    for (const asset of seedData.assets) {
      await insertStatement.executeAsync({
        $id: asset.id,
        $name: asset.name,
        $description: asset.description,
        $latitude: asset.latitude,
        $longitude: asset.longitude,
        $url: asset.url,
        $category: asset.category,
      });
    }
  } finally {
    await insertStatement.finalizeAsync();
  }
}

export async function getAllAssets(): Promise<Asset[]> {
  const database = await getDatabase();
  const results = await database.getAllAsync<Asset>('SELECT * FROM assets');
  return results.map((row) => ({
    id: row.id,
    name: row.name,
    description: row.description,
    latitude: row.latitude,
    longitude: row.longitude,
    url: row.url,
    category: row.category,
    createdAt: row.createdAt,
  }));
}

export async function getAssetById(id: number): Promise<Asset | null> {
  const database = await getDatabase();
  const result = await database.getFirstAsync<Asset>(
    'SELECT * FROM assets WHERE id = ?',
    [id]
  );
  return result || null;
}

export async function getAssetsByCategory(category: string): Promise<Asset[]> {
  const database = await getDatabase();
  return database.getAllAsync<Asset>(
    'SELECT * FROM assets WHERE category = ?',
    [category]
  );
}
