'use server';
import { eq } from 'drizzle-orm';
import db from '../../db';
import { folders as foldersSchema } from '@/tables';

export const getFolders = async (workspaceId: string) => {
	try {
		const folders = await db
			.select()
			.from(foldersSchema)
			.orderBy(foldersSchema.createdAt)
			.where(eq(foldersSchema.workspaceId, workspaceId));
		return { folders, error: null };
	} catch (error) {
		return { folders: null, error: 'Find Folders Error' };
	}
};
