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

		if (workspace) return { workspace, error: null };
		return { workspace: null, error: null };
	} catch (error) {
		return { workspace: null, error: `Get workspace error: ${error}` };
	}
};

export const getPrivateWorkspaces = async (userId: string) => {
	try {
		if (!userId) return { privateWorkspaces: [], error: null };
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
		return { privateWorkspaces, error: null };
	} catch (error) {
		return {
			privateWorkspaces: [],
			error: `Get private workspaces error: ${error}`,
		};
	}
};

export const getCollaboratingWorkspaces = async (userId: string) => {
	try {
		if (!userId) return { collaboratingWorkspaces: [], error: null };
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
		return { collaboratingWorkspaces, error: null };
	} catch (error) {
		return {
			collaboratingWorkspaces: [],
			error: `Get collaborating workspaces error: ${error}`,
		};
	}
};

export const getSharedWorkspaces = async (userId: string) => {
	try {
		if (!userId) return { sharedWorkspaces: [], error: null };
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
		return { sharedWorkspaces, error: null };
	} catch (error) {
		return {
			sharedWorkspaces: [],
			error: `Get collaborated workspaces error: ${error}`,
		};
	}
};
