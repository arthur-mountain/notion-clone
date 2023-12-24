import type { UserType } from '@/lib/supabase/types';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import {
	addCollaborators,
	getCollaborators,
	removeCollaborators,
} from '@/lib/supabase/schemas/collaborators/queries';
import { useAppStore } from '@/components/providers/AppProvider';
import { useUser } from '@/components/providers/UserProvider';
import { useSubscriptionModal } from '@/components/providers/SubscriptionModalProvider';

const useCollaborators = () => {
	const router = useRouter();
	const { setIsOpen } = useSubscriptionModal();
	const {
		store: { subscription },
	} = useUser();
	const {
		store: { workspaceId },
		action: { updatePermission },
	} = useAppStore();
	const [collaborators, setCollaborators] = useState<UserType[]>([]);
	const existsCollaboratorIdsSet = useMemo(
		() => new Set(collaborators.map(({ id }) => id)),
		[collaborators],
	);

	const changePermissions = (value: 'shared' | 'private') => {
		updatePermission({ permission: value });
	};

	const addCollaborator = async (user: UserType) => {
		if (!workspaceId) return;
		if (subscription?.status !== 'active' && collaborators.length >= 2) {
			setIsOpen(true);
			return;
		}
		await addCollaborators([user], workspaceId);
		setCollaborators((prev) => [...prev, user]);
	};

	const deleteCollaborator = async (user: UserType) => {
		if (!workspaceId) return;
		if (collaborators.length === 1) changePermissions('private');

		await removeCollaborators([user], workspaceId);
		setCollaborators((prev) => prev.filter(({ id }) => id !== user.id));
		router.refresh();
	};

	useEffect(() => {
		if (!workspaceId) return;
		(async () => {
			const { data: collaborators } = await getCollaborators(workspaceId);
			if (collaborators.length) {
				updatePermission({ permission: 'shared' });
				setCollaborators(collaborators);
			}
		})();
	}, [workspaceId, updatePermission]);

	return {
		store: { collaborators, existsCollaboratorIdsSet },
		action: { addCollaborator, deleteCollaborator },
	};
};

export default useCollaborators;
