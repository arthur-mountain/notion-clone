'use server';
import type { DatabaseType } from '../../types';
import { cookies } from 'next/headers';
import {
	createServerClient,
	type CookieMethods,
	type CookieOptions,
} from '@supabase/ssr';

export const createServerComponentClient = (cookieMethods?: CookieMethods) => {
	const cookieStore = cookies();
	return createServerClient<DatabaseType>(
		process.env.NEXT_PUBLIC_SUPABASE_URL as string,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
		{
			cookies: {
				get: (name: string) => cookieStore.get(name)?.value,
				set: (name: string, value: string, options: CookieOptions) => {
					cookieStore.set({ name, value, ...options });
					if (typeof cookieMethods?.set === 'function') {
						cookieMethods.set(name, value, options);
					}
				},
				remove: (name: string, options: CookieOptions) => {
					cookieStore.set({ name, value: '', ...options });
					if (typeof cookieMethods?.remove === 'function') {
						cookieMethods.remove(name, options);
					}
				},
			},
		},
	);
};
