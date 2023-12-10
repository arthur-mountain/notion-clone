'use client';
import {
	createContext,
	useContext,
	useEffect,
	type PropsWithChildren,
} from 'react';
import useInit, { type StoreType } from './use-init';

const UserContext = createContext<{
	store: StoreType;
}>({ store: { user: null, subscription: null } });

export const useUser = () => useContext(UserContext);
export const UserProvider = ({ children }: PropsWithChildren) => {
	const { store, action } = useInit();

	useEffect(() => {
		(async () => {
			await action.getUser();
			await action.getSubscription();
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<UserContext.Provider value={{ store }}>{children}</UserContext.Provider>
	);
};
