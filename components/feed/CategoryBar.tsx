"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { ErrorBoundary } from "react-error-boundary";

import { trpc } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import FilterCarousel from "@/components/feed/FilterCarousel";

interface CategoryBarProps {
  categoryId?: string;
}

const CategoryBar = ({ categoryId }: CategoryBarProps) => {
  const router = useRouter();
  const [categories] = trpc.categories.getMany.useSuspenseQuery();

  const data = categories.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  const onSelect = (value: string | null) => {
    const url = new URL(window.location.href);
    if (value) {
      url.searchParams.set("categoryId", value);
    } else {
      url.searchParams.delete("categoryId");
    }

    router.push(url.toString());
  };

  return (
    <Suspense
      fallback={<FilterCarousel isLoading data={[]} onSelect={() => {}} />}
    >
      <ErrorBoundary fallback={<Button>Something Went Wrong</Button>}>
        <FilterCarousel onSelect={onSelect} value={categoryId} data={data} />
      </ErrorBoundary>
    </Suspense>
  );
};

export default CategoryBar;
