import * as SQLite from 'expo-sqlite';
import * as Crypto from 'expo-crypto';

// Database instance
let db: SQLite.SQLiteDatabase | null = null;

// Generate secure random ID
async function generateId(prefix: string): Promise<string> {
  try {
    // Use expo-crypto for secure random UUID
    const uuid = Crypto.randomUUID();
    return `${prefix}_${uuid}`;
  } catch {
    // Fallback to timestamp-based ID (not cryptographically secure but acceptable for local DB)
    return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  }
}

// Initialize database
export async function initDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;
  
  db = await SQLite.openDatabaseAsync('fashionmuse.db');
  
  // Enable foreign keys
  await db.execAsync('PRAGMA foreign_keys = ON;');
  
  // Create tables
  await createTables();
  
  return db;
}

// Get database instance
export function getDatabase(): SQLite.SQLiteDatabase {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase first.');
  }
  return db;
}

// Create all tables
async function createTables() {
  if (!db) throw new Error('Database not initialized');
  
  await db.execAsync(`
    -- Users table
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      profile_image TEXT,
      credits INTEGER NOT NULL DEFAULT 10,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
    
    -- Images table
    CREATE TABLE IF NOT EXISTS images (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      image_data TEXT NOT NULL,
      mime_type TEXT NOT NULL DEFAULT 'image/jpeg',
      is_original INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    
    -- History table (generation sessions)
    CREATE TABLE IF NOT EXISTS history (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      count INTEGER NOT NULL,
      thumbnail_image_id TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (thumbnail_image_id) REFERENCES images(id) ON DELETE CASCADE
    );
    
    -- History images junction table
    CREATE TABLE IF NOT EXISTS history_images (
      history_id TEXT NOT NULL,
      image_id TEXT NOT NULL,
      order_index INTEGER NOT NULL,
      PRIMARY KEY (history_id, image_id),
      FOREIGN KEY (history_id) REFERENCES history(id) ON DELETE CASCADE,
      FOREIGN KEY (image_id) REFERENCES images(id) ON DELETE CASCADE
    );
    
    -- Transactions table (for credits)
    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      amount INTEGER NOT NULL,
      type TEXT NOT NULL,
      description TEXT,
      created_at INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    
    -- Create indexes for better performance
    CREATE INDEX IF NOT EXISTS idx_images_user_id ON images(user_id);
    CREATE INDEX IF NOT EXISTS idx_history_user_id ON history(user_id);
    CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
  `);
}

// Database types
export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  profile_image: string | null;
  credits: number;
  created_at: number;
  updated_at: number;
}

export interface Image {
  id: string;
  user_id: string;
  image_data: string;
  mime_type: string;
  is_original: number;
  created_at: number;
}

export interface History {
  id: string;
  user_id: string;
  date: string;
  time: string;
  count: number;
  thumbnail_image_id: string;
  created_at: number;
}

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  type: 'purchase' | 'deduction' | 'refund';
  description: string | null;
  created_at: number;
}

// User operations
export async function createUser(
  name: string,
  email: string,
  passwordHash: string
): Promise<User> {
  const db = getDatabase();
  const id = await generateId('user');
  const now = Date.now();
  
  await db.runAsync(
    `INSERT INTO users (id, name, email, password_hash, credits, created_at, updated_at) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [id, name, email, passwordHash, 10, now, now]
  );
  
  return {
    id,
    name,
    email,
    password_hash: passwordHash,
    profile_image: null,
    credits: 10,
    created_at: now,
    updated_at: now,
  };
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const db = getDatabase();
  const result = await db.getFirstAsync<User>(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );
  return result || null;
}

export async function getUserById(id: string): Promise<User | null> {
  const db = getDatabase();
  const result = await db.getFirstAsync<User>(
    'SELECT * FROM users WHERE id = ?',
    [id]
  );
  return result || null;
}

export async function updateUser(
  id: string,
  updates: Partial<Pick<User, 'name' | 'profile_image'>>
): Promise<void> {
  const db = getDatabase();
  const now = Date.now();
  
  const fields: string[] = [];
  const values: any[] = [];
  
  if (updates.name !== undefined) {
    fields.push('name = ?');
    values.push(updates.name);
  }
  
  if (updates.profile_image !== undefined) {
    fields.push('profile_image = ?');
    values.push(updates.profile_image);
  }
  
  if (fields.length === 0) return;
  
  fields.push('updated_at = ?');
  values.push(now);
  values.push(id);
  
  await db.runAsync(
    `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
    values
  );
}

export async function updateUserCredits(
  userId: string,
  amount: number
): Promise<number> {
  const db = getDatabase();
  const now = Date.now();
  
  await db.runAsync(
    'UPDATE users SET credits = credits + ?, updated_at = ? WHERE id = ?',
    [amount, now, userId]
  );
  
  const user = await getUserById(userId);
  return user?.credits || 0;
}

// Image operations
export async function saveImage(
  userId: string,
  imageData: string,
  mimeType: string = 'image/jpeg',
  isOriginal: boolean = false
): Promise<Image> {
  const db = getDatabase();
  const id = await generateId('img');
  const now = Date.now();
  
  await db.runAsync(
    `INSERT INTO images (id, user_id, image_data, mime_type, is_original, created_at) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id, userId, imageData, mimeType, isOriginal ? 1 : 0, now]
  );
  
  return {
    id,
    user_id: userId,
    image_data: imageData,
    mime_type: mimeType,
    is_original: isOriginal ? 1 : 0,
    created_at: now,
  };
}

export async function getImageById(id: string): Promise<Image | null> {
  const db = getDatabase();
  const result = await db.getFirstAsync<Image>(
    'SELECT * FROM images WHERE id = ?',
    [id]
  );
  return result || null;
}

export async function getUserImages(userId: string): Promise<Image[]> {
  const db = getDatabase();
  const results = await db.getAllAsync<Image>(
    'SELECT * FROM images WHERE user_id = ? ORDER BY created_at DESC',
    [userId]
  );
  return results;
}

export async function deleteImage(id: string): Promise<void> {
  const db = getDatabase();
  await db.runAsync('DELETE FROM images WHERE id = ?', [id]);
}

// History operations
export async function saveHistory(
  userId: string,
  date: string,
  time: string,
  imageIds: string[]
): Promise<History> {
  const db = getDatabase();
  const id = await generateId('hist');
  const now = Date.now();
  
  // Insert history record
  await db.runAsync(
    `INSERT INTO history (id, user_id, date, time, count, thumbnail_image_id, created_at) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [id, userId, date, time, imageIds.length, imageIds[0], now]
  );
  
  // Insert history-image relationships
  for (let i = 0; i < imageIds.length; i++) {
    await db.runAsync(
      'INSERT INTO history_images (history_id, image_id, order_index) VALUES (?, ?, ?)',
      [id, imageIds[i], i]
    );
  }
  
  return {
    id,
    user_id: userId,
    date,
    time,
    count: imageIds.length,
    thumbnail_image_id: imageIds[0],
    created_at: now,
  };
}

export async function getUserHistory(userId: string): Promise<Array<{
  id: string;
  date: string;
  time: string;
  count: number;
  thumbnail: string;
  results: string[];
}>> {
  const db = getDatabase();
  
  // Get all history records
  const histories = await db.getAllAsync<History>(
    'SELECT * FROM history WHERE user_id = ? ORDER BY created_at DESC',
    [userId]
  );
  
  // Get images for each history
  const result = [];
  for (const history of histories) {
    const images = await db.getAllAsync<{ image_data: string }>(
      `SELECT i.image_data 
       FROM history_images hi 
       JOIN images i ON hi.image_id = i.id 
       WHERE hi.history_id = ? 
       ORDER BY hi.order_index`,
      [history.id]
    );
    
    const thumbnail = await getImageById(history.thumbnail_image_id);
    
    result.push({
      id: history.id,
      date: history.date,
      time: history.time,
      count: history.count,
      thumbnail: thumbnail?.image_data || '',
      results: images.map(img => img.image_data),
    });
  }
  
  return result;
}

export async function deleteHistory(id: string): Promise<void> {
  const db = getDatabase();
  await db.runAsync('DELETE FROM history WHERE id = ?', [id]);
}

// Transaction operations
export async function createTransaction(
  userId: string,
  amount: number,
  type: 'purchase' | 'deduction' | 'refund',
  description?: string
): Promise<Transaction> {
  const db = getDatabase();
  const id = await generateId('txn');
  const now = Date.now();
  
  await db.runAsync(
    `INSERT INTO transactions (id, user_id, amount, type, description, created_at) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id, userId, amount, type, description || null, now]
  );
  
  return {
    id,
    user_id: userId,
    amount,
    type,
    description: description || null,
    created_at: now,
  };
}

export async function getUserTransactions(userId: string): Promise<Transaction[]> {
  const db = getDatabase();
  const results = await db.getAllAsync<Transaction>(
    'SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC',
    [userId]
  );
  return results;
}

// Secure password hashing using SHA-256 and random salt (for production, use bcrypt or PBKDF2)
export async function hashPassword(password: string): Promise<string> {
  // Generate a 16-byte random salt
  const saltBytes = await Crypto.getRandomBytesAsync(16);
  const salt = Buffer.from(saltBytes).toString('hex');
  const hash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password + salt
  );
  // Store as salt:hash
  return `${salt}:${hash}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  // stored is in the format salt:hash
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const passwordHash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password + salt
  );
  return passwordHash === hash;
}
