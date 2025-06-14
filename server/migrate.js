const fs = require('fs').promises;
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function runMigrations() {
  let pool;
  try {
    // First, create a connection without database
    const initialPool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // Create database if it doesn't exist
    await initialPool.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'pemesanan_lapangan'}`);
    console.log('Database created or already exists');

    // Now create the pool with database
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'pemesanan_lapangan',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // Create migrations table if it doesn't exist
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Get all migration files
    const migrationsDir = path.join(__dirname, 'migrations');
    const files = await fs.readdir(migrationsDir);
    const sqlFiles = files.filter(f => f.endsWith('.sql')).sort();

    // Get executed migrations
    const [executedMigrations] = await pool.execute('SELECT name FROM migrations');
    const executedNames = executedMigrations.map(m => m.name);

    console.log('Starting migrations...');

    // Run each migration
    for (const file of sqlFiles) {
      if (!executedNames.includes(file)) {
        console.log(`Running migration: ${file}`);
        
        const filePath = path.join(migrationsDir, file);
        const sql = await fs.readFile(filePath, 'utf8');
        
        // Split SQL file into individual statements
        const statements = sql
          .split(';')
          .map(s => s.trim())
          .filter(s => s.length > 0);

        // Execute each statement
        for (const statement of statements) {
          if (statement.toLowerCase().includes('create database')) {
            // Skip CREATE DATABASE statements as we already created it
            continue;
          }
          await pool.execute(statement);
        }

        // Record migration
        await pool.execute('INSERT INTO migrations (name) VALUES (?)', [file]);
        console.log(`✓ Completed: ${file}`);
      }
    }

    console.log('All migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    if (pool) {
      await pool.end();
    }
  }
}

// Run migrations
runMigrations(); 