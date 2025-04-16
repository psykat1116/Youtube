import { createTRPCRouter } from "@/trpc/init";
import { categoriesRouter } from "@/module/categories/procedures";
import { studioRouter } from "@/module/studio/procedures";
import { videosRouter } from "@/module/videos/procedure";

export const appRouter = createTRPCRouter({
  studio: studioRouter,
  videos: videosRouter,
  categories: categoriesRouter,
});

export type AppRouter = typeof appRouter;
