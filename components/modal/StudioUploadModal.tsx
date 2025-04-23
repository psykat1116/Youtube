"use client";

import { toast } from "sonner";
import { Loader, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { trpc } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import StudioUploader from "@/components/studio/StudioUploader";
import ResponsiveModal from "@/components/modal/ResponsiveModal";

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
      <ResponsiveModal
        title="Upload a video"
        description="Upload a video to your channel."
        open={!!create.data?.url}
        onOpenChange={() => create.reset()}
      >
        {create.data?.url ? (
          <StudioUploader endpoint={create.data?.url} onSuccess={onSuccess} />
        ) : (
          <Loader />
        )}
      </ResponsiveModal>
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
