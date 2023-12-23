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
			store: StoreType & {
				workspaceId?: string;
				folderId?: string;
				fileId?: string;
			};
			action: ActionType;
	  }
	| undefined
>(undefined);

export const AppStoreProvider = ({ children }: PropsWithChildren) => {
	const { store, action } = useInit();
	const pathname = usePathname();
	const [_, workspaceId, folderId, fileId] = useMemo(
		() => pathname?.split('/').filter(Boolean),
		[pathname],
	);

	useEffect(() => {
		if (!workspaceId || !folderId) return;
		(async () => {
			const { data: files, error: filesError } = await getFiles(folderId);
			if (filesError) return;
			action.setFiles({ workspaceId, folderId, files });
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [action.setFiles, folderId, workspaceId]);

	useEffect(() => {
		console.log('App Store Changed', store);
	}, [store]);

	return (
		<AppStoreContext.Provider
			value={{ store: { ...store, workspaceId, folderId, fileId }, action }}
		>
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
