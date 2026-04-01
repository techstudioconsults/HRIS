'use client';

import { Icon } from '@workspace/ui/lib/icons/icon';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const NotFoundPage = () => {
  const router = useRouter();

  return (
    <section className="grid h-screen w-full place-items-center bg-white">
      <div className="fixed top-0 left-0 min-h-dvh w-screen bg-white" />
      <div className="pointer-events-none relative z-30 flex flex-col gap-y-6">
        <p className="text-primary text-center font-medium uppercase sm:text-2xl md:text-3xl lg:text-4xl lg:font-bold xl:font-bold">
          Page Not Found
        </p>
        <Image
          src="/images/logo.svg"
          alt="404"
          width={180}
          height={104}
          unoptimized
          loading="eager"
          priority
          className={`mx-auto`}
        />
        <div className="flex w-full items-center justify-center gap-x-4">
          <button
            onClick={() => router.back()}
            className="hover:text-accent-color pointer-events-auto flex items-center gap-x-2
             rounded-xl border border-gray-200 bg-white px-4 py-2 transition-colors duration-300"
          >
            <Icon name="ArrowLeft" size={24} />
            Back
          </button>
          <Link
            href="/"
            prefetch
            className="hover:text-accent-color pointer-events-auto flex items-center gap-x-2
            rounded-xl border border-gray-200 bg-white px-4 py-2 transition-colors duration-300"
          >
            <Icon name="Home" size={24} />
            Home
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NotFoundPage;
