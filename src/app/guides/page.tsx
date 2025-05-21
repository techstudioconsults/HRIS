"use client";

import MainButton from "@/components/shared/button";
import { FC } from "react";
import { LuOrbit, LuPlus } from "react-icons/lu";

const StyleGuide: FC = () => {
  return (
    <main className="flex min-h-screen flex-col items-start gap-7 overflow-hidden p-6 sm:p-12 md:p-24">
      <h2 className="text-2xl font-semibold">Color Guides</h2>
      <div className="grid w-full grid-cols-3 items-start gap-4">
        <div className="border-border bg-background text-foreground flex w-full items-center justify-center rounded-lg border px-4 py-4 whitespace-nowrap">
          bg-background, text-foreground (default)
        </div>
        <div className="bg-primary text-primary-foreground flex w-full items-center justify-center rounded-lg px-4 py-4 whitespace-nowrap">
          bg-primary, text-primary-foreground
        </div>
        <div className="bg-secondary flex w-full items-center justify-center rounded-lg px-4 py-4 whitespace-nowrap text-white">
          bg-secondary, text-secondary-foreground
        </div>
        <div className="bg-muted text-muted-foreground flex w-full items-center justify-center rounded-lg px-4 py-4 whitespace-nowrap">
          bg-muted, text-muted-foreground
        </div>
        <div className="bg-accent text-accent-foreground flex w-full items-center justify-center rounded-lg px-4 py-4 whitespace-nowrap">
          bg-accent, text-accent-foreground
        </div>
        <div className="bg-destructive text-background flex w-full items-center justify-center rounded-lg px-4 py-4 whitespace-nowrap">
          bg-destructive, text-background
        </div>
      </div>
      <h2 className="text-2xl font-semibold">HRIS Design system</h2>
      <div className="grid w-full grid-cols-3 items-start gap-4">
        <div className="bg-primary-500 flex w-full items-center justify-center rounded-lg px-4 py-4 whitespace-nowrap text-white">
          bg-primary-500
        </div>
        <div className="bg-primary-400 flex w-full items-center justify-center rounded-lg px-4 py-4 whitespace-nowrap text-white">
          bg-primary-400
        </div>
        <div className="bg-low-blue flex w-full items-center justify-center rounded-lg px-4 py-4 whitespace-nowrap text-black">
          bg-low-blue
        </div>
        <div className="bg-high-danger flex w-full items-center justify-center rounded-lg px-4 py-4 whitespace-nowrap text-white">
          bg-high-danger
        </div>
        <div className="bg-mid-danger flex w-full items-center justify-center rounded-lg px-4 py-4 whitespace-nowrap text-white">
          bg-mid-danger
        </div>
        <div className="bg-low-danger flex w-full items-center justify-center rounded-lg px-4 py-4 whitespace-nowrap text-black">
          bg-low-danger
        </div>
        <div className="bg-high-warning flex w-full items-center justify-center rounded-lg px-4 py-4 whitespace-nowrap text-white">
          bg-high-warning
        </div>
        <div className="bg-mid-warning flex w-full items-center justify-center rounded-lg px-4 py-4 whitespace-nowrap text-white">
          bg-mid-warning
        </div>
        <div className="bg-low-warning flex w-full items-center justify-center rounded-lg px-4 py-4 whitespace-nowrap text-black">
          bg-low-warning
        </div>
        <div className="bg-high-success flex w-full items-center justify-center rounded-lg px-4 py-4 whitespace-nowrap text-white">
          bg-high-success
        </div>
        <div className="bg-mid-success flex w-full items-center justify-center rounded-lg px-4 py-4 whitespace-nowrap text-white">
          bg-mid-success
        </div>
        <div className="bg-low-success flex w-full items-center justify-center rounded-lg px-4 py-4 whitespace-nowrap text-black">
          bg-low-success
        </div>
        <div className="bg-high-grey-III flex w-full items-center justify-center rounded-lg px-4 py-4 whitespace-nowrap text-white">
          bg-high-grey-III
        </div>
        <div className="bg-mid-grey-III flex w-full items-center justify-center rounded-lg px-4 py-4 whitespace-nowrap text-white">
          bg-mid-grey-III
        </div>
        <div className="bg-low-grey-III flex w-full items-center justify-center rounded-lg px-4 py-4 whitespace-nowrap text-white">
          bg-low-grey-III
        </div>
        <div className="bg-high-grey-II flex w-full items-center justify-center rounded-lg px-4 py-4 whitespace-nowrap text-white">
          bg-high-grey-II
        </div>
        <div className="bg-mid-grey-II flex w-full items-center justify-center rounded-lg px-4 py-4 whitespace-nowrap text-white">
          bg-mid-grey-II
        </div>
        <div className="bg-low-grey-II flex w-full items-center justify-center rounded-lg px-4 py-4 whitespace-nowrap text-white">
          bg-low-grey-II
        </div>
        <div className="bg-high-grey-I flex w-full items-center justify-center rounded-lg px-4 py-4 whitespace-nowrap text-black">
          bg-high-grey-I
        </div>
        <div className="bg-mid-grey-I flex w-full items-center justify-center rounded-lg px-4 py-4 whitespace-nowrap text-black">
          bg-mid-grey-I
        </div>
        <div className="bg-low-grey-I flex w-full items-center justify-center rounded-lg px-4 py-4 whitespace-nowrap text-black">
          bg-low-grey-I
        </div>
      </div>
      <h2 className="text-2xl font-semibold">Button Variants</h2>
      <div
        className="grid w-full grid-cols-5 items-start gap-4"
        style={{ gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))" }}
      >
        <div className="group flex h-full flex-col items-start justify-between rounded-lg border px-5 py-5">
          <h2 className="mb-3 text-2xl font-semibold">Default Button</h2>
          <div className="flex items-center gap-4">
            <MainButton>Button CTA</MainButton>
          </div>
        </div>
        <div className="group flex h-full flex-col items-start justify-between rounded-lg border px-5 py-5">
          <h2 className="mb-3 text-2xl font-semibold">Primary Button</h2>
          <div className="flex items-center gap-4">
            <MainButton variant="primary">Button CTA</MainButton>
          </div>
        </div>
        <div className="group flex h-full flex-col items-start justify-between rounded-lg border px-5 py-5">
          <h2 className="mb-3 text-2xl font-semibold">Destructive Button</h2>
          <div className="flex items-center gap-4">
            <MainButton variant="destructive">Button CTA</MainButton>
          </div>
        </div>
        <div className="group flex h-full flex-col items-start justify-between rounded-lg border px-5 py-5">
          <h2 className="mb-3 text-2xl font-semibold">Subtle Button</h2>
          <div className="flex items-center gap-4">
            <MainButton variant="subtle">Button CTA</MainButton>
          </div>
        </div>
        <div className="group flex h-full flex-col items-start justify-between rounded-lg border px-5 py-5">
          <h2 className="mb-3 text-2xl font-semibold">With Icon Default Button</h2>
          <div className="flex items-center gap-4">
            <MainButton isLeftIconVisible={true} icon={<LuOrbit />}>
              Button CTA
            </MainButton>
          </div>
        </div>
        <div className="group flex h-full flex-col items-start justify-between rounded-lg border px-5 py-5">
          <h2 className="mb-3 text-2xl font-semibold">With Icon Primary Button</h2>
          <div className="flex items-center gap-4">
            <MainButton variant="primary" isLeftIconVisible={true} icon={<LuOrbit />}>
              Button CTA
            </MainButton>
          </div>
        </div>
        <div className="group flex h-full flex-col items-start justify-between rounded-lg border px-5 py-5">
          <h2 className="mb-3 text-2xl font-semibold">Loading Button</h2>
          <div className="flex items-center gap-4">
            <MainButton variant="loading" isLoading={true} />
          </div>
        </div>
        <div className="group flex h-full flex-col items-start justify-between rounded-lg border px-5 py-5">
          <h2 className="mb-3 text-2xl font-semibold">Outline Button</h2>
          <div className="flex items-center gap-4">
            <MainButton variant="outline">Button CTA</MainButton>
          </div>
        </div>
        <div className="group flex h-full flex-col items-start justify-between rounded-lg border px-5 py-5">
          <h2 className="mb-3 text-2xl font-semibold">Link With Left Icon Button</h2>
          <div className="flex items-center gap-4">
            <MainButton variant="link" size="link" isLeftIconVisible={true} icon={<LuOrbit />}>
              Button CTA
            </MainButton>
          </div>
        </div>
        <div className="group flex h-full flex-col items-start justify-between rounded-lg border px-5 py-5">
          <h2 className="mb-3 text-2xl font-semibold">Link With Right Icon Button</h2>
          <div className="flex items-center gap-4">
            <MainButton variant="link" size="link" isRightIconVisible={true} icon={<LuOrbit />}>
              Button CTA
            </MainButton>
          </div>
        </div>
        <div className="group flex h-full flex-col items-start justify-between rounded-lg border px-5 py-5">
          <h2 className="mb-3 text-2xl font-semibold">Link Button</h2>
          <div className="flex items-center gap-4">
            <MainButton variant="link" size="link">
              Button CTA
            </MainButton>
          </div>
        </div>
        <div className="group flex h-full flex-col items-start justify-between rounded-lg border px-5 py-5">
          <h2 className="mb-3 text-2xl font-semibold">Icon Only Button</h2>
          <div className="flex items-center gap-4">
            <MainButton variant="outline" size="icon" isIconOnly={true} icon={<LuPlus />} />
          </div>
        </div>
        <div className="group flex h-full flex-col items-start justify-between rounded-lg border px-5 py-5">
          <h2 className="mb-3 text-2xl font-semibold">Icon Only Circle Button</h2>
          <div className="flex items-center gap-4">
            <MainButton variant="outline" size="circle" isIconOnly={true} icon={<LuPlus />} />
          </div>
        </div>
      </div>
      <h2 className="text-2xl font-semibold">Usage</h2>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <span>Import the custom button component</span>
          <div className="rounded-lg bg-zinc-950 p-4">
            <span className="block font-mono text-sm text-white">
              import <span className="text-blue-400">MainButton</span> from{" "}
              <span className="text-yellow-400">&quot;~/components/common/Button/button&quot;</span>;
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span>Variant Types</span>
          <div className="rounded-lg bg-zinc-950 p-4">
            <span className="block font-mono text-sm text-gray-100">
              <span className="text-pink-400">type Variant</span> {"{"}
            </span>
            <span className="ml-4 block font-mono text-sm text-gray-100">
              default <br />
              primary <br />
              destructive <br />
              subtle <br />
              loading <br />
              outline <br />
              link
            </span>
            <span className="block font-mono text-sm text-gray-100">{"}"}</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span>Size Types</span>
          <div className="rounded-lg bg-zinc-950 p-4">
            <span className="block font-mono text-sm text-gray-100">
              <span className="text-pink-400">type Size</span> {"{"}
            </span>
            <span className="ml-4 block font-mono text-sm text-gray-100">
              default <br />
              sm <br />
              lg <br />
              link <br />
              icon <br />
              circle
            </span>
            <span className="block font-mono text-sm text-gray-100">{"}"}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span>Accepted Custom Button Props</span>
          <div className="rounded-lg bg-zinc-950 p-4">
            <span className="block font-mono text-sm text-gray-100">
              <span className="text-pink-400">ButtonProps</span> {"{"}
            </span>
            <span className="ml-4 block font-mono text-sm text-gray-100">
              variant<span className="text-pink-400">?: </span>Variant;
              <br />
              size<span className="text-pink-400">?: </span>Size;
              <br />
              icon<span className="text-pink-400">?: </span>React.ReactNode;
              <br />
              children<span className="text-pink-400">?: </span>
              React.ReactNode;
              <br />
              isLoading<span className="text-pink-400">?: </span>boolean;
              <br />
              isIconOnly<span className="text-pink-400">?: </span>boolean;
              <br />
              isLeftIconVisible<span className="text-pink-400">?: </span>
              boolean;
              <br />
              isRightIconVisible<span className="text-pink-400">?: </span>
              boolean;
              <br />
              isDisabled<span className="text-pink-400">?: </span>boolean;
              <br />
              ariaLabel<span className="text-pink-400">?: </span>string;
            </span>
            <span className="block font-mono text-sm text-gray-100">{"}"}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span>Example</span>
          <div className="rounded-lg bg-zinc-950 p-4">
            <span className="block font-mono text-sm text-gray-100">return (</span>
            <span className="ml-4 block font-mono text-sm text-gray-100">
              <span className="text-green-400">{"<"}</span>
              <span className="text-blue-400">MainButton</span>
              <br />
              <span className="ml-4">
                variant=
                <span className="text-yellow-400">&quot;subtle&quot;</span> <br />
              </span>
              <span className="ml-4">
                icon=<span className="text-yellow-400">{"{<Plus />}"}</span> <br />
              </span>
              <span className="ml-4">
                isLeftIconVisible=
                <span className="text-yellow-400">{"{true}"}</span> <br />
              </span>
              <span className="ml-4">
                isLoading={<span className="text-yellow-400">false</span>} <br />
              </span>
              <span className="ml-4">
                isDisabled={<span className="text-yellow-400">false</span>} <br />
              </span>
              <span className="text-green-400">{">"}</span> <br />
              <span className="ml-4">Click Me</span> <br />
              <span className="text-green-400">{"<"}</span>/<span className="text-blue-400">MainButton</span>
              <span className="text-green-400">{">"}</span>
            </span>
            <span className="block font-mono text-sm text-gray-100">);</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span>Example</span>
          <div className="rounded-lg bg-zinc-950 p-4">
            <span className="block font-mono text-sm text-gray-100">return (</span>
            <span className="ml-4 block font-mono text-sm text-gray-100">
              <span className="text-green-400">{"<"}</span>
              <span className="text-blue-400">DataCard</span>
              <br />
              <span className="ml-4">
                price=
                <span className="text-yellow-400">{"{500}"}</span> <br />
              </span>
              <span className="ml-4">
                initialPrice=
                <span className="text-yellow-400">{"{1500}"}</span> <br />
              </span>
              <span className="ml-4">
                plan=
                {<span className="text-yellow-400">{"{2-Days Plan}"}</span>} <br />
              </span>
              <span className="ml-4">
                packages=
                {<span className="text-yellow-400">{"{packages}"}</span>} <br />
              </span>
              <span className="text-green-400">{"/>"}</span> <br />
            </span>
            <span className="block font-mono text-sm text-gray-100">);</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span>Example</span>
          <div className="rounded-lg bg-zinc-950 p-4">
            <span className="block font-mono text-sm text-gray-100">return (</span>
            <span className="ml-4 block font-mono text-sm text-gray-100">
              <span className="text-green-400">{"<"}</span>
              <span className="text-blue-400">JobCard</span>
              <br />
              <span className="ml-4">
                position=
                <span className="text-yellow-400">{"{position name}"}</span> <br />
              </span>
              <span className="ml-4">
                Description=
                <span className="text-yellow-400">{"{Job description}"}</span> <br />
              </span>
              <span className="ml-4">
                jobDescription=
                {<span className="text-yellow-400">{"{jobDescriptions}"}</span>} <br />
              </span>
              <span className="text-green-400">{"/>"}</span> <br />
            </span>
            <span className="block font-mono text-sm text-gray-100">);</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span>Example</span>
          <div className="rounded-lg bg-zinc-950 p-4">
            <span className="block font-mono text-sm text-gray-100">return (</span>
            <span className="ml-4 block font-mono text-sm text-gray-100">
              <span className="text-green-400">{"<"}</span>
              <span className="text-blue-400">ArticlesCard</span>
              <br />
              <span className="ml-4">
                articleImage=
                <span className="text-yellow-400">{"{articleImage}"}</span> <br />
              </span>
              <span className="ml-4">
                heading=
                <span className="text-yellow-400">{"{heading}"}</span> <br />
              </span>
              <span className="ml-4">
                dateSent
                {<span className="text-yellow-400">{"{dateSent}"}</span>} <br />
              </span>
              <span className="ml-4">
                subHeading
                {<span className="text-yellow-400">{"{subHeading}"}</span>} <br />
              </span>
              <span className="text-green-400">{"/>"}</span> <br />
            </span>
            <span className="block font-mono text-sm text-gray-100">);</span>
          </div>
        </div>
      </div>
      <section>
        <h1 className="text-4xl">Components</h1>
      </section>
    </main>
  );
};

export default StyleGuide;
