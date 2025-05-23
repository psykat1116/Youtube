import Link from "next/link";

import PlayListInfo, {
  PlaylistInfoSkeleton,
} from "@/components/playlist/PlayListInfo";
import { PlaylistGetManyOutput } from "@/types";
import PlaylistThumbnail, {
  PlaylistThumbnailSkeleton,
} from "@/components/playlist/PlaylistThumbnail";

interface PlaylistGridCardProps {
  data: PlaylistGetManyOutput["items"][number];
}

export const PlaylistGridCardSkeleton = () => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <PlaylistThumbnailSkeleton />
      <PlaylistInfoSkeleton />
    </div>
  );
};

const PlaylistGridCard = ({ data }: PlaylistGridCardProps) => {
  return (
    <Link prefetch href={`playlists/${data.id}`}>
      <div className="flex flex-col gap-2 w-full group">
        <PlaylistThumbnail
          imageUrl={data.thumbnailUrl || "/Thumbnail.svg"}
          title={data.name}
          videoCount={data.videoCount}
        />
        <PlayListInfo data={data} />
      </div>
    </Link>
  );
};

export default PlaylistGridCard;
