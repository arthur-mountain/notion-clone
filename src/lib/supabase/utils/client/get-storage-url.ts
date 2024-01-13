import { createClientComponentClient } from '.';

export const getStoragePublicUrl = (
	bucketName: string,
	publicUrl: string | null,
) => {
	if (!publicUrl) return '';
	const url = createClientComponentClient()
		.storage.from(bucketName)
		.getPublicUrl(publicUrl).data.publicUrl;
	return url || '';
};
