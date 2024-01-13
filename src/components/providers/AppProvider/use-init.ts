'use client';
import type { FileType, FolderType, WorkspaceType } from '@/lib/supabase/types';
import {
	updateFile,
	deleteFile,
	createFile,
} from '@/lib/supabase/schemas/files/queries';
import {
	updateFolder,
	deleteFolder,
	createFolder,
} from '@/lib/supabase/schemas/folders/queries';
import { useReducer } from 'react';
import {
	createWorkspace,
	deleteWorkspace,
	updateWorkspace,
} from '@/lib/supabase/schemas/workspaces/queries';

export type AppStoreFolderType = FolderType & { files: FileType[] };
export type AppStoreWorkspaceType = WorkspaceType & {
	folders: AppStoreFolderType[];
};

type Store = {
	workspaces: AppStoreWorkspaceType[];
	workspaceId: string;
	folderId: string;
	fileId: string;
};

type ActionPayload<Payload = {}> = Payload &
	Partial<{
		workspaceId: string;
		folderId: string;
		fileId: string;
	}>;
type Action =
	| { type: 'INIT'; payload?: ActionPayload }
	| { type: 'SET_WORKSPACES'; payload: { workspaces: AppStoreWorkspaceType[] } }
	| { type: 'ADD_WORKSPACE'; payload: { workspace: AppStoreWorkspaceType } }
	| {
			type: 'UPDATE_WORKSPACE';
			payload: { workspace: Partial<AppStoreWorkspaceType> };
	  }
	| { type: 'DELETE_WORKSPACE' }
	| { type: 'SET_FOLDERS'; payload: { folders: AppStoreFolderType[] } }
	| { type: 'ADD_FOLDER'; payload: { folder: AppStoreFolderType } }
	| { type: 'UPDATE_FOLDER'; payload: { folder: Partial<AppStoreFolderType> } }
	| { type: 'DELETE_FOLDER'; payload?: ActionPayload }
	| { type: 'SET_FILES'; payload: { files: FileType[] } }
	| { type: 'ADD_FILE'; payload: { file: FileType } }
	| { type: 'UPDATE_FILE'; payload: { file: Partial<FileType> } }
	| { type: 'DELETE_FILE'; payload?: ActionPayload };

const initialStore: Store = {
	workspaces: [],
	workspaceId: '',
	folderId: '',
	fileId: '',
};

const sortByCreatedAt = (a: any, b: any) =>
	new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
const reducer = (store: Store = initialStore, action: Action): Store => {
	switch (action.type) {
		case 'INIT':
			return {
				...store,
				workspaceId: action.payload?.workspaceId || '',
				folderId: action.payload?.folderId || '',
				fileId: action.payload?.fileId || '',
			};
		case 'SET_WORKSPACES':
			return { ...store, workspaces: action.payload.workspaces };
		case 'ADD_WORKSPACE':
			return {
				...store,
				workspaces: [...store.workspaces, action.payload.workspace],
			};
		case 'DELETE_WORKSPACE':
			return {
				...store,
				workspaces: store.workspaces.filter(
					(workspace) => workspace.id !== store.workspaceId,
				),
			};
		case 'UPDATE_WORKSPACE':
			return {
				...store,
				workspaces: store.workspaces.map((workspace) => {
					return workspace.id === store.workspaceId
						? { ...workspace, ...action.payload.workspace }
						: workspace;
				}),
			};
		case 'SET_FOLDERS':
			return {
				...store,
				workspaces: store.workspaces.map((workspace) => {
					return workspace.id === store.workspaceId
						? {
								...workspace,
								folders: action.payload.folders.sort(sortByCreatedAt),
						  }
						: workspace;
				}),
			};
		case 'ADD_FOLDER':
			return {
				...store,
				workspaces: store.workspaces.map((workspace) => {
					return workspace.id === store.workspaceId
						? {
								...workspace,
								folders: [...workspace.folders, action.payload.folder].sort(
									sortByCreatedAt,
								),
						  }
						: workspace;
				}),
			};
		case 'DELETE_FOLDER':
			return {
				...store,
				workspaces: store.workspaces.map((workspace) => {
					return workspace.id === store.workspaceId
						? {
								...workspace,
								folders: workspace.folders.filter(
									(folder) => folder.id !== store.folderId,
								),
						  }
						: workspace;
				}),
			};
		case 'UPDATE_FOLDER':
			return {
				...store,
				workspaces: store.workspaces.map((workspace) => {
					return workspace.id === store.workspaceId
						? {
								...workspace,
								folders: workspace.folders.map((folder) => {
									return folder.id === store.folderId
										? { ...folder, ...action.payload.folder }
										: folder;
								}),
						  }
						: workspace;
				}),
			};
		case 'SET_FILES':
			return {
				...store,
				workspaces: store.workspaces.map((workspace) => {
					return workspace.id === store.workspaceId
						? {
								...workspace,
								folders: workspace.folders.map((folder) => {
									return folder.id === store.folderId
										? {
												...folder,
												files: action.payload.files.sort(sortByCreatedAt),
										  }
										: folder;
								}),
						  }
						: workspace;
				}),
			};
		case 'ADD_FILE':
			return {
				...store,
				workspaces: store.workspaces.map((workspace) => {
					return workspace.id === store.workspaceId
						? {
								...workspace,
								folders: workspace.folders.map((folder) => {
									return folder.id === store.folderId
										? {
												...folder,
												files: [...folder.files, action.payload.file].sort(
													sortByCreatedAt,
												),
										  }
										: folder;
								}),
						  }
						: workspace;
				}),
			};
		case 'DELETE_FILE':
			return {
				...store,
				workspaces: store.workspaces.map((workspace) => {
					return workspace.id === store.workspaceId
						? {
								...workspace,
								folder: workspace.folders.map((folder) => {
									return folder.id === store.folderId
										? {
												...folder,
												files: folder.files.filter(
													(file) => file.id !== store.fileId,
												),
										  }
										: folder;
								}),
						  }
						: workspace;
				}),
			};
		case 'UPDATE_FILE':
			return {
				...store,
				workspaces: store.workspaces.map((workspace) => {
					return workspace.id === store.workspaceId
						? {
								...workspace,
								folders: workspace.folders.map((folder) => {
									return folder.id === store.folderId
										? {
												...folder,
												files: folder.files.map((file) => {
													return file.id === store.fileId
														? { ...file, ...action.payload.file }
														: file;
												}),
										  }
										: folder;
								}),
						  }
						: workspace;
				}),
			};
		default:
			return initialStore;
	}
};

const useInit = () => {
	const [store, dispatch] = useReducer(reducer, initialStore);

	const utils = {
		getWorkspace: (
			{ workspaceId }: { workspaceId: string } = {
				workspaceId: store.workspaceId,
			},
		) => {
			return store.workspaces.find((workspace) => workspace.id === workspaceId);
		},
		getFolder: (
			{ workspaceId, folderId }: { workspaceId: string; folderId: string } = {
				workspaceId: store.workspaceId,
				folderId: store.folderId,
			},
		) => {
			return store.workspaces
				.find((workspace) => workspace.id === workspaceId)
				?.folders.find((folder) => folder.id === folderId);
		},
		getFile: (
			{
				workspaceId,
				folderId,
				fileId,
			}: { workspaceId: string; folderId: string; fileId: string } = {
				workspaceId: store.workspaceId,
				folderId: store.folderId,
				fileId: store.fileId,
			},
		) => {
			return store.workspaces
				.find((workspace) => workspace.id === workspaceId)
				?.folders.find((folder) => folder.id === folderId)
				?.files.find((file) => file.id === fileId);
		},
	} as const;

	const action = {
		init: (payload: Extract<Action, { type: 'INIT' }>['payload']) => {
			dispatch({ type: 'INIT', payload });
		},
		// FILE
		setFiles: (payload: Extract<Action, { type: 'SET_FILES' }>['payload']) => {
			dispatch({ type: 'SET_FILES', payload });
		},
		addFile: (payload: { file: FileType }) => {
			dispatch({ type: 'ADD_FILE', payload });
			return createFile(payload.file);
		},
		updateFile: (
			payload: Extract<Action, { type: 'UPDATE_FILE' }>['payload'],
		) => {
			if (!store.fileId) return { error: 'fileId not founded' };
			dispatch({ type: 'UPDATE_FILE', payload });
			return updateFile(payload.file, store.fileId);
		},
		deleteFile: () => {
			if (!store.fileId) return { error: 'fileId not founded' };
			dispatch({ type: 'DELETE_FILE' });
			return deleteFile(store.fileId);
		},
		// FOLDER
		setFolders: (
			payload: Extract<Action, { type: 'SET_FOLDERS' }>['payload'],
		) => {
			dispatch({ type: 'SET_FOLDERS', payload });
		},
		addFolder: (payload: { folder: FolderType }) => {
			dispatch({
				type: 'ADD_FOLDER',
				payload: { folder: { ...payload.folder, files: [] } },
			});
			return createFolder(payload.folder);
		},
		updateFolder: (
			payload: Extract<Action, { type: 'UPDATE_FOLDER' }>['payload'],
		) => {
			if (!store.folderId) return { error: 'FolderId not founded' };
			dispatch({ type: 'UPDATE_FOLDER', payload });
			return updateFolder(payload.folder, store.folderId);
		},
		deleteFolder: () => {
			if (!store.folderId) return { error: 'FolderId not founded' };
			dispatch({ type: 'DELETE_FOLDER' });
			return deleteFolder(store.folderId);
		},
		// WORKSPACE
		setWorkspaces: (
			payload: Extract<Action, { type: 'SET_WORKSPACES' }>['payload'],
		) => {
			dispatch({ type: 'SET_WORKSPACES', payload });
		},
		addWorkspace: (payload: { workspace: WorkspaceType }) => {
			dispatch({
				type: 'ADD_WORKSPACE',
				payload: { workspace: { ...payload.workspace, folders: [] } },
			});
			return createWorkspace(payload.workspace);
		},
		updateWorkspace: (
			payload: Extract<Action, { type: 'UPDATE_WORKSPACE' }>['payload'],
		) => {
			if (!store.workspaceId) return { error: 'workspaceId not founded' };
			dispatch({ type: 'UPDATE_WORKSPACE', payload });
			return updateWorkspace(payload.workspace, store.workspaceId);
		},
		deleteWorkspace: () => {
			if (!store.workspaceId) return { error: 'workspaceId not founded' };
			dispatch({ type: 'DELETE_WORKSPACE' });
			return deleteWorkspace(store.workspaceId);
		},
		utils,
	};

	return { store, action };
};

export type StoreType = ReturnType<typeof useInit>['store'];
export type ActionType = ReturnType<typeof useInit>['action'];
export default useInit;
