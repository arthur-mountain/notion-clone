'use server';
import type { SubscriptionType } from '../../types';
import db from '../../db';

export const getFirstSubscriptionByUserId = async (userId: string) => {
	try {
		const subscription = (await db.query.subscriptions.findFirst({
			where: (s, { eq }) => eq(s.userId, userId),
		})) as SubscriptionType;

		if (subscription) return { data: subscription, error: null };
		return { data: null, error: null };
	} catch (error) {
		return { data: null, error: `Couldn't found the subscription by user id, error is: ${error}` };
	}
};
