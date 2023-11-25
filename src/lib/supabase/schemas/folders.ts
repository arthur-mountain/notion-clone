import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { workspaces } from './workspaces';

export const folders = pgTable('folders', {
	id: uuid('id').defaultRandom().primaryKey().notNull(),
	createAt: timestamp('create_at', {
		mode: 'string',
		withTimezone: true,
	}),
	title: text('title').notNull(),
	iconId: text('icon_id').notNull(),
	data: text('data'),
	inTrash: text('in_trash'),
	bannerUrl: text('banner_url'),
	workspaceId: uuid('workspace_id')
		.references(() => workspaces.id, {
			onDelete: 'cascade',
		})
		.notNull(),
});
