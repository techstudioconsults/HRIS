import MainButton from "@/components/shared/button";
import { Info } from "lucide-react";

export const PayrollNotificationBanner = () => {
  return (
    <div className="flex w-full items-center justify-between bg-green-500 p-4 px-8">
      <p className="text-background flex max-w-5xl text-sm font-medium">
        <span>
          <Info className="mr-4 stroke-2" size={18} />
        </span>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Vitae alias suscipit accusantium ullam, facere
        laboriosam, non aspernatur iure inventore reiciendis quo fuga sapiente labore odio consequuntur quaerat
        perferendis nisi modi!
      </p>
      <div className="flex items-center gap-4">
        <MainButton variant="default" className="">
          Accept
        </MainButton>
        <MainButton variant="destructiveOutline">Decline</MainButton>
      </div>
    </div>
  );
};
