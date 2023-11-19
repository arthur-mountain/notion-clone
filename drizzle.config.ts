import type { Config } from 'drizzle-kit';
import { config } from 'dotenv';
config({ path: '.env' });

if (!process.env.DATABASE_URL) {
	console.log('💔 Cannot find database url in dirzzle.config.ts!');
}

export default {
	schema: './src/lib/supabase/schema.ts',
	out: './migrations',
	driver: 'pg',
	dbCredentials: {
		connectionString: process.env.DATABASE_URL || '',
	},
} satisfies Config;
