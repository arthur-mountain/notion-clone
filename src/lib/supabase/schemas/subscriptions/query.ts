'use server';
import type { SubscriptionType } from '../../types';
import db from '../../db';

export const getFirstSubscriptionByUserId = async (userId: string) => {
	try {
		const subscription = (await db.query.subscriptions.findFirst({
			where: (s, { eq }) => eq(s.userId, userId),
		})) as SubscriptionType;

		if (subscription) return { subscription, error: null };
		return { subscription: null, error: null };
	} catch (error) {
		return { subscription: null, error: `Error ${error}` };
	}
};
