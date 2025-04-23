import { db } from "@/db";
import { subscriptions, users } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { and, desc, eq, getTableColumns, lt, or } from "drizzle-orm";

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
  getMany: protectedProcedure
    .input(
      z.object({
        cursor: z
          .object({
            creator: z.string().uuid(),
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
          ...getTableColumns(subscriptions),
          user: {
            ...getTableColumns(users),
            subscriberCount: db.$count(
              subscriptions,
              eq(subscriptions.creator, users.id)
            ),
          },
        })
        .from(subscriptions)
        .innerJoin(users, eq(users.id, subscriptions.creator))
        .where(
          and(
            eq(subscriptions.viewer, userId),
            cursor
              ? or(
                  lt(subscriptions.updatedAt, cursor.updatedAt),
                  and(
                    eq(subscriptions.updatedAt, cursor.updatedAt),
                    lt(subscriptions.creator, cursor.creator)
                  )
                )
              : undefined
          )
        )
        .orderBy(desc(subscriptions.updatedAt), desc(subscriptions.creator))
        .limit(limit + 1);

      const hasMore = data.length > limit;
      const items = hasMore ? data.slice(0, -1) : data;
      const lastItem = items[items.length - 1];
      const nextCursor = hasMore
        ? {
            creator: lastItem.creator,
            updatedAt: lastItem.updatedAt,
          }
        : null;

      return {
        items,
        nextCursor,
      };
    }),
});
