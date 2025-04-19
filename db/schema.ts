import {
  uuid,
  text,
  pgTable,
  timestamp,
  uniqueIndex,
  integer,
  pgEnum,
  primaryKey,
} from "drizzle-orm/pg-core";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { relations } from "drizzle-orm";

export const videoVisibility = pgEnum("video_visibility", [
  "private",
  "public",
]);

export const videoReaction = pgEnum("video_reaction", ["like", "dislike"]);

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    imageUrl: text("image_url").notNull(),
    clerkId: text("clerk_id").unique().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("clerk_id_index").on(t.clerkId)]
);

export const userRelations = relations(users, ({ many }) => ({
  videos: many(videos),
  views: many(views),
  reactions: many(reactions),
  subscribers: many(subscriptions, {
    relationName: "subscription_creator_id_fk",
  }),
  subscriptions: many(subscriptions, {
    relationName: "subscription_viewer_id_fk",
  }),
}));

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull().unique(),
    description: text("description").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("name_index").on(t.name)]
);

export const categoryRelations = relations(categories, ({ many }) => ({
  videos: many(videos),
}));

export const videos = pgTable("videos", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  categoryId: uuid("category_id").references(() => categories.id, {
    onDelete: "set null",
  }),
  visibility: videoVisibility("visibility").default("private").notNull(),
  muxStatus: text("mux_status"),
  muxAssetId: text("mux_asset_id").unique(),
  muxUploadId: text("mux_upload_id").unique(),
  muxPlaybackId: text("mux_playback_id").unique(),
  muxTrackId: text("mux_track_id").unique(),
  muxTrackStatus: text("mux_track_status"),
  thumbnailKey: text("thumbnail_key"),
  thumbnailUrl: text("thumbnail_url"),
  previewUrl: text("preview_url"),
  duration: integer("duration").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const videoInsertSchema = createInsertSchema(videos);
export const videoUpdateSchema = createUpdateSchema(videos);
export const videoSelectSchema = createSelectSchema(videos);

export const videoRelations = relations(videos, ({ one, many }) => ({
  user: one(users, {
    fields: [videos.userId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [videos.categoryId],
    references: [categories.id],
  }),
  views: many(views),
  reactions: many(reactions),
}));

export const views = pgTable(
  "views",
  {
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    videoId: uuid("video_id")
      .references(() => videos.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    primaryKey({
      name: "video_view_pk",
      columns: [t.userId, t.videoId],
    }),
  ]
);

export const viewRelations = relations(views, ({ one }) => ({
  users: one(users, {
    fields: [views.userId],
    references: [users.id],
  }),
  videos: one(videos, {
    fields: [views.videoId],
    references: [videos.id],
  }),
}));

export const viewSelectSchema = createSelectSchema(views);
export const viewInsertSchema = createInsertSchema(views);
export const viewUpdateSchema = createUpdateSchema(views);

export const reactions = pgTable(
  "reactions",
  {
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    videoId: uuid("video_id")
      .references(() => videos.id, { onDelete: "cascade" })
      .notNull(),
    type: videoReaction("type").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    primaryKey({
      name: "video_reaction_pk",
      columns: [t.userId, t.videoId],
    }),
  ]
);

export const reactionRelations = relations(reactions, ({ one }) => ({
  users: one(users, {
    fields: [reactions.userId],
    references: [users.id],
  }),
  videos: one(videos, {
    fields: [reactions.videoId],
    references: [videos.id],
  }),
}));

export const reactionSelectSchema = createSelectSchema(reactions);
export const reactionInsertSchema = createInsertSchema(reactions);
export const reactionUpdateSchema = createUpdateSchema(reactions);

export const subscriptions = pgTable(
  "subscriptions",
  {
    viewerId: uuid("viewer_id")
      .references(() => users.id, {
        onDelete: "cascade",
      })
      .notNull(),
    creatorId: uuid("creator_id")
      .references(() => users.id, {
        onDelete: "cascade",
      })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    primaryKey({
      name: "subscription_pk",
      columns: [t.viewerId, t.creatorId],
    }),
  ]
);

export const subscriptionRelations = relations(subscriptions, ({ one }) => ({
  viewerId: one(users, {
    fields: [subscriptions.viewerId],
    references: [users.id],
    relationName: "subscription_viewer_id_fk",
  }),
  creatorId: one(users, {
    fields: [subscriptions.creatorId],
    references: [users.id],
    relationName: "subscription_creator_id_fk",
  }),
}));
