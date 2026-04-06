import { MainButton } from '@workspace/ui/lib/button';

export const HeroActions = () => {
  return (
    <div className="mx-auto flex flex-col md:flex-row md:items-center gap-4 justify-center w-full md:w-1/2">
      <div className={`flex-1/2`}>
        <MainButton
          href={`/register`}
          isExternal
          size="xl"
          variant={'primary'}
          className="w-full"
        >
          Start Free Trial
        </MainButton>
      </div>
      <div className={`flex-1/2`}>
        <MainButton
          isExternal
          size="xl"
          variant={'primaryOutline'}
          className="w-full bg-background"
          href={`/login`}
        >
          Login
        </MainButton>
      </div>
    </div>
  );
};
