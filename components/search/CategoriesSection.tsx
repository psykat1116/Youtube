"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { ErrorBoundary } from "react-error-boundary";

import { trpc } from "@/trpc/client";
import FilterCarousel from "@/components/feed/FilterCarousel";

interface CategoriesSection {
  categoryId?: string;
}

const CategoriesSection = ({ categoryId }: CategoriesSection) => {
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
      <ErrorBoundary fallback={<p>Error...</p>}>
        <FilterCarousel onSelect={onSelect} value={categoryId} data={data} />
      </ErrorBoundary>
    </Suspense>
  );
};

export default CategoriesSection;
