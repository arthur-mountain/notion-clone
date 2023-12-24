import type { AuthUser } from '@supabase/supabase-js';
import type { FileType } from '@/lib/supabase/types';
import { createFile, updateFile } from '@/lib/supabase/schemas/files/queries';
import { updateFolder } from '@/lib/supabase/schemas/folders/queries';
import { useAppStore } from '@/components/providers/AppProvider';
import { useToast } from '@/components/ui/use-toast';

type UseInitType = { ids: string[]; type: 'folder' | 'file'; user: AuthUser };
const useInit = ({ ids, type, user }: UseInitType) => {
	const { toast } = useToast();
	const { action } = useAppStore();
	const [workspaceId, folderId, fileId] = ids;

	const onUpdateTitle = async (title: string) => {
		let error;
		switch (type) {
			case 'folder':
				error = folderId
					? (await updateFolder({ title }, folderId)).error
					: 'FolderId not founded';
				break;
			case 'file':
				error = fileId
					? (await updateFile({ title }, fileId)).error
					: 'FileId not founded';
				break;
			default:
				error = 'Type not founded';
				break;
		}

		if (error) {
			toast({
				title: 'Error',
				variant: 'destructive',
				description: `Could not update the title for this ${type}`,
			});
		} else {
			toast({ title: 'Success', description: `${type} title changed.` });
		}
	};

	const onUpdateEmoji = async (updatedEmoji: string) => {
		if (!workspaceId) return;

		const data = { iconId: updatedEmoji };
		let funcOrError;
		switch (type) {
			case 'folder': {
				funcOrError = folderId
					? () => {
							action.updateFolder({ workspaceId, folderId, folder: data });
							return updateFolder(data, folderId);
					  }
					: 'FolderId not founded';
				break;
			}
			case 'file':
				funcOrError =
					folderId && fileId
						? () => {
								action.updateFile({
									workspaceId,
									folderId,
									fileId,
									file: data,
								});
								return updateFile(data, fileId);
						  }
						: 'One of folderId and fileId not founded';
				break;
			default:
				funcOrError = 'Type not founded';
				break;
		}

		if (typeof funcOrError === 'string' || (await funcOrError()).error) {
			toast({
				title: 'Error',
				variant: 'destructive',
				description: `Could not update the emoji for this ${type}`,
			});
		} else {
			toast({ title: 'Success', description: `Update emoji for the ${type}` });
		}
	};

	const onMoveToTrash = async () => {
		if (!user?.email || !workspaceId) return;
		const data = { inTrash: `Deleted by ${user?.email}` };
		let funcOrError;
		switch (type) {
			case 'folder': {
				funcOrError = folderId
					? () => {
							action.updateFolder({ workspaceId, folderId, folder: data });
							return updateFolder(data, folderId);
					  }
					: 'FolderId not founded';
				break;
			}
			case 'file': {
				funcOrError = folderId
					? () => {
							action.updateFile({
								workspaceId,
								folderId,
								fileId,
								file: data,
							});
							return updateFile(data, fileId);
					  }
					: 'One of folderId and fileId not founded';
				break;
			}
			default:
				funcOrError = 'Type not founded';
				break;
		}

		if (typeof funcOrError === 'string' || (await funcOrError()).error) {
			toast({
				title: 'Error',
				variant: 'destructive',
				description: `Could not move the ${type} to trash`,
			});
		} else {
			toast({ title: 'Success', description: `Moved ${type} to trash` });
		}
	};

	const createNewFile = async () => {
		if (!workspaceId || !folderId) return;

		const newFile: FileType = {
			id: crypto.randomUUID(),
			workspaceId,
			folderId,
			data: null,
			createdAt: new Date().toISOString(),
			inTrash: null,
			title: 'Untitled',
			iconId: '📄',
			bannerUrl: '',
		};

		action.addFile({ workspaceId, folderId, file: newFile });
		if ((await createFile(newFile)).error) {
			toast({
				title: 'Error',
				variant: 'destructive',
				description: 'Could not create a file',
			});
		} else {
			toast({ title: 'Success', description: 'File created.' });
		}
	};

	return { onUpdateTitle, onUpdateEmoji, onMoveToTrash, createNewFile };
};

export default useInit;