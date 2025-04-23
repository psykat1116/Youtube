import { DEFAULT_LIMIT } from "@/constant";
import { HydrateClient, trpc } from "@/trpc/server";
import PlaylistView from "@/components/playlist/PlaylistView";

export const dynamic = "force-dynamic";

const PlaylistsPage = async () => {
  void trpc.playlists.getMany.prefetchInfinite({ limit: DEFAULT_LIMIT });

  return (
    <HydrateClient>
      <PlaylistView />
    </HydrateClient>
  );
};

export default PlaylistsPage;
