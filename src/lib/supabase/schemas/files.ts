import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { folders } from './folders';
import { workspaces } from './workspaces';

export const files = pgTable('files', {
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
	folderId: uuid('folder_id').references(() => folders.id, {
		onDelete: 'cascade',
	}),
});
