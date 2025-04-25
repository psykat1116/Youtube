"use client";

import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { Plus } from "lucide-react";
import { ErrorBoundary } from "react-error-boundary";

import { trpc } from "@/trpc/client";
import Error from "@/components/Error";
import VideoGridCard, {
  VideoGridCardSkeleton,
} from "@/components/video/VideoGridCard";
import { DEFAULT_LIMIT } from "@/constant";
import { Button } from "@/components/ui/button";
import InfiniteScroll from "@/components/InfiniteScroll";

interface HomeVideoSectionProps {
  categoryId?: string;
}

const HomeVideoSectionSkeleton = () => {
  return (
    <div className="gap-4 gap-y-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 [@media(min-width:1920px)]:grid-cols-5 [@media(min-width:2200px)]:grid-cols-6">
      {[...Array(10)].map((_, index) => (
        <VideoGridCardSkeleton key={index} />
      ))}
    </div>
  );
};

const HomeVideoSection = ({ categoryId }: HomeVideoSectionProps) => {
  const [videos, query] = trpc.videos.getMany.useSuspenseInfiniteQuery(
    {
      categoryId,
      limit: DEFAULT_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  return (
    <Suspense key={categoryId} fallback={<HomeVideoSectionSkeleton />}>
      <ErrorBoundary fallback={<Error />}>
        {videos.pages.flatMap((page) => page.items).length === 0 && (
          <div className="flex flex-col justify-center items-center h-[28rem]">
            <Image src="/Empty.svg" alt="Logo" height={300} width={300} />
            <p className="uppercase text-xl font-semibold">No Videos</p>
            <Button asChild>
              <Link href="/studio" className="mt-6">
                <Plus />
                Upload Video
              </Link>
            </Button>
          </div>
        )}
        <div className="gap-4 gap-y-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 [@media(min-width:1920px)]:grid-cols-5 [@media(min-width:2200px)]:grid-cols-6">
          {videos.pages
            .flatMap((page) => page.items)
            .map((video) => (
              <VideoGridCard key={video.id} data={video} />
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

export default HomeVideoSection;
