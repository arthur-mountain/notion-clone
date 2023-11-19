'use server';
import { z } from 'zod';
import { createSubabaseServerClient } from '../../supabase/utils';
import { SignUpSchema } from '../../form-schema/sign-up';

const actionSignUpSchema = SignUpSchema.omit({ confirmPassword: true });
export const actionSignUpUser = async ({
	email,
	password,
}: z.infer<typeof actionSignUpSchema>) => {
	const supabase = createSubabaseServerClient();
	const { data } = await supabase
		.from('profiles')
		.select('*')
		.eq('email', email);

	if (data?.length) return { error: { message: 'User already exists', data } };

	return await supabase.auth.signUp({
		email,
		password,
		options: {
			emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}api/auth/callback`,
		},
	});
};
