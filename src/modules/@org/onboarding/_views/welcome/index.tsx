"use client";

import { BlurImage } from "@/components/core/miscellaneous/blur-image";
import MainButton from "@/components/shared/button";
import { ReusableDialog } from "@/components/shared/dialog/Dialog";
import { useState } from "react";

export const Welcome = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const handleOpenTeamDialog = () => {
    setDialogOpen(true);
  };
  return (
    <>
      <section className={`flex flex-col-reverse items-center justify-between gap-8 lg:flex-row`}>
        <section className={`max-w-[646px]`}>
          <div className={`space-y-[24px]`}>
            <h1 className={`text-4xl/[100%] font-semibold`}>Welcome to TechstudioHR,</h1>
            <p className={`text-xl/[120%]`}>
              Let’s help you get started. You can take a quick tour to understand how Techstudio HR works or you can
              jump straight in and begin set up.
            </p>
          </div>
          <div className={`mt-[36px] flex flex-col gap-[28px] lg:flex-row`}>
            <MainButton onClick={handleOpenTeamDialog} className={`w-full lg:w-fit`} variant={`primary`}>
              Take a Quick Tour
            </MainButton>
            <MainButton href={`/onboarding?step=1`} className={`w-full lg:w-fit`} variant={`outline`}>
              Skip Tour & Continue
            </MainButton>
          </div>
        </section>

        <BlurImage
          width={500}
          height={561}
          src={"/images/onboarding/deal.svg"}
          alt={"onboarding"}
          className={`max-h-[561px] w-[500px] rounded-2xl object-cover shadow-xl`}
        />
      </section>
      <ReusableDialog
        open={dialogOpen}
        className={`!max-w-3xl`}
        onOpenChange={setDialogOpen}
        // title={"Video"}
        // description={"more video"}
      >
        <video
          width="100%"
          height="auto"
          controls
          poster="/images/onboarding/video-poster.png"
          style={{ borderRadius: "12px" }}
          autoPlay
        >
          <source src="/video/trees.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </ReusableDialog>
    </>
  );
};
