"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import PlaylistSection from "@/components/playlist/PlaylistSection";
import PlaylistCreateModal from "@/components/modal/PlaylistCreateModal";

const PlaylistView = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="max-w-[2400px] mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
      <PlaylistCreateModal onOpenChange={setOpen} open={open} />
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Playlists</h1>
          <p className="text-xs text-muted-foreground">
            Create and manage your playlists. You can add songs, edit details,
            and share them with others.
          </p>
        </div>
        <Button variant="outline" onClick={() => setOpen(true)}>
          <Plus />
          Create
        </Button>
      </div>
      <PlaylistSection />
    </div>
  );
};

export default PlaylistView;
