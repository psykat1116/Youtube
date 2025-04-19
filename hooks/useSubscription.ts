import { trpc } from "@/trpc/client";
import { toast } from "sonner";
import { useClerk } from "@clerk/nextjs";

interface UseSubscriptionProps {
  userId: string;
  isSubscribed: boolean;
  fromVideoId?: string;
}

export const useSubscription = ({
  userId,
  fromVideoId,
  isSubscribed,
}: UseSubscriptionProps) => {
  const { openSignIn } = useClerk();
  const utils = trpc.useUtils();

  const subscribe = trpc.subscriptions.create.useMutation({
    onSuccess: () => {
      if (isSubscribed) {
        toast.success("Unsubscribed successfully!");
      } else {
        toast.success("Subscribed successfully!");
      }
      //TODO: Reinvalidate subscription.getMany, user.getOne

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
