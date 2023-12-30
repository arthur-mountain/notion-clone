'use client';
import type { AuthUser } from '@supabase/supabase-js';
import type { SubscriptionType } from '@/lib/supabase/types';
import EmojiPicker from '@/components/Global/EmojiPicker';
import Loader from '@/components/Global/Loader';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import useInit from './use-init';

type Props = {
	user: AuthUser;
	subscription: SubscriptionType | null;
};

const DashboardSetup = ({ user, subscription }: Props) => {
	const {
		FORM_REGISTER_ATTRIBUTES,
		store: {
			formState: { isLoading, errors },
			selectedEmoji,
		},
		action: { onSubmit, onEmojiChange },
	} = useInit({ user });

	return (
		<Card className='w-[800px] h-screen sm:h-auto'>
			<CardHeader>
				<CardTitle>Create A Workspace</CardTitle>
				<CardDescription>
					Lets create a private workspace to get you started.You can add
					collaborators later from the workspace settings tab.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={onSubmit}>
					<div className='flex flex-col gap-4'>
						<div className='flex items-center gap-4'>
							<div className='text-5xl'>
								<EmojiPicker onChange={onEmojiChange}>
									{selectedEmoji}
								</EmojiPicker>
							</div>
							<div className='w-full '>
								<Label
									htmlFor='workspaceName'
									className='text-sm text-muted-foreground'
								>
									Name
								</Label>
								<Input
									id='workspaceName'
									type='text'
									placeholder='Workspace Name'
									disabled={isLoading}
									{...FORM_REGISTER_ATTRIBUTES.workspaceName}
								/>
								<small className='text-red-600'>
									{errors?.workspaceName?.message?.toString()}
								</small>
							</div>
						</div>
						<div>
							<Label htmlFor='logo' className='text-sm text-muted-foreground'>
								Workspace Logo
							</Label>
							<Input
								id='logo'
								type='file'
								accept='image/*'
								placeholder='Workspace Name'
								className=' cursor-pointer'
								disabled={isLoading /*|| subscription?.status !== 'active'*/}
								{...FORM_REGISTER_ATTRIBUTES.logo}
							/>
							<small className='text-red-600'>
								{errors?.logo?.message?.toString()}
							</small>
							{subscription?.status !== 'active' && (
								<small className='text-muted-foreground block'>
									To customize your workspace, you need to be on a Pro Plan
								</small>
							)}
						</div>
						<div className='self-end'>
							<Button disabled={isLoading} type='submit'>
								{!isLoading ? 'Create Workspace' : <Loader />}
							</Button>
						</div>
					</div>
				</form>
			</CardContent>
		</Card>
	);
};

export default DashboardSetup;
