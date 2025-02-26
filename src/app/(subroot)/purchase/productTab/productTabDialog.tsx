// ui
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";

const ProductTabDialog = ({
  trigger,
  children,
}: {
  trigger: React.ReactNode;
  children: React.ReactNode;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="w-full bg-white text-black z-[110] max-h-[90vh] overflow-y-scroll md:max-h-[50vh] md:max-w-[80vw] lg:max-h-[90vh] lg:max-w-[986px] p-8">
       
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default ProductTabDialog;

