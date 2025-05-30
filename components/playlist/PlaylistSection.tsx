import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { trpc } from "@/trpc/client";
import Error from "@/components/Error";
import { DEFAULT_LIMIT } from "@/constant";
import InfiniteScroll from "@/components/InfiniteScroll";
import PlaylistGridCard, {
  PlaylistGridCardSkeleton,
} from "@/components/playlist/PlaylistGridCard";

const PlaylistSectionSkeleton = () => {
  return (
    <div className="gap-4 gap-y-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 [@media(min-width:1920px)]:grid-cols-5 [@media(min-width:2200px)]:grid-cols-6">
      {[...Array(10)].map((_, index) => (
        <PlaylistGridCardSkeleton key={index} />
      ))}
    </div>
  );
};

const PlaylistSection = () => {
  const [playlists, query] = trpc.playlists.getMany.useSuspenseInfiniteQuery(
    {
      limit: DEFAULT_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  return (
    <Suspense fallback={<PlaylistSectionSkeleton />}>
      <ErrorBoundary fallback={<Error />}>
        {playlists.pages.flatMap((page) => page.items).length === 0 && (
          <div className="flex justify-center items-center h-[20rem] flex-col">
            <p className="text-xl font-semibold uppercase">
              No playlists found
            </p>
            <p className="text-muted-foreground text-sm">
              Create a new playlist to get started.
            </p>
          </div>
        )}
        <div className="gap-4 gap-y-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 [@media(min-width:1920px)]:grid-cols-5 [@media(min-width:2200px)]:grid-cols-6">
          {playlists.pages
            .flatMap((page) => page.items)
            .map((playlist) => (
              <PlaylistGridCard data={playlist} key={playlist.id} />
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

export default PlaylistSection;
