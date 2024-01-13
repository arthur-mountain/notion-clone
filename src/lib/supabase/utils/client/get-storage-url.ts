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

export const removeStorageUrls = (bucketName: string, urls: string[]) => {
	if (!urls.length) return;
	createClientComponentClient().storage.from(bucketName).remove(urls);
};
