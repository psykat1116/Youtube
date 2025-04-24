import HistoryVideoSection from "@/components/playlist/HistoryVideoSection";

const HistoryView = () => {
  return (
    <div className="max-w-[2400px] mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
      <div>
        <h1 className="text-2xl font-bold">History</h1>
        <p className="text-xs text-muted-foreground">
          This is a list of all the videos you have played in the past.
        </p>
      </div>
      <HistoryVideoSection />
    </div>
  );
};

export default HistoryView;
