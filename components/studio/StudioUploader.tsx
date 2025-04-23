import MuxUploader, {
  MuxUploaderDrop,
  MuxUploaderStatus,
  MuxUploaderProgress,
  MuxUploaderFileSelect,
} from "@mux/mux-uploader-react";
import { Upload } from "lucide-react";

import { Button } from "@/components/ui/button";

interface StudioUploaderProps {
  endpoint?: string | null;
  onSuccess: () => void;
}

const StudioUploader = ({ endpoint, onSuccess }: StudioUploaderProps) => {
  return (
    <div>
      <MuxUploader
        onSuccess={onSuccess}
        endpoint={endpoint}
        id="video-uploader"
        className="hidden group/uploader"
      />
      <MuxUploaderDrop muxUploader="video-uploader" className="group/drop">
        <div slot="heading" className="flex flex-col items-center gap-6">
          <div className="flex items-center justify-center gap-2 rounded-full bg-muted h-32 w-32">
            <Upload className="size-10 text-muted-foreground group/drop-[&[active]]:animate-bounce transition-all duration-300" />
          </div>
          <div className="flex flex-col gap-2 text-center">
            <p className="text-sm"> Drag and drop video files to upload </p>
            <p className="text-xs text-muted-foreground">
              Your videos will be private untill you publish them.
            </p>
          </div>
          <MuxUploaderFileSelect muxUploader="video-uploader">
            <Button type="button" className="rounded-full">
              Select Files
            </Button>
          </MuxUploaderFileSelect>
        </div>
        <span slot="separator" className="hidden" />
        <MuxUploaderStatus muxUploader="video-uploader" className="text-sm" />
        <MuxUploaderProgress
          muxUploader="video-uploader"
          className="text-sm"
          type="percentage"
        />
        <MuxUploaderProgress muxUploader="video-uploader" type="bar" />
      </MuxUploaderDrop>
    </div>
  );
};

export default StudioUploader;
