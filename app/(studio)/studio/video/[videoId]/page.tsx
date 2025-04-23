import { HydrateClient, trpc } from "@/trpc/server";
import VideoView from "@/components/video/VideoView";

export const dynamic = "force-dynamic";

interface VideoIdPageProps {
  params: Promise<{
    videoId: string;
  }>;
}

const VideoIdPage = async ({ params }: VideoIdPageProps) => {
  const { videoId } = await params;
  
  void trpc.studio.getOne.prefetch({ id: videoId });
  void trpc.categories.getMany.prefetch();

  return (
    <HydrateClient>
      <VideoView videoId={videoId} />
    </HydrateClient>
  );
};

export default VideoIdPage;
