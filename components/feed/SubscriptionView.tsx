import SubscriptionVideoSection from "@/components/feed/SubscriptionVideoSection";

const SubscriptionView = () => {
  return (
    <div className="max-w-[2400px] mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
      <div>
        <h1 className="text-2xl font-bold">Subscription</h1>
        <p className="text-xs text-muted-foreground">
          Videos from channels you are subscribed to. This section is updated
          regularly to reflect the latest uploads from your subscriptions.
        </p>
      </div>
      <SubscriptionVideoSection />
    </div>
  );
};

export default SubscriptionView;
