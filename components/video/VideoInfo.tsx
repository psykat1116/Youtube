import Link from "next/link";
import { useMemo } from "react";
import { formatDistanceToNow } from "date-fns";

import { VideoGetManyOutput } from "@/types";
import UserAvatar from "@/components/UserAvatar";
import UserInfo from "@/components/user/UserInfo";
import { Skeleton } from "@/components/ui/skeleton";
import WatchMenu from "@/components/watch/WatchMenu";

interface VideoInfoProps {
  data: VideoGetManyOutput["items"][number];
  onRemove?: () => void;
}

export const VideoInfoSkeleton = () => {
  return (
    <div className="flex gap-3">
      <Skeleton className="size-10 flex-shrink-0 rounded-full" />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-5 w-[90%]" />
        <Skeleton className="h-5 w-[70%]" />
      </div>
    </div>
  );
};

const VideoInfo = ({ data, onRemove }: VideoInfoProps) => {
  const compactViews = useMemo(() => {
    return Intl.NumberFormat("en-US", {
      notation: "compact",
    }).format(data.viewCount);
  }, [data.viewCount]);

  const compactDate = useMemo(() => {
    return formatDistanceToNow(data.createdAt, { addSuffix: true });
  }, [data.createdAt]);

  return (
    <div className="flex gap-3">
      <Link prefetch href={`/users/${data.user.id}`}>
        <UserAvatar imageUrl={data.user.imageUrl} name={data.user.name} />
      </Link>
      <div className="min-w-0 flex-1">
        <Link prefetch href={`/watch/${data.id}`}>
          <h3 className="font-medium line-clamp-1 text-base break-words">
            {data.title}
          </h3>
        </Link>
        <Link prefetch href={`/users/${data.user.id}`}>
          <UserInfo name={data.user.name} />
        </Link>
        <Link prefetch href={`/watch/${data.id}`}>
          <p className="text-xs text-gray-600 line-clamp-1">
            {compactViews} views • {compactDate}
          </p>
        </Link>
      </div>
      <div className="shrink-0">
        <WatchMenu videoId={data.id} onRemove={onRemove} />
      </div>
    </div>
  );
};

export default VideoInfo;
