'use client';
import type { UserType, WorkspaceType } from '@/lib/supabase/types';
import { useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react';
import { SelectGroup } from '@radix-ui/react-select';
import { Lock, Plus, Share } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { createWorkspace } from '@/lib/supabase/schemas/workspaces/query';
import { addCollaborators } from '@/lib/supabase/schemas/collaborators/queries';
import { useUser } from '../../providers/UserProvider';
import CollaboratorSearch from './CollaboratorSearch';
import { ScrollArea } from '@/components/ui/scroll-area';

const WorkspaceCreator = () => {
	const {
		store: { user },
	} = useUser();
	const { toast } = useToast();
	const router = useRouter();
	const [title, setTitle] = useState('');
	const [permissions, setPermissions] = useState<'private' | 'shared'>(
		'private',
	);
	const [collaborators, setCollaborators] = useState<UserType[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const existingCollaboratorIds = useMemo(
		() => collaborators.map((c) => c.id),
		[collaborators],
	);

	const addCollaborator = (user: UserType) => () => {
		setCollaborators([...collaborators, user]);
	};

	const removeCollaborator = (user: UserType) => {
		setCollaborators(collaborators.filter((c) => c.id !== user.id));
	};

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
				};

				// FIXME: this is not exception, but also need some error handing
				await Promise.all(
					permissions === 'shared'
						? [
								createWorkspace(newWorkspace),
								addCollaborators(collaborators, workspaceId),
						  ]
						: [createWorkspace(newWorkspace)],
				);
				toast({ title: 'Success', description: 'Created the workspace' });
				router.refresh();
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
			<>
				<Label htmlFor='permissions' className='text-sm text-muted-foreground'>
					Permission
				</Label>
				<Select
					onValueChange={(v: 'private' | 'shared') => setPermissions(v)}
					defaultValue={permissions}
				>
					<SelectTrigger className='w-full h-26 -mt-3'>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectItem value='private'>
								<div className='p-2 flex gap-4 justify-center items-center'>
									<Lock />
									<article className='text-left flex flex-col whitespace-pre-line'>
										<span>Private</span>
										<p>
											Your workspace is private to you. You can choose to share
											it later.
										</p>
									</article>
								</div>
							</SelectItem>
							<SelectItem value='shared'>
								<div className='p-2 flex gap-4 justify-center items-center'>
									<Share />
									<article className='text-left flex flex-col whitespace-pre-line'>
										<span>Shared</span>
										<p>You can invite collaborators.</p>
									</article>
								</div>
							</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>
			</>

			{permissions === 'shared' && (
				<div>
					<CollaboratorSearch
						existingCollaboratorIds={existingCollaboratorIds}
						getCollaborator={(user) => {
							addCollaborator(user);
						}}
					>
						<span className='inline-flex items-center justify-center rounded-md font-medium transition-colors bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 text-sm mt-4'>
							<Plus />
							Add Collaborators
						</span>
					</CollaboratorSearch>
					<div className='mt-4'>
						<div>
							<span className='text-sm text-muted-foreground'>
								Collaborators {collaborators.length || ''}
							</span>
							<ScrollArea className='h-[120px] w-full rounded-md border border-muted-foreground/20'>
								{collaborators.length > 0 ? (
									collaborators.map((c) => (
										<div
											key={c.id}
											className='p-4 flex justify-between items-center'
										>
											<div className='flex gap-4 items-center'>
												<Avatar>
													<AvatarImage src='/avatars/7.png' />
													<AvatarFallback>PJ</AvatarFallback>
												</Avatar>
												<div className='text-sm  gap-2 text-muted-foreground overflow-hidden overflow-ellipsis sm:w-[300px] w-[140px]'>
													{c.email}
												</div>
											</div>
											<Button
												variant='secondary'
												onClick={() => removeCollaborator(c)}
											>
												Remove
											</Button>
										</div>
									))
								) : (
									<div className='absolute right-0 left-0 top-0 bottom-0 flex justify-center items-center'>
										<span className='text-muted-foreground text-sm'>
											You have no collaborators
										</span>
									</div>
								)}
							</ScrollArea>
						</div>
					</div>
				</div>
			)}
			<Button
				type='button'
				variant='secondary'
				disabled={
					!title ||
					(permissions === 'shared' && !collaborators.length) ||
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
