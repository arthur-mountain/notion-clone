import { NextRequest, NextResponse } from 'next/server';
import { createServerComponentClient } from '@/lib/supabase/utils';

export const GET = async (req: NextRequest) => {
	const requestUrl = new URL(req.url);
	const code = requestUrl.searchParams.get('code');

	if (code) {
		await createServerComponentClient().auth.exchangeCodeForSession(code);
	}
	return NextResponse.redirect(`${requestUrl.origin}/dashboard`);
};
