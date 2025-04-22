import { Input } from "../ui/input";
import ResponsiveModal from "./ResponsiveModal";
import {
  Form,
  FormField,
  FormControl,
  FormLabel,
  FormMessage,
  FormItem,
} from "../ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

interface PlaylistCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PlaylistCreateModal = ({
  onOpenChange,
  open,
}: PlaylistCreateModalProps) => {
  const utils = trpc.useUtils();

  // TODO: ADD Message to restriction
  const formSchema = z.object({
    name: z.string().min(1).max(100),
    description: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const create = trpc.playlists.create.useMutation({
    onSuccess: () => {
      form.reset();
      onOpenChange(false);
      utils.playlists.getMany.invalidate();
    },
    onError: (error) => {
      if (error.data?.code === "CONFLICT") {
        form.setError("name", {
          type: "manual",
          message: error.message,
        });
      } else {
        toast.error(error.message);
      }
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    create.mutate(data);
  };

  return (
    <ResponsiveModal
      title="Create a playlist"
      description="Create a new playlist to organize your videos."
      open={open}
      onOpenChange={onOpenChange}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    min={1}
                    max={100}
                    placeholder="e.g. 'Personal', 'Music'"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    rows={10}
                    cols={20}
                    placeholder="e.g. 'This is my personal playlist'"
                    className="resize-none"
                    maxLength={500}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button disabled={create.isPending} type="submit">
              Create
            </Button>
          </div>
        </form>
      </Form>
    </ResponsiveModal>
  );
};

export default PlaylistCreateModal;
