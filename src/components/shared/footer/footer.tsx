"use client";

import { cn } from "@/lib/utils";
import { FC } from "react";
import { LuGithub, LuLinkedin } from "react-icons/lu";

import MainButton from "../button";

export const Footer: FC = () => {
  return (
    <footer className={cn(`cc-border-u fixed bottom-0 z-10 w-full pl-4`)} role="footer">
      <section className="flex w-full items-center justify-between">
        <div className={`flex items-center gap-4`}>
          <p>Find me in:</p>
          <div>
            <MainButton icon={<LuLinkedin />} isIconOnly size={"icon"} className={`h-12 w-12`} />
            <MainButton icon={<LuLinkedin />} isIconOnly size={"icon"} className={`h-12 w-12`} />
            <MainButton icon={<LuLinkedin />} isIconOnly size={"icon"} className={`h-12 w-12`} />
          </div>
        </div>
        <div className={`hidden lg:block`}>
          <MainButton variant={`ghost`}>
            @Kinxlo <LuGithub />
          </MainButton>
        </div>
      </section>
    </footer>
  );
};
