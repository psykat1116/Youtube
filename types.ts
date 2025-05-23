import { inferRouterOutputs } from "@trpc/server";

import { AppRouter } from "@/trpc/routers/_app";

export type VideoGetOneOutput =
  inferRouterOutputs<AppRouter>["videos"]["getOne"];

export type CommentGetManyOutput =
  inferRouterOutputs<AppRouter>["comments"]["getMany"];

export type VideoGetManyOutput =
  inferRouterOutputs<AppRouter>["suggestions"]["getMany"];

export type PlaylistGetManyOutput =
  inferRouterOutputs<AppRouter>["playlists"]["getMany"];

export type UserGetOneOutput = inferRouterOutputs<AppRouter>["users"]["getOne"];
