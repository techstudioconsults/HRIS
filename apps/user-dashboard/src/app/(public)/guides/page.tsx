"use client";

import { MainButton } from "@workspace/ui/lib/button";
import { LucideOrbit, LucidePlus } from "lucide-react";
import { FC } from "react";

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
      <div className="grid w-full grid-cols-7 items-start gap-4">
        {/* primary */}
        <div className="bg-primary-500 flex w-full items-center justify-center rounded-lg px-4 py-4 whitespace-nowrap text-white">
          bg-primary-500
        </div>
        <div className="bg-primary-400 flex w-full items-center justify-center rounded-lg px-4 py-4 whitespace-nowrap text-white">
          bg-primary-400
        </div>
        <div className="bg-primary flex w-full items-center justify-center rounded-lg px-4 py-4 whitespace-nowrap text-white">
          bg-primary
        </div>
        <div className="bg-primary-200 flex w-full items-center justify-center rounded-lg px-4 py-4 whitespace-nowrap text-white">
          bg-primary-200
        </div>
        <div className="bg-primary-100 flex w-full items-center justify-center rounded-lg px-4 py-4 whitespace-nowrap text-white">
          bg-primary-100
        </div>
        <div className="bg-primary-75 flex w-full items-center justify-center rounded-lg px-4 py-4 whitespace-nowrap text-white">
          bg-primary-75
        </div>
        <div className="bg-primary-50 flex w-full items-center justify-center rounded-lg px-4 py-4 whitespace-nowrap text-white">
          bg-primary-50
        </div>
        {/* secondary/warning  */}
        <div className="bg-secondary-500 flex w-full items-center justify-center rounded-lg px-4 py-4 whitespace-nowrap text-white">
          bg-secondary-500
        </div>
        <div className="bg-secondary-400 flex w-full items-center justify-center rounded-lg px-4 py-4 whitespace-nowrap text-white">
          bg-secondary-400
        </div>
        <div className="bg-secondary flex w-full items-center justify-center rounded-lg px-4 py-4 whitespace-nowrap text-white">
          bg-secondary
        </div>
        <div className="bg-secondary-200 flex w-full items-center justify-center rounded-lg px-4 py-4 whitespace-nowrap text-white">
          bg-secondary-200
        </div>
        <div className="bg-secondary-100 flex w-full items-center justify-center rounded-lg px-4 py-4 whitespace-nowrap text-white">
          bg-secondary-100
        </div>
        <div className="bg-secondary-75 flex w-full items-center justify-center rounded-lg px-4 py-4 whitespace-nowrap text-white">
          bg-secondary-75
        </div>
        <div className="bg-secondary-50 flex w-full items-center justify-center rounded-lg px-4 py-4 whitespace-nowrap text-white">
          bg-secondary-50
        </div>

        {/* succes  */}

        <div className="bg-success-500 flex w-full items-center justify-center rounded-lg px-4 py-4 whitespace-nowrap text-white">
          bg-success-500
        </div>
        <div className="bg-success-400 flex w-full items-center justify-center rounded-lg px-4 py-4 whitespace-nowrap text-white">
          bg-success-400
        </div>
        <div className="bg-success flex w-full items-center justify-center rounded-lg px-4 py-4 whitespace-nowrap text-white">
          bg-success
        </div>
        <div className="bg-success-200 flex w-full items-center justify-center rounded-lg px-4 py-4 whitespace-nowrap text-white">
          bg-success-200
        </div>
        <div className="bg-success-100 flex w-full items-center justify-center rounded-lg px-4 py-4 whitespace-nowrap text-white">
          bg-success-100
        </div>
        <div className="bg-success-75 flex w-full items-center justify-center rounded-lg px-4 py-4 whitespace-nowrap text-white">
          bg-success-75
        </div>
        <div className="bg-success-50 flex w-full items-center justify-center rounded-lg px-4 py-4 whitespace-nowrap text-white">
          bg-success-50
        </div>

        {/* danger */}
        <div className="bg-danger-500 flex w-full items-center justify-center rounded-lg px-4 py-4 whitespace-nowrap text-white">
          bg-danger-500
        </div>
        <div className="bg-danger-400 flex w-full items-center justify-center rounded-lg px-4 py-4 whitespace-nowrap text-white">
          bg-danger-400
        </div>
        <div className="bg-danger flex w-full items-center justify-center rounded-lg px-4 py-4 whitespace-nowrap text-white">
          bg-danger
        </div>
        <div className="bg-danger-200 flex w-full items-center justify-center rounded-lg px-4 py-4 whitespace-nowrap text-white">
          bg-danger-200
        </div>
        <div className="bg-danger-100 flex w-full items-center justify-center rounded-lg px-4 py-4 whitespace-nowrap text-white">
          bg-danger-100
        </div>
        <div className="bg-danger-75 flex w-full items-center justify-center rounded-lg px-4 py-4 whitespace-nowrap text-white">
          bg-danger-75
        </div>
        <div className="bg-danger-50 flex w-full items-center justify-center rounded-lg px-4 py-4 whitespace-nowrap text-white">
          bg-danger-50
        </div>

        {/* gray */}
        <div className="flex w-full items-center justify-center rounded-lg bg-gray-500 px-4 py-4 whitespace-nowrap text-white">
          bg-gray-500
        </div>
        <div className="flex w-full items-center justify-center rounded-lg bg-gray-400 px-4 py-4 whitespace-nowrap text-white">
          bg-gray-400
        </div>
        <div className="bg-gray flex w-full items-center justify-center rounded-lg px-4 py-4 whitespace-nowrap text-white">
          bg-gray
        </div>
        <div className="flex w-full items-center justify-center rounded-lg bg-gray-200 px-4 py-4 whitespace-nowrap text-white">
          bg-gray-200
        </div>
        <div className="flex w-full items-center justify-center rounded-lg bg-gray-100 px-4 py-4 whitespace-nowrap text-white">
          bg-gray-100
        </div>
        <div className="bg-gray-75 flex w-full items-center justify-center rounded-lg px-4 py-4 whitespace-nowrap text-white">
          bg-gray-75
        </div>
        <div className="flex w-full items-center justify-center rounded-lg bg-gray-50 px-4 py-4 whitespace-nowrap text-white">
          bg-gray-50
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
            <MainButton isLeftIconVisible={true} icon={<LucideOrbit />}>
              Button CTA
            </MainButton>
          </div>
        </div>
        <div className="group flex h-full flex-col items-start justify-between rounded-lg border px-5 py-5">
          <h2 className="mb-3 text-2xl font-semibold">With Icon Primary Button</h2>
          <div className="flex items-center gap-4">
            <MainButton variant="primary" isLeftIconVisible={true} icon={<LucideOrbit />}>
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
            <MainButton variant="link" size="link" isLeftIconVisible={true} icon={<LucideOrbit />}>
              Button CTA
            </MainButton>
          </div>
        </div>
        <div className="group flex h-full flex-col items-start justify-between rounded-lg border px-5 py-5">
          <h2 className="mb-3 text-2xl font-semibold">Link With Right Icon Button</h2>
          <div className="flex items-center gap-4">
            <MainButton variant="link" size="link" isRightIconVisible={true} icon={<LucideOrbit />}>
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
            <MainButton variant="outline" size="icon" isIconOnly={true} icon={<LucidePlus />} />
          </div>
        </div>
        <div className="group flex h-full flex-col items-start justify-between rounded-lg border px-5 py-5">
          <h2 className="mb-3 text-2xl font-semibold">Icon Only Circle Button</h2>
          <div className="flex items-center gap-4">
            <MainButton variant="outline" size="circle" isIconOnly={true} icon={<LucidePlus />} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default StyleGuide;
