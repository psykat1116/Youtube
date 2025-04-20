import WatchView from "@/components/watch/WatchView";
import { HydrateClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

interface VideoIDPageProps {
  params: Promise<{
    videoId: string;
  }>;
}

const VideoIDPage = async ({ params }: VideoIDPageProps) => {
  const { videoId } = await params;
  void trpc.videos.getOne.prefetch({ id: videoId });
  // TODO: change to prefetchInfiniteQuery when we have infinite scroll
  void trpc.comments.getMany.prefetchInfinite({ videoId, limit: 10 });

  return (
    <HydrateClient>
      <WatchView videoId={videoId} />
    </HydrateClient>
  );
};

export default VideoIDPage;
