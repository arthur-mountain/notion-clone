'use client';
import type { UserType, WorkspaceType } from '@/lib/supabase/types';
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
		store: { user, subscription, isSubscriptionModalOpen },
		action: { toggleSubscriptionDialog },
	} = useUser();
	const {
		store: { workspaces, workspaceId, currentWorkspace },
		action,
	} = useAppStore();
	const [collaborators, setCollaborators] = useState<UserType[]>([]);
	const [workspaceDetails, setWorkspaceDetails] = useState<WorkspaceType>();
	const titleTimerRef = useRef<ReturnType<typeof setTimeout>>();
	const [uploadingLogo, setUploadingLogo] = useState(false);
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
		action.updateWorkspace({ workspace: { title: value } });

		if (titleTimerRef.current) clearTimeout(titleTimerRef.current);
		titleTimerRef.current = setTimeout(async () => {
			// await updateWorkspace({ title: e.target.value }, workspaceId);
		}, 500);
	};

	const onChangeWorkspaceLogo = async (file: File) => {
		if (!workspaceId || !file) return;
		setUploadingLogo(true);
		const imgPath = await upload({
			storageName: 'workspace-logos',
			fileName: `workspaceLogo.${crypto.randomUUID()}`,
			file,
			storageConfig: { cacheControl: '3600', upsert: true },
		});
		setUploadingLogo(false);

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
	};

	const onDeleteWorkspace = async () => {
		if (!workspaceId) return;
		await deleteWorkspace(workspaceId);
		toast({ title: 'Successfully deleted your workspae' });
		action.deleteWorkspace();
		router.replace('/dashboard');
	};

	useEffect(() => {
		const showingWorkspace = workspaces.find(
			(workspace) => workspace.id === workspaceId,
		);
		if (showingWorkspace) setWorkspaceDetails(showingWorkspace);
	}, [workspaceId, workspaces]);

	useEffect(() => {
		if (!workspaceId) return;
		(async () => {
			const { data: collaborators } = await getCollaborators(workspaceId);

			if (collaborators.length) {
				action.updateWorkspace({ workspace: { permission: 'shared' } });
				setCollaborators(collaborators);
			}
		})();
	}, [workspaceId, action.updatePermission]);

	return {
		store: {
			isSubscriptionModalOpen,
			isOpenAlertMessage,
			workspaceDetails,
			uploadingLogo,
			user,
			subscription,
			collaborators,
			permission: currentWorkspace?.permission,
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
