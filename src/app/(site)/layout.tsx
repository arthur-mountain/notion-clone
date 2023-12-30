import type { PropsWithChildren } from 'react';
import { Header } from '@/components/LandingPage';

const HomePageLayout = ({ children }: PropsWithChildren) => {
	return (
		<main>
			<Header />
			{children}
		</main>
	);
};

export default HomePageLayout;
