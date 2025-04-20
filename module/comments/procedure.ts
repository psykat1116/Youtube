import { db } from "@/db";
import { commentReactions, comments, users } from "@/db/schema";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import {
  and,
  count,
  desc,
  eq,
  getTableColumns,
  inArray,
  isNotNull,
  isNull,
  lt,
  or,
} from "drizzle-orm";
import { z } from "zod";

export const commentsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        value: z.string(),
        videoId: z.string().uuid(),
        parentId: z.string().uuid().nullish(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.data;
      const { videoId, value, parentId } = input;

      if (value.length < 1 || value.length > 500) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Message must be between 1 and 500 characters.",
        });
      }

      const [existingComment] = await db
        .select()
        .from(comments)
        .where(inArray(comments.id, parentId ? [parentId] : []));

      if (!existingComment && parentId) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Parent comment not found.",
        });
      }

      if (existingComment && parentId && existingComment.parentId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot reply to a reply.",
        });
      }

      const [newComment] = await db
        .insert(comments)
        .values({
          userId,
          videoId,
          value,
          parentId,
        })
        .returning();

      return newComment;
    }),
  getMany: baseProcedure
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
        parentId: z.string().uuid().nullish(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { clerkId } = ctx;
      const { videoId, cursor, limit, parentId } = input;

      let userId;
      const [user] = await db
        .select()
        .from(users)
        .where(inArray(users.clerkId, clerkId ? [clerkId] : []));

      if (user) {
        userId = user.id;
      }

      const userReaction = db.$with("userReaction").as(
        db
          .select({
            commentId: commentReactions.commentId,
            type: commentReactions.type,
          })
          .from(commentReactions)
          .where(inArray(commentReactions.userId, userId ? [userId] : []))
      );

      const replies = db.$with("replies").as(
        db
          .select({
            parentId: comments.parentId,
            count: count(comments.id).as("count"),
          })
          .from(comments)
          .where(isNotNull(comments.parentId))
          .groupBy(comments.parentId)
      );

      const data = await db
        .with(userReaction, replies)
        .select({
          ...getTableColumns(comments),
          user: users,
          userReaction: userReaction.type,
          likeCount: db.$count(
            commentReactions,
            and(
              eq(commentReactions.commentId, comments.id),
              eq(commentReactions.type, "like")
            )
          ),
          dislikeCount: db.$count(
            commentReactions,
            and(
              eq(commentReactions.commentId, comments.id),
              eq(commentReactions.type, "dislike")
            )
          ),
          replyCount: replies.count,
        })
        .from(comments)
        .innerJoin(users, eq(comments.userId, users.id))
        .leftJoin(userReaction, eq(comments.id, userReaction.commentId))
        .leftJoin(replies, eq(comments.id, replies.parentId))
        .where(
          and(
            eq(comments.videoId, videoId),
            parentId
              ? eq(comments.parentId, parentId)
              : isNull(comments.parentId),
            cursor
              ? or(
                  lt(comments.updatedAt, cursor.updatedAt),
                  and(
                    eq(comments.updatedAt, cursor.updatedAt),
                    lt(comments.id, cursor.id)
                  )
                )
              : undefined
          )
        )
        .orderBy(desc(comments.updatedAt), desc(comments.id))
        .limit(limit + 1);

      const commentCount = await db.$count(
        comments,
        eq(comments.videoId, videoId)
      );

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
        commentCount,
      };
    }),
  remove: protectedProcedure
    .input(z.object({ commentId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.data;
      const { commentId } = input;

      const [deletedComment] = await db
        .delete(comments)
        .where(and(eq(comments.id, commentId), eq(comments.userId, userId)))
        .returning();

      if (!deletedComment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message:
            "Comment not found or you do not have permission to delete it.",
        });
      }

      return deletedComment;
    }),
});
