import { TriangleAlert } from "lucide-react";

const Error = () => {
  return (
    <div className="flex items-center justify-center h-[28rem] flex-col gap-y-1">
      <TriangleAlert size={60} className="fill-red-600 text-white" />
      <p className="text-2xl font-semibold">Something went wrong</p>
      <p className="text-xs text-muted-foreground">
        Please try again later or contact support
      </p>
    </div>
  );
};

export default Error;
