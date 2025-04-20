import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const subscriptionRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        userId: z.string().uuid(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id: currentUserId } = ctx.data;
      const { userId } = input;

      if (currentUserId === userId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You cannot subscribe/unsubscribe to yourself.",
        });
      }

      const [existingSubscription] = await db
        .select()
        .from(subscriptions)
        .where(
          and(
            eq(subscriptions.viewer, currentUserId),
            eq(subscriptions.creator, userId)
          )
        );

      if (existingSubscription) {
        const [deletedSubscription] = await db
          .delete(subscriptions)
          .where(
            and(
              eq(subscriptions.viewer, currentUserId),
              eq(subscriptions.creator, userId)
            )
          )
          .returning();

        return deletedSubscription;
      }

      const [newSubscription] = await db
        .insert(subscriptions)
        .values({
          viewer: currentUserId,
          creator: userId,
        })
        .returning();

      return newSubscription;
    }),
});
