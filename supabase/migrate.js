/**
 * Floral Scentora — One-time SQLite → Supabase Migration Script
 * Uses sql.js (pure WebAssembly — no C++ build tools needed)
 *
 * Usage:
 *   1. Create .env.local with your Supabase credentials
 *   2. Run:  node supabase/migrate.js
 */

import { createRequire }  from 'module';
import { readFileSync }   from 'fs';
import path               from 'path';
import { fileURLToPath }  from 'url';
import { createClient }   from '@supabase/supabase-js';

const require    = createRequire(import.meta.url);
const __dirname  = path.dirname(fileURLToPath(import.meta.url));

// ── Load .env.local manually (no external dotenv needed) ──────────────────────
function loadEnv() {
  const envPath = path.resolve(__dirname, '../.env.local');
  try {
    const raw = readFileSync(envPath, 'utf8');
    for (const line of raw.split('\n')) {
      const t = line.trim();
      if (!t || t.startsWith('#')) continue;
      const eqIdx = t.indexOf('=');
      if (eqIdx < 0) continue;
      const key = t.slice(0, eqIdx).trim();
      const val = t.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {
    console.error('❌  .env.local not found — copy .env.example to .env.local and fill in your Supabase keys.');
    process.exit(1);
  }
}
loadEnv();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌  Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

// ── Open SQLite database with sql.js (pure WASM — no C++ needed) ───────────────
const initSqlJs = require('sql.js');
const sqlitePath = path.resolve(__dirname, '../backend/database/database.sqlite');

let sqliteBuffer;
try {
  sqliteBuffer = readFileSync(sqlitePath);
} catch {
  console.error('❌  Cannot read SQLite file at:', sqlitePath);
  console.error('    Make sure the Laravel backend database exists.');
  process.exit(1);
}

console.log('\n⏳  Loading SQLite database via sql.js (WebAssembly)...');
const SQL = await initSqlJs();
const db  = new SQL.Database(sqliteBuffer);

// ── Read all products ─────────────────────────────────────────────────────────
const result = db.exec('SELECT * FROM products');
if (!result.length) {
  console.error('❌  products table is empty or not found.');
  process.exit(1);
}

const { columns, values } = result[0];
const allProducts = values.map(row =>
  Object.fromEntries(columns.map((col, i) => [col, row[i]]))
);

console.log(`📦  Found ${allProducts.length} products in SQLite\n`);

// ── Clean rows for Supabase (drop SQLite-specific fields) ─────────────────────
const clean = allProducts.map(({ id, created_at, updated_at, ...p }) => ({
  name:         String(p.name         || '').trim(),
  brand:        String(p.brand        || 'Floral Scentora').trim(),
  category:     String(p.category     || 'Floral').trim(),
  price:        parseFloat(p.price)   || 0,
  quantity:     parseInt(p.quantity)  || 0,
  stock_status: p.stock_status        || 'In Stock',
  notes_top:    p.notes_top           || '',
  notes_middle: p.notes_middle        || '',
  notes_base:   p.notes_base          || '',
  description:  p.description         || '',
  image:        p.image               || '',
  longevity:    p.longevity           || '',
  sillage:      p.sillage             || '',
}));

// ── Connect to Supabase ────────────────────────────────────────────────────────
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── Clear existing rows first ──────────────────────────────────────────────────
console.log('🗑   Clearing existing Supabase products table...');
const { error: delErr } = await supabase.from('products').delete().gt('id', 0);
if (delErr) console.warn('⚠️   Could not clear (may already be empty):', delErr.message);

// ── Batch insert ───────────────────────────────────────────────────────────────
const BATCH_SIZE    = 100;
let   totalInserted = 0;
let   totalErrors   = 0;
const totalBatches  = Math.ceil(clean.length / BATCH_SIZE);

for (let i = 0; i < clean.length; i += BATCH_SIZE) {
  const batch    = clean.slice(i, i + BATCH_SIZE);
  const batchNum = Math.floor(i / BATCH_SIZE) + 1;

  const { error } = await supabase.from('products').insert(batch);

  if (error) {
    console.error(`\n❌  Batch ${batchNum}/${totalBatches} FAILED:`, error.message);
    totalErrors += batch.length;
  } else {
    totalInserted += batch.length;
    const pct = Math.round((totalInserted / clean.length) * 100);
    process.stdout.write(
      `\r  ✅  Batch ${batchNum}/${totalBatches} — ${totalInserted}/${clean.length} products (${pct}%)  `
    );
  }
}

console.log(`\n\n🎉  Migration complete!`);
console.log(`    ✅  Inserted : ${totalInserted}`);
if (totalErrors > 0) console.log(`    ❌  Errors   : ${totalErrors}`);
console.log(`\nOpen your Supabase dashboard → Table Editor → products to verify.\n`);
db.close();
