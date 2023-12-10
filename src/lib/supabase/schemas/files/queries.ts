'use server';
import { eq } from 'drizzle-orm';
import { files as filesSchema } from '@/tables';
import db from '../../db';

export const getFiles = async (folderId: string) => {
	try {
		const files = await db
			.select()
			.from(filesSchema)
			.orderBy(filesSchema.createdAt)
			.where(eq(filesSchema.folderId, folderId));
		return { files, error: null };
	} catch (error) {
		return { files: [], error: `Get fils error is: ${error}` };
	}
};
