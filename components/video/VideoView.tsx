import FormSection from "@/components/video/FormSection";

interface VideoViewProps {
  videoId: string;
}

const VideoView = ({ videoId }: VideoViewProps) => {
  return (
    <div className="px-4 pt-1.5 max-w-screen-lg">
      <FormSection videoId={videoId} />
    </div>
  );
};

export default VideoView;
