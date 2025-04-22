import { UploadDropzone } from "@/lib/uploadthing";
import ResponsiveModal from "./ResponsiveModal";
import { trpc } from "@/trpc/client";

interface ThumbnailUploadModalProps {
  videoId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ThumbnailUploadModal = ({
  videoId,
  onOpenChange,
  open,
}: ThumbnailUploadModalProps) => {
  const utils = trpc.useUtils();

  const onUploadComplete = () => {
    utils.studio.getOne.invalidate({ id: videoId });
    utils.studio.getMany.invalidate();
    onOpenChange(false);
  };

  return (
    <ResponsiveModal
      title="Upload a thumbnail"
      description="Upload a thumbnail for your video."
      onOpenChange={onOpenChange}
      open={open}
    >
      <UploadDropzone
        endpoint="thumbnailUploader"
        input={{ videoId }}
        onClientUploadComplete={onUploadComplete}
      />
    </ResponsiveModal>
  );
};

export default ThumbnailUploadModal;
