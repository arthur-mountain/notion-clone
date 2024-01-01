import { z } from 'zod';

const UploadBannerFormSchema = z.object({
	banner: z.string().describe('Banner Image'),
});
export type UploadBannerFormSchemaType = z.infer<typeof UploadBannerFormSchema>;
