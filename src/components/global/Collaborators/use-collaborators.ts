import type { UserType } from '@/lib/supabase/types';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import {
	addCollaborators,
	getCollaborators,
	removeCollaborators,
} from '@/lib/supabase/schemas/collaborators/queries';
import { useAppStore } from '@/components/Providers/AppProvider';
import { useUser } from '@/components/Providers/UserProvider';

const useCollaborators = ({
	type = 'update',
}: {
	type?: 'create' | 'update';
}) => {
	const router = useRouter();
	const {
		action: { checkIsSubscriptionValid },
	} = useUser();
	const {
		store: { workspaceId },
		action: { updateWorkspace },
	} = useAppStore();
	const [collaborators, setCollaborators] = useState<UserType[]>([]);
	const existsCollaboratorIdsSet = useMemo(
		() => new Set(collaborators.map(({ id }) => id)),
		[collaborators],
	);
	const hasExistedWorkspace = type === 'update';

	const addCollaborator = async (user: UserType) => {
		if (!workspaceId) return;
		if (collaborators.length >= 2 && !checkIsSubscriptionValid()) return;

		if (hasExistedWorkspace) await addCollaborators([user], workspaceId);
		setCollaborators((prev) => [...prev, user]);
	};

	const deleteCollaborator = async (user: UserType) => {
		if (!workspaceId) return;
		if (hasExistedWorkspace && collaborators.length === 1) {
			updateWorkspace({ workspace: { permission: 'private' } });
		}

		setCollaborators((prev) => prev.filter(({ id }) => id !== user.id));
		if (hasExistedWorkspace) {
			await removeCollaborators([user], workspaceId);
			router.refresh();
		}
	};

	useEffect(() => {
		if (!workspaceId) return;
		(async () => {
			const { data: collaborators } = await getCollaborators(workspaceId);
			
			if (collaborators.length) {
				if (hasExistedWorkspace) {
					updateWorkspace({ workspace: { permission: 'shared' } });
				}

				setCollaborators(collaborators);
			}
		})();
	}, [workspaceId, hasExistedWorkspace, updateWorkspace]);

	return {
		store: { collaborators, existsCollaboratorIdsSet },
		action: { addCollaborator, deleteCollaborator },
	};
};

export default useCollaborators;
