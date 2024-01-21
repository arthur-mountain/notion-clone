import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAppStore } from '@/components/Providers/AppProvider';
import { createClientComponentClient } from '.';
import camelCaseKeys from '@/lib/utils/camecase-keys';

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
					switch (payload.eventType) {
						case 'INSERT': {
							console.log('🟢 RECEIVED REAL TIME EVENT');
							console.log(`🚀 ~ Realtime insert:`, payload);
							const {
								folder_id: folderId,
								workspace_id: workspaceId,
								id: fileId,
							} = payload.new;

							if (action.utils.getFile({ workspaceId, folderId, fileId }))
								break;
							action.onRealtimeUpdate({
								type: 'INSERT_FILE',
								payload: {
									workspaceId,
									folderId,
									file: camelCaseKeys(payload.new),
								},
							});
							break;
						}
						case 'DELETE': {
							let workspaceId = '';
							const fileExists = workspaces.some((workspace) =>
								workspace.folders.some((folder) =>
									folder.files.some((file) => {
										if (file.id === payload.old.id) {
											workspaceId = workspace.id;
											action.onRealtimeUpdate({
												type: 'DELETE_FILE',
												payload: {
													workspaceId,
													folderId: folder.id,
													fileId: payload.old.id,
												},
											});
											return true;
										}
									}),
								),
							);
							if (fileExists) router.replace(`/dashboard/${workspaceId}`);
							break;
						}
						case 'UPDATE': {
							const {
								folder_id: folderId,
								workspace_id: workspaceId,
								id: fileId,
							} = payload.new;
							console.log(`🚀 ~ Realtime update:`, payload.new);
							workspaces.some((workspace) =>
								workspace.folders.some((folder) =>
									folder.files.some((file) => {
										if (file.id === fileId) {
											action.onRealtimeUpdate({
												type: 'UPDATE_FILE',
												payload: {
													workspaceId,
													folderId,
													fileId,
													file: camelCaseKeys(payload.new),
												},
											});
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
