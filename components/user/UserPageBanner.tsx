import { Edit2 } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import React, { useState } from "react";

import { cn } from "@/lib/utils";
import { UserGetOneOutput } from "@/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import BannerUploadModal from "@/components/modal/BannerUploadModal";

interface UserPageBannerProps {
  user: UserGetOneOutput;
}

export const UserPageBannerSkeleton = () => {
  return <Skeleton className="w-full max-h-[200px] h-[15vh] md:h-[25vh]" />;
};

const UserPageBanner = ({ user }: UserPageBannerProps) => {
  const { userId } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative group">
      <BannerUploadModal userId={user.id} onOpenChange={setOpen} open={open} />
      <div
        className={cn(
          "w-full max-h-[200px] h-[15vh] md:h-[25vh] bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl bg-gray-100",
          user.bannerUrl ? "bg-cover bg-center" : "bg-gray-100"
        )}
        style={{
          backgroundImage: user.bannerUrl
            ? `url(${user.bannerUrl})`
            : undefined,
        }}
      >
        {user.clerkId === userId && (
          <Button
            type="button"
            size="icon"
            className="absolute top-4 right-4 rounded-full bg-black/50 hover:bg-black/50 opaciity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onClick={() => setOpen(true)}
          >
            <Edit2 className="size-4 text-white" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default UserPageBanner;
