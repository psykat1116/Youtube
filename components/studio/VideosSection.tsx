"use client";

import { Suspense } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { ErrorBoundary } from "react-error-boundary";
import {
  CircleCheck,
  CircleX,
  Globe,
  Loader,
  Lock,
  TriangleAlert,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableHeader,
} from "@/components/ui/table";
import { trpc } from "@/trpc/client";
import { DEFAULT_LIMIT } from "@/constant";
import { snakeCaseToTitle } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import InfiniteScroll from "@/components/InfiniteScroll";
import VideoThumbnail from "@/components/studio/VideoThumbnail";

const VideoScetionSkeleton = () => {
  return (
    <div className="border-y">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-6 w-[510px]">Video</TableHead>
            <TableHead>Visibility</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Views</TableHead>
            <TableHead className="text-right">Comments</TableHead>
            <TableHead className="text-right pr-6">Likes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell className="pl-6">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-20 w-36" />
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-[100px]" />
                    <Skeleton className="h-3 w-[150px]" />
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-20" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-16" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="h-4 w-12 ml-auto" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="h-4 w-12 ml-auto" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="h-4 w-12 ml-auto pr-6" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const VideosSectionFallback = () => {
  return (
    <div className="border-y">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-6 w-[510px]">Video</TableHead>
            <TableHead>Visibility</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Views</TableHead>
            <TableHead className="text-right">Comments</TableHead>
            <TableHead className="text-right pr-6">Likes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell
              colSpan={7}
              className="text-center py-10 flex flex-col items-center justify-center gap-y-1"
            >
              <TriangleAlert size={60} className="fill-red-600 text-white" />
              <p className="text-2xl font-semibold">Something went wrong</p>
              <p className="text-xs text-muted-foreground">
                Please try again later or contact support
              </p>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

const VideosSection = () => {
  const router = useRouter();
  const [data, query] = trpc.studio.getMany.useSuspenseInfiniteQuery(
    {
      limit: DEFAULT_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  return (
    <Suspense fallback={<VideoScetionSkeleton />}>
      <ErrorBoundary fallback={<VideosSectionFallback />}>
        <div className="px-4">
          <div className="border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6 w-[480px]">Video</TableHead>
                  <TableHead>Visibility</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Comments</TableHead>
                  <TableHead>Likes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.pages.flatMap((page) => page.items).length === 0 && (
                  <TableRow className="">
                    <TableCell colSpan={7} className="text-center py-10">
                      <p className="text-sm capitalize">
                        You have no videos yet
                      </p>
                    </TableCell>
                  </TableRow>
                )}
                {data.pages
                  .flatMap((page) => page.items)
                  .map((video) => (
                    <TableRow
                      className="cursor-pointer"
                      key={video.id}
                      onClick={() => router.push(`/studio/video/${video.id}`)}
                    >
                      <TableCell className="pl-6 line-clamp-2">
                        <div className="flex items-center gap-4">
                          <div className="relative aspect-video w-36 shrink-0">
                            <VideoThumbnail
                              imageUrl={video.thumbnailUrl}
                              previewUrl={video.previewUrl}
                              title={video.title}
                              duration={video.duration || 0}
                            />
                          </div>
                          <div className="flex flex-col overflow-hidden gap-y-1">
                            <span className="text-sm line-clamp-1">
                              {video.title.slice(0, 30)}...
                            </span>
                            <span className="text-xs text-muted-foreground line-clamp-1">
                              {video.description?.slice(0, 30) ||
                                "No description"}
                              ...
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm truncate">
                        <div className="flex items-center gap-2">
                          {video.visibility === "private" ? (
                            <Lock className="text-muted-foreground size-4" />
                          ) : (
                            <Globe className="text-muted-foreground size-4" />
                          )}
                          {snakeCaseToTitle(video.visibility)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {video.muxStatus === "ready" && (
                            <CircleCheck className="fill-green-600 text-white size-5" />
                          )}
                          {video.muxStatus === "preparing" && (
                            <Loader className="text-blue-600 size-4 animate-spin" />
                          )}
                          {video.muxStatus === "errored" && (
                            <CircleX className="fill-red-600 text-white size-5" />
                          )}
                          {snakeCaseToTitle(video.muxStatus || "Error")}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm truncate">
                        {format(new Date(video.createdAt), "d MMM yyyy")}
                      </TableCell>
                      <TableCell className="text-center text-sm">
                        {Intl.NumberFormat("en-US", {
                          notation: "compact",
                        }).format(video.viewCount)}
                      </TableCell>
                      <TableCell className="text-center text-sm">
                        {Intl.NumberFormat("en-US", {
                          notation: "compact",
                        }).format(video.commentCount)}
                      </TableCell>
                      <TableCell className="text-center text-sm pr-6">
                        {Intl.NumberFormat("en-US", {
                          notation: "compact",
                        }).format(video.likeCount)}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
          <InfiniteScroll
            isManual
            hasNextPage={query.hasNextPage}
            isFetchingNextPage={query.isFetchingNextPage}
            fetchNextPage={query.fetchNextPage}
          />
        </div>
      </ErrorBoundary>
    </Suspense>
  );
};

export default VideosSection;
