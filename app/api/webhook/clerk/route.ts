import { db } from "@/db";
import { playlists, users } from "@/db/schema";

import { eq } from "drizzle-orm";
import { verifyWebhook } from "@clerk/nextjs/webhooks";

export async function POST(req: Request) {
  try {
    const evt = await verifyWebhook(req, {
      signingSecret: process.env.WEBHOOK_SECRET,
    });
    const eventType = evt.type;

    if (eventType === "user.created") {
      const data = evt.data;
      const [user] = await db
        .insert(users)
        .values({
          clerkId: data.id,
          name: `${data.first_name || "John"} ${data.last_name || "Doe"}`,
          imageUrl: data.image_url,
        })
        .returning();

      await db.insert(playlists).values({
        name: "Watch Later",
        userId: user.id,
        description: "A playlist for all the videos you want to watch later.",
      });
    } else if (eventType === "user.updated") {
      const data = evt.data;
      if (!data.id) {
        return new Response("User ID not found", { status: 400 });
      }

      await db
        .update(users)
        .set({
          name: `${data.first_name || "John"} ${data.last_name || "Doe"}`,
          imageUrl: data.image_url,
        })
        .where(eq(users.clerkId, data.id));
    } else if (eventType === "user.deleted") {
      const data = evt.data;
      if (!data.id) {
        return new Response("User ID not found", { status: 400 });
      }
      await db.delete(users).where(eq(users.clerkId, data.id));
    }

    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
