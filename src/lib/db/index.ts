import { createKysely } from '@vercel/postgres-kysely';
import { type Database } from './schema';

export const db = createKysely<Database>();

export * from './schema'; 