import UserAvatar from "../UserAvatar";
import { useUser, useClerk } from "@clerk/nextjs";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { trpc } from "@/trpc/client";

interface CommentFormProps {
  videoId: string;
  onSuccess: () => void;
  variant?: "reply" | "comment";
  parentId?: string;
  onCancel?: () => void;
}

const CommentForm = ({
  videoId,
  onSuccess,
  variant = "comment",
  parentId,
  onCancel,
}: CommentFormProps) => {
  const { user } = useUser();
  const clerk = useClerk();
  const utils = trpc.useUtils();

  const create = trpc.comments.create.useMutation({
    onSuccess: () => {
      utils.comments.getMany.invalidate({ videoId });
      utils.comments.getMany.invalidate({ videoId, parentId });
      form.reset();
      onSuccess?.();
    },
    onError: (error) => {
      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
      } else {
        toast.error(error.message);
      }
    },
  });

  const formSchema = z.object({
    value: z.string().min(1, "Comment Cannot Be Empty"),
    videoId: z.string().uuid(),
    parentId: z.string().uuid().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      parentId,
      videoId,
      value: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    create.mutate(data);
  };

  const handleCancel = () => {
    form.reset();
    onCancel?.();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex gap-4 group"
      >
        <UserAvatar
          size="lg"
          imageUrl={user?.imageUrl || "/Placeholder.svg"}
          name={user?.username || "User"}
        />
        <div className="flex-1">
          <FormField
            name="value"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    minLength={1}
                    {...field}
                    placeholder={
                      variant === "comment"
                        ? "Add a comment..."
                        : "Reply to this comment..."
                    }
                    className="resize-none bg-transparent overflow-hidden min-h-0"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end mt-2 gap-2">
            {onCancel && (
              <Button variant="ghost" type="button" onClick={handleCancel}>
                Cancel
              </Button>
            )}
            <Button disabled={create.isPending} type="submit" size="sm">
              {variant === "comment" ? "Comment" : "Reply"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default CommentForm;
