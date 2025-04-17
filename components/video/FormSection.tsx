"use client";

import { trpc } from "@/trpc/client";
import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  CircleCheck,
  CircleX,
  Copy,
  CopyCheck,
  Globe,
  Loader,
  Lock,
  Trash,
} from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "../ui/form";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "../ui/select";
import { videoUpdateSchema } from "@/db/schema";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";
import VideoPlayer from "./VideoPlayer";
import Link from "next/link";
import { snakeCaseToTitle } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface FormSectionProps {
  videoId: string;
}

const FormSectionSkeleton = () => {
  return <p>Loading..</p>;
};

const FormSection = ({ videoId }: FormSectionProps) => {
  const router = useRouter();
  const utils = trpc.useUtils();
  const fullUrl = `${
    process.env.VERCEL_URL || "http://localhost:3000"
  }/video/${videoId}`;
  const [isCopied, setIsCopied] = useState(false);

  const [video] = trpc.studio.getOne.useSuspenseQuery({
    id: videoId,
  });
  const [categories] = trpc.categories.getMany.useSuspenseQuery();

  const update = trpc.videos.update.useMutation({
    onSuccess: () => {
      utils.studio.getMany.invalidate();
      utils.studio.getOne.invalidate({ id: videoId });
      toast.success("Video updated successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const remove = trpc.videos.remove.useMutation({
    onSuccess: () => {
      router.push("/studio");
      utils.studio.getMany.invalidate();
      toast.success("Video Deleted Successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const form = useForm<z.infer<typeof videoUpdateSchema>>({
    resolver: zodResolver(videoUpdateSchema),
    defaultValues: video,
  });

  const onSubmit = async (data: z.infer<typeof videoUpdateSchema>) => {
    update.mutate(data);
  };

  const onCopy = () => {
    navigator.clipboard.writeText(fullUrl).then(() => {
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    });
  };

  return (
    <Suspense fallback={<FormSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error...</p>}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="h-full mb-5">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold">Video Details</h1>
                <p className="text-xs text-muted-foreground">
                  Manage your video details
                </p>
              </div>
              <div className="flex items-center gap-x-2">
                <Button type="submit" disabled={update.isPending}>
                  Save
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => remove.mutate({ id: videoId })}
                  disabled={remove.isPending}
                >
                  <Trash className="size-4" />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <div className="space-y-8 lg:col-span-3">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Title
                        {/**ADD AI GENERATED TITLE */}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Add a title to your video"
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
                      <FormLabel>
                        Description
                        {/**TODO: ADD AI GENRERATED DESCRIPTION */}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          value={field.value || ""}
                          className="resize-none pr-10 h-40"
                          placeholder="Add a description to your video"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/** TODO: ADD THUMBNAIL FIELD */}
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value || undefined}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent className="w-full">
                            {categories.map((c) => (
                              <SelectItem key={c.id} value={c.id}>
                                {c.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="visibility"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Visibility</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value || undefined}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Visibility" />
                          </SelectTrigger>
                          <SelectContent className="w-full">
                            <SelectItem value="public">
                              <div className="flex items-center gap-1">
                                <Globe className="size-4 mr-2" />
                                Public
                              </div>
                            </SelectItem>
                            <SelectItem value="private">
                              <div className="flex items-center gap-1">
                                <Lock className="size-4 mr-2" />
                                Private
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col gap-y-2 lg:col-span-2 bg-[#f9f9f9] rounded-xl overflow-hidden h-fit pb-4">
                <div className="aspect-video overflow-hidden relative">
                  <VideoPlayer
                    playbackId={video.muxPlaybackId}
                    posterUrl={video.thumbnailUrl}
                  />
                </div>
                <div className="px-4 py-2 flex flex-col">
                  <div className="flex justify-between flex-col gap-y-2">
                    <p className="text-muted-foreground text-sm">Video URL</p>
                    <div className="flex items-center gap-x-2 border pl-2 border-black/50 rounded-sm">
                      <Link href={`/videos/${video.id}`}>
                        <p className="line-clamp-1 text-sm text-blue-500">
                          {fullUrl}
                        </p>
                      </Link>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="shrink-0"
                        onClick={onCopy}
                        disabled={isCopied}
                      >
                        {isCopied ? <CopyCheck /> : <Copy />}
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="px-4 flex justify-between w-full gap-y-2 items-center flex-col">
                  <div className="flex items-center justify-between gap-x-1 w-full">
                    <p className="text-muted-foreground text-sm">
                      Video status
                    </p>
                    <div className="flex items-center gap-1">
                      {video.muxStatus === "ready" && (
                        <CircleCheck className="text-white fill-green-500 size-5" />
                      )}
                      {video.muxStatus === "preparing" && (
                        <Loader className="animate-spin text-blue-500 size-4" />
                      )}
                      {video.muxStatus === "errored" && (
                        <CircleX className="size-5 fill-red-500 text-white" />
                      )}
                      <p>{snakeCaseToTitle(video.muxStatus || "preparing")}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-x-1 w-full">
                    <p className="text-muted-foreground text-sm">
                      Track status
                    </p>
                    <div className="flex items-center gap-1">
                      {video.muxTrackStatus === "ready" && (
                        <CircleCheck className="text-white fill-green-500 size-5" />
                      )}
                      {video.muxTrackStatus === "preparing" && (
                        <Loader className="animate-spin text-blue-500 size-4" />
                      )}
                      {video.muxTrackStatus === "errored" && (
                        <CircleX className="size-5 fill-red-500 text-white" />
                      )}
                      {snakeCaseToTitle(video.muxTrackStatus || "no_subtitles")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </ErrorBoundary>
    </Suspense>
  );
};

export default FormSection;
