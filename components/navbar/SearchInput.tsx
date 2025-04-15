"use client";
import { useState } from "react";
import { Search } from "lucide-react";

const SearchInput = () => {
  const [text, setText] = useState("");

  return (
    <form className="flex w-full max-w-[600px]">
      <div className="relative w-full">
        <input
          type="text"
          value={text}
          placeholder="Search..."
          onChange={(e) => setText(e.target.value)}
          className="w-full pl-4 py-2 pr-12 rounded-l-full border focus:outline-none focus:border-blue-500"
        />
        {/* TODO: Add a clear button or icon inside the input field */}
      </div>
      <button
        type="submit"
        className="px-5 py-2.5 bg-gray-100 border border-l-0 rounded-r-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Search className="size-5" />
      </button>
    </form>
  );
};

export default SearchInput;
