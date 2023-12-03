'use server';
import type { FormSchemaType } from '../form-schema';
import { createServerComponentClient } from '@/lib/supabase/utils/server';

export const actionLoginUser = async ({ email, password }: FormSchemaType) => {
	return await createServerComponentClient().auth.signInWithPassword({
		email,
		password,
	});
};
