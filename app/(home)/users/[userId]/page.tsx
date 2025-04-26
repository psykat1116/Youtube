import { Metadata } from "next";

import { DEFAULT_LIMIT } from "@/constant";
import UserView from "@/components/user/UserView";
import { HydrateClient, trpc, ServerCaller } from "@/trpc/server";

export const dynamic = "force-dynamic";

interface UserIdPageProps {
  params: Promise<{
    userId: string;
  }>;
}

export async function generateMetadata({
  params,
}: UserIdPageProps): Promise<Metadata> {
  const { userId } = await params;
  const user = await ServerCaller.users.getOne({ id: userId });

  if (!user) {
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
            url: "https://github.com/psykat1116/Youtube/blob/master/public/Opengraph.png?raw=true",
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
    title: `${user.name} | Youtube`,
    description: `Welcome to ${user.name}'s channel`,
    authors: {
      name: user.name,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/users/${user.id}`,
    },
    openGraph: {
      title: `${user.name}`,
      description: `Welcome to ${user.name}'s channel`,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/users/${user.id}`,
      siteName: process.env.NEXT_PUBLIC_SITE_URL,
      locale: "en_US",
      type: "website",
      images: [
        {
          url: user.imageUrl,
          width: 1200,
          height: 630,
          alt: user.name,
          type: "image/*",
        },
      ],
    },
    creator: user.name,
    applicationName: "Youtube",
  };
}

const UserIdPage = async ({ params }: UserIdPageProps) => {
  const { userId } = await params;

  void trpc.users.getOne.prefetch({ id: userId });
  void trpc.videos.getMany.prefetchInfinite({ userId, limit: DEFAULT_LIMIT });

  return (
    <HydrateClient>
      <UserView userId={userId} />
    </HydrateClient>
  );
};

export default UserIdPage;
