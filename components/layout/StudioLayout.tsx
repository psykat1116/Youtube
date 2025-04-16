import { SidebarProvider } from "@/components/ui/sidebar";
import StudioNavbar from "../navbar/StudioNavbar";
import StudioSidebar from "../sidebar/StudioSidebar";

interface StudioLayoutProps {
  children: React.ReactNode;
}

const StudioLayout = ({ children }: StudioLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="w-full">
        <StudioNavbar />
        <div className="flex min-h-screen pt-[4rem]">
          <StudioSidebar />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default StudioLayout;
