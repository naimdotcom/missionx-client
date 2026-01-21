import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// For local development, use environment variables
const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/missionx';

const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });
