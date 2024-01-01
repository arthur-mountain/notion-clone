import type { UploadBannerFormSchemaType } from './from-schema';
import React from 'react';
import { useForm } from 'react-hook-form';
import { upload } from '@/lib/supabase/utils/client/upload';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Loader from '@/components/Global/Loader';
import { useAppStore } from '@/components/Providers/AppProvider';

type Props = {
	id: string;
	type: 'workspace' | 'file' | 'folder';
};

const BannerUploadForm = ({ id, type }: Props) => {
	const { action } = useAppStore();
	const {
		register,
		handleSubmit,
		formState: { isSubmitting: isUploading, errors },
	} = useForm<UploadBannerFormSchemaType>({
		mode: 'onChange',
		defaultValues: { banner: '' },
	});
	const onSubmitHandler = async (values: UploadBannerFormSchemaType) => {
		const file = values.banner?.[0];
		if (!file || !id) return;

		try {
			const bannerUrl = await upload({
				storageName: 'file-banners',
				fileName: `banner-${id}`,
				file,
				storageConfig: { cacheControl: '5', upsert: true },
			});

			if (!bannerUrl) return;

			switch (type) {
				case 'workspace': {
					await action.updateWorkspace({ workspace: { bannerUrl } });
					break;
				}
				case 'folder': {
					await action.updateFolder({ folder: { bannerUrl } });
					break;
				}
				case 'file': {
					await action.updateFile({ file: { bannerUrl } });
					break;
				}
				default:
					break;
			}
		} catch {}
	};
	return (
		<form
			onSubmit={handleSubmit(onSubmitHandler)}
			className='flex flex-col gap-2'
		>
			<Label className='text-sm text-muted-foreground' htmlFor='bannerImage'>
				Banner Image
			</Label>
			<Input
				id='bannerImage'
				type='file'
				accept='image/*'
				disabled={isUploading}
				className='cursor-pointer'
				{...register('banner', { required: 'Banner Image is required' })}
			/>
			<small className='text-red-600'>
				{errors.banner?.message?.toString()}
			</small>
			<Button disabled={isUploading} type='submit'>
				{!isUploading ? 'Upload Banner' : <Loader />}
			</Button>
		</form>
	);
};

export default BannerUploadForm;
