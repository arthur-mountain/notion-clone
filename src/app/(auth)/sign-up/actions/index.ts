'use server';
import type { SignUpActionParamType } from '../form-schema';
import { createServerComponentClient } from '@/lib/supabase/utils/server';

export const actionSignUpUser = async ({
	email,
	password,
}: SignUpActionParamType) => {
	const supabase = createServerComponentClient();
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
