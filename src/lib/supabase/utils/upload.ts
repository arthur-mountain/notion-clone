'use server';
import { createServerComponentClient } from './create-instance';

type ToastConfig =
	| { toastConfig?: { variant: 'destructive'; title: string } }
	| { toastConfig?: string };
type UploadParams = {
	storageName: string;
	fileName: string;
	// FIXME: Those two types should match supabase upload types
	file: Blob;
	storageConfig?: any;
} & ToastConfig;

export const upload = async ({
	storageName,
	fileName,
	file,
	storageConfig = {
		cacheControl: '3600',
		upsert: true,
	},
	toastConfig,
}: UploadParams) => {
	try {
		const { data, error } = await await createServerComponentClient()
			.storage.from(storageName)
			.upload(fileName, file, storageConfig);

		return error ? Promise.reject(error) : data.path;
	} catch (error) {
		console.log('Upload Error', error);
		const emptyPath = ''
		if (!toastConfig) return emptyPath;

		let config =
			toastConfig && toastConfig !== null && typeof toastConfig === 'object'
				? toastConfig
				: {
						variant: 'destructive',
						title: 'Error! Could not upload your workspace logo',
				  };

		if (typeof toastConfig === 'string') config.title = toastConfig;

		// toast(config);
		return emptyPath;
	}
};
