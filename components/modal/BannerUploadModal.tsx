import { trpc } from "@/trpc/client";
import { UploadDropzone } from "@/lib/uploadthing";
import ResponsiveModal from "@/components/modal/ResponsiveModal";

interface BannerUploadModalProps {
  userId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BannerUploadModal = ({
  userId,
  onOpenChange,
  open,
}: BannerUploadModalProps) => {
  const utils = trpc.useUtils();

  const onUploadComplete = () => {
    utils.users.getOne.invalidate({ id: userId });
    onOpenChange(false);
  };

  return (
    <ResponsiveModal
      title="Upload a Banner"
      description="Upload a banner for your profile."
      onOpenChange={onOpenChange}
      open={open}
    >
      <UploadDropzone
        endpoint="bannerUploader"
        onClientUploadComplete={onUploadComplete}
      />
    </ResponsiveModal>
  );
};

export default BannerUploadModal;
