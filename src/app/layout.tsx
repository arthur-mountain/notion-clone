import type { Metadata } from 'next';
import { Noto_Sans } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/Providers/NextThemeProvider';
import { AppStoreProvider } from '@/components/Providers/AppProvider';
import { UserProvider } from '@/components/Providers/UserProvider';
import { SocketProvider } from '@/components/Providers/SocketProvider';
import { cn } from '@/lib/utils';
import '@/lib/supabase/db';
import './globals.css';

const font = Noto_Sans({
	weight: ['300', '400', '500', '600', '700'],
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'My notion clone',
	description: 'Generated by create next14 app router',
	category: 'Full stack skills usage and new frontend features testing',
	keywords: [
		'NextJs 14',
		'App router',
		'Typescript',
		'TailwindCss',
		'SaaS',
		'Notion',
	],
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<html lang='en'>
			<body className={cn('bg-background', font.className)}>
				<ThemeProvider attribute='class' defaultTheme='dark' enableSystem>
					<AppStoreProvider>
						<UserProvider>
							<SocketProvider>
								{children}
								<Toaster />
							</SocketProvider>
						</UserProvider>
					</AppStoreProvider>
				</ThemeProvider>
			</body>
		</html>
	);
};

export default RootLayout;
