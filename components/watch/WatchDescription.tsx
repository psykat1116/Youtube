import { cn } from "@/lib/utils";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface WatchDescriptionProps {
  compactViews: string;
  expandedViews: string;
  compactDate: string;
  expandedDate: string;
  description?: string | null;
}

const WatchDescription = ({
  compactViews,
  expandedViews,
  compactDate,
  expandedDate,
  description,
}: WatchDescriptionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className="bg-secondary/50 rounded-xl p-3 cursor-pointer hover:bg-secondary/70 transition"
      onClick={() => setIsExpanded((current) => !current)}
    >
      <div className="flex gap-2 text-sm mb-2">
        <span className="font-medium">
          {isExpanded ? expandedViews : compactViews} Views
        </span>
        <span className="font-medium">
          {isExpanded ? expandedDate : compactDate}
        </span>
      </div>
      <div className="relative">
        <p
          className={cn(
            "text-sm whitespace-pre-wrap",
            !isExpanded && "line-clamp-1"
          )}
        >
          {description || "No description"}
        </p>
        <div className="flex items-center gap-1 mt-4 text-sm font-medium">
          {isExpanded ? (
            <>
              Show Less <ChevronUp className="size-4" />
            </>
          ) : (
            <>
              Show More <ChevronDown className="size-4" />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WatchDescription;
