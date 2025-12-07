import { Input } from "@workspace/ui/components/input";
import { MainButton, ReusableDialog } from "@workspace/ui/lib";
import { LucideSearch, X } from "lucide-react";
import { useState } from "react";

export const SearchDialog = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ReusableDialog
      hideClose
      trigger={
        <button aria-label="Open Search Dialog" className="border-neutral-dark-2 rounded-full border p-2">
          <LucideSearch size={20} />
        </button>
      }
      open={isOpen}
      onOpenChange={setIsOpen}
      className="top-[4rem] sm:max-w-[1240px] xl:top-[10rem] xl:rounded-[49px]"
    >
      <div className="flex items-center border-b">
        <LucideSearch size={28} />
        <Input className="mx-4 h-[46px] border-0 hover:border-0 hover:ring-0 focus:border-0 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none active:border-0 active:ring-0 active:outline-none" />
        <MainButton
          size={`icon`}
          isIconOnly
          icon={<X size={28} />}
          onClick={() => setIsOpen(false)}
          aria-label="Close Search Dialog"
          className={`shadow-none`}
        />
      </div>
    </ReusableDialog>
  );
};
