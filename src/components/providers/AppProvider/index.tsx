'use client';
import type { FileType } from '@/lib/supabase/types';
import { usePathname } from 'next/navigation';
import React, {
	createContext,
	useContext,
	useEffect,
	useMemo,
	type PropsWithChildren,
} from 'react';
import useInit, {
	type StoreType,
	type ActionType,
	type AppStoreFolderType,
	type AppStoreWorkspaceType,
} from './use-init';

const AppStoreContext = createContext<
	| {
			store: StoreType & {
				currentWorkspace?: AppStoreWorkspaceType;
				currentFolder?: AppStoreFolderType;
				currentFile?: FileType;
			};
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
	const currentWorkspace = useMemo(
		() => store.workspaces.find((workspace) => workspace.id === workspaceId),
		[store.workspaces, workspaceId],
	);
	const currentFolder = useMemo(
		() => currentWorkspace?.folders?.find((folder) => folder.id === folderId),
		[currentWorkspace, folderId],
	);
	const currentFile = useMemo(
		() => currentFolder?.files?.find((file) => file.id === fileId),
		[currentFolder, fileId],
	);

	useEffect(() => {
		action.init({ workspaceId, folderId, fileId });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [workspaceId, folderId, fileId]);

	useEffect(() => {
		console.log('App Store Changed', {
			...store,
			currentWorkspace,
			currentFolder,
			currentFile,
		});
	}, [store, currentWorkspace, currentFolder, currentFile]);

	return (
		<AppStoreContext.Provider
			value={{
				store: { ...store, currentWorkspace, currentFolder, currentFile },
				action,
			}}
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
