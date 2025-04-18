import { VideoGetOneOutput } from "@/types";
import { AlertTriangle } from "lucide-react";
import React from "react";

interface WatchBannerProps {
  status: VideoGetOneOutput["muxStatus"];
}

const WatchBanner = ({ status }: WatchBannerProps) => {
  if (status === "ready") return null;

  return (
    <div className="bg-yellow-500 py-3 px-4 rounded-b-xl flex items-center gap-2">
      <AlertTriangle className="size-4 text-black shrink-0" />
      <p className="text-xs md:text-sm font-medium text-black line-clamp-1">
        This video is currently being processed. Please check back later.
      </p>
    </div>
  );
};

export default WatchBanner;
