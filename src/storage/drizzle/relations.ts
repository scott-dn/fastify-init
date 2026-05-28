// @ts-nocheck
/* eslint-disable */

import { defineRelations } from "drizzle-orm";
import * as schema from "#/storage/drizzle/schema.js";

export const relations = defineRelations(schema, (r) => ({
	post: {
		user: r.one.user({
			from: r.post.authorid,
			to: r.user.id
		}),
	},
	user: {
		posts: r.many.post(),
		profiles: r.one.profile(),
	},
	profile: {
		user: r.one.user({
			from: r.profile.userid,
			to: r.user.id
		}),
	},
}))