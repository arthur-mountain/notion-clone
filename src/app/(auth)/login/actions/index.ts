'use server';
import { z } from 'zod';
import { createServerComponentClient } from '@/lib/supabase/utils';
import { FormSchema } from '../form-schema';

export const actionLoginUser = async ({
	email,
	password,
}: z.infer<typeof FormSchema>) => {
	return await createServerComponentClient().auth.signInWithPassword({
		email,
		password,
	});
};
