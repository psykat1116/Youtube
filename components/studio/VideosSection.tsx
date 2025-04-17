"use client";

import { DEFAULT_LIMIT } from "@/constant";
import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import InfiniteScroll from "../InfiniteScroll";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useRouter } from "next/navigation";
import VideoThumbnail from "./VideoThumbnail";
import { snakeCaseToTitle } from "@/lib/utils";
import { format } from "date-fns";
import {
  CircleCheck,
  CircleX,
  Globe,
  Loader,
  Lock,
} from "lucide-react";

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
    <Suspense fallback={<p>Loading</p>}>
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <div className="px-4">
          <div className="border">
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
                {data.pages
                  .flatMap((page) => page.items)
                  .map((video) => (
                    <TableRow
                      className="cursor-pointer"
                      key={video.id}
                      onClick={() => router.push(`/studio/videos/${video.id}`)}
                    >
                      <TableCell>
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
                              {video.title}
                            </span>
                            <span className="text-xs text-muted-foreground line-clamp-1">
                              {video.description || "No description"}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
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
                      <TableCell>views</TableCell>
                      <TableCell>comments</TableCell>
                      <TableCell>likes</TableCell>
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
