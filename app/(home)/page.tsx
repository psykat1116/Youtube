import { trpc } from "@/trpc/server";

const Home = async () => {
  void trpc.hello.prefetch({ text: "from TRPC" });
  
  return <div className="">client says</div>;
};

export default Home;
