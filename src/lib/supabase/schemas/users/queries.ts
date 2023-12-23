'use server';
import db from '../../db';

export const getUsersByEmail = async (email: string) => {
	try {
		if (!email) return { users: null, error: null };
		const users = await db.query.users.findMany({
			where: (u, { ilike }) => ilike(u.email, `${email}%`),
		});
		return { data: users, error: null };
	} catch (error) {
		return { data: null, error: `Find users by email error: ${error}` };
	}
};
