import React, { type PropsWithChildren } from 'react';
import Sidebar from '@/components/Sidebar';
import MobileSidebar from '@/components/Sidebar/MobileSidebar';

type Props = PropsWithChildren<{ params: { workspaceId: string } }>;

const WorkspaceLayout = ({ children, params }: Props) => {
	return (
		<div className='flex overflow-hidden h-screen w-screen'>
			<Sidebar params={params} />
			<MobileSidebar>
				<Sidebar params={params} className='w-screen inline-block sm:hidden' />
			</MobileSidebar>
			<div className='dark:border-Neutrals-12/70 border-l-[1px] w-full relative overflow-scroll'>
				{children}
			</div>
		</div>
	);
};

export default WorkspaceLayout;
