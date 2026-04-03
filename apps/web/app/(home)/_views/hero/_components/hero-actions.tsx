import { MainButton } from '@workspace/ui/lib/button';

export const HeroActions = () => {
  return (
    <div
      className="mx-auto flex w-full max-w-md flex-col items-center
    justify-center gap-3 sm:max-w-none sm:flex-row sm:gap-4 lg:gap-5"
    >
      <MainButton
        href={`/register`}
        isExternal
        size="xl"
        variant={'primary'}
        className="w-full sm:w-auto"
      >
        Start Free Trial
      </MainButton>
      <MainButton
        size="xl"
        variant={'primaryOutline'}
        className={`bg-background`}
        href={`/login`}
      >
        Login
      </MainButton>
    </div>
  );
};
