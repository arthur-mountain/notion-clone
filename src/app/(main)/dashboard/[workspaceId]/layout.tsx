import React, { type PropsWithChildren } from 'react';
import Sidebar from '@/components/Sidebar';

type Props = PropsWithChildren<{ params: { workspaceId: string } }>;

const WorkspaceLayout = ({ children, params }: Props) => {
	return (
		<div className='flex overflow-hidden h-screen w-screen'>
			<Sidebar params={params} />
			<div className='dark:border-Neutrals-12/70 border-l-[1px] w-full relative overflow-scroll'>
				{children}
			</div>
		</div>
	);
};

export default WorkspaceLayout;
