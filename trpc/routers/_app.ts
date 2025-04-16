import { createTRPCRouter } from "@/trpc/init";
import { categoriesRouter } from "@/module/categories/procedures";

export const appRouter = createTRPCRouter({
  categories: categoriesRouter,
});

export type AppRouter = typeof appRouter;
