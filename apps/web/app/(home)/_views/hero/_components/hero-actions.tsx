import { MainButton } from '@workspace/ui/lib';

export const HeroActions = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-5">
      <MainButton variant={'primary'}>Start Free Trial</MainButton>
      <MainButton variant={'primaryOutline'} className="bg-background">
        Login
      </MainButton>
    </div>
  );
};
