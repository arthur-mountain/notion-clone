import { SelectGroup } from '@radix-ui/react-select';
import { Lock, Share } from 'lucide-react';
import { useCallback } from 'react';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useAppStore } from '../Providers/AppProvider';

type Props = {
	initialValue?: 'private' | 'shared';
	onChange?: (v: 'private' | 'shared') => void;
};

const PermissionsSelect = ({ initialValue, onChange }: Props) => {
	const {
		store: { workspaces, workspaceId },
		action: { updateWorkspace },
	} = useAppStore();
	const currentWorkspace = workspaces.find((w) => w.id === workspaceId);

	const onPermissionChange = useCallback(
		(value: 'private' | 'shared') => {
			onChange
				? onChange(value)
				: updateWorkspace({ workspace: { permission: value } });
		},
		[onChange, updateWorkspace],
	);

	return (
		<>
			<Label htmlFor='permissions' className='text-sm text-muted-foreground'>
				Permission
			</Label>
			<Select
				onValueChange={onPermissionChange}
				defaultValue={initialValue || currentWorkspace?.permission || 'private'}
			>
				<SelectTrigger className='w-full h-26 -mt-3'>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectItem value='private'>
							<div className='p-2 flex gap-4 justify-center items-center'>
								<Lock />
								<article className='text-left flex flex-col whitespace-pre-line'>
									<span>Private</span>
									<p>
										Your workspace is private to you. You can choose to share it
										later.
									</p>
								</article>
							</div>
						</SelectItem>
						<SelectItem value='shared'>
							<div className='p-2 flex gap-4 justify-center items-center'>
								<Share />
								<article className='text-left flex flex-col whitespace-pre-line'>
									<span>Shared</span>
									<p>You can invite collaborators.</p>
								</article>
							</div>
						</SelectItem>
					</SelectGroup>
				</SelectContent>
			</Select>
		</>
	);
};

export default PermissionsSelect;
