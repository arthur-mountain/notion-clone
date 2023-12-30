'use client';
import { deleteFile } from '@/lib/supabase/schemas/files/queries';
import { deleteFolder } from '@/lib/supabase/schemas/folders/queries';
import type { FileType, FolderType, WorkspaceType } from '@/lib/supabase/types';
import { useReducer, useMemo } from 'react';

export type FoldersType = FolderType & { files: FileType[] };
export type WorkspacesType = WorkspaceType & {
	folders: FoldersType[];
};

type Store = {
	workspaces: WorkspacesType[];
	workspaceId: string;
	folderId: string;
	fileId: string;
};

type Action =
	| {
			type: 'INIT';
			payload: { workspaceId?: string; folderId?: string; fileId?: string };
	  }
	| { type: 'SET_WORKSPACES'; payload: { workspaces: WorkspacesType[] } }
	| { type: 'ADD_WORKSPACE'; payload: { workspace: WorkspacesType } }
	| {
			type: 'UPDATE_WORKSPACE';
			payload: { workspace: Partial<WorkspacesType> };
	  }
	| { type: 'DELETE_WORKSPACE' }
	| { type: 'SET_FOLDERS'; payload: { folders: FoldersType[] } }
	| { type: 'ADD_FOLDER'; payload: { folder: FoldersType } }
	| { type: 'UPDATE_FOLDER'; payload: { folder: Partial<FoldersType> } }
	| { type: 'DELETE_FOLDER' }
	| { type: 'SET_FILES'; payload: { files: FileType[] } }
	| { type: 'ADD_FILE'; payload: { file: FileType } }
	| { type: 'UPDATE_FILE'; payload: { file: Partial<FileType> } }
	| { type: 'DELETE_FILE' };

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
				workspaceId: action.payload.workspaceId || '',
				folderId: action.payload.folderId || '',
				fileId: action.payload.fileId || '',
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
	const currentWorkspace = useMemo(
		() => store.workspaces.find((w) => w.id === store.workspaceId),
		[store.workspaces, store.workspaceId],
	);

	const action = {
		init: (payload: Extract<Action, { type: 'INIT' }>['payload']) => {
			dispatch({ type: 'INIT', payload });
		},
		setFiles: (payload: Extract<Action, { type: 'SET_FILES' }>['payload']) => {
			dispatch({ type: 'SET_FILES', payload });
		},
		addFile: (payload: Extract<Action, { type: 'ADD_FILE' }>['payload']) => {
			dispatch({ type: 'ADD_FILE', payload });
		},
		updateFile: (
			payload: Extract<Action, { type: 'UPDATE_FILE' }>['payload'],
		) => {
			dispatch({ type: 'UPDATE_FILE', payload });
		},
		deleteFile: async () => {
			if (!store.fileId) return;
			dispatch({ type: 'DELETE_FILE' });
			await deleteFile(store.fileId);
		},
		setFolders: (
			payload: Extract<Action, { type: 'SET_FOLDERS' }>['payload'],
		) => {
			dispatch({ type: 'SET_FOLDERS', payload });
		},
		addFolder: (
			payload: Extract<Action, { type: 'ADD_FOLDER' }>['payload'],
		) => {
			dispatch({ type: 'ADD_FOLDER', payload });
		},
		updateFolder: (
			payload: Extract<Action, { type: 'UPDATE_FOLDER' }>['payload'],
		) => {
			dispatch({ type: 'UPDATE_FOLDER', payload });
		},
		deleteFolder: async () => {
			if (!store.folderId) return;
			dispatch({ type: 'DELETE_FOLDER' });
			await deleteFolder(store.folderId);
		},
		setWorkspaces: (
			payload: Extract<Action, { type: 'SET_WORKSPACES' }>['payload'],
		) => {
			dispatch({ type: 'SET_WORKSPACES', payload });
		},
		addWorkspace: (
			payload: Extract<Action, { type: 'ADD_WORKSPACE' }>['payload'],
		) => {
			dispatch({ type: 'ADD_WORKSPACE', payload });
		},
		updateWorkspace: (
			payload: Extract<Action, { type: 'UPDATE_WORKSPACE' }>['payload'],
		) => {
			dispatch({ type: 'UPDATE_WORKSPACE', payload });
		},
		deleteWorkspace: () => {
			dispatch({ type: 'DELETE_WORKSPACE' });
		},
	};

	return { store: { ...store, currentWorkspace }, action };
};

export type StoreType = ReturnType<typeof useInit>['store'];
export type ActionType = ReturnType<typeof useInit>['action'];
export default useInit;
