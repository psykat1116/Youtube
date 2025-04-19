import { db } from "@/db";
import { views } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const viewRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        videoId: z.string().uuid(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id: userId } = ctx.data;
      const { videoId } = input;

      const [existingView] = await db
        .select()
        .from(views)
        .where(and(eq(views.userId, userId), eq(views.videoId, videoId)));

      if (existingView) {
        return existingView;
      }

      const [newView] = await db
        .insert(views)
        .values({
          userId,
          videoId,
        })
        .returning();

      return newView;
    }),
});
