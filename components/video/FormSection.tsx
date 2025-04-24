"use client";

import {
  Copy,
  Lock,
  Info,
  Trash,
  Globe,
  Loader,
  CircleX,
  CopyCheck,
  ImagePlus,
  RotateCcw,
  RefreshCcw,
  CircleCheck,
} from "lucide-react";
import { z } from "zod";
import Link from "next/link";
import { toast } from "sonner";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { ErrorBoundary } from "react-error-boundary";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from "@/components/ui/select";
import { trpc } from "@/trpc/client";
import { Input } from "@/components/ui/input";
import { snakeCaseToTitle } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { videoUpdateSchema } from "@/db/schema";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import VideoPlayer from "@/components/video/VideoPlayer";
import ThumbnailUploadModal from "@/components/modal/ThumbnailUploadModal";

interface FormSectionProps {
  videoId: string;
}

const FormSectionSkeleton = () => {
  return (
    <div className="h-full mb-5">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Video Details</h1>
          <p className="text-xs text-muted-foreground">
            Manage your video details
          </p>
        </div>
        <div className="flex items-center gap-x-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="w-8 h-8" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="space-y-8 lg:col-span-3">
          <div className="flex flex-col gap-y-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="flex flex-col gap-y-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-30 w-full" />
          </div>
          <div className="flex flex-col gap-y-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-20 w-32" />
          </div>
        </div>
        <div className="flex flex-col gap-y-2 lg:col-span-2 bg-[#f9f9f9] rounded-xl overflow-hidden h-fit pb-4">
          <div className="aspect-video overflow-hidden relative">
            <Skeleton className="h-full w-full" />
          </div>
          <div className="px-4 py-2 flex flex-col">
            <div className="flex justify-between flex-col gap-y-2">
              <Skeleton className="h-5 w-16" />
              <div className="flex items-center gap-x-2 border pl-2 border-black/50 rounded-sm">
                <Skeleton className="h-8 w-32" />
              </div>
            </div>
          </div>
          <div className="px-4 flex justify-between w-full gap-y-2 items-center flex-col">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-16" />
          </div>
          <div className="flex flex-col gap-y-4 p-4">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

const FormSection = ({ videoId }: FormSectionProps) => {
  const router = useRouter();
  const utils = trpc.useUtils();
  const fullUrl = `${
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  }/watch/${videoId}`;
  const [isCopied, setIsCopied] = useState(false);
  const [thumbnailOpen, setThumbnailOpen] = useState(false);

  const [video] = trpc.studio.getOne.useSuspenseQuery({
    id: videoId,
  });
  const [categories] = trpc.categories.getMany.useSuspenseQuery();

  const update = trpc.videos.update.useMutation({
    onSuccess: () => {
      toast.success("Video Updated Successfully");
      utils.studio.getMany.invalidate();
      utils.studio.getOne.invalidate({ id: videoId });
      utils.videos.getMany.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const remove = trpc.videos.remove.useMutation({
    onSuccess: () => {
      router.push("/studio");
      utils.studio.getMany.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const revaildate = trpc.videos.revalidate.useMutation({
    onSuccess: () => {
      utils.studio.getMany.invalidate();
      utils.studio.getOne.invalidate({ id: videoId });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const restoreThumbnail = trpc.videos.restore.useMutation({
    onSuccess: () => {
      utils.studio.getMany.invalidate();
      utils.studio.getOne.invalidate({ id: videoId });
      toast.success("Thumnail Restored Successfully");
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
        <ThumbnailUploadModal
          onOpenChange={setThumbnailOpen}
          open={thumbnailOpen}
          videoId={videoId}
        />
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
                  onClick={() => remove.mutate({ id: videoId })}
                  disabled={remove.isPending}
                >
                  <Trash className="size-4" />
                  Delete
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => revaildate.mutate({ id: videoId })}
                  disabled={revaildate.isPending}
                >
                  <RefreshCcw className="size-4" />
                  Refresh
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-end text-sm text-red-600 gap-x-2 mb-4">
              <Info size={20}/>
              Video Will Be Deleted Automatically after 24 hours of upload
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
                <FormField
                  control={form.control}
                  name="thumbnailUrl"
                  render={() => (
                    <FormItem>
                      <FormLabel>Thumbnail</FormLabel>
                      <FormControl>
                        <div className="relative group flex gap-x-2">
                          <Image
                            height={150}
                            width={350}
                            alt="Thumnail"
                            src={video.thumbnailUrl ?? "/Thumbnail.svg"}
                            className="aspect-video object-cover p-0.5 border border-dashed border-neutral-400"
                          />
                          <div className="flex flex-col gap-y-2 group-hover:opacity-100 opacity-0 transition-all duration-300">
                            <Button
                              className="flex items-center justify-between"
                              onClick={() => setThumbnailOpen(true)}
                              variant="secondary"
                            >
                              <ImagePlus className="size-4 mr-1" />
                              Change
                            </Button>
                            <Button
                              onClick={() =>
                                restoreThumbnail.mutate({ id: videoId })
                              }
                              variant="secondary"
                              className="flex items-center justify-between"
                            >
                              <RotateCcw className="size-4 mr-1" />
                              Restore
                            </Button>
                          </div>
                        </div>
                      </FormControl>
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
                      <Link prefetch href={`/watch/${video.id}`}>
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
                <div className="flex flex-col gap-y-4 p-4">
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
              </div>
            </div>
          </form>
        </Form>
      </ErrorBoundary>
    </Suspense>
  );
};

export default FormSection;
