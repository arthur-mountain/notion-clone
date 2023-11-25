'use server';
import { z } from 'zod';
import { createServerComponentClient } from '../../supabase/utils';
import { FormSchema } from '../../form-schema/login';

export const actionLoginUser = async ({
	email,
	password,
}: z.infer<typeof FormSchema>) => {
	return await createServerComponentClient().auth.signInWithPassword({
		email,
		password,
	});
};
