import type { Quill, TextChangeHandler, SelectionChangeHandler } from 'quill';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { createClientComponentClient } from '@/lib/supabase/utils/client';
import { useAppStore } from '@/components/Providers/AppProvider';
import { useUser } from '@/components/Providers/UserProvider';
import { useSocket } from '../Providers/SocketProvider';
import { getFileById } from '@/lib/supabase/schemas/files/queries';
import { getFolderById } from '@/lib/supabase/schemas/folders/queries';
import { getWorkspaceById } from '@/lib/supabase/schemas/workspaces/queries';
import { getStoragePublicUrl } from '@/lib/supabase/utils/client/storage-urls';

export type Props = {
	id: string;
	type: 'workspace' | 'folder' | 'file';
	quillIns: Quill | undefined;
};

const useRealtimeSocket = ({ id, type, quillIns }: Props) => {
	const { socket, isConnected } = useSocket();
	const router = useRouter();
	const {
		store: { workspaceId },
		action,
	} = useAppStore();
	const {
		store: { user },
	} = useUser();
	const saveTimerRef = useRef<number>();
	const [isSaving, setIsSaving] = useState(false);
	const [collaborators, setCollaborators] = useState<
		{ id: string; email: string; avatarUrl: string }[]
	>([]);
	const [cursors, setCursors] = useState<any[]>([]);

	useEffect(() => {
		if (!id) return;

		(async () => {
			switch (type) {
				case 'workspace': {
					const { data: workspace, error } = await getWorkspaceById(id);
					if (error) return router.replace('/dashboard');

					if (!quillIns || !workspace?.data) return;
					quillIns.setContents(JSON.parse(workspace.data || ''));
					await action.updateWorkspace({ workspace: { data: workspace.data } });
					break;
				}
				case 'folder': {
					const { data: folder, error } = await getFolderById(id);
					if (error) return router.replace('/dashboard');

					if (!folder) return router.replace(`/dashboard/${workspaceId}`);

					if (!quillIns || !folder.data) return;
					quillIns.setContents(JSON.parse(folder.data || ''));
					await action.updateFolder({ folder: { data: folder.data } });
					break;
				}
				case 'file': {
					const { data: file, error } = await getFileById(id);

					if (error) return router.replace('/dashboard');

					if (!file) return router.replace(`/dashboard/${workspaceId}`);

					if (!quillIns || !file.data) return;
					quillIns.setContents(JSON.parse(file.data || ''));
					await action.updateFile({ file: { data: file.data } });
					break;
				}
				default: {
					break;
				}
			}
		})();

		// Ignore action object that references will change may cause infinite loop
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id, type, quillIns, workspaceId, router]);

	/* Start: Create room */
	useEffect(() => {
		if (!socket || !quillIns || !id) return;
		socket.emit('create-room', id);
	}, [socket, quillIns, id]);
	/* End: Create room */

	/* Start: Send quill text change event to all clients */
	useEffect(() => {
		if (!quillIns || !socket || !id || !user) return;
		const onTextChange: TextChangeHandler = (delta, _oldDelta, source) => {
			if (source !== 'user') return;
			if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
			setIsSaving(true);
			saveTimerRef.current = window.setTimeout(async () => {
				const contents = quillIns.getContents();
				const quillLength = quillIns.getLength();
				if (!contents || quillLength === 1 || !id) return;

				switch (type) {
					case 'workspace': {
						await action.updateWorkspace({
							workspace: { data: JSON.stringify(contents) },
						});
						break;
					}
					case 'folder': {
						await action.updateFolder({
							folder: { data: JSON.stringify(contents) },
						});
						break;
					}
					case 'file': {
						await action.updateFile({
							file: { data: JSON.stringify(contents) },
						});
						break;
					}
					default: {
						break;
					}
				}
				setIsSaving(false);
				window.clearTimeout(saveTimerRef.current);
			}, 850);
			socket.emit('send-changes', delta, id);
		};
		quillIns.on('text-change', onTextChange);

		return () => {
			quillIns.off('text-change', onTextChange);
			if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
		};

		// Ignore action object that references will change may cause infinite loop
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id, type, quillIns, socket, user]);

	useEffect(() => {
		if (!quillIns || !socket || !id) return;
		const onReceiveTextChange = (
			deltas: Parameters<TextChangeHandler>[0],
			receiveId: string,
		) => {
			if (receiveId !== id) return;
			quillIns.updateContents(deltas);
		};
		socket.on('receive-changes', onReceiveTextChange);
		return () => {
			socket.off('receive-changes', onReceiveTextChange);
		};
	}, [quillIns, socket, id]);
	/* End: Send quill text change event to all clients */

	/* Start: Send quill selection/cursor change to all clients */
	useEffect(() => {
		if (!quillIns || !socket || !id || !user) return;

		const onSelectionChange: SelectionChangeHandler = (
			range,
			_oldRange,
			source,
		) => {
			if (source === 'user') {
				socket.emit('send-cursor-move', range, id, user.id);
			}
		};

		quillIns.on('selection-change', onSelectionChange);
		return () => {
			quillIns.off('selection-change', onSelectionChange);
		};
	}, [id, quillIns, socket, user]);

	useEffect(() => {
		if (!quillIns || !socket || !id || !cursors.length) return;
		const onReceiveCursorChange = (
			range: Parameters<SelectionChangeHandler>[0],
			roomId: string,
			cursorId: string,
		) => {
			if (roomId !== id) return;
			const currentCursor = cursors.find(
				(c) => c.cursors()?.[0]?.id === cursorId,
			);
			if (currentCursor) currentCursor.moveCursor(cursorId, range);
		};
		socket.on('receive-cursor-move', onReceiveCursorChange);
		return () => {
			socket.off('receive-cursor-move', onReceiveCursorChange);
		};
	}, [quillIns, socket, id, cursors]);
	/* End: Send quill selection/cursor change to all clients */

	useEffect(() => {
		if (!id || !quillIns || !user) return;
		const supabase = createClientComponentClient();
		const channel = supabase.channel(id);

		channel
			.on('presence', { event: 'sync' }, () => {
				const newState = channel.presenceState<{
					id: string;
					email: string;
					avatarUrl: string;
				}>();
				const newCollaborators = Object.values(newState).flat();
				setCollaborators(newCollaborators);

				setCursors(
					newCollaborators
						.filter((collaborator) => collaborator.id !== user.id)
						.map((collaborator) => {
							const userCursor = quillIns?.getModule('cursors');
							userCursor?.createCursor(
								collaborator.id,
								collaborator.email.split('@')[0],
								`#${Math.random().toString(16).slice(2, 8)}`,
							);
							return userCursor;
						}),
				);
			})
			.subscribe(() => {
				channel.track({
					id: user.id,
					email: user.email?.split('@')[0],
					avatarUrl: getStoragePublicUrl('avatars', user.extra.avatarUrl),
				});
			});

		return () => {
			supabase.removeChannel(channel);
		};
	}, [id, quillIns, user]);

	return {
		store: { isConnected, isSaving, collaborators },
	};
};

export default useRealtimeSocket;
