import { pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users, workspaces } from '../../../../../migrations/schema';

export const collaborators = pgTable('collaborators', {
	id: uuid('id').defaultRandom().primaryKey().notNull(),
	workspaceId: uuid('workspace_id')
		.notNull()
		.references(() => workspaces.id, { onDelete: 'cascade' }),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
		.defaultNow()
		.notNull(),
	userId: uuid('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
});
