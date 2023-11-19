import { NextRequest, NextResponse } from 'next/server';
import { createSubabaseServerClient } from '@/lib/supabase/utils';

export const GET = async (req: NextRequest) => {
	const requestUrl = new URL(req.url);
	const code = requestUrl.searchParams.get('code');

	if (code) {
		await createSubabaseServerClient().auth.exchangeCodeForSession(code);
	}
	return NextResponse.redirect(`${requestUrl.origin}/dashboard`);
};
