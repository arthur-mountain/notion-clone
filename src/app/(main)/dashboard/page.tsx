import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@/lib/supabase/utils';
import { getSubscriptionByUserId } from '@/lib/supabase/queries/subscriptions';
import { getWorkspaceByUserId } from '@/lib/supabase/queries/workspaces';
import DashboardSetup from '@/components/dashboard-setup';

const DashboardPage = async () => {
	const supabase = await createServerComponentClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) return;

	const { subscription, error: subscriptionError } =
		await getSubscriptionByUserId(user.id);

	// if (subscriptionError) return;

	const { workspace } = await getWorkspaceByUserId(user.id);
	if (!workspace) {
		return (
			<div className='bg-background h-screen w-screen flex justify-center items-center'>
				<DashboardSetup user={user} subscription={subscription} />
			</div>
		);
	}

	redirect(`/dashboard/${workspace.id}`);
};

export default DashboardPage;
