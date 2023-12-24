'use client';
import {
	Briefcase,
	CreditCard,
	ExternalLink,
	LogOut,
	User as UserIcon,
	HammerIcon as ProfileIcon,
} from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import LogoutButton from '@/components/global/LogoutButton';
import Collaborators from '@/components/global/Collaborators';
import PermissionsSelect from '@/components/global/PermissionsSelect';
// import { postData } from '@/lib/utils';
import AlertDialog from './AlertDialog';
import useInit from './use-init';

const SettingsForm = () => {
	const {
		store: {
			// user,
			permission,
			subscription,
			// isSubscriptionModalOpen,
			isOpenAlertMessage,
			workspaceDetails,
			uploadingLogo,
		},
		action: {
			onAlertConfirm,
			onChangeWorkspaceName,
			onChangeWorkspaceLogo,
			onDeleteWorkspace,
			toggleSubscriptionDialog,
			openAlertMessageModal,
		},
	} = useInit();

	return (
		<div className='flex gap-4 flex-col'>
			<p className='flex items-center gap-2 mt-6'>
				<Briefcase size={20} />
				Workspace
			</p>
			<hr />
			<div className='flex flex-col gap-2'>
				<Label
					htmlFor='workspaceName'
					className='text-sm text-muted-foreground'
				>
					Name
				</Label>
				<Input
					name='workspaceName'
					value={workspaceDetails ? workspaceDetails.title : ''}
					placeholder='Workspace Name'
					onChange={(e) =>
						e.currentTarget.value &&
						onChangeWorkspaceName(e.currentTarget.value)
					}
				/>
				<Label
					htmlFor='workspaceLogo'
					className='text-sm text-muted-foreground'
				>
					Workspace Logo
				</Label>
				<Input
					name='workspaceLogo'
					type='file'
					accept='image/*'
					placeholder='Workspace Logo'
					onChange={(e) =>
						e.currentTarget.files?.[0] &&
						onChangeWorkspaceLogo(e.currentTarget.files[0])
					}
					disabled={uploadingLogo || subscription?.status !== 'active'}
				/>
				{subscription?.status !== 'active' && (
					<small className='text-muted-foreground'>
						To customize your workspace, you need to be on a Pro Plan
					</small>
				)}
			</div>
			<>
				<PermissionsSelect />
				{permission === 'shared' && <Collaborators />}
				<Alert variant='destructive'>
					<AlertDescription>
						Warning! deleting you workspace will permanantly delete all data
						related to this workspace.
					</AlertDescription>
					<Button
						type='submit'
						size='sm'
						variant='destructive'
						className='mt-4 text-sm bg-destructive/40  border-2  border-destructive'
						onClick={onDeleteWorkspace}
					>
						Delete Workspace
					</Button>
				</Alert>
				<p className='flex items-center gap-2 mt-6'>
					<UserIcon size={20} /> Profile
				</p>
				<hr />
				<div className='flex items-center'>
					{/* <Avatar>
						<AvatarImage src='' />
						<AvatarFallback>
							<ProfileIcon />
						</AvatarFallback>
					</Avatar>
					<div className='flex flex-col ml-6'>
						<small className='text-muted-foreground cursor-not-allowed'>
							{user?.email}
						</small>
						<Label
							htmlFor='profilePicture'
							className='text-sm text-muted-foreground'
						>
							Profile Picture
						</Label>
						<Input
							name='profilePicture'
							type='file'
							accept='image/*'
							placeholder='Profile Picture'
							// onChange={onChangeUserProfileAvatar}
							disabled
						/>
					</div> */}
				</div>
				<LogoutButton className='flex items-center'>
					<LogOut />
				</LogoutButton>
				<p className='flex items-center gap-2 mt-6'>
					<CreditCard size={20} /> Billing & Plan
				</p>
				<hr />
				<p className='text-muted-foreground'>
					You are currently on a
					{subscription?.status === 'active' ? 'Pro' : 'Free'} Plan
				</p>
				<Link
					href='/'
					target='_blank'
					className='text-muted-foreground flex flex-row items-center gap-2'
				>
					View Plans <ExternalLink size={16} />
				</Link>
				{subscription?.status === 'active' ? (
					<div>
						<Button
							type='button'
							size='sm'
							variant={'secondary'}
							// disabled={loadingPortal}
							className='text-sm'
							// onClick={redirectToCustomerPortal}
						>
							Manage Subscription
						</Button>
					</div>
				) : (
					<div>
						<Button
							type='button'
							size='sm'
							variant={'secondary'}
							className='text-sm'
							onClick={() => toggleSubscriptionDialog(true)}
						>
							Start Plan
						</Button>
					</div>
				)}
			</>
			<AlertDialog
				isOpened={isOpenAlertMessage}
				onCancel={() => openAlertMessageModal(false)}
				onConfirm={onAlertConfirm}
			/>
		</div>
	);
};

export default SettingsForm;
