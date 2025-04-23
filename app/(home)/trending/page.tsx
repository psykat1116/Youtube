import { DEFAULT_LIMIT } from "@/constant";
import { HydrateClient, trpc } from "@/trpc/server";
import TrendingView from "@/components/feed/TrendingView";

export const dynamic = "force-dynamic";

const TrendingPage = async () => {
  void trpc.videos.getTrending.prefetchInfinite({
    limit: DEFAULT_LIMIT,
  });

  return (
    <HydrateClient>
      <TrendingView />
    </HydrateClient>
  );
};

export default TrendingPage;
