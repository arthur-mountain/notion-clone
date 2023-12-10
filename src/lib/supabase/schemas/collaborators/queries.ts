'use server';
import type { UserType } from '../../types';
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
