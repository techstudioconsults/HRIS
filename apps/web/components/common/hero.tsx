import { LucideSearch } from 'lucide-react';
import { Navbar } from './navbar';

interface HeroProperties {
  title: string;
  lastUpdated?: string;
  searchPlaceholder?: string;
  showSearch?: boolean;
}

export const Hero = ({
  title,
  lastUpdated,
  searchPlaceholder = 'Search for policy, data..',
  showSearch = true,
}: HeroProperties) => {
  return (
    <section className="relative min-h-[355px] pt-32 pb-16 px-6 md:px-12 bg-[url('/images/hero-bg.svg')] bg-cover bg-center overflow-hidden">
      <Navbar />

      <div className="max-w-7xl mx-auto text-center relative z-10 flex flex-col items-center">
        <h1 className="text-4xl md:text-[62px] font-semibold text-[#232323] mb-6 tracking-tight leading-tight">
          {title}
        </h1>
        {lastUpdated && (
          <p className="text-gray-500 mb-12 font-medium text-lg leading-relaxed">Last Update: {lastUpdated}</p>
        )}

        {showSearch && (
          <div className="w-full max-w-2xl relative group bg-white rounded-lg">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
              <LucideSearch className="text-gray-400 group-focus-within:text-blue-500 transition-colors" size={22} />
            </div>
            <input
              type="text"
              placeholder={searchPlaceholder}
              className="w-full h-12 pl-16 pr-8 rounded-lg border-none bg-white shadow-md focus-visible:ring-2 focus-visible:ring-blue-400 text-lg text-gray-700"
            />
          </div>
        )}
      </div>
    </section>
  );
};
