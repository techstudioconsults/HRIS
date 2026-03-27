import { Input } from '@workspace/ui/components/input';
import { MainButton } from '../../button';

export const NewsLetter = () => {
  return (
    <main className="bg-primary relative flex h-[258px] items-center justify-center rounded-xl">
      <div className="bg-secondary/20 absolute top-4 left-4 h-12 w-12 rounded-full blur-2xl" aria-hidden="true" />

      <section className="mb-4">
        <p className="mb-4 text-center text-[28px] font-medium text-white lg:text-[44px]">
          Subscribe to our newsletter
        </p>
        <div className="mt-3 lg:mt-7">
          <form action="" className="items-center justify-center gap-3 px-4 xl:flex">
            <Input
              type="email"
              placeholder="Email Address"
              className="max-w-full rounded-full outline-none xl:w-[456px]"
            />

            <div className="text-center">
              <MainButton className="bg-secondary text-background mt-3 w-[178px] rounded-full xl:mt-0" size="lg">
                Subscribe
              </MainButton>
            </div>
          </form>
        </div>
      </section>

      <div className="bg-secondary/20 absolute right-4 bottom-4 h-12 w-12 rounded-full blur-2xl" aria-hidden="true" />
    </main>
  );
};
