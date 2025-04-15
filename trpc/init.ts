import { cache } from "react";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db, ratelimit } from "@/db";
import { users } from "@/db/schema";

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

export const createTRPCContext = cache(async () => {
  const { userId } = await auth();
  return { clerkId: userId };
});

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const baseProcedure = t.procedure;
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const protectedProcedure = t.procedure.use(async function isAuthed(
  opts
) {
  const { ctx } = opts;
  if (!ctx.clerkId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Please Login To Continue.",
    });
  }

  const [data] = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, ctx.clerkId))
    .limit(1);

  if (!data) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Please Login To Continue.",
    });
  }

  const { success } = await ratelimit.limit(data.id);
  if (!success) {
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: "You are being rate limited.",
    });
  }

  return opts.next({
    ctx: {
      ...ctx,
      data,
    },
  });
});
