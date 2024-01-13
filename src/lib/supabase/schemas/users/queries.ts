'use server';
import db from '../../db';

export const getUserById = async (userId: string) => {
	try {
		if (!userId) return { data: null, error: `Empty user id` };
		const user = await db.query.users.findFirst({
			where: (u, { eq }) => eq(u.id, userId),
		});
		if (!user) return { data: null, error: `User not found` };
		return { data: user, error: null };
	} catch (error) {
		return { data: null, error: `Find user by id error: ${error}` };
	}
};

export const getUsersByEmail = async (email: string) => {
	try {
		if (!email) return { data: null, error: `Empty email` };
		const users = await db.query.users.findMany({
			where: (u, { ilike }) => ilike(u.email, `${email}%`),
		});
		return { data: users, error: null };
	} catch (error) {
		return { data: null, error: `Find users by email error: ${error}` };
	}
};
