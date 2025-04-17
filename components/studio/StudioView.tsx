import VideosSection from "./VideosSection";

const StudioView = () => {
  return (
    <div className="flex flex-col gap-y-6 pt-1.5">
      <div className="px-4">
        <h1 className="text-2xl font-bold">Channel Content</h1>
        <p className="text-xs text-muted-foreground">
          Manage your channel contetn and videos
        </p>
      </div>
      <VideosSection />
    </div>
  );
};

export default StudioView;
