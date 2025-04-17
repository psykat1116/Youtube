import { eq } from "drizzle-orm";
import {
  VideoAssetCreatedWebhookEvent,
  VideoAssetErroredWebhookEvent,
  VideoAssetReadyWebhookEvent,
  VideoAssetTrackReadyWebhookEvent,
  VideoAssetDeletedWebhookEvent,
} from "@mux/mux-node/resources/webhooks";
import { db, mux } from "@/db";
import { videos } from "@/db/schema";
import { headers } from "next/headers";

type WebhookEvent =
  | VideoAssetCreatedWebhookEvent
  | VideoAssetErroredWebhookEvent
  | VideoAssetReadyWebhookEvent
  | VideoAssetTrackReadyWebhookEvent
  | VideoAssetDeletedWebhookEvent;

export async function POST(request: Request) {
  const SIGNING_SECRET = process.env.MUX_WEBHOOK_SECRET;
  if (!SIGNING_SECRET) {
    throw new Error("Missing MUX_WEBHOOK_SECRET environment variable");
  }

  const headersPayload = await headers();
  const muxSignature = headersPayload.get("mux-signature");

  if (!muxSignature) {
    return new Response("Missing Mux signature", { status: 401 });
  }

  const payload = await request.json();
  const body = JSON.stringify(payload);

  mux.webhooks.verifySignature(body, await headers(), SIGNING_SECRET);

  switch (payload.type as WebhookEvent["type"]) {
    case "video.asset.created": {
      const data = payload.data as VideoAssetCreatedWebhookEvent["data"];
      if (!data.upload_id) return new Response("No upload id", { status: 400 });

      await db
        .update(videos)
        .set({
          muxAssetId: data.id,
          muxStatus: data.status,
        })
        .where(eq(videos.muxUploadId, data.upload_id));

      break;
    }

    case "video.asset.ready": {
      const data = payload.data as VideoAssetReadyWebhookEvent["data"];
      if (!data.playback_ids)
        return new Response("No playback ids", { status: 400 });
      if (!data.upload_id) return new Response("No upload id", { status: 400 });

      const thumbnailUrl = `https://image.mux.com/${data.playback_ids[0].id}/thumbnail.jpg`;
      const previewUrl = `https://image.mux.com/${data.playback_ids[0].id}/animated.gif`;

      await db
        .update(videos)
        .set({
          muxPlaybackId: data.playback_ids[0].id,
          muxStatus: data.status,
          muxAssetId: data.id,
          thumbnailUrl,
          previewUrl,
          duration: data.duration ? Math.round(data.duration * 1000) : 0,
        })
        .where(eq(videos.muxUploadId, data.upload_id));

      break;
    }

    case "video.asset.errored": {
      const data = payload.data as VideoAssetErroredWebhookEvent["data"];
      if (!data.upload_id) return new Response("No upload id", { status: 400 });

      await db
        .update(videos)
        .set({
          muxStatus: data.status,
        })
        .where(eq(videos.muxUploadId, data.upload_id));

      break;
    }

    case "video.asset.deleted": {
      const data = payload.data as VideoAssetDeletedWebhookEvent["data"];
      if (!data.upload_id) return new Response("No upload id", { status: 400 });

      await db.delete(videos).where(eq(videos.muxUploadId, data.upload_id));

      break;
    }

    case "video.asset.track.ready": {
      const data = payload.data as VideoAssetTrackReadyWebhookEvent["data"] & {
        asset_id: string;
      };

      // Typescript doesn't know that data.asset_id is always present in this event
      const assetId = data.asset_id;
      const trackId = data.id;
      const status = data.status;

      if (!assetId) {
        return new Response("No asset id", { status: 400 });
      }

      await db
        .update(videos)
        .set({
          muxTrackId: trackId,
          muxTrackStatus: status,
        })
        .where(eq(videos.muxAssetId, assetId));

      break;
    }

    default:
      break;
  }

  return new Response("Webhook received", { status: 200 });
}
