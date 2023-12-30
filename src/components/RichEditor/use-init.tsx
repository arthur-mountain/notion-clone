import type { FileType, FolderType, WorkspaceType } from '@/lib/supabase/types';
import { useAppStore } from '../Providers/AppProvider';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';

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

	const storeData = useMemo(() => {
		switch (type) {
			case 'workspace': {
				return workspaces.find((workspace) => workspace.id === workspaceId);
			}
			case 'folder': {
				return workspaces
					.find((workspace) => workspace.id === workspaceId)
					?.folders.find((folder) => folder.id === folderId);
			}
			case 'file': {
				return workspaces
					.find((workspace) => workspace.id === workspaceId)
					?.folders.find((folder) => folder.id === folderId)
					?.files.find((file) => file.id === fileId);
			}
			default:
				return;
		}
	}, [type, workspaces, workspaceId, folderId, fileId]);

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

	return {
		store: { storeData },
		action: { restore, remove },
	};
};

export default useInit;
