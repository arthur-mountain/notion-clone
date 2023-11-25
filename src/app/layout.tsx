import type { Metadata } from 'next';
import { Noto_Sans } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/next-theme-provider';
import { cn } from '@/lib/utils';
import '@/lib/supabase/db';
import './globals.css';

const font = Noto_Sans({
	weight: ['300', '400', '500', '600', '700'],
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Create Next App',
	description: 'Generated by create next app',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<html lang='en'>
			<body className={cn('bg-background', font.className)}>
				<ThemeProvider attribute='class' defaultTheme='dark' enableSystem>
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
};

export default RootLayout;
