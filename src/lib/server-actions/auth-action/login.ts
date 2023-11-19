'use server';
import { z } from 'zod';
import { createSubabaseServerClient } from '../../supabase/utils';
import { FormSchema } from '../../form-schema/login';

export const actionLoginUser = async ({
	email,
	password,
}: z.infer<typeof FormSchema>) => {
	return await createSubabaseServerClient().auth.signInWithPassword({
		email,
		password,
	});
};
