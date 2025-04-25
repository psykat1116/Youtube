"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { trpc } from "@/trpc/client";
import Error from "@/components/Error";
import { DEFAULT_LIMIT } from "@/constant";
import InfiniteScroll from "@/components/InfiniteScroll";
import VideoRowCard, {
  VideoRowCardSkeleton,
} from "@/components/video/VideoRowCard";
import VideoGridCard, {
  VideoGridCardSkeleton,
} from "@/components/video/VideoGridCard";

interface SuggestionSectionProps {
  videoId: string;
  isManual?: boolean;
}

const SuggestionSectionSkeleton = () => {
  return (
    <>
      <div className="hidden md:block space-y-3">
        {[...Array(8)].map((_, i) => (
          <VideoRowCardSkeleton key={i} size="compact" />
        ))}
      </div>
      <div className="block md:hidden space-y-10">
        {[...Array(8)].map((_, i) => (
          <VideoGridCardSkeleton key={i} />
        ))}
      </div>
    </>
  );
};

const SuggestionSection = ({ videoId, isManual }: SuggestionSectionProps) => {
  const [suggestions, query] =
    trpc.suggestions.getMany.useSuspenseInfiniteQuery(
      {
        videoId,
        limit: DEFAULT_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  return (
    <Suspense fallback={<SuggestionSectionSkeleton />}>
      <ErrorBoundary fallback={<Error />}>
        {suggestions.pages.flatMap((page) => page.items).length === 0 && (
          <div className="flex h-[50rem] bg-gray-100 rounded-md flex-col items-center justify-center">
            <p className="uppercase text-sm font-semibold">
              No Suggestions Found.
            </p>
            <p className="text-xs text-muted-foreground">
              Please check back later.
            </p>
          </div>
        )}
        <div className="hidden md:block space-y-3">
          {suggestions.pages
            .flatMap((page) => page.items)
            .map((video) => (
              <VideoRowCard key={video.id} data={video} size="compact" />
            ))}
        </div>
        <div className="block md:hidden space-y-10">
          {suggestions.pages
            .flatMap((page) => page.items)
            .map((video) => (
              <VideoGridCard key={video.id} data={video} />
            ))}
        </div>
        <InfiniteScroll
          isManual={isManual}
          hasNextPage={query.hasNextPage}
          isFetchingNextPage={query.isFetchingNextPage}
          fetchNextPage={query.fetchNextPage}
        />
      </ErrorBoundary>
    </Suspense>
  );
};

export default SuggestionSection;
