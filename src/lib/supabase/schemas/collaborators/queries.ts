'use server';
import type { UserType } from '../../types';
import { and, eq } from 'drizzle-orm';
import { collaborators as collaboratorsSchema } from '@/tables';
import db from '../../db';

export const addCollaborators = async (
	users: UserType[],
	workspaceId: string,
) => {
	try {
		users.forEach(async (user: UserType) => {
			const userExists = await db.query.collaborators.findFirst({
				where: (c, { eq, and }) =>
					and(eq(c.userId, user.id), eq(c.workspaceId, workspaceId)),
			});

			if (!userExists) {
				await db
					.insert(collaboratorsSchema)
					.values({ workspaceId, userId: user.id });
			}
		});
		return { data: null, error: null };
	} catch (error) {
		return { data: null, error: `Add collaborators error: ${error}` };
	}
};

export const getCollaborators = async (workspaceId: string) => {
	try {
		const results = await db
			.select()
			.from(collaboratorsSchema)
			.where(eq(collaboratorsSchema.workspaceId, workspaceId));
		if (!results.length) return { data: [], error: null };

		const users = (
			await Promise.all(
				results.map(async (user) => {
					return await db.query.users.findFirst({
						where: (u, { eq }) => eq(u.id, user.userId),
					});
				}),
			)
		).filter(Boolean) as UserType[];
		return { data: users, error: null };
	} catch (error) {
		return { data: [], error: `Get collaborators error: ${error}` };
	}
};

export const removeCollaborators = async (
	users: UserType[],
	workspaceId: string,
) => {
	try {
		users.forEach(async (user: UserType) => {
			const userExists = await db.query.collaborators.findFirst({
				where: (u, { eq, and }) =>
					and(eq(u.userId, user.id), eq(u.workspaceId, workspaceId)),
			});
			if (!userExists) return;
			await db
				.delete(collaboratorsSchema)
				.where(
					and(
						eq(collaboratorsSchema.workspaceId, workspaceId),
						eq(collaboratorsSchema.userId, user.id),
					),
				);
		});
		return { data: null, error: null };
	} catch (error) {
		return { data: null, error: `Remove collaborators error: ${error}` };
	}
};
