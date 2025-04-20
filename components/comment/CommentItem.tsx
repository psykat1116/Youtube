import { CommentGetManyOutput } from "@/types";
import Link from "next/link";
import UserAvatar from "../UserAvatar";
import { formatDistanceToNow } from "date-fns";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import {
  ChevronDown,
  ChevronUp,
  MessageSquare,
  MoreVertical,
  ThumbsDown,
  ThumbsUp,
  Trash2,
} from "lucide-react";
import { useAuth, useClerk } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { useState } from "react";
import CommentForm from "./CommentForm";
import CommentReplies from "./CommentReplies";

interface CommentItemProps {
  comment: CommentGetManyOutput["items"][number];
  variant?: "reply" | "comment";
}

const CommentItem = ({ comment, variant = "comment" }: CommentItemProps) => {
  const { userId } = useAuth();
  const utils = trpc.useUtils();
  const { openSignIn } = useClerk();

  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [isRepliesOpen, setIsRepliesOpen] = useState(false);

  const like = trpc.commentReactions.like.useMutation({
    onSuccess: () => {
      utils.comments.getMany.invalidate();
    },
    onError: (error) => {
      if (error.data?.code === "UNAUTHORIZED") {
        openSignIn();
      }
      toast.error(error.message);
    },
  });
  const dislike = trpc.commentReactions.dislike.useMutation({
    onSuccess: () => {
      utils.comments.getMany.invalidate();
    },
    onError: (error) => {
      if (error.data?.code === "UNAUTHORIZED") {
        openSignIn();
      }
      toast.error(error.message);
    },
  });
  const remove = trpc.comments.remove.useMutation({
    onSuccess: () => {
      utils.comments.getMany.invalidate();
      toast.success("Comment Deleted");
    },
    onError: (error) => {
      if (error.data?.code === "UNAUTHORIZED") {
        openSignIn();
      }
      toast.error(error.message);
    },
  });

  return (
    <div className="group">
      <div className="flex gap-4">
        <Link href={`/users/${comment.userId}`}>
          <UserAvatar
            size={variant === "comment" ? "lg" : "sm"}
            name={comment.user.name}
            imageUrl={comment.user.imageUrl}
          />
        </Link>
        <div className="flex-1 min-w-0">
          <Link href={`/users/${comment.userId}`}>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-medium text-sm pb-0.5">
                {comment.user.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
              </span>
            </div>
          </Link>
          <p className="text-sm">{comment.value}</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center">
              <Button
                className="size-8"
                size="icon"
                variant="ghost"
                disabled={like.isPending}
                onClick={() => like.mutate({ commentId: comment.id })}
              >
                <ThumbsUp
                  className={cn(
                    comment.userReaction === "like" && "fill-black"
                  )}
                />
              </Button>
              <span className="text-xs text-muted-foreground">
                {comment.likeCount}
              </span>
              <Button
                className="size-8"
                size="icon"
                variant="ghost"
                disabled={dislike.isPending}
                onClick={() => dislike.mutate({ commentId: comment.id })}
              >
                <ThumbsDown
                  className={cn(
                    comment.userReaction === "dislike" && "fill-black"
                  )}
                />
              </Button>
              <span className="text-xs text-muted-foreground">
                {comment.dislikeCount}
              </span>
            </div>
            {variant === "comment" && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8"
                onClick={() => setIsReplyOpen(true)}
              >
                Reply
              </Button>
            )}
          </div>
        </div>
        {(comment.user.clerkId === userId || variant === "comment") && (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger
              asChild
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <Button variant="ghost" size="icon" className="size-8">
                <MoreVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {variant === "comment" && (
                <DropdownMenuItem onClick={() => setIsReplyOpen(true)}>
                  <MessageSquare className="size-4" />
                  Reply
                </DropdownMenuItem>
              )}
              {comment.user.clerkId === userId && (
                <DropdownMenuItem
                  onClick={() => remove.mutate({ commentId: comment.id })}
                >
                  <Trash2 className="size-4" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      {isReplyOpen && variant === "comment" && (
        <div className="mt-4 pl-14">
          <CommentForm
            variant="reply"
            parentId={comment.id}
            videoId={comment.videoId}
            onSuccess={() => {
              setIsReplyOpen(false);
              setIsRepliesOpen(true);
            }}
            onCancel={() => setIsReplyOpen(false)}
          />
        </div>
      )}
      {comment.replyCount > 0 && variant === "comment" && (
        <div className="pl-14">
          <Button
            variant="tertiary"
            size="sm"
            onClick={() => setIsRepliesOpen((prev) => !prev)}
          >
            {isRepliesOpen ? <ChevronUp /> : <ChevronDown />}
            {comment.replyCount} {comment.replyCount > 1 ? "Replies" : "Reply"}
          </Button>
        </div>
      )}
      {comment.replyCount > 0 && variant === "comment" && isRepliesOpen && (
        <CommentReplies parentId={comment.id} videoId={comment.videoId} />
      )}
    </div>
  );
};

export default CommentItem;
