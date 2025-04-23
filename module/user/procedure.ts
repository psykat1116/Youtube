import { db } from "@/db";
import { subscriptions, users, videos } from "@/db/schema";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { eq, getTableColumns, inArray, isNotNull } from "drizzle-orm";

export const usersRouter = createTRPCRouter({
  getOne: baseProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      const { clerkId } = ctx;
      let userId;

      const [user] = await db
        .select()
        .from(users)
        .where(inArray(users.clerkId, clerkId ? [clerkId] : []));

      if (user) {
        userId = user.id;
      }

      // ? Common Table Expressions (CTE) to get the user subscription
      const userSubscription = db.$with("user_subscription").as(
        db
          .select()
          .from(subscriptions)
          .where(inArray(subscriptions.viewer, userId ? [userId] : []))
      );

      const [existingUser] = await db
        .with(userSubscription)
        .select({
          ...getTableColumns(users),
          isSubscribed: isNotNull(userSubscription.viewer).mapWith(Boolean),
          videoCount: db.$count(videos, eq(videos.userId, users.id)),
          subscriberCount: db.$count(
            subscriptions,
            eq(subscriptions.creator, users.id)
          ),
        })
        .from(users)
        .leftJoin(userSubscription, eq(userSubscription.creator, users.id))
        .where(eq(users.id, input.id));

      if (!existingUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Video not found",
        });
      }

      return existingUser;
    }),
});
