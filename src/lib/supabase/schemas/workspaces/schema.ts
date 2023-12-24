import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const workspaces = pgTable('workspaces', {
	id: uuid('id').defaultRandom().primaryKey().notNull(),
	createdAt: timestamp('created_at', {
		mode: 'string',
		withTimezone: true,
	})
		.defaultNow()
		.notNull(),
	workspaceOwner: uuid('workspace_owner').notNull(),
	title: text('title').notNull(),
	iconId: text('icon_id').notNull(),
	data: text('data'),
	inTrash: text('in_trash'),
	logo: text('logo'),
	bannerUrl: text('banner_url'),
	permission: text('permission').default('private').notNull(),
});
