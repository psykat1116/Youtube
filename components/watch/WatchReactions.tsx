import React from "react";
import { Button } from "../ui/button";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";

// TODO: Add the actual video reaction state or prop
const WatchReactions = () => {
  const videoReaction: "like" | "dislike" = "like"; // This should be replaced with the actual state or prop that holds the video reaction

  return (
    <div className="flex items-center flex-none">
      <Button
        variant="secondary"
        className="rounded-l-full rounded-r-none gap-2 pr-4"
      >
        <ThumbsUp
          className={cn("size-5", videoReaction === "like" && "fill-black")}
        />
        {1}
      </Button>
      <Separator orientation="vertical" className="h-7" />
      <Button
        variant="secondary"
        className="rounded-l-none rounded-r-full pl-3"
      >
        <ThumbsDown
          className={cn("size-5", videoReaction !== "like" && "fill-black")}
        />
        {1}
      </Button>
    </div>
  );
};

export default WatchReactions;
