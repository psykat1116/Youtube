import PlayListVideoView from "@/components/playlist/PlayListVideoView";
import { DEFAULT_LIMIT } from "@/constant";
import { HydrateClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

interface PlayListIDPageProps {
  params: Promise<{
    playlistId: string;
  }>;
}

const PlayListIDPage = async ({ params }: PlayListIDPageProps) => {
  const { playlistId } = await params;
  
  void trpc.playlists.getVideo.prefetchInfinite({
    limit: DEFAULT_LIMIT,
    playlistId,
  });
  void trpc.playlists.getOne.prefetch({ playlistId });

  return (
    <HydrateClient>
      <PlayListVideoView playlistId={playlistId} />
    </HydrateClient>
  );
};

export default PlayListIDPage;
