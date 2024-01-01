import type { FileType, FolderType, WorkspaceType } from '@/lib/supabase/types';
import { useAppStore } from '../Providers/AppProvider';
import { useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@/lib/supabase/utils/client';

export type Props = {
	id: string;
	type: 'workspace' | 'folder' | 'file';
	data: FileType | FolderType | WorkspaceType;
};

const useInit = ({ id, type, data }: Props) => {
	const {
		store: { workspaces, workspaceId, folderId, fileId },
		action,
	} = useAppStore();
	const router = useRouter();
	const pathname = usePathname();
	const currentWorkspace = useMemo(
		() => workspaces.find((workspace) => workspace.id === workspaceId),
		[workspaces, workspaceId],
	);

	const storeData = useMemo(() => {
		switch (type) {
			case 'workspace': {
				return currentWorkspace;
			}
			case 'folder': {
				return currentWorkspace?.folders.find(
					(folder) => folder.id === folderId,
				);
			}
			case 'file': {
				return currentWorkspace?.folders
					.find((folder) => folder.id === folderId)
					?.files.find((file) => file.id === fileId);
			}
			default:
				return;
		}
	}, [type, currentWorkspace, folderId, fileId]);

	const breadCrumbs = useMemo(() => {
		if (!currentWorkspace) return '';

		const workspaceBreadCrumb = `${currentWorkspace.iconId} ${currentWorkspace.title}`;
		if (!folderId) return workspaceBreadCrumb.trim();

		const currentFolder = currentWorkspace.folders?.find(
			(folder) => folder.id === folderId,
		);
		const folderBreadCrumb = currentFolder
			? `/ ${currentFolder.iconId} ${currentFolder.title}`
			: '';

		if (!fileId) return `${workspaceBreadCrumb} ${folderBreadCrumb}`.trim();

		const currentFile = currentFolder?.files?.find(
			(file) => file.id === fileId,
		);
		const fileBreadCrumb = currentFile
			? `/ ${currentFile.iconId} ${currentFile.title}`
			: '';

		return `${workspaceBreadCrumb} ${folderBreadCrumb} ${fileBreadCrumb}`.trim();
	}, [currentWorkspace, folderId, fileId]);

	const restore = async () => {
		switch (type) {
			case 'folder': {
				await action.updateFolder({ folder: { inTrash: '' } });
				break;
			}
			case 'file': {
				await action.updateFile({ file: { inTrash: '' } });
				break;
			}
			default:
				break;
		}
	};
	const remove = async () => {
		switch (type) {
			case 'folder': {
				await action.deleteFolder();
				break;
			}
			case 'file': {
				await action.deleteFile();
				break;
			}
			default:
				break;
		}
		router.replace(`/dashboard/${workspaceId}`);
	};

	const changeIcon = async (iconId: string) => {
		switch (type) {
			case 'workspace': {
				await action.updateWorkspace({ workspace: { iconId } });
				break;
			}
			case 'folder': {
				await action.updateFolder({ folder: { iconId } });
				break;
			}
			case 'file': {
				await action.updateFile({ file: { iconId } });
				break;
			}
			default:
				break;
		}
	};

	const removeBanner = async () => {
		try {
			await createClientComponentClient()
				.storage.from('file-banners')
				.remove([`banner-${id}`]);
			switch (type) {
				case 'workspace': {
					await action.updateWorkspace({ workspace: { bannerUrl: '' } });
					break;
				}
				case 'folder': {
					await action.updateFolder({ folder: { bannerUrl: '' } });
					break;
				}
				case 'file': {
					await action.updateFile({ file: { bannerUrl: '' } });
					break;
				}
				default:
					break;
			}
		} catch (error) {
			console.log(`🚀 ~ removeBanner ~ error:`, error);
		}
	};

	return {
		store: { storeData, breadCrumbs },
		action: { restore, remove, changeIcon, removeBanner },
	};
};

export default useInit;
