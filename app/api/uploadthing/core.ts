import { db } from "@/db";
import { users, videos } from "@/db/schema";

import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { UploadThingError, UTApi } from "uploadthing/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  thumbnailUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .input(z.object({ videoId: z.string().uuid() }))
    .middleware(async ({ input }) => {
      const { userId: clerkId } = await auth();
      if (!clerkId) throw new UploadThingError("Unauthorized");

      const [user] = await db
        .select({
          id: users.id,
        })
        .from(users)
        .where(eq(users.clerkId, clerkId))
        .limit(1);

      if (!user) throw new UploadThingError("User not found");
      const userId = user.id;

      const [existingVideo] = await db
        .select({
          thumbnailKey: videos.thumbnailKey,
        })
        .from(videos)
        .where(and(eq(videos.id, input.videoId), eq(videos.userId, userId)));

      if (!existingVideo) throw new UploadThingError("Video not found");
      if (existingVideo.thumbnailKey) {
        const utapi = new UTApi();
        await utapi.deleteFiles([existingVideo.thumbnailKey]);

        await db
          .update(videos)
          .set({ thumbnailKey: null, thumbnailUrl: null })
          .where(and(eq(videos.id, input.videoId), eq(videos.userId, userId)));
      }

      return { userId, ...input };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await db
        .update(videos)
        .set({
          thumbnailUrl: file.ufsUrl,
          thumbnailKey: file.key,
        })
        .where(
          and(
            eq(videos.id, metadata.videoId),
            eq(videos.userId, metadata.userId)
          )
        );

      return { uploadedBy: metadata.userId };
    }),
  bannerUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const { userId: clerkId } = await auth();
      if (!clerkId) throw new UploadThingError("Unauthorized");

      const [currentUser] = await db
        .select()
        .from(users)
        .where(eq(users.clerkId, clerkId))
        .limit(1);

      if (!currentUser) throw new UploadThingError("User not found");

      if (currentUser.bannerKey) {
        const utapi = new UTApi();
        await utapi.deleteFiles([currentUser.bannerKey]);

        await db
          .update(users)
          .set({ bannerKey: null, bannerUrl: null })
          .where(eq(users.id, currentUser.id));
      }

      return { userId: currentUser.id };
    })
    .onUploadComplete(async ({ file, metadata }) => {
      await db
        .update(users)
        .set({
          bannerUrl: file.ufsUrl,
          bannerKey: file.key,
        })
        .where(eq(users.id, metadata.userId));

      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
