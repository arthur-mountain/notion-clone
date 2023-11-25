import React from 'react';
import db from '@/lib/supabase/db';
import { createServerComponentClient } from '@/lib/supabase/utils';

const DashboardPage = async () => {
	const supabase = await createServerComponentClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) return;

	// const workspace = await db.query.workspaces.findFirst({
	// 	where: (workspace, { eq }) => eq(workspace.workspaceOwner, user.id),
	// }); // yt:2:31:48

	return <div>DashboardPage</div>;
};

export default DashboardPage;
