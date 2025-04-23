import { Separator } from "@/components/ui/separator";
import UserSection from "@/components/user/UserSection";
import UserVideoSection from "@/components/user/UserVideoSection";

interface UserIdPageProps {
  userId: string;
}

const UserView = ({ userId }: UserIdPageProps) => {
  return (
    <div className="flex flex-col max-w-[1300px] px-4 pt-2.5 mx-auto mb-10 gap-y-6">
      <UserSection userId={userId} />
      <Separator />
      <UserVideoSection userId={userId} />
    </div>
  );
};

export default UserView;
