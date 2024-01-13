import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAppStore } from '@/components/Providers/AppProvider';
import { createClientComponentClient } from '.';

const useRealtime = () => {
	const {
		store: { workspaceId, workspaces },
		action,
	} = useAppStore();
	const router = useRouter();

	useEffect(() => {
		const channel = createClientComponentClient()
			.channel('db-changes')
			.on(
				'postgres_changes',
				{ event: '*', schema: 'public', table: 'files' },
				async (payload) => {
					// TODO: Refactor action object
					// current action will use current pathname ids(workspace id, folder id, file id),
					// if we want `insert, update, delete` spacial file that ids not in current pathname.
					switch (payload.eventType) {
						case 'INSERT': {
							console.log('🟢 RECEIVED REAL TIME EVENT');
							const {
								folder_id: folderId,
								workspace_id: workspaceId,
								id: fileId,
							} = payload.new;
							if (action.utils.getFile({ workspaceId, folderId, fileId })) {
								break;
							}
							// TODO: add file after refactor action object
							// action.addFile({
							// 	file: {
							// 		id: payload.new.id,
							// 		workspaceId: payload.new.workspace_id,
							// 		folderId: payload.new.folder_id,
							// 		createdAt: payload.new.created_at,
							// 		title: payload.new.title,
							// 		iconId: payload.new.icon_id,
							// 		data: payload.new.data,
							// 		inTrash: payload.new.in_trash,
							// 		bannerUrl: payload.new.banner_url,
							// 	},
							// });
							break;
						}
						case 'DELETE': {
							let workspaceId = '';
							let folderId = '';
							const fileExists = workspaces.some((workspace) =>
								workspace.folders.some((folder) =>
									folder.files.some((file) => {
										if (file.id === payload.old.id) {
											workspaceId = workspace.id;
											folderId = folder.id;
											return true;
										}
									}),
								),
							);
							if (fileExists && workspaceId && folderId) {
								router.replace(`/dashboard/${workspaceId}`);
								// TODO: delete file after refactor action object
								// dispatch({
								// 	type: 'DELETE_FILE',
								// 	payload: { fileId: payload.old.id, folderId, workspaceId },
								// });
							}
							break;
						}
						case 'UPDATE': {
							const { folder_id: folderId, workspace_id: workspaceId } =
								payload.new;
							workspaces.some((workspace) =>
								workspace.folders.some((folder) =>
									folder.files.some((file) => {
										if (file.id === payload.new.id) {
											// TODO: update file after refactor action object
											// dispatch({
											// 	type: 'UPDATE_FILE',
											// 	payload: {
											// 		workspaceId,
											// 		folderId,
											// 		fileId: payload.new.id,
											// 		file: {
											// 			title: payload.new.title,
											// 			iconId: payload.new.icon_id,
											// 			inTrash: payload.new.in_trash,
											// 		},
											// 	},
											// });
											return true;
										}
									}),
								),
							);
							break;
						}
						default: {
							break;
						}
					}
				},
			)
			.subscribe();

		return () => {
			channel.unsubscribe();
		};

		// Ignore action that references changes to prevent infinite loop
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [workspaceId, workspaces, router]);

	return null;
};

export default useRealtime;
