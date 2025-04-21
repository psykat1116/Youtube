import React from "react";
import CategoriesSection from "./CategoriesSection";
import ResultSection from "./ResultSection";

interface SearchViewProps {
  query: string | undefined;
  categoryId: string | undefined;
}

const SearchView = ({ query, categoryId }: SearchViewProps) => {
  return (
    <div className="max-w-[1300px] mx-auto mb-10 flex flex-col gap-y-6 px-4 pt-2.5">
      <CategoriesSection categoryId={categoryId} />
      <ResultSection query={query} categoryId={categoryId} />
    </div>
  );
};

export default SearchView;
