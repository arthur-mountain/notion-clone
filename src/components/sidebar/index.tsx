import React from 'react';
import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@/lib/supabase/utils/server';
import { getFolders } from '@/lib/supabase/schemas/folders/query';
import { getFirstSubscriptionByUserId } from '@/lib/supabase/schemas/subscriptions/query';

type Props = { params: { workspaceId: string }; className?: string };

const Sidebar = async ({ params, className }: Props) => {
	const {
		data: { user },
	} = await createServerComponentClient().auth.getUser();
	if (!user) return;

	const [
		{ subscription, error: subscriptionError },
		{ folders, error: foldersError },
	] = await Promise.all([
		getFirstSubscriptionByUserId(user.id),
		getFolders(params.workspaceId),
	]);

	// if (subscriptionError || foldersError) return redirect('/dashboard');

	return <div>Sidebar</div>;
};

export default Sidebar;
