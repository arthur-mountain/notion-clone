import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@/lib/supabase/utils/server';
import { getFirstSubscriptionByUserId } from '@/lib/supabase/schemas/subscriptions/queries';
import { getFirstWorkspaceByUserId } from '@/lib/supabase/schemas/workspaces/queries';
import DashboardSetup from '@/components/dashboard-setup';

const DashboardPage = async () => {
	const supabase = await createServerComponentClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) return;

	const { data: subscription, error: subscriptionError } =
		await getFirstSubscriptionByUserId(user.id);

	if (subscriptionError) return;

	const { data: workspace } = await getFirstWorkspaceByUserId(user.id);
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
