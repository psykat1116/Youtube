"use client";

import { Suspense } from "react";
import { Loader } from "lucide-react";
import { ErrorBoundary } from "react-error-boundary";

import { trpc } from "@/trpc/client";
import { DEFAULT_LIMIT } from "@/constant";
import InfiniteScroll from "@/components/InfiniteScroll";
import CommentItem from "@/components/comment/CommentItem";
import CommentForm from "@/components/comment/CommentForm";

interface CommentSectionProps {
  videoId: string;
}

const CommentSectionSkeleton = () => {
  return (
    <div className="mt-6 flex justify-center items-center">
      <Loader className="text-muted-foreground size-7 animate-spin" />
    </div>
  );
};

const CommentSection = ({ videoId }: CommentSectionProps) => {
  const [comments, query] = trpc.comments.getMany.useSuspenseInfiniteQuery(
    {
      videoId,
      limit: DEFAULT_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  return (
    <Suspense fallback={<CommentSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error...</p>}>
        <div className="mt-6">
          <div className="flex flex-col gap-6">
            <h1 className="font-semibold">
              {comments.pages[0].commentCount} Comments
            </h1>
            <CommentForm onSuccess={() => {}} videoId={videoId} />
          </div>
          <div className="flex flex-col gap-4 mt-2">
            {comments.pages.flatMap((page) => page.items).length === 0 && (
              <div className="flex bg-gray-100 rounded-md items-center h-30 justify-center flex-col">
                <p className="text-sm uppercase font-semibold">No Comments</p>
              </div>
            )}
            {comments.pages
              .flatMap((page) => page.items)
              .map((comment) => (
                <CommentItem key={comment.id} comment={comment} />
              ))}
            <InfiniteScroll
              hasNextPage={query.hasNextPage}
              isFetchingNextPage={query.isFetchingNextPage}
              fetchNextPage={query.fetchNextPage}
            />
          </div>
        </div>
      </ErrorBoundary>
    </Suspense>
  );
};

export default CommentSection;
