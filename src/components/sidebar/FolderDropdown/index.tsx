'use client';
import type { FolderType } from '@/lib/supabase/types';
import React, { useEffect, useMemo } from 'react';
import { PlusIcon } from 'lucide-react';
import { MAX_FOLDERS_FREE_PLAN } from '@/constants/common';
import { createFolder } from '@/lib/supabase/schemas/folders/queries';
import { useAppStore } from '@/components/providers/AppProvider';
import { useUser } from '@/components/providers/UserProvider';
import Tooltip from '@/components/global/Tooltip';
import { useToast } from '@/components/ui/use-toast';
import { Accordion } from '@/components/ui/accordion';
import Dropdown from './Dropdown';

type Props = {
	workspaceFolders: FolderType[];
	workspaceId: string;
};

const FoldersDropdownList = ({ workspaceFolders, workspaceId }: Props) => {
	const {
		store: { user },
		action: { checkIsSubscriptionValid },
	} = useUser();
	const {
		store: { workspaces, folderId },
		action,
	} = useAppStore();
	const { toast } = useToast();
	const workspace = useMemo(
		() => workspaces.find((workspace) => workspace.id === workspaceId),
		[workspaces, workspaceId],
	);
	const folders = useMemo(
		() => workspace?.folders?.filter((folder) => !folder.inTrash) || [],
		[workspace],
	);

	const addFolder = async () => {
		if (
			folders.length >= MAX_FOLDERS_FREE_PLAN &&
			!checkIsSubscriptionValid()
		) {
			return;
		}

		const newFolder: FolderType = {
			data: null,
			id: crypto.randomUUID(),
			createdAt: new Date().toISOString(),
			title: 'Untitled',
			iconId: '📄',
			inTrash: null,
			workspaceId,
			bannerUrl: '',
		};
		action.addFolder({ workspaceId, folder: { ...newFolder, files: [] } });

		if ((await createFolder(newFolder)).error) {
			toast({
				title: 'Error',
				variant: 'destructive',
				description: 'Could not create the folder',
			});
		} else {
			toast({
				title: 'Success',
				description: 'Created folder.',
			});
		}
	};

	useEffect(() => {
		if (workspaceFolders.length) {
			const workspace = workspaces.find(
				(workspace) => workspace.id === workspaceId,
			);
			action.setFolders({
				workspaceId,
				folders: workspaceFolders.map((folder) => ({
					...folder,
					files:
						workspace?.folders?.find((f) => f.id === folder.id)?.files || [],
				})),
			});
		}
	}, [workspaceId, workspaceFolders]);

	return (
		<>
			<div className='flex sticky z-20 top-0 bg-background w-full h-10 group/title justify-between items-center pr-4 text-Neutrals/neutrals-8'>
				<span className='text-Neutrals-8 font-bold text-xs'>FOLDERS</span>
				<Tooltip message='Create Folder'>
					<PlusIcon
						size={16}
						onClick={addFolder}
						className='group-hover/title:inline-block hidden cursor-pointer hover:dark:text-white'
					/>
				</Tooltip>
			</div>
			{user && workspace && (
				<Accordion
					type='multiple'
					defaultValue={[folderId || '']}
					className='pb-20'
				>
					{folders.map((folder) => (
						<Dropdown
							key={folder.id}
							type='folder'
							user={user}
							mainId={folder.id}
							ids={[workspace.id, folder.id]}
							title={folder.title}
							iconId={folder.iconId}
							files={folder.files}
						/>
					))}
				</Accordion>
			)}
		</>
	);
};

export default FoldersDropdownList;
