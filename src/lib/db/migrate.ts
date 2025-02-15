import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';
import fs from 'fs';
import path from 'path';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function main() {
  try {
    const migrationFile = path.join(process.cwd(), 'src/lib/db/migrations/0001_auth_tables.sql');
    const migrationSql = fs.readFileSync(migrationFile, 'utf8');
    
    // Split the SQL file into individual statements
    const statements = migrationSql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    // Execute each statement
    for (const statement of statements) {
      await sql(statement);
    }

    console.log('Migrations completed');
    process.exit(0);
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  }
}

main(); 