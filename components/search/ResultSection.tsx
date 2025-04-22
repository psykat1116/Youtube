"use client";

import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import VideoRowCard, { VideoRowCardSkeleton } from "../video/VideoRowCard";
import VideoGridCard, { VideoGridCardSkeleton } from "../video/VideoGridCard";
import InfiniteScroll from "../InfiniteScroll";
import { ErrorBoundary } from "react-error-boundary";
import { DEFAULT_LIMIT } from "@/constant";

interface ResultSectionProps {
  query: string | undefined;
  categoryId: string | undefined;
}

const ResultSectionSkeleton = () => {
  return (
    <div>
      <div className="hidden flex-col gap-4 md:flex">
        {[...Array(5)].map((_, index) => (
          <VideoRowCardSkeleton key={index} />
        ))}
      </div>
      <div className="flex flex-col gap-4 p-4 gap-y-10 pt-6 md:hidden">
        {[...Array(5)].map((_, index) => (
          <VideoGridCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};

const ResultSection = ({ query, categoryId }: ResultSectionProps) => {
  const [results, resultQuery] = trpc.search.getMany.useSuspenseInfiniteQuery(
    {
      query,
      categoryId,
      limit: DEFAULT_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  return (
    <Suspense
      key={`${query}-${categoryId}`}
      fallback={<ResultSectionSkeleton />}
    >
      <ErrorBoundary fallback={<p>Error</p>}>
        <div className="flex flex-col gap-4 gap-y-10 md:hidden">
          {results.pages
            .flatMap((page) => page.items)
            .map((item) => (
              <VideoGridCard key={item.id} data={item} />
            ))}
        </div>
        <div className="flex-col hidden md:flex gap-4">
          {results.pages
            .flatMap((page) => page.items)
            .map((item) => (
              <VideoRowCard key={item.id} data={item} />
            ))}
        </div>
        <InfiniteScroll
          hasNextPage={resultQuery.hasNextPage}
          isFetchingNextPage={resultQuery.isFetchingNextPage}
          fetchNextPage={resultQuery.fetchNextPage}
        />
      </ErrorBoundary>
    </Suspense>
  );
};

export default ResultSection;
