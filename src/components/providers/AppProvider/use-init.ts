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
	| { type: 'ADD_WORKSPACES'; payload: { workspaces: WorkspacesType[] } }
	| {
			type: 'UPDATE_WORKSPACE';
			payload: { workspace: Partial<WorkspacesType>; workspaceId: string };
	  }
	| { type: 'DELETE_WORKSPACE'; payload: { workspaceId: string } }
	| {
			type: 'ADD_FOLDERS';
			payload: { workspaceId: string; folders: FoldersType[] };
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
			type: 'ADD_FILES';
			payload: { workspaceId: string; folderId: string; files: FileType[] };
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

const reducer = (store: Store = initialStore, action: Action): Store => {
	switch (action.type) {
		case 'ADD_WORKSPACES':
			return {
				...store,
				workspaces: [...store.workspaces, ...action.payload.workspaces],
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
		case 'ADD_FOLDERS':
			return {
				...store,
				workspaces: store.workspaces.map((workspace) => {
					return {
						...workspace,
						folders: [...workspace.folders, ...action.payload.folders].sort(
							(a, b) =>
								new Date(String(a.createdAt)).getTime() -
								new Date(String(b.createdAt)).getTime(),
						),
					};
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
		case 'ADD_FILES':
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
												files: [...folder.files, ...action.payload.files].sort(
													(a, b) =>
														new Date(String(a.createdAt)).getTime() -
														new Date(String(b.createdAt)).getTime(),
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
			addFiles: (
				payload: Extract<Action, { type: 'ADD_FILES' }>['payload'],
			) => {
				dispatch({ type: 'ADD_FILES', payload });
			},
			addWorkspaces: (
				payload: Extract<Action, { type: 'ADD_WORKSPACES' }>['payload'],
			) => {
				dispatch({ type: 'ADD_WORKSPACES', payload });
			},
		}),
		[dispatch],
	);

	return { store, action };
};

export type StoreType = ReturnType<typeof useInit>['store'];
export type ActionType = ReturnType<typeof useInit>['action'];
export default useInit;
