import { trpc } from "@/trpc/client";
import { DEFAULT_LIMIT } from "@/constant";
import { Button } from "@/components/ui/button";
import InfiniteScroll from "@/components/InfiniteScroll";
import ResponsiveModal from "@/components/modal/ResponsiveModal";

import { toast } from "sonner";
import { Loader, Square, SquareCheck } from "lucide-react";

interface PlaylistAddModalProps {
  open: boolean;
  videoId: string;
  onOpenChange: (open: boolean) => void;
}

const PlaylistAddModal = ({
  onOpenChange,
  open,
  videoId,
}: PlaylistAddModalProps) => {
  const utils = trpc.useUtils();
  const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } =
    trpc.playlists.getForVideo.useInfiniteQuery(
      {
        limit: DEFAULT_LIMIT,
        videoId,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        enabled: !!videoId && open,
      }
    );

  const add = trpc.playlists.addVideo.useMutation({
    onSuccess: (data) => {
      toast.success(`Video Added To ${data.name}`);
      utils.playlists.getMany.invalidate();
      utils.playlists.getForVideo.invalidate({ videoId });
      utils.playlists.getVideo.invalidate({ playlistId: data.playlistId });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const remove = trpc.playlists.removeVideo.useMutation({
    onSuccess: (data) => {
      toast.success(`Video Remove From ${data.name}`);
      utils.playlists.getMany.invalidate();
      utils.playlists.getForVideo.invalidate({ videoId });
      utils.playlists.getVideo.invalidate({ playlistId: data.playlistId });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <ResponsiveModal
      title="Add To Playlist"
      description="Save This Video To Your Playlist"
      open={open}
      onOpenChange={onOpenChange}
    >
      <div className="flex flex-col gap-2">
        {isLoading && (
          <div className="p-5 flex justify-center items-center">
            <Loader className="animate-spin size-5 text-muted-foreground" />
          </div>
        )}
        {!isLoading && !data?.pages.length && (
          <div className="flex justify-center items-center">
            No Playlists Found
          </div>
        )}
        {!isLoading &&
          data?.pages
            .flatMap((page) => page.items)
            .map((playlist) => (
              <Button
                key={playlist.id}
                variant="outline"
                className="w-full justify-start px-2 [&_svg]:size-5"
                size="lg"
                onClick={
                  playlist.containsVideo
                    ? () =>
                        remove.mutate({
                          videoId,
                          playlistId: playlist.id,
                          name: playlist.name,
                        })
                    : () =>
                        add.mutate({
                          videoId,
                          playlistId: playlist.id,
                          name: playlist.name,
                        })
                }
                disabled={
                  isFetchingNextPage || add.isPending || remove.isPending
                }
              >
                {playlist.containsVideo ? (
                  <SquareCheck className="mr-2 text-white bg-blue-600 " />
                ) : (
                  <Square className="mr-2" />
                )}
                {playlist.name}
              </Button>
            ))}
        {!isLoading && (
          <InfiniteScroll
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
            isManual
          />
        )}
      </div>
    </ResponsiveModal>
  );
};

export default PlaylistAddModal;
