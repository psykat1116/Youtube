import { createTRPCRouter } from "@/trpc/init";
import { categoriesRouter } from "@/module/categories/procedures";
import { studioRouter } from "@/module/studio/procedures";
import { videosRouter } from "@/module/videos/procedure";
import { viewRouter } from "@/module/view/procedure";
import { videoReactionRouter } from "@/module/videoreaction/procedure";
import { subscriptionRouter } from "@/module/subscription/procedure";
import { commentsRouter } from "@/module/comments/procedure";
import { commentReactionRouter } from "@/module/commentreaction/procedure";
import { suggestionsRouter } from "@/module/suggestions/procedures";
import { searchRouter } from "@/module/search/procedures";
import { playlistRouter } from "@/module/playlist/procedure";
import { usersRouter } from "@/module/user/procedure";

export const appRouter = createTRPCRouter({
  studio: studioRouter,
  search: searchRouter,
  videos: videosRouter,
  categories: categoriesRouter,
  views: viewRouter,
  videoReactions: videoReactionRouter,
  subscriptions: subscriptionRouter,
  comments: commentsRouter,
  commentReactions: commentReactionRouter,
  suggestions: suggestionsRouter,
  playlists: playlistRouter,
  users: usersRouter,
});

export type AppRouter = typeof appRouter;
