"use client";
import { trpc } from "@/trpc/client";
import { Button } from "../ui/button";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

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
    <Button
      variant="secondary"
      onClick={() => create.mutate()}
      disabled={create.isPending}
    >
      {create.isPending ? <Loader2 className="animate-spin" /> : <Plus />}
      Create
    </Button>
  );
};

export default StudioUploadModal;
