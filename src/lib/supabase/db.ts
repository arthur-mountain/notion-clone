import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { config } from 'dotenv';
import * as schema from '@/tables';
config({ path: '.env' });

if (!process.env.DATABASE_URL) {
	console.log('💔 Cannot find database url in lib/supabase/db.ts!');
}

const client = postgres(process.env.DATABASE_URL as string, { max: 1 });
const db = drizzle(client, { schema });
const migrateDB = async () => {
	try {
		console.log('🧡 Migrate client!');
		await migrate(db, { migrationsFolder: 'migrations' });
		console.log('💜 SuccussFully migrated!');
	} catch (error) {
		console.log('💔 Error Migrating client!', error);
	}
};
migrateDB();
export default db;
