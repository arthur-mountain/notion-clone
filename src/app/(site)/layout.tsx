import type { PropsWithChildren } from 'react';
import { Header } from '@/components/landing-page';

const HomePageLayout = ({ children }: PropsWithChildren) => {
	return (
		<main>
			<Header />
			{children}
		</main>
	);
};

export default HomePageLayout;
