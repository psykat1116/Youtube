import StudioView from "@/components/studio/StudioView";
import { DEFAULT_LIMIT } from "@/constant";
import { HydrateClient, trpc } from "@/trpc/server";

const StudioPage = async () => {
  void trpc.studio.getMany.prefetchInfinite({
    limit: DEFAULT_LIMIT,
  });

  return (
    <HydrateClient>
      <StudioView />
    </HydrateClient>
  );
};

export default StudioPage;
