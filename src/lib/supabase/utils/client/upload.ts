'use client';
import { createClientComponentClient } from '.';

type UploadParams = {
	storageName: string;
	fileName: string;
	// FIXME: Those two types should match supabase upload types
	file: Blob;
	storageConfig?: any;
};

export const upload = async ({
	storageName,
	fileName,
	file,
	storageConfig = { cacheControl: '3600', upsert: true },
}: UploadParams) => {
	try {
		const { data, error } = await createClientComponentClient()
			.storage.from(storageName)
			.upload(fileName, file, storageConfig);
		if (error) throw new Error(error.message);
		return data.path;
	} catch (error) {
		console.log('Upload Error', error);
		return '';
	}
};
