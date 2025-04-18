import { VideoGetOneOutput } from "@/types";
import React, { useMemo } from "react";
import WatchOwner from "./WatchOwner";
import WatchReactions from "./WatchReactions";
import WatchMenu from "./WatchMenu";
import WatchDescription from "./WatchDescription";
import { format, formatDistanceToNow } from "date-fns";

interface WatchTopRowProps {
  video: VideoGetOneOutput;
}

const WatchTopRow = ({ video }: WatchTopRowProps) => {
  const compactViews = useMemo(() => {
    return Intl.NumberFormat("en", {
      notation: "compact",
    }).format(172642716);
  }, []);
  const expandedViews = useMemo(() => {
    return Intl.NumberFormat("en", {
      notation: "standard",
    }).format(172642716);
  }, []);
  const compactDate = useMemo(() => {
    return formatDistanceToNow(video.createdAt, { addSuffix: true });
  }, [video.createdAt]);
  const expandedDate = useMemo(() => {
    return format(video.createdAt, "dd/MM/yyyy");
  }, [video.createdAt]);

  return (
    <div className="flex flex-col gap-4 mt-4">
      <h1 className="text-xl font-semibold">{video.title}</h1>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <WatchOwner user={video.user} videoId={video.id} />
        <div className="flex overflow-x-auto sm:min-w-[calc(50%-6px)] sm:justify-end sm:overflow-visible pb-2 -mb-2 sm:pb-0 sm:mb-0 gap-2">
          <WatchReactions />
          <WatchMenu videoId={video.id} variant="secondary" />
        </div>
      </div>
      <WatchDescription
        compactViews={compactViews}
        expandedViews={expandedViews}
        compactDate={compactDate}
        expandedDate={expandedDate}
        description={video.description}
      />
    </div>
  );
};

export default WatchTopRow;
