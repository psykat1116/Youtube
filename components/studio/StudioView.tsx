import { Info } from "lucide-react";

import VideosSection from "@/components/studio/VideosSection";

const StudioView = () => {
  return (
    <div className="flex flex-col gap-y-6 pt-1.5">
      <div className="px-4">
        <h1 className="text-2xl font-bold">Channel Content</h1>
        <p className="text-xs text-muted-foreground">
          Manage your channel content and videos
        </p>
      </div>
      <div className="flex items-center justify-end gap-x-2 px-4 text-sm text-red-600">
        <Info size={20} />
        <p>Video will be deleted automatically after 24 hours</p>
      </div>
      <VideosSection />
    </div>
  );
};

export default StudioView;
