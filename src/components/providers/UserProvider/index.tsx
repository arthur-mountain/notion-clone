'use client';
import type { AuthUser } from '@supabase/supabase-js';
import type { SubscriptionType } from '@/lib/supabase/types';
import {
	createContext,
	useContext,
	useEffect,
	useState,
	useCallback,
	type PropsWithChildren,
} from 'react';
import { useToast } from '@/components/ui/use-toast';
import SubscriptionDialog from '@/components/global/SubscriptionDialog';
import { createClientComponentClient } from '@/lib/supabase/utils/client';
import { getFirstSubscriptionByUserId } from '@/lib/supabase/schemas/subscriptions/queries';

type Store = {
	user: AuthUser | null;
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
	const [user, setUser] = useState<AuthUser | null>(null);
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
			if (!user) return;
			console.log(user);
			setUser(user);
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (!user) return;
		(async () => {
			const { data: subscription, error } = await getFirstSubscriptionByUserId(
				user.id,
			);
			if (error || !subscription) {
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
