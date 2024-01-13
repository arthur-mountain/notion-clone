import type { WorkspaceType } from '@/lib/supabase/types';
import Link from 'next/link';
import Image from 'next/image';
import React, { useEffect, useState, type MouseEvent } from 'react';
import { getStoragePublicUrl } from '@/lib/supabase/utils/client/get-storage-url';

type Props = {
	workspace: WorkspaceType;
	onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
};

const SelectedWorkspace = ({ workspace, onClick }: Props) => {
	const [workspaceLogo, setWorkspaceLogo] = useState('/cypress-logo.svg');

	useEffect(() => {
		if (workspace.logo) {
			setWorkspaceLogo(getStoragePublicUrl('workspace-logos', workspace.logo));
		}
	}, [workspace]);

	return (
		<Link
			href={`/dashboard/${workspace.id}`}
			onClick={onClick}
			className='flex rounded-md hover:bg-muted transition-all flex-row p-2 gap-4 justify-center cursor-pointer items-center my-2'
		>
			<Image
				src={workspaceLogo}
				alt='workspace logo'
				width={26}
				height={26}
				objectFit='cover'
				className='rounded-full'
			/>
			<div className='flex flex-col'>
				<p className='text-lg w-[170px] overflow-hidden overflow-ellipsis whitespace-nowrap'>
					{workspace.title}
				</p>
			</div>
		</Link>
	);
};

export default SelectedWorkspace;
