import Link from "next/link";
import Image from "next/image";

import AuthButton from "@/components/auth/AuthButton";
import { SidebarTrigger } from "@/components/ui/sidebar";
import SearchInput from "@/components/navbar/SearchInput";

const HomeNavbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white flex items-center px-2 pr-5 z-50">
      <div className="flex items-center gap-4 w-full">
        <div className="flex items-center flex-shrink-0">
          <SidebarTrigger />
          <Link
            prefetch
            href="/"
            className="p-4 md:flex items-center gap-1 hidden"
          >
            <Image src="/Logo.png" alt="Logo" width={32} height={32} />
            <p className="text-xl font-semibold tracking-tight">Youtube</p>
          </Link>
        </div>
        <div className="flex-1 flex justify-center max-w-[717px] mx-auto">
          <SearchInput />
        </div>
        <div className="flex-shrink-0 items-center flex gap-4">
          <AuthButton />
        </div>
      </div>
    </nav>
  );
};

export default HomeNavbar;
