'use server';
import type { WorkspaceType } from '../../types';
import { workspaces } from '@/tables';
import db from '../../db';

export const getWorkspaceByUserId = async (userId: string) => {
	try {
		const workspace = await db.query.workspaces.findFirst({
			where: (w, { eq }) => eq(w.workspaceOwner, userId),
		});

		if (workspace) return { workspace, error: null };
		return { workspace: null, error: null };
	} catch (error) {
		return { workspace: null, error: `Get workspace error: ${error}` };
	}
};

export const createWorkspace = async (workspace: WorkspaceType) => {
	try {
		await db.insert(workspaces).values(workspace);
		return { data: null, error: null };
	} catch (error) {
		return { data: null, error: `Create workspace error: ${error}` };
	}
};
