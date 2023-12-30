'use client';
import { useRouter } from 'next/navigation';
import { type PropsWithChildren } from 'react';
import { createClientComponentClient } from '@/lib/supabase/utils/client';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/components/Providers/AppProvider';
import { cn } from '@/lib/utils';

type Props = PropsWithChildren<{ className?: string }>;
const LogoutButton = ({ children, className }: Props) => {
	const { action } = useAppStore();
	const router = useRouter();
	const logout = async () => {
		await createClientComponentClient().auth.signOut();
		router.refresh();
		action.setWorkspaces({ workspaces: [] });
	};
	return (
		<Button
			variant='ghost'
			size='icon'
			className={cn('p-0', className)}
			onClick={logout}
		>
			{children}
		</Button>
	);
};

export default LogoutButton;
