import { NextResponse, type NextRequest } from 'next/server';
import { createSubabaseServerClient } from '@/lib/supabase/utils';
import { EMAIL_LINK_ERROR } from '@/constants/error';

export const middleware = async (request: NextRequest) => {
	let response = NextResponse.next({
		request: {
			headers: request.headers,
		},
	});

	const supabase = await createSubabaseServerClient({
		set(name, value, options) {
			response = NextResponse.next({
				request: { headers: request.headers },
			});
			response.cookies.set({ name, value, ...options });
		},
		remove(name, options) {
			response = NextResponse.next({
				request: { headers: request.headers },
			});
			response.cookies.set({ name, value: '', ...options });
		},
	});

	const {
		data: { session },
	} = await supabase.auth.getSession();

	const { pathname, searchParams } = request.nextUrl;

	if (pathname.startsWith('/dashboard') && !session) {
		return NextResponse.redirect(new URL('/login', request.url));
	}

	if (
		searchParams.get('error_description') === EMAIL_LINK_ERROR &&
		pathname !== '/sign-up'
	) {
		return NextResponse.redirect(
			new URL(`/sign-up?error_description=${EMAIL_LINK_ERROR}`, request.url),
		);
	}

	if (['/login', '/sign-up'].includes(pathname) && session) {
		return NextResponse.redirect(new URL('/dashboard', request.url));
	}

	return response;
};
