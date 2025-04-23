import { DEFAULT_LIMIT } from "@/constant";
import { HydrateClient, trpc } from "@/trpc/server";
import WatchView from "@/components/watch/WatchView";

export const dynamic = "force-dynamic";

interface VideoIDPageProps {
  params: Promise<{
    videoId: string;
  }>;
}

const VideoIDPage = async ({ params }: VideoIDPageProps) => {
  const { videoId } = await params;
  
  void trpc.videos.getOne.prefetch({ id: videoId });
  void trpc.comments.getMany.prefetchInfinite({ videoId, limit: DEFAULT_LIMIT });
  void trpc.suggestions.getMany.prefetchInfinite({ videoId, limit: DEFAULT_LIMIT });

  return (
    <HydrateClient>
      <WatchView videoId={videoId} />
    </HydrateClient>
  );
};

export default VideoIDPage;
