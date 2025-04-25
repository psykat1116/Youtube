"use client";

import { toast } from "sonner";
import { Suspense } from "react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ErrorBoundary } from "react-error-boundary";

import { trpc } from "@/trpc/client";
import Error from "@/components/Error";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface PlayListHeaderProps {
  playlistId: string;
}

const PlayListHeaderSkeleton = () => {
  return (
    <div className="flex flex-col gap-y-2">
      <Skeleton className="h-6 w-24" />
      <Skeleton className="h-4 w-32" />
    </div>
  );
};

const PlayListHeader = ({ playlistId }: PlayListHeaderProps) => {
  const router = useRouter();
  const utils = trpc.useUtils();
  const [playlist] = trpc.playlists.getOne.useSuspenseQuery({
    playlistId,
  });
  const remove = trpc.playlists.remove.useMutation({
    onSuccess: () => {
      utils.playlists.getMany.invalidate();
      router.push("/playlists");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <Suspense fallback={<PlayListHeaderSkeleton />}>
      <ErrorBoundary fallback={<Error />}>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{playlist.name}</h1>
            <p className="text-xs text-muted-foreground">
              {playlist.description || "This playlist has no description."}
            </p>
          </div>
          <Button
            disabled={remove.isPending}
            onClick={() => remove.mutate({ playlistId })}
            variant="outline"
            size="icon"
            className="rounded-full"
          >
            <Trash2 />
          </Button>
        </div>
      </ErrorBoundary>
    </Suspense>
  );
};

export default PlayListHeader;
