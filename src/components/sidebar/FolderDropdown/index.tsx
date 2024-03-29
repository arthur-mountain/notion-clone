'use client';
import type { FolderType } from '@/lib/supabase/types';
import React, { useEffect, useMemo } from 'react';
import { PlusIcon } from 'lucide-react';
import { MAX_FOLDERS_FREE_PLAN } from '@/constants/common';
import { getFiles } from '@/lib/supabase/schemas/files/queries';
import { useAppStore } from '@/components/Providers/AppProvider';
import { useUser } from '@/components/Providers/UserProvider';
import Tooltip from '@/components/Global/Tooltip';
import { useToast } from '@/components/ui/use-toast';
import { Accordion } from '@/components/ui/accordion';
import Dropdown from './Dropdown';
import useRealtime from '@/lib/supabase/utils/client/use-realtime';

type Props = {
	workspaceFolders: FolderType[];
	workspaceId: string;
};

const FoldersDropdownList = ({ workspaceFolders, workspaceId }: Props) => {
	useRealtime();
	const {
		store: { user },
		action: { checkIsSubscriptionValid },
	} = useUser();
	const {
		store: { workspaces, folderId },
		action,
	} = useAppStore();
	const { toast } = useToast();
	const folders = useMemo(
		() => workspaces.find((w) => w.id === workspaceId)?.folders || [],
		[workspaces, workspaceId],
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

		if ((await action.addFolder({ folder: newFolder })).error) {
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
			const currentWorkspace = workspaces.find((w) => w.id === workspaceId);
			action.setFolders({
				folders: workspaceFolders.map((folder) => ({
					...folder,
					files:
						currentWorkspace?.folders?.find((f) => f.id === folder.id)?.files ||
						[],
				})),
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [workspaceId, workspaceFolders]);

	useEffect(() => {
		if (!folderId) return;
		(async () => {
			const { data: files, error: filesError } = await getFiles(folderId);
			if (filesError) return;
			action.setFiles({ files });
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [folderId]);

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
			{user && workspaceId && (
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
							ids={[workspaceId, folder.id]}
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
