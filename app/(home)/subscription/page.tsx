import { DEFAULT_LIMIT } from "@/constant";
import { HydrateClient, trpc } from "@/trpc/server";
import SubscriptionView from "@/components/home/SubscriptionView";

export const dynamic = "force-dynamic";

const SubscriptionPage = async () => {
  void trpc.videos.getSubscribed.prefetchInfinite({
    limit: DEFAULT_LIMIT,
  });

  return (
    <HydrateClient>
      <SubscriptionView />
    </HydrateClient>
  );
};

export default SubscriptionPage;
