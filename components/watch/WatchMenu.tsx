import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import PlaylistAddModal from "@/components/modal/PlaylistAddModal";

import { toast } from "sonner";
import { useState } from "react";
import {
  Clock5,
  Forward,
  ListPlus,
  MoreVertical,
  Ban,
  Trash2,
} from "lucide-react";
import { useClerk, useUser } from "@clerk/nextjs";

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
  const clerk = useClerk();
  const { isSignedIn } = useUser();
  const [open, setOpen] = useState(false);

  const handleShare = () => {
    const fullUrl = `${
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    }/watch/${videoId}`;

    navigator.clipboard.writeText(fullUrl).then(() => {
      toast.success("Link Copied");
    });
  };

  return (
    <>
      <PlaylistAddModal onOpenChange={setOpen} open={open} videoId={videoId} />
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
            <Forward className="mr-2 size-4" />
            Share
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => clerk.openSignIn()}>
            <Clock5 className="mr-2 size-4" />
            Save To Watch Later
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              if (!isSignedIn) {
                return clerk.openSignIn();
              }
              setOpen(true);
            }}
          >
            <ListPlus className="mr-2 size-4" />
            Save To Playlist
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              if (!isSignedIn) {
                return clerk.openSignIn();
              }
              // TODO: Add to not interested
            }}
          >
            <Ban className="mr-2 size-4" />
            Not Interested
          </DropdownMenuItem>
          {onRemove && (
            <DropdownMenuItem onClick={onRemove}>
              <Trash2 className="mr-2 size-4" />
              Remove
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default WatchMenu;
