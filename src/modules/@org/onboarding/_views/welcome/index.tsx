import { BlurImage } from "@/components/core/miscellaneous/blur-image";
import MainButton from "@/components/shared/button";

export const Welcome = () => {
  return (
    <section className={`flex flex-col-reverse items-center justify-between gap-8 lg:flex-row`}>
      <section className={`max-w-[646px]`}>
        <div className={`space-y-[24px]`}>
          <h1 className={`text-4xl/[100%] font-semibold`}>Welcome to TechstudioHR</h1>
          <p className={`text-xl/[120%]`}>
            Let’s help you get started. You can take a quick tour to understand how Techstudio HR works or you can jump
            straight in and begin set up.
          </p>
        </div>
        <div className={`mt-[36px] flex flex-col gap-[28px] lg:flex-row`}>
          <MainButton className={`w-full lg:w-fit`} variant={`primary`}>
            Take a Quick Tour
          </MainButton>
          <MainButton className={`w-full lg:w-fit`} variant={`outline`}>
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
  );
};
