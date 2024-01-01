'use server';
import type { FileType } from '../../types';
import { eq } from 'drizzle-orm';
import { files as filesSchema } from '@/tables';
import db from '../../db';

export const getFileById = async (fileId: string) => {
	try {
		const file = await db.query.files.findFirst({
			where: (w, { eq }) => eq(w.id, fileId),
		});
		return { data: file, error: null };
	} catch (error) {
		return { data: null, error: `Get file error: ${error}` };
	}
};

export const createFile = async (file: FileType) => {
	try {
		const results = await db.insert(filesSchema).values(file);
		return { data: results, error: null };
	} catch (error) {
		console.log(error);
		return { data: null, error: 'Error' };
	}
};

export const getFiles = async (folderId: string) => {
	try {
		const files = await db
			.select()
			.from(filesSchema)
			.orderBy(filesSchema.createdAt)
			.where(eq(filesSchema.folderId, folderId));
		return { data: files, error: null };
	} catch (error) {
		return { data: [], error: `Get fils error is: ${error}` };
	}
};

export const updateFile = async (file: Partial<FileType>, fileId: string) => {
	try {
		const results = await db
			.update(filesSchema)
			.set(file)
			.where(eq(filesSchema.id, fileId));
		return { data: results, error: null };
	} catch (error) {
		return { data: null, error: `Update file error: ${error}` };
	}
};

export const deleteFile = async (fileId: string) => {
	if (!fileId) return
	await db.delete(filesSchema).where(eq(filesSchema.id, fileId));
};
