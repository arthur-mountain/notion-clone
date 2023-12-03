'use client';
import type { DatabaseType } from '../../types';
import { createBrowserClient } from '@supabase/ssr';

export const createClientComponentClient = () => {
	return createBrowserClient<DatabaseType>(
		process.env.NEXT_PUBLIC_SUPABASE_URL as string,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
	);
};
