import LikedVideoSection from "./LikedVideoSection";

const LikedView = () => {
  return (
    <div className="max-w-[2400px] mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
      <div>
        <h1 className="text-2xl font-bold">Liked Videos</h1>
        <p className="text-xs text-muted-foreground">
          This is a list of all the videos you have liked. You can use this to
          find videos you have liked before and add them to your playlist.
        </p>
      </div>
      <LikedVideoSection />
    </div>
  );
};

export default LikedView;
