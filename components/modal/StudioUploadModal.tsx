"use client";

import { trpc } from "@/trpc/client";
import { Button } from "../ui/button";
import { Loader, Plus } from "lucide-react";
import { toast } from "sonner";
import VideoUploadModal from "./VideoUploadModal";
import StudioUploader from "../studio/StudioUploader";
import { useRouter } from "next/navigation";

const StudioUploadModal = () => {
  const router = useRouter();
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

  const onSuccess = () => {
    if (!create.data?.video.id) return;

    create.reset();
    router.push(`/studio/video/${create.data?.video.id}`);
  };

  return (
    <>
      <VideoUploadModal
        title="Upload a video"
        open={!!create.data?.url}
        onOpenChange={() => create.reset()}
      >
        {create.data?.url ? (
          <StudioUploader endpoint={create.data?.url} onSuccess={onSuccess} />
        ) : (
          <Loader />
        )}
      </VideoUploadModal>
      <Button
        variant="secondary"
        onClick={() => create.mutate()}
        disabled={create.isPending}
      >
        {create.isPending ? <Loader className="animate-spin" /> : <Plus />}
        Create
      </Button>
    </>
  );
};

export default StudioUploadModal;
