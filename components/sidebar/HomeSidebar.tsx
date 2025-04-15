import React from "react";
import { Sidebar, SidebarContent } from "../ui/sidebar";
import MainSection from "./MainSection";
import { Separator } from "../ui/separator";
import PersonalSection from "./PersonalSection";

const HomeSidebar = () => {
  return (
    <Sidebar className="pt-16 z-40 border-none" collapsible="icon">
      <SidebarContent className="bg-background">
        <MainSection />
        <Separator className="px-4" />
        <PersonalSection />
      </SidebarContent>
    </Sidebar>
  );
};

export default HomeSidebar;
