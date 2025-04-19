import { createTRPCRouter } from "@/trpc/init";
import { categoriesRouter } from "@/module/categories/procedures";
import { studioRouter } from "@/module/studio/procedures";
import { videosRouter } from "@/module/videos/procedure";
import { viewRouter } from "@/module/view/procedure";
import { reactionRouter } from "@/module/reaction/procedure";
import { subscriptionRouter } from "@/module/subscription/procedure";

export const appRouter = createTRPCRouter({
  studio: studioRouter,
  videos: videosRouter,
  categories: categoriesRouter,
  views: viewRouter,
  reactions: reactionRouter,
  subscriptions: subscriptionRouter,
});

export type AppRouter = typeof appRouter;
