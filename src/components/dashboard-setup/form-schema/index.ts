import { z } from 'zod';

export const createWorkspaceFormSchema = z.object({
	workspaceName: z
		.string()
		.describe('Workspace Name')
		.min(1, 'Workspace name must be min of 1 character'),
	logo: z.any(),
});
export type CreateWorkspaceFormSchemaType = z.infer<typeof createWorkspaceFormSchema>;
