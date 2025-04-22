"use client";

import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import PlaylistCreateModal from "../modal/PlaylistCreateModal";
import { useState } from "react";
import PlaylistSection from "./PlaylistSection";

const PlaylistView = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="max-w-[2400px] mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
      <PlaylistCreateModal onOpenChange={setOpen} open={open} />
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Playlists</h1>
          <p className="text-xs text-muted-foreground">
            Explore a collection of curated playlists featuring a variety of
            videos from different genres and themes. Discover new content and
            enjoy binge-watching your favorite topics.
          </p>
        </div>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          onClick={() => setOpen(true)}
        >
          <Plus />
        </Button>
      </div>
      <PlaylistSection />
    </div>
  );
};

export default PlaylistView;
