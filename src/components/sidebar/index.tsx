import React from 'react';
import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@/lib/supabase/utils/server';
import { getFolders } from '@/lib/supabase/schemas/folders/queries';
import { getFirstSubscriptionByUserId } from '@/lib/supabase/schemas/subscriptions/queries';
import {
	getPrivateWorkspaces,
	getCollaboratingWorkspaces,
	getSharedWorkspaces,
} from '@/lib/supabase/schemas/workspaces/queries';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import WorkspaceDropdown from './WorkspaceDropdown';
import PlanUsage from './PlanUsage';
import Navigation from './Navigation';
import FoldersDropdownList from './FolderDropdown';

type Props = { params: { workspaceId: string }; className?: string };

const Sidebar = async ({ params, className }: Props) => {
	const {
		data: { user },
	} = await createServerComponentClient().auth.getUser();
	if (!user) return;

	const [
		{ data: subscription, error: subscriptionError },
		{ data: folders, error: foldersError },
		{ data: privateWorkspaces, error: privateWorkspacesError },
		{ data: collaboratingWorkspaces, error: collaboratingWorkspacesError },
		{ data: sharedWorkspaces, error: sharedWorkspacesError },
	] = await Promise.all([
		getFirstSubscriptionByUserId(user.id),
		getFolders(params.workspaceId),
		getPrivateWorkspaces(user.id),
		getCollaboratingWorkspaces(user.id),
		getSharedWorkspaces(user.id),
	]);

	if (
		subscriptionError ||
		foldersError ||
		privateWorkspacesError ||
		collaboratingWorkspacesError ||
		sharedWorkspacesError
	) {
		return redirect('/dashboard');
	}

	return (
		<aside
			className={cn(
				'hidden sm:flex sm:flex-col w-[280px] shrink-0 p-4 md:gap-4 justify-between',
				className,
			)}
		>
			<div>
				<WorkspaceDropdown
					privateWorkspaces={privateWorkspaces}
					sharedWorkspaces={sharedWorkspaces}
					collaboratingWorkspaces={collaboratingWorkspaces}
					defaultWorkspace={[
						...privateWorkspaces,
						...collaboratingWorkspaces,
						...sharedWorkspaces,
					].find((workspace) => workspace.id === params.workspaceId)}
				/>
				<PlanUsage
					foldersLength={folders?.length || 0}
					subscription={subscription}
				/>
				<Navigation workspaceId={params.workspaceId} />
				<ScrollArea className='h-[450px]'>
					<div className='pointer-events-none w-full absolute bottom-0 h-20 bg-gradient-to-t from-background to-transparent z-40' />
					<FoldersDropdownList
						workspaceId={params.workspaceId}
						workspaceFolders={folders || []}
					/>
				</ScrollArea>
			</div>
			{/* <UserCard subscription={subscription} /> */}
		</aside>
	);
};

export default Sidebar;
