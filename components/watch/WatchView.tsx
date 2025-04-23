import WatchSection from "@/components/watch/WatchSection";
import CommentSection from "@/components/watch/CommentSection";
import SuggestionSection from "@/components/watch/SuggestionSection";

interface WatchViewProps {
  videoId: string;
}

const WatchView = ({ videoId }: WatchViewProps) => {
  return (
    <div className="flex flex-col max-w-[1700px] mx-auto p-2.5 px-4 mb-10">
      <div className="flex flex-col xl:flex-row gap-6">
        <div className="flex-1 min-w-0">
          <WatchSection videoId={videoId} />
          <div className="xl:hidden block mt-4">
            <SuggestionSection videoId={videoId} isManual />
          </div>
          <CommentSection videoId={videoId} />
        </div>
        <div className="hidden xl:block w-full xl:w-[380px] 2xl:w-[460px] shrink-1">
          <SuggestionSection videoId={videoId} />
        </div>
      </div>
    </div>
  );
};

export default WatchView;
