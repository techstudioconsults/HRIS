import MainButton from "@/components/shared/button";
import { Add, SearchNormal1 } from "iconsax-reactjs";

// import Link from "next/link";

export const ResourcesHeader = () => {
  return (
    <div className="flex flex-col items-start justify-between pb-6 md:items-center lg:flex-row">
      <div className="py-3 text-left">
        <h4 className="">Resources</h4>
        <p className="">Resources</p>
      </div>

      <div className="hidden flex-col items-center gap-4 lg:flex lg:flex-row">
        {/* Search Input */}
        <div className="relative hidden w-full max-w-[240px] md:block">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <SearchNormal1 size="15" className="text-gray-400" variant="Outline" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="focus:ring-primary-500 block w-full rounded border-0 py-3 pr-4 pl-10 text-gray-900 ring-1 ring-gray-200 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
            // onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        <MainButton
          className="border-gray-75 text-black dark:text-white"
          variant="outline"
          isLeftIconVisible={true}
          icon={<Add />}
        >
          Create Folder
        </MainButton>
        <MainButton variant="primary" isLeftIconVisible={true} icon={<Add />}>
          Upload File
        </MainButton>
      </div>
    </div>
  );
};
