import { Sidebar, SidebarContent } from "../ui/sidebar";
import MainSection from "./MainSection";
import { Separator } from "../ui/separator";
import PersonalSection from "./PersonalSection";
import SubscriptionSection from "./SubscriptionSection";
import { SignedIn } from "@clerk/nextjs";

const HomeSidebar = () => {
  return (
    <Sidebar className="pt-16 z-40 border-none" collapsible="icon">
      <SidebarContent className="bg-background">
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
