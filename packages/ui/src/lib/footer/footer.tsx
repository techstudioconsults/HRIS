"use client";

import { cn } from "@/lib/utils";
import { LucideGithub, LucideLinkedin } from "lucide-react";
import { FC } from "react";

import MainButton from "../button";

export const Footer: FC = () => {
  return (
    <footer
      className={cn(`cc-border-u fixed bottom-0 z-10 w-full pl-4`)}
      role="footer"
    >
      <section className="flex w-full items-center justify-between">
        <div className={`flex items-center gap-4`}>
          <p>Find me in:</p>
          <div>
            <MainButton
              icon={<LucideLinkedin />}
              isIconOnly
              size={"icon"}
              className={`h-12 w-12`}
            />
            <MainButton
              icon={<LucideLinkedin />}
              isIconOnly
              size={"icon"}
              className={`h-12 w-12`}
            />
            <MainButton
              icon={<LucideLinkedin />}
              isIconOnly
              size={"icon"}
              className={`h-12 w-12`}
            />
          </div>
        </div>
        <div className={`hidden lg:block`}>
          <MainButton variant={`ghost`}>
            @Kinxlo <LucideGithub />
          </MainButton>
        </div>
      </section>
    </footer>
  );
};
