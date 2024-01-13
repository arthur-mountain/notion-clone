import type { Quill, TextChangeHandler } from 'quill';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
// import { createClientComponentClient } from '@/lib/supabase/utils/client';
import { useAppStore } from '@/components/Providers/AppProvider';
import { useUser } from '@/components/Providers/UserProvider';
import { useSocket } from '../Providers/SocketProvider';
import { getFileById } from '@/lib/supabase/schemas/files/queries';
import { getFolderById } from '@/lib/supabase/schemas/folders/queries';
import { getWorkspaceById } from '@/lib/supabase/schemas/workspaces/queries';

export type Props = {
	id: string;
	type: 'workspace' | 'folder' | 'file';
	quillIns: Quill | undefined;
};

const useRealtimeSocket = ({ id, type, quillIns }: Props) => {
	const { socket, isConnected } = useSocket();
	const router = useRouter();
	const {
		store: { workspaces, workspaceId, folderId, fileId },
		action,
	} = useAppStore();
	const {
		store: { user },
	} = useUser();
	const saveTimerRef = useRef<number>();
	const [isSaving, setIsSaving] = useState(false);

	// const router = useRouter();
	// const pathname = usePathname();
	// const currentWorkspace = useMemo(
	// 	() => workspaces.find((workspace) => workspace.id === workspaceId),
	// 	[workspaces, workspaceId],
	// );

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
	}, [id, type, quillIns, workspaceId, router]);

	// Rooms
	useEffect(() => {
		if (!socket || !quillIns || !id) return;
		socket.emit('create-room', id);
	}, [socket, quillIns, id]);

	// Send quill changes to all clients
	useEffect(() => {
		if (!quillIns || !socket || !id || !user) return;

		// const selectionChangeHandler = (cursorId: string) => {
		// 	return (range: any, _oldRange: any, source: any) => {
		// 		if (source === 'user' && cursorId) {
		// 			socket.emit('send-cursor-move', range, fileId, cursorId);
		// 		}
		// 	};
		// };
		const onTextChange: TextChangeHandler = (delta, _oldDelta, source) => {
			if (source !== 'user') return;
			if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
			setIsSaving(true);
			saveTimerRef.current = window.setTimeout(async () => {
				console.log('changes saved', delta, _oldDelta, source);

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
		// quillIns.on('selection-change', selectionChangeHandler(user.id));

		return () => {
			quillIns.off('text-change', onTextChange);
			// quillIns.off('selection-change', selectionChangeHandler(user.id));
			if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
		};
	}, [id, type, quillIns, socket, user]);

	useEffect(() => {
		if (!quillIns || !socket || !id) return;
		const onReceiveChanges = (deltas: any, receiveId: string) => {
		console.log(`🚀 ~ onReceiveChanges ~ receiveId:`, receiveId);
			console.log(`🚀 ~ onReceiveChanges ~ deltas:`, deltas);
			if (receiveId !== id) return;
			quillIns.updateContents(deltas);
		};
		socket.on('receive-changes', onReceiveChanges);
		return () => {
			socket.off('receive-changes', onReceiveChanges);
		};
	}, [quillIns, socket, id]);

	return { store: { isConnected, isSaving } };
};

export default useRealtimeSocket;
