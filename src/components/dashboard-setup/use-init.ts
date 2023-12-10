import type { AuthUser } from '@supabase/supabase-js';
import type { WorkspaceType } from '@/lib/supabase/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

import { upload } from '@/lib/supabase/utils/client/upload';
import { createWorkspace } from '@/lib/supabase/schemas/workspaces/query';
import { useAppStore } from '../providers/AppProvider';
import { useToast } from '../ui/use-toast';
import {
	createWorkspaceFormSchema,
	type CreateWorkspaceFormSchemaType,
} from './form-schema';

type InitialParams = {
	user: AuthUser;
};

const useInit = ({ user }: InitialParams) => {
	const { store, action } = useAppStore();
	const router = useRouter();
	const { toast } = useToast();
	const [selectedEmoji, setSelectedEmoji] = useState('💼');
	const {
		register,
		handleSubmit,
		reset,
		formState: { isSubmitting: isLoading, errors },
	} = useForm<CreateWorkspaceFormSchemaType>({
		mode: 'onChange',
		resolver: zodResolver(createWorkspaceFormSchema),
		defaultValues: { logo: '', workspaceName: '' },
	});
	const FORM_REGISTER_ATTRIBUTES = useMemo(
		() => ({
			logo: register('logo', { required: false }),
			workspaceName: register('workspaceName', {
				required: 'Workspace name is required',
			}),
		}),
		[register],
	);

	const onEmojiChange = (emoji: string) => setSelectedEmoji(emoji);
	const onSubmit = handleSubmit(async (values) => {
		let filePath = '';
		const file = values.logo?.[0];
		const workspaceUUID = crypto.randomUUID();

		if (file) {
			filePath = await upload({
				storageName: 'workspace-logos',
				fileName: `workspaceLogo.${workspaceUUID}`,
				file,
			});
		}

		if (!filePath) {
			toast({
				title: 'Workspace icon upload failed',
				description: 'Workspace icon upload failed. Please try again.',
			});
			return reset(values);
		}

		try {
			const newWorkspace: WorkspaceType = {
				data: null,
				createdAt: new Date().toISOString(),
				iconId: selectedEmoji,
				id: workspaceUUID,
				inTrash: '',
				title: values.workspaceName,
				workspaceOwner: user.id,
				logo: filePath,
				bannerUrl: '',
			};
			const { error } = await createWorkspace(newWorkspace);

			if (error) throw new Error(error);

			action.addWorkspaces({ workspaces: [{ ...newWorkspace, folders: [] }] });

			toast({
				title: 'Workspace Created',
				description: `${newWorkspace.title} has been created successfully.`,
			});

			router.replace(`/dashboard/${newWorkspace.id}`);
		} catch (error) {
			toast({
				variant: 'destructive',
				title: 'Could not create your workspace',
				description:
					"Oops! Something went wrong, and we couldn't create your workspace. Try again or come back later.",
			});
		} finally {
			reset();
		}
	});

	return {
		FORM_REGISTER_ATTRIBUTES,
		store: {
			formState: { isLoading, errors },
			selectedEmoji,
		},
		action: { onSubmit, onEmojiChange },
	};
};

export default useInit;
