// @ts-nocheck
/* eslint-disable */

import { pgTable, serial, varchar, text, timestamp, smallint, integer, boolean, uniqueIndex, foreignKey, primaryKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const migrations = pgTable("migrations", {
	name: varchar({ length: 500 }).primaryKey(),
	version: smallint().notNull(),
	appliedAt: timestamp("applied_at").default(sql`CURRENT_TIMESTAMP`),
});

export const post = pgTable("post", {
	id: serial().primaryKey(),
	createdat: timestamp({ precision: 3 }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedat: timestamp({ precision: 3 }).notNull(),
	title: varchar({ length: 255 }).notNull(),
	content: text(),
	published: boolean().default(false).notNull(),
	authorid: integer().notNull().references(() => user.id, { onDelete: "restrict", onUpdate: "cascade" } ),
});

export const profile = pgTable("profile", {
	id: serial().primaryKey(),
	bio: text(),
	userid: integer().notNull().references(() => user.id, { onDelete: "restrict", onUpdate: "cascade" } ),
}, (table) => [
	uniqueIndex("profile_userid_key").using("btree", table.userid.asc().nullsLast()),
]);

export const user = pgTable("user", {
	id: serial().primaryKey(),
	email: text().notNull(),
	name: text(),
}, (table) => [
	uniqueIndex("user_email_key").using("btree", table.email.asc().nullsLast()),
]);
