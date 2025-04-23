import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BellRing, UserPlus } from "lucide-react";

interface SubscriptionButtonProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled: boolean;
  isSubscribed: boolean;
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
}

const SubscriptionButton = ({
  onClick,
  disabled,
  isSubscribed,
  className,
  size,
}: SubscriptionButtonProps) => {
  return (
    <Button
      size={size}
      variant={isSubscribed ? "secondary" : "default"}
      className={cn("rounded-full", className)}
      onClick={onClick}
      disabled={disabled}
    >
      {isSubscribed ? <BellRing className="fill-black" /> : <UserPlus />}
      {isSubscribed ? "Unsubscribe" : "Subscribe"}
    </Button>
  );
};

export default SubscriptionButton;
