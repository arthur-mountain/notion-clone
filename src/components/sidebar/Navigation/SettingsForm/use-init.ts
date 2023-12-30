'use client';
import type { UserType } from '@/lib/supabase/types';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import {
	getCollaborators,
	removeCollaborators,
} from '@/lib/supabase/schemas/collaborators/queries';
import {
	deleteWorkspace,
	updateWorkspace,
} from '@/lib/supabase/schemas/workspaces/queries';
import { upload } from '@/lib/supabase/utils/client/upload';
import { useAppStore } from '@/components/providers/AppProvider';
import { useUser } from '@/components/providers/UserProvider';
// import { postData } from '@/lib/utils';

const useInit = () => {
	const router = useRouter();
	const { toast } = useToast();
	const {
		store: { subscription, isSubscriptionModalOpen },
		action: { toggleSubscriptionDialog },
	} = useUser();
	const {
		store: { workspaces, workspaceId },
		action,
	} = useAppStore();
	const [collaborators, setCollaborators] = useState<UserType[]>([]);
	const titleTimerRef = useRef<ReturnType<typeof setTimeout>>();
	const [isUploadingLogo, setIsUploadingLogo] = useState(false);
	const [isOpenAlertMessage, setIsOpenAlertMessage] = useState(false);

	const onAlertConfirm = async () => {
		if (!workspaceId) return;
		if (collaborators.length > 0) {
			await removeCollaborators(collaborators, workspaceId);
		}
		action.updateWorkspace({ workspace: { permission: 'private' } });
		setIsOpenAlertMessage(false);
	};

	const onChangeWorkspaceName = (value: string) => {
		if (!workspaceId || !value) return;
		if (titleTimerRef.current) clearTimeout(titleTimerRef.current);
		titleTimerRef.current = setTimeout(async () => {
			action.updateWorkspace({ workspace: { title: value } });
			await updateWorkspace({ title: value }, workspaceId);
			router.refresh();
		}, 500);
	};

	const onChangeWorkspaceLogo = async (file: File) => {
		if (!workspaceId || !file) return;
		setIsUploadingLogo(true);
		const imgPath = await upload({
			storageName: 'workspace-logos',
			fileName: `workspaceLogo.${crypto.randomUUID()}`,
			file,
			storageConfig: { cacheControl: '3600', upsert: true },
		});
		setIsUploadingLogo(false);

		if (!imgPath) {
			toast({
				title: 'Error',
				variant: 'destructive',
				description: 'Error uploading logo, please try again',
			});
			return;
		}

		action.updateWorkspace({ workspace: { logo: imgPath } });
		await updateWorkspace({ logo: imgPath }, workspaceId);
		router.refresh();
	};

	const onDeleteWorkspace = async () => {
		if (!workspaceId) return;
		await deleteWorkspace(workspaceId);
		toast({ title: 'Successfully deleted your workspae' });
		action.deleteWorkspace();
		router.replace('/dashboard');
	};

	useEffect(() => {
		if (!workspaceId) return;
		(async () => {
			const { data: collaborators } = await getCollaborators(workspaceId);

			if (collaborators.length) {
				action.updateWorkspace({ workspace: { permission: 'shared' } });
				setCollaborators(collaborators);
			}
		})();
	}, [workspaceId]);

	return {
		store: {
			isSubscriptionModalOpen,
			isOpenAlertMessage,
			currentWorkspace: workspaces.find(({ id }) => id === workspaceId),
			isUploadingLogo,
			collaborators,
			subscription,
		},
		action: {
			onAlertConfirm,
			onChangeWorkspaceName,
			onChangeWorkspaceLogo,
			onDeleteWorkspace,
			toggleSubscriptionDialog,
			openAlertMessageModal: setIsOpenAlertMessage,
		},
	};
};

export default useInit;
