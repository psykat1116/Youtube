import CategoryBar from "./CategoryBar";

interface HomeViewProps {
  categoryId?: string;
}

const HomeView = ({ categoryId }: HomeViewProps) => {
  return (
    <div className="max-w-[2440px] mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
      <CategoryBar categoryId={categoryId} />
    </div>
  );
};

export default HomeView;
