import { db } from "@/db";
import { commentReactions } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const commentReactionRouter = createTRPCRouter({
  like: protectedProcedure
    .input(
      z.object({
        commentId: z.string().uuid(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id: userId } = ctx.data;
      const { commentId } = input;

      const [existingReaction] = await db
        .select()
        .from(commentReactions)
        .where(
          and(
            eq(commentReactions.userId, userId),
            eq(commentReactions.commentId, commentId),
            eq(commentReactions.type, "like")
          )
        );

      if (existingReaction) {
        const [deletedReaction] = await db
          .delete(commentReactions)
          .where(
            and(
              eq(commentReactions.userId, userId),
              eq(commentReactions.commentId, commentId),
              eq(commentReactions.type, "like")
            )
          )
          .returning();

        return deletedReaction;
      }

      const [newReaction] = await db
        .insert(commentReactions)
        .values({
          userId,
          commentId,
          type: "like",
        })
        .onConflictDoUpdate({
          target: [commentReactions.userId, commentReactions.commentId],
          set: {
            type: "like",
          },
        })
        .returning();

      return newReaction;
    }),
  dislike: protectedProcedure
    .input(
      z.object({
        commentId: z.string().uuid(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id: userId } = ctx.data;
      const { commentId } = input;

      const [existingReaction] = await db
        .select()
        .from(commentReactions)
        .where(
          and(
            eq(commentReactions.userId, userId),
            eq(commentReactions.commentId, commentId),
            eq(commentReactions.type, "dislike")
          )
        );

      if (existingReaction) {
        const [deletedReaction] = await db
          .delete(commentReactions)
          .where(
            and(
              eq(commentReactions.userId, userId),
              eq(commentReactions.commentId, commentId),
              eq(commentReactions.type, "dislike")
            )
          )
          .returning();

        return deletedReaction;
      }

      const [newReaction] = await db
        .insert(commentReactions)
        .values({
          userId,
          commentId,
          type: "dislike",
        })
        .onConflictDoUpdate({
          target: [commentReactions.userId, commentReactions.commentId],
          set: {
            type: "dislike",
          },
        })
        .returning();

      return newReaction;
    }),
});
