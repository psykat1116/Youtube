import { DEFAULT_LIMIT } from "@/constant";
import { HydrateClient, trpc } from "@/trpc/server";
import SubscriptionsView from "@/components/subscription/SubscriptionsView";

export const dynamic = "force-dynamic";

const SubscriptionPage = async () => {
  void trpc.subscriptions.getMany.prefetchInfinite({
    limit: DEFAULT_LIMIT,
  });

  return (
    <HydrateClient>
      <SubscriptionsView />
    </HydrateClient>
  );
};

export default SubscriptionPage;
