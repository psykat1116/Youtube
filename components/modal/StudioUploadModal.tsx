"use client";
import { trpc } from "@/trpc/client";
import { Button } from "../ui/button";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import VideoUploadModal from "./VideoUploadModal";
import StudioUploader from "../studio/StudioUploader";

const StudioUploadModal = () => {
  const utils = trpc.useUtils();
  const create = trpc.videos.create.useMutation({
    onSuccess: () => {
      toast.success("Video created successfully!");
      utils.studio.getMany.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <>
      <VideoUploadModal
        title="Upload a video"
        open={!!create.data?.url}
        onOpenChange={() => create.reset()}
      >
        {create.data?.url ? (
          <StudioUploader endpoint={create.data?.url} onSuccess={() => {}} />
        ) : (
          <Loader2 />
        )}
      </VideoUploadModal>
      <Button
        variant="secondary"
        onClick={() => create.mutate()}
        disabled={create.isPending}
      >
        {create.isPending ? <Loader2 className="animate-spin" /> : <Plus />}
        Create
      </Button>
    </>
  );
};

export default StudioUploadModal;
