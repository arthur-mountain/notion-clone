'use client';
import type { WorkspaceType } from '@/lib/supabase/types';
import React, { useCallback, useEffect, useState } from 'react';
import { useAppStore } from '../providers/AppProvider';
import SelectedWorkspace from './SelectedWorkspace';

type Props = {
	privateWorkspaces: WorkspaceType[] | [];
	sharedWorkspaces: WorkspaceType[] | [];
	collaboratingWorkspaces: WorkspaceType[] | [];
	defaultWorkspace?: WorkspaceType;
};

const WorkspaceDropdown = ({
	privateWorkspaces,
	sharedWorkspaces,
	collaboratingWorkspaces,
	defaultWorkspace,
}: Props) => {
	const { store, action } = useAppStore();
	const [activeWorkspace, setActiveWorkspace] =
		useState<Props['defaultWorkspace']>(defaultWorkspace);

	const handleClick = useCallback((workspace: WorkspaceType) => {
		setActiveWorkspace(workspace);
	}, []);

	useEffect(() => {
		if (!store.workspaces.length) {
			action.addWorkspaces({
				workspaces: [
					...privateWorkspaces,
					...sharedWorkspaces,
					...collaboratingWorkspaces,
				].map((workspace) => ({ ...workspace, folders: [] })),
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		privateWorkspaces,
		sharedWorkspaces,
		collaboratingWorkspaces,
		action.addWorkspaces,
	]);
	return (
		<div className=' relative inline-block text-left'>
			<div>
				<span onClick={() => setActiveWorkspace(undefined)}>
					{activeWorkspace ? (
						<SelectedWorkspace workspace={activeWorkspace} />
					) : (
						'Select a workspace'
					)}
				</span>
			</div>
			{!!activeWorkspace && (
				<div className='origin-top-right absolute w-full rounded-md shadow-md z-50 h-[190px] bg-black/10 backdrop-blur-lg group overflow-scroll border-[1px] border-muted '>
					<div className='rounded-md flex flex-col'>
						<div className='p-2'>
							{privateWorkspaces.length > 0 && (
								<>
									<p className='text-muted-foreground'>Private</p>
									<hr />
									{privateWorkspaces.map((workspace) => (
										<SelectedWorkspace
											key={workspace.id}
											workspace={workspace}
											onClick={handleClick}
										/>
									))}
								</>
							)}
							{sharedWorkspaces.length > 0 && (
								<>
									<p className='text-muted-foreground'>Shared</p>
									<hr />
									{sharedWorkspaces.map((workspace) => (
										<SelectedWorkspace
											key={workspace.id}
											workspace={workspace}
											onClick={handleClick}
										/>
									))}
								</>
							)}
							{collaboratingWorkspaces.length > 0 && (
								<>
									<p className='text-muted-foreground'>Collaborating</p>
									<hr />
									{collaboratingWorkspaces.map((workspace) => (
										<SelectedWorkspace
											key={workspace.id}
											workspace={workspace}
											onClick={handleClick}
										/>
									))}
								</>
							)}
						</div>
						{/* <CustomDialogTrigger
							header='Create A Workspace'
							content={<WorkspaceCreator />}
							description='Workspaces give you the power to collaborate with others. You can change your workspace privacy settings after creating the workspace too.'
						>
							<div className='flex transition-all hover:bg-muted justify-center items-center gap-2 p-2 w-full'>
								<article className='text-slate-500 rounded-full bg-slate-800 w-4  h-4 flex items-center justify-center'>
									+
								</article>
								Create workspace
							</div>
						</CustomDialogTrigger> */}
					</div>
				</div>
			)}
		</div>
	);
};

export default WorkspaceDropdown;
