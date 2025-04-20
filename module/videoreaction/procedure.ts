import { db } from "@/db";
import { videoReactions } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const videoReactionRouter = createTRPCRouter({
  like: protectedProcedure
    .input(
      z.object({
        videoId: z.string().uuid(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id: userId } = ctx.data;
      const { videoId } = input;

      const [existingReaction] = await db
        .select()
        .from(videoReactions)
        .where(
          and(
            eq(videoReactions.userId, userId),
            eq(videoReactions.videoId, videoId),
            eq(videoReactions.type, "like")
          )
        );

      if (existingReaction) {
        const [deletedReaction] = await db
          .delete(videoReactions)
          .where(
            and(
              eq(videoReactions.userId, userId),
              eq(videoReactions.videoId, videoId),
              eq(videoReactions.type, "like")
            )
          )
          .returning();

        return deletedReaction;
      }

      const [newReaction] = await db
        .insert(videoReactions)
        .values({
          userId,
          videoId,
          type: "like",
        })
        .onConflictDoUpdate({
          target: [videoReactions.userId, videoReactions.videoId],
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
        videoId: z.string().uuid(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id: userId } = ctx.data;
      const { videoId } = input;

      const [existingReaction] = await db
        .select()
        .from(videoReactions)
        .where(
          and(
            eq(videoReactions.userId, userId),
            eq(videoReactions.videoId, videoId),
            eq(videoReactions.type, "dislike")
          )
        );

      if (existingReaction) {
        const [deletedReaction] = await db
          .delete(videoReactions)
          .where(
            and(
              eq(videoReactions.userId, userId),
              eq(videoReactions.videoId, videoId),
              eq(videoReactions.type, "dislike")
            )
          )
          .returning();

        return deletedReaction;
      }

      const [newReaction] = await db
        .insert(videoReactions)
        .values({
          userId,
          videoId,
          type: "dislike",
        })
        .onConflictDoUpdate({
          target: [videoReactions.userId, videoReactions.videoId],
          set: {
            type: "dislike",
          },
        })
        .returning();

      return newReaction;
    }),
});
