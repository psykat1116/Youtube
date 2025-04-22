import PlayListHeader from "./PlayListHeader";
import PlayListVideoSection from "./PlayListVideoSection";

interface PlayListVideoViewProps {
  playlistId: string;
}

const PlayListVideoView = ({ playlistId }: PlayListVideoViewProps) => {
  return (
    <div className="max-w-[2400px] mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
      <PlayListHeader playlistId={playlistId} />
      <PlayListVideoSection playlistId={playlistId} />
    </div>
  );
};

export default PlayListVideoView;
