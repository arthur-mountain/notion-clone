import type { AuthUser } from '@supabase/supabase-js';
import type { FileType } from '@/lib/supabase/types';
import { useAppStore } from '@/components/Providers/AppProvider';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

type UseInitType = { ids: string[]; type: 'folder' | 'file'; user: AuthUser };
const useInit = ({ ids, type, user }: UseInitType) => {
	const router = useRouter();
	const { toast } = useToast();
	const {
		store: { workspaceId },
		action,
	} = useAppStore();

	const onUpdateTitle = async (title: string) => {
		let error;
		switch (type) {
			case 'folder':
				error = (await action.updateFolder({ folder: { title } })).error;
				break;
			case 'file':
				error = (await action.updateFile({ file: { title } })).error;
				break;
			default:
				error = 'Type not founded';
				break;
		}

		if (error) {
			toast({
				title: 'Error',
				variant: 'destructive',
				description: `Could not update the title for this ${type}, cause: ${error}`,
			});
		} else {
			toast({ title: 'Success', description: `${type} title changed.` });
		}
	};

	const onUpdateEmoji = async (updatedEmoji: string) => {
		const data = { iconId: updatedEmoji };
		let error;
		switch (type) {
			case 'folder': {
				error = (await action.updateFolder({ folder: data })).error;
				break;
			}
			case 'file':
				error = (await action.updateFile({ file: data })).error;
				break;
			default:
				error = 'Type not founded';
				break;
		}

		if (error) {
			toast({
				title: 'Error',
				variant: 'destructive',
				description: `Could not update the emoji for this ${type}, cause: ${error}`,
			});
		} else {
			toast({ title: 'Success', description: `Update emoji for the ${type}` });
		}
	};

	const onMoveToTrash = async () => {
		if (!user?.email) return;
		const data = { inTrash: `Deleted by ${user?.email}` };
		let error;
		switch (type) {
			case 'folder': {
				error = (await action.updateFolder({ folder: data })).error;
				break;
			}
			case 'file': {
				error = (await action.updateFile({ file: data })).error;
				break;
			}
			default:
				error = 'Type not founded';
				break;
		}

		router.replace(`/dashboard/${workspaceId}`);

		if (error) {
			toast({
				title: 'Error',
				variant: 'destructive',
				description: `Could not move the ${type} to trash, cause: ${error}`,
			});
		} else {
			toast({ title: 'Success', description: `Moved ${type} to trash` });
		}
	};

	const createNewFile = async () => {
		const [workspaceId, folderId] = ids;
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

		if ((await action.addFile({ file: newFile })).error) {
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
