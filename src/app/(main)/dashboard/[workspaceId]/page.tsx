import { redirect } from 'next/navigation';
import React from 'react';
import { getWorkspaceById } from '@/lib/supabase/schemas/workspaces/queries';
import RichEditor from '@/components/RichEditor';

export const dynamic = 'force-dynamic';

const WorkspacePage = async ({
	params,
}: {
	params: { workspaceId: string };
}) => {
	const { data: workspace, error } = await getWorkspaceById(params.workspaceId);
	if (error || !workspace) redirect('/dashboard');

	return (
		<div className='relative'>
			<RichEditor type='workspace' id={params.workspaceId} data={workspace} />
		</div>
	);
};

export default WorkspacePage;
