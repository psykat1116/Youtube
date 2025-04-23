import { createTRPCRouter } from "@/trpc/init";
import { viewRouter } from "@/module/view/procedure";
import { usersRouter } from "@/module/user/procedure";
import { videosRouter } from "@/module/videos/procedure";
import { studioRouter } from "@/module/studio/procedures";
import { searchRouter } from "@/module/search/procedures";
import { commentsRouter } from "@/module/comments/procedure";
import { playlistRouter } from "@/module/playlist/procedure";
import { categoriesRouter } from "@/module/categories/procedures";
import { suggestionsRouter } from "@/module/suggestions/procedures";
import { subscriptionRouter } from "@/module/subscription/procedure";
import { videoReactionRouter } from "@/module/videoreaction/procedure";
import { commentReactionRouter } from "@/module/commentreaction/procedure";

export const appRouter = createTRPCRouter({
  views: viewRouter,
  users: usersRouter,
  studio: studioRouter,
  search: searchRouter,
  videos: videosRouter,
  comments: commentsRouter,
  playlists: playlistRouter,
  categories: categoriesRouter,
  suggestions: suggestionsRouter,
  subscriptions: subscriptionRouter,
  videoReactions: videoReactionRouter,
  commentReactions: commentReactionRouter,
});

export type AppRouter = typeof appRouter;
