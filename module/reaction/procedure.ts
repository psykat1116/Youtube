import { db } from "@/db";
import { reactions } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const reactionRouter = createTRPCRouter({
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
        .from(reactions)
        .where(
          and(
            eq(reactions.userId, userId),
            eq(reactions.videoId, videoId),
            eq(reactions.type, "like")
          )
        );

      if (existingReaction) {
        const [deletedReaction] = await db
          .delete(reactions)
          .where(
            and(
              eq(reactions.userId, userId),
              eq(reactions.videoId, videoId),
              eq(reactions.type, "like")
            )
          )
          .returning();

        return deletedReaction;
      }

      const [newReaction] = await db
        .insert(reactions)
        .values({
          userId,
          videoId,
          type: "like",
        })
        .onConflictDoUpdate({
          target: [reactions.userId, reactions.videoId],
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
        .from(reactions)
        .where(
          and(
            eq(reactions.userId, userId),
            eq(reactions.videoId, videoId),
            eq(reactions.type, "dislike")
          )
        );

      if (existingReaction) {
        const [deletedReaction] = await db
          .delete(reactions)
          .where(
            and(
              eq(reactions.userId, userId),
              eq(reactions.videoId, videoId),
              eq(reactions.type, "dislike")
            )
          )
          .returning();

        return deletedReaction;
      }

      const [newReaction] = await db
        .insert(reactions)
        .values({
          userId,
          videoId,
          type: "like",
        })
        .onConflictDoUpdate({
          target: [reactions.userId, reactions.videoId],
          set: {
            type: "dislike",
          },
        })
        .returning();

      return newReaction;
    }),
});
