import StudioLayout from "@/components/layout/StudioLayout";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return <StudioLayout>{children}</StudioLayout>;
};

export default Layout;
