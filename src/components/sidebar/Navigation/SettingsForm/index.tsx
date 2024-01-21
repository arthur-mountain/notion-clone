'use client';
import {
	Briefcase,
	User as UserIcon,
	CakeIcon as ProfileIcon,
	LogOut,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Collaborators from '@/components/Global/Collaborators';
import PermissionsSelect from '@/components/Global/PermissionsSelect';
import LogoutButton from '@/components/Global/LogoutButton';
import AlertDialog from './AlertDialog';
import useInit from './use-init';

const SettingsForm = () => {
	const {
		store: {
			user,
			subscription,
			isOpenAlertMessage,
			currentWorkspace,
			isUploadingLogo,
		},
		action: {
			onAlertConfirm,
			onChangeWorkspaceName,
			onChangeWorkspaceLogo,
			onDeleteWorkspace,
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
					defaultValue={currentWorkspace ? currentWorkspace.title : ''}
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
					disabled={isUploadingLogo || subscription?.status !== 'active'}
				/>
				{subscription?.status !== 'active' && (
					<small className='text-muted-foreground'>
						To customize your workspace, you need to be on a Pro Plan
					</small>
				)}
			</div>
			<>
				<PermissionsSelect />
				{currentWorkspace?.permission === 'shared' && <Collaborators />}
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
					<Avatar>
						<AvatarImage src={user?.extra?.avatarUrl || ''} />
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
					</div>
				</div>
				<LogoutButton className='flex items-center'>
					<LogOut />
				</LogoutButton>
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
