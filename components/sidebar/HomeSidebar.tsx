import Link from "next/link";
import Image from "next/image";
import { SignedIn } from "@clerk/nextjs";

import { Separator } from "@/components/ui/separator";
import MainSection from "@/components/sidebar/MainSection";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import PersonalSection from "@/components/sidebar/PersonalSection";
import SubscriptionSection from "@/components/sidebar/SubscriptionSection";

const HomeSidebar = () => {
  return (
    <Sidebar className="pt-16 z-40 border-none" collapsible="icon">
      <SidebarContent className="bg-background">
        <Link
          prefetch
          href="/"
          className="md:hidden items-center gap-1 flex px-4 pt-4"
        >
          <Image src="/Logo.png" alt="Logo" width={32} height={32} />
          <p className="text-xl font-semibold tracking-tight">Youtube</p>
        </Link>
        <MainSection />
        <Separator className="px-4" />
        <PersonalSection />
        <SignedIn>
          <>
            <Separator className="px-4" />
            <SubscriptionSection />
          </>
        </SignedIn>
      </SidebarContent>
    </Sidebar>
  );
};

export default HomeSidebar;
