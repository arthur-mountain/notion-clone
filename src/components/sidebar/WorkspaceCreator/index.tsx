'use client';
import type { WorkspaceType } from '@/lib/supabase/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { createWorkspace } from '@/lib/supabase/schemas/workspaces/queries';
import { addCollaborators } from '@/lib/supabase/schemas/collaborators/queries';
import { useUser } from '@/components/Providers/UserProvider';
import PermissionsSelect from '@/components/global/PermissionsSelect';
import CollaboratorSearch from '@/components/global/Collaborators/Search';
import CollaboratorList from '@/components/global/Collaborators/List';
import useCollaborators from '@/components/global/Collaborators/use-collaborators';

const WorkspaceCreator = ({ onClose }: { onClose: () => void }) => {
	const {
		store: { user },
	} = useUser();
	const { toast } = useToast();
	const router = useRouter();
	const [title, setTitle] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [permission, setPermission] = useState<'private' | 'shared'>('private');
	const {
		store: { collaborators, existsCollaboratorIdsSet },
		action: { addCollaborator, deleteCollaborator },
	} = useCollaborators({ type: 'create' });

	const createItem = async () => {
		try {
			setIsLoading(true);
			const workspaceId = crypto.randomUUID();
			if (user?.id) {
				const newWorkspace: WorkspaceType = {
					data: null,
					createdAt: new Date().toISOString(),
					iconId: '💼',
					id: workspaceId,
					inTrash: '',
					title,
					workspaceOwner: user.id,
					logo: null,
					bannerUrl: '',
					permission,
				};

				// FIXME: this is not exception, but also need some error handing
				await Promise.all(
					newWorkspace.permission === 'shared'
						? [
								createWorkspace(newWorkspace),
								addCollaborators(collaborators, workspaceId),
						  ]
						: [createWorkspace(newWorkspace)],
				);
				toast({ title: 'Success', description: 'Created the workspace' });
				router.refresh();
				onClose();
			}
		} catch {
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='flex gap-4 flex-col'>
			<div>
				<Label htmlFor='name' className='text-sm text-muted-foreground'>
					Name
				</Label>
				<div className='flex justify-center items-center gap-2'>
					<Input
						name='name'
						value={title}
						placeholder='Workspace Name'
						onChange={(e) => setTitle(e.target.value)}
					/>
				</div>
			</div>

			<PermissionsSelect initialValue={permission} onChange={setPermission} />

			{permission === 'shared' && (
				<>
					<CollaboratorSearch
						existsCollaboratorIdsSet={existsCollaboratorIdsSet}
						addCollaborator={addCollaborator}
					/>
					<CollaboratorList
						collaborators={collaborators}
						deleteCollaborator={deleteCollaborator}
					/>
				</>
			)}

			<Button
				type='button'
				variant='secondary'
				disabled={
					!title ||
					(permission === 'shared' && !collaborators.length) ||
					isLoading
				}
				onClick={createItem}
			>
				Create
			</Button>
		</div>
	);
};

export default WorkspaceCreator;
