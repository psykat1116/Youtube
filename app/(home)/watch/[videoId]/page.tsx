import { Metadata } from "next";

import { DEFAULT_LIMIT } from "@/constant";
import WatchView from "@/components/watch/WatchView";
import { HydrateClient, trpc, ServerCaller } from "@/trpc/server";

export const dynamic = "force-dynamic";

interface VideoIDPageProps {
  params: Promise<{
    videoId: string;
  }>;
}

export async function generateMetadata({
  params,
}: VideoIDPageProps): Promise<Metadata> {
  const { videoId } = await params;
  const video = await ServerCaller.videos.getOne({ id: videoId });

  if (!video) {
    return {
      title: "Youtube | Home of Videos and Music You Love",
      description:
        "Enjoy the videos and music you love, upload original content, and share it all with friends, family, and the world on YouTube.",
      authors: {
        name: "Saikat Samanta",
        url: "https://portfolio-one-gilt-34.vercel.app/",
      },
      creator: "Saikat Samanta",
      applicationName: "Youtube",
      openGraph: {
        title: "Youtube",
        description:
          "Enjoy the videos and music you love, upload original content, and share it all with friends, family, and the world on YouTube.",
        url: "https://youtube-ten-amber.vercel.app",
        siteName: "Youtube",
        locale: "en_US",
        type: "website",
        images: [
          {
            url: "https://youtube-ten-amber.vercel.app/Opengraph.png",
            width: 1200,
            height: 630,
            alt: "Youtube",
            type: "image/png",
          },
        ],
      },
    };
  }

  return {
    title: video.title,
    description: video.description,
    authors: {
      name: video.user.name,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/users/${video.user.id}`,
    },
    openGraph: {
      title: video.title,
      description: video.description || "Watch videos on our platform",
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/watch/${videoId}`,
      siteName: process.env.NEXT_PUBLIC_SITE_URL,
      locale: "en_US",
      type: "website",
      images: [
        {
          url:
            video.thumbnailUrl ||
            "https://youtube-ten-amber.vercel.app/Logo.png",
          width: 1200,
          height: 630,
          alt: video.title,
        },
      ],
    },
    creator: video.user.name,
  };
}

const VideoIDPage = async ({ params }: VideoIDPageProps) => {
  const { videoId } = await params;

  void trpc.videos.getOne.prefetch({ id: videoId });
  void trpc.comments.getMany.prefetchInfinite({
    videoId,
    limit: DEFAULT_LIMIT,
  });
  void trpc.suggestions.getMany.prefetchInfinite({
    videoId,
    limit: DEFAULT_LIMIT,
  });

  return (
    <HydrateClient>
      <WatchView videoId={videoId} />
    </HydrateClient>
  );
};

export default VideoIDPage;
