import TrendingView from "@/components/home/TrendingView";
import { DEFAULT_LIMIT } from "@/constant";
import { HydrateClient, trpc } from "@/trpc/server";

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
