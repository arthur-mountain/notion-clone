'use client';
import React, {
	createContext,
	useContext,
	useEffect,
	useMemo,
	type PropsWithChildren,
} from 'react';
import { usePathname } from 'next/navigation';
import { getFiles } from '@/lib/supabase/schemas/files/queries';
import useInit, { type StoreType, type ActionType } from './use-init';

const AppStoreContext = createContext<
	| {
			store: StoreType;
			action: ActionType;
	  }
	| undefined
>(undefined);

export const AppStoreProvider = ({ children }: PropsWithChildren) => {
	const pathname = usePathname();
	const { store, action } = useInit();
	const [_, workspaceId, folderId, fileId] = useMemo(
		() => pathname.split('/').filter(Boolean),
		[pathname],
	);

	useEffect(() => {
		action.init({ workspaceId, folderId, fileId });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [workspaceId, folderId, fileId]);

	useEffect(() => {
		if (!workspaceId || !folderId) return;
		(async () => {
			const { data: files, error: filesError } = await getFiles(folderId);
			if (filesError) return;
			action.setFiles({ workspaceId, folderId, files });
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [workspaceId, folderId]);

	useEffect(() => {
		console.log('App Store Changed', store);
	}, [store]);

	return (
		<AppStoreContext.Provider value={{ store, action }}>
			{children}
		</AppStoreContext.Provider>
	);
};

export const useAppStore = () => {
	const context = useContext(AppStoreContext);
	if (!context) {
		throw new Error('useAppStore must be used within an AppStoreProvider');
	}
	return context;
};
