'use server';
import type { FolderType } from '../../types';
import { eq } from 'drizzle-orm';
import db from '../../db';
import { folders as foldersSchema } from '@/tables';

export const createFolder = async (folder: FolderType) => {
	try {
		const results = await db.insert(foldersSchema).values(folder);
		return { data: results, error: null };
	} catch (error) {
		return { data: null, error: `Create Folder Error: ${error}` };
	}
};

export const getFolders = async (workspaceId: string) => {
	try {
		const folders = await db
			.select()
			.from(foldersSchema)
			.orderBy(foldersSchema.createdAt)
			.where(eq(foldersSchema.workspaceId, workspaceId));
		return { data: folders, error: null };
	} catch (error) {
		return { data: null, error: 'Find Folders Error' };
	}
};

export const updateFolder = async (
	folder: Partial<FolderType>,
	folderId: string,
) => {
	try {
		const results = await db
			.update(foldersSchema)
			.set(folder)
			.where(eq(foldersSchema.id, folderId));
		return { data: results, error: null };
	} catch (error) {
		return { data: null, error: `Update folder error: ${error}` };
	}
};

export const deleteFolder = async (folderId: string) => {
	if (!folderId) return;
	await db.delete(foldersSchema).where(eq(foldersSchema.id, folderId));
};
