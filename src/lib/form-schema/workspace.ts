import { z } from 'zod';

const CreateWorkspaceFormSchema = z.object({
	workspaceName: z
		.string()
		.describe('Workspace Name')
		.min(1, 'Workspace name must be min of 1 character'),
	logo: z.any(),
});
export type CreateWorkspaceFormType = z.infer<typeof CreateWorkspaceFormSchema>;
