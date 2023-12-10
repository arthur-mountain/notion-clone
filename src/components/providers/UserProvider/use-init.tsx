import type { AuthUser } from '@supabase/supabase-js';
import type { SubscriptionType } from '@/lib/supabase/types';
import { useReducer, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { createClientComponentClient } from '@/lib/supabase/utils/client';
import { getFirstSubscriptionByUserId } from '@/lib/supabase/schemas/subscriptions/query';

type Store = { user: AuthUser | null; subscription: SubscriptionType | null };
type Action =
	| { type: 'ADD_USER'; payload: { user: AuthUser } }
	| {
			type: 'ADD_USER_SUBSCRIPTION';
			payload: { subscription: SubscriptionType };
	  };

const initialStore: Store = { user: null, subscription: null };
const reducer = (store: Store = initialStore, action: Action): Store => {
	switch (action.type) {
		case 'ADD_USER':
			return { ...store, user: action.payload.user };
		case 'ADD_USER_SUBSCRIPTION':
			return { ...store, subscription: action.payload.subscription };
		default:
			return initialStore;
	}
};

const useInit = () => {
	const [store, dispatch] = useReducer(reducer, initialStore);
	const { toast } = useToast();

	const getUser = useCallback(async () => {
		const {
			data: { user },
		} = await createClientComponentClient().auth.getUser();
		if (!user) return;
		console.log(user);
		dispatch({ type: 'ADD_USER', payload: { user } });
		return user;
	}, []);
	const getSubscription = useCallback(
		async (uid?: string) => {
			const userId = uid || store.user?.id || (await getUser())?.id;
			if (!userId) return;
			const { subscription, error } = await getFirstSubscriptionByUserId(
				userId,
			);
			if (error) {
				toast({
					title: 'Unexpected Error',
					description: 'Oppse! An unexpected error happened. Try again later.',
				});
			}
			if (subscription) {
				dispatch({
					type: 'ADD_USER_SUBSCRIPTION',
					payload: { subscription },
				});
				return subscription;
			}
		},
		[store.user?.id, getUser, toast],
	);

	return { store, action: { getUser, getSubscription } };
};

export type StoreType = ReturnType<typeof useInit>['store'];
type ActionType = ReturnType<typeof useInit>['action'];
export default useInit;
