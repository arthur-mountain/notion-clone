'use client';
import type { FileType, FolderType, WorkspaceType } from '@/lib/supabase/types';
import { useReducer, useMemo } from 'react';

export type FoldersType = FolderType & { files: FileType[] };
export type WorkspacesType = WorkspaceType & {
	folders: FoldersType[];
};

type Store = {
	workspaces: WorkspacesType[];
};

type Action =
	| { type: 'SET_WORKSPACES'; payload: { workspaces: WorkspacesType[] } }
	| { type: 'ADD_WORKSPACE'; payload: { workspace: WorkspacesType } }
	| {
			type: 'UPDATE_WORKSPACE';
			payload: { workspace: Partial<WorkspacesType>; workspaceId: string };
	  }
	| { type: 'DELETE_WORKSPACE'; payload: { workspaceId: string } }
	| {
			type: 'SET_FOLDERS';
			payload: { workspaceId: string; folders: FoldersType[] };
	  }
	| {
			type: 'ADD_FOLDER';
			payload: { workspaceId: string; folder: FoldersType };
	  }
	| {
			type: 'UPDATE_FOLDER';
			payload: {
				workspaceId: string;
				folderId: string;
				folder: Partial<FoldersType>;
			};
	  }
	| {
			type: 'DELETE_FOLDER';
			payload: { workspaceId: string; folderId: string };
	  }
	| {
			type: 'SET_FILES';
			payload: { workspaceId: string; folderId: string; files: FileType[] };
	  }
	| {
			type: 'ADD_FILE';
			payload: { workspaceId: string; folderId: string; file: FileType };
	  }
	| {
			type: 'DELETE_FILE';
			payload: { workspaceId: string; folderId: string; fileId: string };
	  }
	| {
			type: 'UPDATE_FILE';
			payload: {
				workspaceId: string;
				folderId: string;
				fileId: string;
				file: Partial<FileType>;
			};
	  };

const initialStore: Store = { workspaces: [] };

const sortByCreatedAt = (a: any, b: any) =>
	new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
const reducer = (store: Store = initialStore, action: Action): Store => {
	switch (action.type) {
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
					(workspace) => workspace.id !== action.payload.workspaceId,
				),
			};
		case 'UPDATE_WORKSPACE':
			return {
				...store,
				workspaces: store.workspaces.map((workspace) => {
					return workspace.id === action.payload.workspaceId
						? { ...workspace, ...action.payload.workspace }
						: workspace;
				}),
			};
		case 'SET_FOLDERS':
			return {
				...store,
				workspaces: store.workspaces.map((workspace) => {
					return workspace.id === action.payload.workspaceId
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
					return workspace.id === action.payload.workspaceId
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
					return workspace.id === action.payload.workspaceId
						? {
								...workspace,
								folders: workspace.folders.filter(
									(folder) => folder.id !== action.payload.folderId,
								),
						  }
						: workspace;
				}),
			};
		case 'UPDATE_FOLDER':
			return {
				...store,
				workspaces: store.workspaces.map((workspace) => {
					return workspace.id === action.payload.workspaceId
						? {
								...workspace,
								folders: workspace.folders.map((folder) => {
									return folder.id === action.payload.folderId
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
					return workspace.id === action.payload.workspaceId
						? {
								...workspace,
								folders: workspace.folders.map((folder) => {
									return folder.id === action.payload.folderId
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
					return workspace.id === action.payload.workspaceId
						? {
								...workspace,
								folders: workspace.folders.map((folder) => {
									return folder.id === action.payload.folderId
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
					return workspace.id === action.payload.workspaceId
						? {
								...workspace,
								folder: workspace.folders.map((folder) => {
									return folder.id === action.payload.folderId
										? {
												...folder,
												files: folder.files.filter(
													(file) => file.id !== action.payload.fileId,
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
					return workspace.id === action.payload.workspaceId
						? {
								...workspace,
								folders: workspace.folders.map((folder) => {
									return folder.id === action.payload.folderId
										? {
												...folder,
												files: folder.files.map((file) => {
													return file.id === action.payload.fileId
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

	const action = useMemo(
		() => ({
			setFiles: (
				payload: Extract<Action, { type: 'SET_FILES' }>['payload'],
			) => {
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
		}),
		[dispatch],
	);

	return { store, action };
};

export type StoreType = ReturnType<typeof useInit>['store'];
export type ActionType = ReturnType<typeof useInit>['action'];
export default useInit;
