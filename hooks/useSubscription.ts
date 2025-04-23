import { trpc } from "@/trpc/client";
import { toast } from "sonner";
import { useClerk } from "@clerk/nextjs";

interface UseSubscriptionProps {
  userId: string;
  fromVideoId?: string;
}

export const useSubscription = ({
  userId,
  fromVideoId,
}: UseSubscriptionProps) => {
  const { openSignIn } = useClerk();
  const utils = trpc.useUtils();

  const subscribe = trpc.subscriptions.create.useMutation({
    onSuccess: () => {
      utils.videos.getSubscribed.invalidate();
      utils.users.getOne.invalidate({ id: userId });
      utils.subscriptions.getMany.invalidate();

      if (fromVideoId) {
        utils.videos.getOne.invalidate({ id: fromVideoId });
      }
    },
    onError: (error) => {
      if (error.data?.code === "UNAUTHORIZED") {
        openSignIn();
      } else {
        toast.error(error.message);
      }
    },
  });

  const isPending = subscribe.isPending;
  const onClick = () => {
    subscribe.mutate({ userId });
  };

  return {
    isPending,
    onClick,
  };
};
