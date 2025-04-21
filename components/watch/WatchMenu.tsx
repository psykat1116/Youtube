import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { ListPlus, MoreVertical, Share, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface WatchMenuProps {
  videoId: string;
  variant?: "ghost" | "secondary";
  onRemove?: () => void;
}

const WatchMenu = ({
  videoId,
  variant = "ghost",
  onRemove,
}: WatchMenuProps) => {
  const handleShare = () => {
    const fullUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/watch/${videoId}`
      : `http://localhost:3000/watch/${videoId}`;

    navigator.clipboard.writeText(fullUrl).then(() => {
      toast.success("Link Copied");
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size="icon" className="rounded-full">
          <MoreVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <DropdownMenuItem onClick={handleShare}>
          <Share className="mr-2 size-4" />
          Share
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => {}}>
          <ListPlus className="mr-2 size-4" />
          Add To Playlist
        </DropdownMenuItem>
        {onRemove && (
          <DropdownMenuItem onClick={() => {}}>
            <Trash2 className="mr-2 size-4" />
            Remove
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default WatchMenu;
