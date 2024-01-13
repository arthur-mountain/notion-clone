'use client';
import type { AuthUser } from '@supabase/supabase-js';
import type { SubscriptionType, UserType } from '@/lib/supabase/types';
import {
	createContext,
	useContext,
	useEffect,
	useState,
	useCallback,
	type PropsWithChildren,
} from 'react';
import { useToast } from '@/components/ui/use-toast';
import SubscriptionDialog from '@/components/Global/SubscriptionDialog';
import { createClientComponentClient } from '@/lib/supabase/utils/client';
import { getFirstSubscriptionByUserId } from '@/lib/supabase/schemas/subscriptions/queries';
import { getUserById } from '@/lib/supabase/schemas/users/queries';

type User = AuthUser & {
	extra: UserType;
};

type Store = {
	user: User | null;
	subscription: SubscriptionType | null;
	isSubscriptionModalOpen: boolean;
};
type Action = {
	toggleSubscriptionDialog: (isOpen: boolean) => void;
	checkIsSubscriptionValid: (shouldShowWarningModal?: boolean) => boolean;
};
const UserContext = createContext<{ store: Store; action: Action } | undefined>(
	undefined,
);

export const useUser = () => {
	const context = useContext(UserContext);
	if (!context) {
		throw new Error('useUser must be used within an AppStoreProvider');
	}
	return context;
};
export const UserProvider = ({ children }: PropsWithChildren) => {
	const { toast } = useToast();
	const [user, setUser] = useState<User | null>(null);
	const [subscription, setSubscription] = useState<SubscriptionType | null>(
		null,
	);
	const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);

	const toggleSubscriptionDialog = useCallback((isOpen: boolean) => {
		setIsSubscriptionModalOpen(isOpen);
	}, []);
	const checkIsSubscriptionValid = useCallback(
		(shouldShowWarningModal = true) => {
			const isValid = subscription?.status === 'active';
			if (shouldShowWarningModal && !isValid) setIsSubscriptionModalOpen(true);
			return isValid;
		},
		[subscription],
	);

	useEffect(() => {
		(async () => {
			const {
				data: { user },
			} = await createClientComponentClient().auth.getUser();
			if (!user) return toast({ title: 'User Not Found' });
			const extraUserInfo = await getUserById(user.id);
			if (!extraUserInfo.data || extraUserInfo.error) {
				return toast({
					title: 'Get User Info Error',
					description: extraUserInfo.error,
				});
			}
			setUser({ ...user, extra: extraUserInfo.data });
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (!user) return;
		(async () => {
			const { data: subscription, error } = await getFirstSubscriptionByUserId(
				user.id,
			);
			if (error) {
				toast({
					title: 'Unexpected Error',
					description: 'Oppse! An unexpected error happened. Try again later.',
				});
				return;
			}
			setSubscription(subscription);
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

	return (
		<UserContext.Provider
			value={{
				store: { user, subscription, isSubscriptionModalOpen },
				action: { toggleSubscriptionDialog, checkIsSubscriptionValid },
			}}
		>
			{children}
			<SubscriptionDialog products={[]} />
		</UserContext.Provider>
	);
};
