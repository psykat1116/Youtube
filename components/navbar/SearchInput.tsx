"use client";
import { Suspense, useState } from "react";
import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "../ui/skeleton";

const SearchInput = () => {
  const router = useRouter();
  const query = useSearchParams().get("query") || "";
  const categoryId = useSearchParams().get("categoryId") || "";

  const [text, setText] = useState(query);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const url = new URL(
      "/search",
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    );

    url.searchParams.set("query", encodeURIComponent(text.trim()));
    if (categoryId) {
      url.searchParams.set("categoryId", categoryId);
    }

    setText("");
    router.push(url.toString());
  };

  return (
    <Suspense fallback={<Skeleton className="h-10 w-full" />}>
      <form onSubmit={handleSearch} className="flex w-full max-w-[600px]">
        <div className="relative w-full">
          <input
            type="text"
            value={text}
            placeholder="Search..."
            minLength={1}
            onChange={(e) => setText(e.target.value)}
            className="w-full pl-4 py-2 pr-12 rounded-l-full border focus:outline-none focus:border-blue-500"
          />
          {text !== "" && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setText("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full"
            >
              <X className="text-gray-500" />
            </Button>
          )}
        </div>
        <button
          disabled={text.length < 1}
          type="submit"
          className="px-5 py-2.5 bg-gray-100 border border-l-0 rounded-r-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Search className="size-5" />
        </button>
      </form>
    </Suspense>
  );
};

export default SearchInput;
