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
	| {
			type: 'INIT_WORKSPACES';
			payload: ActionPayload<{ workspaces: AppStoreWorkspaceType[] }>;
	  }
	| {
			type: 'INSERT_WORKSPACE';
			payload: ActionPayload<{ workspace: AppStoreWorkspaceType }>;
	  }
	| {
			type: 'UPDATE_WORKSPACE';
			payload: ActionPayload<{ workspace: Partial<AppStoreWorkspaceType> }>;
	  }
	| { type: 'DELETE_WORKSPACE'; payload?: ActionPayload }
	| {
			type: 'SET_FOLDERS';
			payload: ActionPayload<{ folders: AppStoreFolderType[] }>;
	  }
	| {
			type: 'INSERT_FOLDER';
			payload: ActionPayload<{ folder: AppStoreFolderType }>;
	  }
	| {
			type: 'UPDATE_FOLDER';
			payload: ActionPayload<{ folder: Partial<AppStoreFolderType> }>;
	  }
	| { type: 'DELETE_FOLDER'; payload?: ActionPayload }
	| { type: 'INIT_FILES'; payload: ActionPayload<{ files: FileType[] }> }
	| { type: 'INSERT_FILE'; payload: ActionPayload<{ file: FileType }> }
	| { type: 'UPDATE_FILE'; payload: ActionPayload<{ file: Partial<FileType> }> }
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
	const workspaceId = action.payload?.workspaceId || store.workspaceId;
	const folderId = action.payload?.folderId || store.folderId;
	const fileId = action.payload?.fileId || store.fileId;

	switch (action.type) {
		case 'INIT':
			return {
				...store,
				workspaceId: action.payload?.workspaceId || '',
				folderId: action.payload?.folderId || '',
				fileId: action.payload?.fileId || '',
			};
		case 'INIT_WORKSPACES':
			return { ...store, workspaces: action.payload.workspaces };
		case 'INSERT_WORKSPACE':
			return {
				...store,
				workspaces: [...store.workspaces, action.payload.workspace],
			};
		case 'DELETE_WORKSPACE':
			return {
				...store,
				workspaces: store.workspaces.filter(
					(workspace) => workspace.id !== workspaceId,
				),
			};
		case 'UPDATE_WORKSPACE':
			return {
				...store,
				workspaces: store.workspaces.map((workspace) => {
					return workspace.id === workspaceId
						? { ...workspace, ...action.payload.workspace }
						: workspace;
				}),
			};
		case 'SET_FOLDERS':
			return {
				...store,
				workspaces: store.workspaces.map((workspace) => {
					return workspace.id === workspaceId
						? {
								...workspace,
								folders: action.payload.folders.sort(sortByCreatedAt),
						  }
						: workspace;
				}),
			};
		case 'INSERT_FOLDER':
			return {
				...store,
				workspaces: store.workspaces.map((workspace) => {
					return workspace.id === workspaceId
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
					return workspace.id === workspaceId
						? {
								...workspace,
								folders: workspace.folders.filter(
									(folder) => folder.id !== folderId,
								),
						  }
						: workspace;
				}),
			};
		case 'UPDATE_FOLDER':
			return {
				...store,
				workspaces: store.workspaces.map((workspace) => {
					return workspace.id === workspaceId
						? {
								...workspace,
								folders: workspace.folders.map((folder) => {
									return folder.id === folderId
										? { ...folder, ...action.payload.folder }
										: folder;
								}),
						  }
						: workspace;
				}),
			};
		case 'INIT_FILES':
			return {
				...store,
				workspaces: store.workspaces.map((workspace) => {
					return workspace.id === workspaceId
						? {
								...workspace,
								folders: workspace.folders.map((folder) => {
									return folder.id === folderId
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
		case 'INSERT_FILE':
			return {
				...store,
				workspaces: store.workspaces.map((workspace) => {
					return workspace.id === workspaceId
						? {
								...workspace,
								folders: workspace.folders.map((folder) => {
									return folder.id === folderId
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
					return workspace.id === workspaceId
						? {
								...workspace,
								folder: workspace.folders.map((folder) => {
									return folder.id === folderId
										? {
												...folder,
												files: folder.files.filter(
													(file) => file.id !== fileId,
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
					return workspace.id === workspaceId
						? {
								...workspace,
								folders: workspace.folders.map((folder) => {
									return folder.id === folderId
										? {
												...folder,
												files: folder.files.map((file) => {
													return file.id === fileId
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
		setFiles: (payload: Extract<Action, { type: 'INIT_FILES' }>['payload']) => {
			dispatch({ type: 'INIT_FILES', payload });
		},
		addFile: (payload: { file: FileType }) => {
			dispatch({ type: 'INSERT_FILE', payload });
			return createFile(payload.file);
		},
		updateFile: (
			payload: Extract<Action, { type: 'UPDATE_FILE' }>['payload'],
		) => {
			const fileId = payload?.fileId || store.fileId;
			if (!fileId) return { error: 'fileId not founded' };
			dispatch({ type: 'UPDATE_FILE', payload });
			return updateFile(payload.file, fileId);
		},
		deleteFile: (
			payload?: Extract<Action, { type: 'DELETE_FILE' }>['payload'],
		) => {
			const fileId = payload?.fileId || store.fileId;
			if (!fileId) return { error: 'fileId not founded' };
			dispatch({ type: 'DELETE_FILE' });
			return deleteFile(fileId);
		},
		// FOLDER
		setFolders: (
			payload: Extract<Action, { type: 'SET_FOLDERS' }>['payload'],
		) => {
			dispatch({ type: 'SET_FOLDERS', payload });
		},
		addFolder: (payload: { folder: FolderType }) => {
			dispatch({
				type: 'INSERT_FOLDER',
				payload: { folder: { ...payload.folder, files: [] } },
			});
			return createFolder(payload.folder);
		},
		updateFolder: (
			payload: Extract<Action, { type: 'UPDATE_FOLDER' }>['payload'],
		) => {
			const folderId = payload?.folderId || store.folderId;
			if (!folderId) return { error: 'FolderId not founded' };
			dispatch({ type: 'UPDATE_FOLDER', payload });
			return updateFolder(payload.folder, folderId);
		},
		deleteFolder: (
			payload?: Extract<Action, { type: 'DELETE_FOLDER' }>['payload'],
		) => {
			const folderId = payload?.folderId || store.folderId;
			if (!folderId) return { error: 'FolderId not founded' };
			dispatch({ type: 'DELETE_FOLDER' });
			return deleteFolder(folderId);
		},
		// WORKSPACE
		setWorkspaces: (
			payload: Extract<Action, { type: 'INIT_WORKSPACES' }>['payload'],
		) => {
			dispatch({ type: 'INIT_WORKSPACES', payload });
		},
		addWorkspace: (payload: { workspace: WorkspaceType }) => {
			dispatch({
				type: 'INSERT_WORKSPACE',
				payload: { workspace: { ...payload.workspace, folders: [] } },
			});
			return createWorkspace(payload.workspace);
		},
		updateWorkspace: (
			payload: Extract<Action, { type: 'UPDATE_WORKSPACE' }>['payload'],
		) => {
			const workspaceId = payload?.workspaceId || store.workspaceId;
			if (!workspaceId) return { error: 'workspaceId not founded' };
			dispatch({ type: 'UPDATE_WORKSPACE', payload });
			return updateWorkspace(payload.workspace, workspaceId);
		},
		deleteWorkspace: (
			payload?: Extract<Action, { type: 'DELETE_WORKSPACE' }>['payload'],
		) => {
			const workspaceId = payload?.workspaceId || store.workspaceId;
			if (!workspaceId) return { error: 'workspaceId not founded' };
			dispatch({ type: 'DELETE_WORKSPACE' });
			return deleteWorkspace(workspaceId);
		},
		onRealtimeUpdate: (
			realtimeData: Exclude<
				Action,
				{ type: 'INIT' | 'INIT_WORKSPACES' | 'INIT_FOLDERS' | 'INIT_FILES' }
			>,
		) => {
			dispatch(realtimeData);
		},
		utils,
	};

	return { store, action };
};

export type StoreType = ReturnType<typeof useInit>['store'];
export type ActionType = ReturnType<typeof useInit>['action'];
export default useInit;
