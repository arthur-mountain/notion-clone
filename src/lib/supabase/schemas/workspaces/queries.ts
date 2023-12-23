'use server';
import type { WorkspaceType } from '../../types';
import { and, eq, notExists } from 'drizzle-orm';
import {
	users as usersSchema,
	workspaces as workspacesSchema,
	collaborators as collaboratorsSchema,
} from '@/tables';
import db from '../../db';

export const createWorkspace = async (workspace: WorkspaceType) => {
	try {
		await db.insert(workspacesSchema).values(workspace);
		return { data: null, error: null };
	} catch (error) {
		return { data: null, error: `Create workspace error: ${error}` };
	}
};

export const getFirstWorkspaceByUserId = async (userId: string) => {
	try {
		const workspace = await db.query.workspaces.findFirst({
			where: (w, { eq }) => eq(w.workspaceOwner, userId),
		});
		if (workspace) return { data: workspace, error: null };
		return { data: null, error: null };
	} catch (error) {
		return { data: null, error: `Get workspace error: ${error}` };
	}
};

export const getPrivateWorkspaces = async (userId: string) => {
	try {
		if (!userId) return { data: [], error: null };
		const privateWorkspaces = await db
			.select({
				id: workspacesSchema.id,
				createdAt: workspacesSchema.createdAt,
				workspaceOwner: workspacesSchema.workspaceOwner,
				title: workspacesSchema.title,
				iconId: workspacesSchema.iconId,
				data: workspacesSchema.data,
				inTrash: workspacesSchema.inTrash,
				logo: workspacesSchema.logo,
				bannerUrl: workspacesSchema.bannerUrl,
			})
			.from(workspacesSchema)
			.where(
				and(
					notExists(
						db
							.select()
							.from(collaboratorsSchema)
							.where(eq(collaboratorsSchema.workspaceId, workspacesSchema.id)),
					),
					eq(workspacesSchema.workspaceOwner, userId),
				),
			);
		return { data: privateWorkspaces, error: null };
	} catch (error) {
		return {
			data: [],
			error: `Get private workspaces error: ${error}`,
		};
	}
};

export const getCollaboratingWorkspaces = async (userId: string) => {
	try {
		if (!userId) return { data: [], error: null };
		const collaboratingWorkspaces = await db
			.select({
				id: workspacesSchema.id,
				createdAt: workspacesSchema.createdAt,
				workspaceOwner: workspacesSchema.workspaceOwner,
				title: workspacesSchema.title,
				iconId: workspacesSchema.iconId,
				data: workspacesSchema.data,
				inTrash: workspacesSchema.inTrash,
				logo: workspacesSchema.logo,
				bannerUrl: workspacesSchema.bannerUrl,
			})
			.from(usersSchema)
			.innerJoin(
				collaboratorsSchema,
				eq(usersSchema.id, collaboratorsSchema.userId),
			)
			.innerJoin(
				workspacesSchema,
				eq(collaboratorsSchema.workspaceId, workspacesSchema.id),
			)
			.where(eq(usersSchema.id, userId));
		return { data: collaboratingWorkspaces, error: null };
	} catch (error) {
		return {
			data: [],
			error: `Get collaborating workspaces error: ${error}`,
		};
	}
};

export const getSharedWorkspaces = async (userId: string) => {
	try {
		if (!userId) return { data: [], error: null };
		const sharedWorkspaces = await db
			.selectDistinct({
				id: workspacesSchema.id,
				createdAt: workspacesSchema.createdAt,
				workspaceOwner: workspacesSchema.workspaceOwner,
				title: workspacesSchema.title,
				iconId: workspacesSchema.iconId,
				data: workspacesSchema.data,
				inTrash: workspacesSchema.inTrash,
				logo: workspacesSchema.logo,
				bannerUrl: workspacesSchema.bannerUrl,
			})
			.from(workspacesSchema)
			.orderBy(workspacesSchema.createdAt)
			.innerJoin(
				collaboratorsSchema,
				eq(workspacesSchema.id, collaboratorsSchema.workspaceId),
			)
			.where(eq(workspacesSchema.workspaceOwner, userId));
		return { data: sharedWorkspaces, error: null };
	} catch (error) {
		return {
			data: [],
			error: `Get collaborated workspaces error: ${error}`,
		};
	}
};
