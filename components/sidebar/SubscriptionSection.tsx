"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import Link from "next/link";
import { trpc } from "@/trpc/client";
import { DEFAULT_LIMIT } from "@/constant";
import { usePathname } from "next/navigation";
import UserAvatar from "../UserAvatar";
import { Skeleton } from "../ui/skeleton";
import { List } from "lucide-react";

const SubscriptionSectionSkeleton = () => {
  return (
    <>
      {[...Array(5)].map((_, index) => (
        <SidebarMenuItem key={index}>
          <SidebarMenuButton disabled>
            <Skeleton className="size-6 rounded-full shrink-0" />
            <Skeleton className="h-4 w-full" />
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </>
  );
};

const SubscriptionSection = () => {
  const pathname = usePathname();

  const { data, isLoading } = trpc.subscriptions.getMany.useInfiniteQuery(
    {
      limit: DEFAULT_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Subscriptions</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {isLoading && <SubscriptionSectionSkeleton />}
          {!isLoading &&
            data?.pages
              .flatMap((page) => page.items)
              .map((item) => (
                <SidebarMenuItem key={`${item.creator}-${item.user}`}>
                  <SidebarMenuButton
                    tooltip={item.user.name}
                    asChild
                    isActive={pathname === `/users/${item.user.id}`}
                  >
                    <Link
                      prefetch
                      href={`/users/${item.user.id}`}
                      className="flex itesm-center gap-4"
                    >
                      <UserAvatar
                        size="xs"
                        imageUrl={item.user.imageUrl}
                        name={item.user.name}
                      />
                      <span className="text-sm">{item.user.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
          {!isLoading && (
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === "/subscriptions"}
              >
                <Link
                  prefetch
                  href="/subscriptions"
                  className="flex items-center gap-4"
                >
                  <List className="size-4" />
                  <span className="text-sm">All Subscriptions</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default SubscriptionSection;
