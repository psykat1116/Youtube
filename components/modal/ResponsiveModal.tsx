import { useIsMobile } from "@/hooks/use-mobile";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "../ui/drawer";

interface ResponsiveModalProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
}

const ResponsiveModal = ({
  children,
  onOpenChange,
  open,
  title,
}: ResponsiveModalProps) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
          </DrawerHeader>
          {children}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default ResponsiveModal;
