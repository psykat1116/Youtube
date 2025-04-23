"use client";

import Link from "next/link";
import { toast } from "sonner";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { trpc } from "@/trpc/client";
import { DEFAULT_LIMIT } from "@/constant";
import InfiniteScroll from "@/components/InfiniteScroll";
import SubscriptionItem, { SubscriptionItemSkeleton } from "@/components/subscription/SubscriptionItem";

const SubscriptionsSectionSkeleton = () => {
  return (
    <div className="flex flex-col gap-4">
      {[...Array(10)].map((_, index) => (
        <SubscriptionItemSkeleton key={index} />
      ))}
    </div>
  );
};

const SubscriptionsSection = () => {
  const utils = trpc.useUtils();

  const [subscriptions, query] =
    trpc.subscriptions.getMany.useSuspenseInfiniteQuery(
      {
        limit: DEFAULT_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  const unsubscribe = trpc.subscriptions.create.useMutation({
    onSuccess: (data) => {
      utils.videos.getSubscribed.invalidate();
      utils.subscriptions.getMany.invalidate();
      utils.users.getOne.invalidate({ id: data.creator });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <Suspense fallback={<SubscriptionsSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error...</p>}>
        <div className="flex flex-col gap-4">
          {subscriptions.pages
            .flatMap((page) => page.items)
            .map((sub) => (
              <Link prefetch href={`/users/${sub.user.id}`} key={sub.creator}>
                <SubscriptionItem
                  name={sub.user.name}
                  imageUrl={sub.user.imageUrl}
                  subscriberCount={sub.user.subscriberCount}
                  onUnsubscribe={() => {
                    unsubscribe.mutate({ userId: sub.user.id });
                  }}
                  disabled={unsubscribe.isPending}
                />
              </Link>
            ))}
        </div>
        <InfiniteScroll
          hasNextPage={query.hasNextPage}
          fetchNextPage={query.fetchNextPage}
          isFetchingNextPage={query.isFetchingNextPage}
        />
      </ErrorBoundary>
    </Suspense>
  );
};

export default SubscriptionsSection;
