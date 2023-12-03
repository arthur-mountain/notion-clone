import type { AuthUser } from '@supabase/supabase-js';
import type { SubscriptionType } from '@/lib/supabase/types';
import type { CreateWorkspaceFormType } from './form-schema';
import { useForm } from 'react-hook-form';
import { useMemo, useState } from 'react';
import { upload } from '@/lib/supabase/utils';
import { createWorkspace } from '@/lib/supabase/queries/workspaces';

type InitialParams = {
	user: AuthUser;
	subscription: SubscriptionType | null;
};

const useInit = ({ user, subscription }: InitialParams) => {
	const [selectedEmoji, setSelectedEmoji] = useState('💼');
	const {
		register,
		handleSubmit,
		reset,
		formState: { isSubmitting: isLoading, errors },
	} = useForm<CreateWorkspaceFormType>({
		mode: 'onChange',
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
		console.log(file);

		if (file) {
			filePath = await upload({
				storageName: 'workspace-logos',
				fileName: `workspaceLogo.${workspaceUUID}`,
				file,
			});
		}

		if (!filePath) return;

		try {
			const { error } = await createWorkspace({
				data: null,
				createdAt: new Date().toISOString(),
				iconId: selectedEmoji,
				id: workspaceUUID,
				inTrash: '',
				title: values.workspaceName,
				workspaceOwner: user.id,
				logo: filePath || null,
				bannerUrl: '',
			});

			if (error) throw new Error(error);
			// dispatch({
			// 	type: 'ADD_WORKSPACE',
			// 	payload: { ...newWorkspace, folders: [] },
			// });

			// toast({
			// 	title: 'Workspace Created',
			// 	description: `${newWorkspace.title} has been created successfully.`,
			// });

			// router.replace(`/dashboard/${newWorkspace.id}`);
		} catch (error) {
			console.log(error);
			// toast({
			// 	variant: 'destructive',
			// 	title: 'Could not create your workspace',
			// 	description:
			// 		"Oops! Something went wrong, and we couldn't create your workspace. Try again or come back later.",
			// });
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
