import { db } from "@/db";
import { videos } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const videosRouter = createTRPCRouter({
  create: protectedProcedure.mutation(async ({ ctx }) => {
    const { id } = ctx.data;
    const [video] = await db
      .insert(videos)
      .values({
        userId: id,
        title: "Untitled",
      })
      .returning();

    return video;
  }),
});
