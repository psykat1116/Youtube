import { db } from "@/db";
import {
  videoReactions,
  users,
  videos,
  views,
  playlists,
  playlistVideos,
} from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, desc, eq, getTableColumns, lt, or, sql } from "drizzle-orm";
import { z } from "zod";

export const playlistRouter = createTRPCRouter({
  getHistory: protectedProcedure
    .input(
      z.object({
        cursor: z
          .object({
            id: z.string().uuid(),
            viewedAt: z.date(),
          })
          .nullish(),
        limit: z.number().min(1).max(100).default(10),
      })
    )
    .query(async ({ input, ctx }) => {
      const { cursor, limit } = input;
      const { id: userId } = ctx.data;

      const userVideoViews = db.$with("user_video_views").as(
        db
          .select({
            videoId: views.videoId,
            viewedAt: views.updatedAt,
          })
          .from(views)
          .where(eq(views.userId, userId))
      );

      const data = await db
        .with(userVideoViews)
        .select({
          ...getTableColumns(videos),
          user: users,
          viewedAt: userVideoViews.viewedAt,
          viewCount: db.$count(views, eq(views.videoId, videos.id)),
          likeCount: db.$count(
            videoReactions,
            and(
              eq(videoReactions.videoId, videos.id),
              eq(videoReactions.type, "like")
            )
          ),
          dislikeCount: db.$count(
            videoReactions,
            and(
              eq(videoReactions.videoId, videos.id),
              eq(videoReactions.type, "dislike")
            )
          ),
        })
        .from(videos)
        .innerJoin(users, eq(users.id, videos.userId))
        .innerJoin(userVideoViews, eq(userVideoViews.videoId, videos.id))
        .where(
          and(
            eq(videos.visibility, "public"),
            cursor
              ? or(
                  lt(userVideoViews.viewedAt, cursor.viewedAt),
                  and(
                    eq(userVideoViews.viewedAt, cursor.viewedAt),
                    lt(videos.id, cursor.id)
                  )
                )
              : undefined
          )
        )
        .orderBy(desc(userVideoViews.viewedAt), desc(videos.id))
        .limit(limit + 1);

      const hasMore = data.length > limit;
      const items = hasMore ? data.slice(0, -1) : data;
      const lastItem = items[items.length - 1];
      const nextCursor = hasMore
        ? {
            id: lastItem.id,
            viewedAt: lastItem.viewedAt,
          }
        : null;

      return {
        items,
        nextCursor,
      };
    }),
  getLiked: protectedProcedure
    .input(
      z.object({
        cursor: z
          .object({
            id: z.string().uuid(),
            likedAt: z.date(),
          })
          .nullish(),
        limit: z.number().min(1).max(100).default(10),
      })
    )
    .query(async ({ input, ctx }) => {
      const { cursor, limit } = input;
      const { id: userId } = ctx.data;

      const userVideoLikes = db.$with("user_video_likes").as(
        db
          .select({
            videoId: videoReactions.videoId,
            likedAt: videoReactions.updatedAt,
          })
          .from(videoReactions)
          .where(
            and(
              eq(videoReactions.userId, userId),
              eq(videoReactions.type, "like")
            )
          )
      );

      const data = await db
        .with(userVideoLikes)
        .select({
          ...getTableColumns(videos),
          user: users,
          likedAt: userVideoLikes.likedAt,
          viewCount: db.$count(views, eq(views.videoId, videos.id)),
          likeCount: db.$count(
            videoReactions,
            and(
              eq(videoReactions.videoId, videos.id),
              eq(videoReactions.type, "like")
            )
          ),
          dislikeCount: db.$count(
            videoReactions,
            and(
              eq(videoReactions.videoId, videos.id),
              eq(videoReactions.type, "dislike")
            )
          ),
        })
        .from(videos)
        .innerJoin(users, eq(users.id, videos.userId))
        .innerJoin(userVideoLikes, eq(userVideoLikes.videoId, videos.id))
        .where(
          and(
            eq(videos.visibility, "public"),
            cursor
              ? or(
                  lt(userVideoLikes.likedAt, cursor.likedAt),
                  and(
                    eq(userVideoLikes.likedAt, cursor.likedAt),
                    lt(videos.id, cursor.id)
                  )
                )
              : undefined
          )
        )
        .orderBy(desc(userVideoLikes.likedAt), desc(videos.id))
        .limit(limit + 1);

      const hasMore = data.length > limit;
      const items = hasMore ? data.slice(0, -1) : data;
      const lastItem = items[items.length - 1];
      const nextCursor = hasMore
        ? {
            id: lastItem.id,
            likedAt: lastItem.likedAt,
          }
        : null;

      return {
        items,
        nextCursor,
      };
    }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.data;
      const { name } = input;

      if (name.length < 1 || name.length > 100) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Name should be between 1 and 100 characters",
        });
      }

      const [existingPlaylist] = await db
        .select()
        .from(playlists)
        .where(and(eq(playlists.userId, userId), eq(playlists.name, name)));

      if (existingPlaylist) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Playlist with this name already exists",
        });
      }

      const [newPlaylist] = await db
        .insert(playlists)
        .values({
          userId,
          name,
        })
        .returning();

      return newPlaylist;
    }),
  getMany: protectedProcedure
    .input(
      z.object({
        cursor: z
          .object({
            id: z.string().uuid(),
            updatedAt: z.date(),
          })
          .nullish(),
        limit: z.number().min(1).max(100).default(10),
      })
    )
    .query(async ({ input, ctx }) => {
      const { cursor, limit } = input;
      const { id: userId } = ctx.data;

      const data = await db
        .select({
          ...getTableColumns(playlists),
          videoCount: db.$count(
            playlistVideos,
            eq(playlistVideos.playlistId, playlists.id)
          ),
          user: users,
          thumbnailUrl: sql<string | null>`(
            SELECT v.thumbnail_url
            FROM ${playlistVideos} pv
            JOIN ${videos} v ON pv.video_id = v.id
            WHERE pv.playlist_id = ${playlists.id}
            AND v.visibility = 'public'
            ORDER BY pv.updated_at DESC
            LIMIT 1
          )`,
        })
        .from(playlists)
        .innerJoin(users, eq(users.id, playlists.userId))
        .where(
          and(
            eq(playlists.userId, userId),
            cursor
              ? or(
                  lt(playlists.updatedAt, cursor.updatedAt),
                  and(
                    eq(playlists.updatedAt, cursor.updatedAt),
                    lt(playlists.id, cursor.id)
                  )
                )
              : undefined
          )
        )
        .orderBy(desc(playlists.updatedAt), desc(playlists.id))
        .limit(limit + 1);

      const hasMore = data.length > limit;
      const items = hasMore ? data.slice(0, -1) : data;
      const lastItem = items[items.length - 1];
      const nextCursor = hasMore
        ? {
            id: lastItem.id,
            updatedAt: lastItem.updatedAt,
          }
        : null;

      return {
        items,
        nextCursor,
      };
    }),
  getForVideo: protectedProcedure
    .input(
      z.object({
        videoId: z.string().uuid(),
        cursor: z
          .object({
            id: z.string().uuid(),
            updatedAt: z.date(),
          })
          .nullish(),
        limit: z.number().min(1).max(100).default(10),
      })
    )
    .query(async ({ input, ctx }) => {
      const { cursor, limit, videoId } = input;
      const { id: userId } = ctx.data;

      const data = await db
        .select({
          ...getTableColumns(playlists),
          videoCount: db.$count(
            playlistVideos,
            eq(playlistVideos.playlistId, playlists.id)
          ),
          user: users, // TODO: Check if this is needed
          containsVideo: videoId
            ? sql<boolean>`(
            SELECT EXISTS (
              SELECT 1 
              FROM ${playlistVideos} pv 
              WHERE pv.playlist_id = ${playlists.id} 
                AND pv.video_id = ${videoId}
          ))`
            : sql<boolean>`false`,
        })
        .from(playlists)
        .innerJoin(users, eq(users.id, playlists.userId))
        .where(
          and(
            eq(playlists.userId, userId),
            cursor
              ? or(
                  lt(playlists.updatedAt, cursor.updatedAt),
                  and(
                    eq(playlists.updatedAt, cursor.updatedAt),
                    lt(playlists.id, cursor.id)
                  )
                )
              : undefined
          )
        )
        .orderBy(desc(playlists.updatedAt), desc(playlists.id))
        .limit(limit + 1);

      const hasMore = data.length > limit;
      const items = hasMore ? data.slice(0, -1) : data;
      const lastItem = items[items.length - 1];
      const nextCursor = hasMore
        ? {
            id: lastItem.id,
            updatedAt: lastItem.updatedAt,
          }
        : null;

      return {
        items,
        nextCursor,
      };
    }),
  addVideo: protectedProcedure
    .input(
      z.object({
        playlistId: z.string().uuid(),
        videoId: z.string().uuid(),
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.data;
      const { playlistId, videoId, name } = input;

      const [playlist] = await db
        .select()
        .from(playlists)
        .where(and(eq(playlists.id, playlistId), eq(playlists.userId, userId)));

      if (!playlist) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Playlist not found",
        });
      }

      const [video] = await db
        .select()
        .from(videos)
        .where(and(eq(videos.id, videoId), eq(videos.visibility, "public")));

      if (!video) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Video not found",
        });
      }

      const [existingPlaylistVideo] = await db
        .select()
        .from(playlistVideos)
        .where(
          and(
            eq(playlistVideos.videoId, videoId),
            eq(playlistVideos.playlistId, playlistId)
          )
        );

      if (existingPlaylistVideo) {
        throw new TRPCError({
          code: "CONFLICT",
          message: `Video Already Exists In ${name}`,
        });
      }

      const [newPlaylistVideo] = await db
        .insert(playlistVideos)
        .values({
          videoId,
          playlistId,
        })
        .returning();

      return {
        ...newPlaylistVideo,
        name,
      };
    }),
  removeVideo: protectedProcedure
    .input(
      z.object({
        playlistId: z.string().uuid(),
        videoId: z.string().uuid(),
        name: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.data;
      const { playlistId, videoId, name } = input;

      const [playlist] = await db
        .select()
        .from(playlists)
        .where(and(eq(playlists.id, playlistId), eq(playlists.userId, userId)));

      if (!playlist) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Playlist not found",
        });
      }

      const [video] = await db
        .select()
        .from(videos)
        .where(and(eq(videos.id, videoId), eq(videos.visibility, "public")));

      if (!video) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Video not found",
        });
      }

      const [existingPlaylistVideo] = await db
        .select()
        .from(playlistVideos)
        .where(
          and(
            eq(playlistVideos.videoId, videoId),
            eq(playlistVideos.playlistId, playlistId)
          )
        );

      if (!existingPlaylistVideo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Video Not Found In ${name || "Playlist"}`,
        });
      }

      const [deletedPlaylistVideo] = await db
        .delete(playlistVideos)
        .where(
          and(
            eq(playlistVideos.videoId, videoId),
            eq(playlistVideos.playlistId, playlistId)
          )
        )
        .returning();

      return { ...deletedPlaylistVideo, name };
    }),
  getVideo: protectedProcedure
    .input(
      z.object({
        playlistId: z.string().uuid(),
        cursor: z
          .object({
            id: z.string().uuid(),
            updatedAt: z.date(),
          })
          .nullish(),
        limit: z.number().min(1).max(100).default(10),
      })
    )
    .query(async ({ input, ctx }) => {
      const { cursor, limit, playlistId } = input;
      const { id: userId } = ctx.data;

      const [playlist] = await db
        .select()
        .from(playlists)
        .where(and(eq(playlists.id, playlistId), eq(playlists.userId, userId)));

      if (!playlist) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Playlist not found",
        });
      }

      const videoFromPlaylist = db.$with("video_from_playlist").as(
        db
          .select({
            videoId: playlistVideos.videoId,
          })
          .from(playlistVideos)
          .where(eq(playlistVideos.playlistId, playlistId))
      );

      const data = await db
        .with(videoFromPlaylist)
        .select({
          ...getTableColumns(videos),
          user: users,
          viewCount: db.$count(views, eq(views.videoId, videos.id)),
          likeCount: db.$count(
            videoReactions,
            and(
              eq(videoReactions.videoId, videos.id),
              eq(videoReactions.type, "like")
            )
          ),
          dislikeCount: db.$count(
            videoReactions,
            and(
              eq(videoReactions.videoId, videos.id),
              eq(videoReactions.type, "dislike")
            )
          ),
        })
        .from(videos)
        .innerJoin(users, eq(users.id, videos.userId))
        .innerJoin(videoFromPlaylist, eq(videoFromPlaylist.videoId, videos.id))
        .where(
          and(
            eq(videos.visibility, "public"),
            cursor
              ? or(
                  lt(videos.updatedAt, cursor.updatedAt),
                  and(
                    eq(videos.updatedAt, cursor.updatedAt),
                    lt(videos.id, cursor.id)
                  )
                )
              : undefined
          )
        )
        .orderBy(desc(videos.updatedAt), desc(videos.id))
        .limit(limit + 1);

      const hasMore = data.length > limit;
      const items = hasMore ? data.slice(0, -1) : data;
      const lastItem = items[items.length - 1];
      const nextCursor = hasMore
        ? {
            id: lastItem.id,
            updatedAt: lastItem.updatedAt,
          }
        : null;

      return {
        items,
        nextCursor,
      };
    }),
  getOne: protectedProcedure
    .input(
      z.object({
        playlistId: z.string().uuid(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { id: userId } = ctx.data;
      const { playlistId } = input;

      const [existingPlaylist] = await db
        .select()
        .from(playlists)
        .where(and(eq(playlists.id, playlistId), eq(playlists.userId, userId)));

      if (!existingPlaylist) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Playlist not found",
        });
      }

      return existingPlaylist;
    }),
  remove: protectedProcedure
    .input(
      z.object({
        playlistId: z.string().uuid(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id: userId } = ctx.data;
      const { playlistId } = input;

      const [existingPlaylist] = await db
        .select()
        .from(playlists)
        .where(and(eq(playlists.id, playlistId), eq(playlists.userId, userId)));

      if (!existingPlaylist) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Playlist not found",
        });
      }

      const [deletedPlaylist] = await db
        .delete(playlists)
        .where(and(eq(playlists.id, playlistId), eq(playlists.userId, userId)))
        .returning();

      return deletedPlaylist;
    }),
});
