import { HydrateClient, trpc } from "@/trpc/server";
import PlaylistView from "@/components/playlist/PlaylistView";
import { DEFAULT_LIMIT } from "@/constant";

const PlaylistsPage = async () => {
  void trpc.playlists.getMany.prefetchInfinite({ limit: DEFAULT_LIMIT });
  
  return (
    <HydrateClient>
      <PlaylistView />
    </HydrateClient>
  );
};

export default PlaylistsPage;
