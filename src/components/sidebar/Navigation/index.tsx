import { HomeIcon, SettingsIcon, TrashIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { cn } from '@/lib/utils';
import CustomDialog from '@/components/global/CustomDialog';
import SettingsForm from './SettingsForm';
import TrashRestore from './TrashRestore';

type Props = { workspaceId: string; className?: string };
const Navigation = ({ workspaceId, className }: Props) => {
	return (
		<nav className={cn('my-2', className)}>
			<ul className='flex flex-col gap-2'>
				<li className='group/native text-Neutrals/neutrals-7'>
					<Link
						href={`/dashboard/${workspaceId}`}
						className='group/native flex items-center text-Neutrals/neutrals-7 transition-all gap-2'
					>
						<HomeIcon size={20} />
						<span>My Workspace</span>
					</Link>
				</li>

				<li className='group/native text-Neutrals/neutrals-7'>
					<CustomDialog
						header='Settings'
						content={<SettingsForm />}
						className='w-full flex items-center gap-2'
					>
						<SettingsIcon size={20} />
						<span>Settings</span>
					</CustomDialog>
				</li>

				<li className='group/native text-Neutrals/neutrals-7'>
					<CustomDialog
						header='Trash'
						content={<TrashRestore />}
						className='w-full flex items-center gap-2'
					>
						<TrashIcon size={20} />
						<span>Trash</span>
					</CustomDialog>
				</li>
			</ul>
		</nav>
	);
};

export default Navigation;
