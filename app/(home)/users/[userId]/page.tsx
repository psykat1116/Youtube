import UserView from "@/components/user/UserView";
import { DEFAULT_LIMIT } from "@/constant";
import { HydrateClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

interface UserIdPageProps {
  params: Promise<{
    userId: string;
  }>;
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
