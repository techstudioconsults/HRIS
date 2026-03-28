export const OurProductsPlaceholder = () => {
  return (
    <section
      aria-hidden
      data-home-products-placeholder
      className="bg-background px-4 pb-20 pt-20 sm:px-6 lg:px-8 lg:pb-28"
    >
      <div className="mx-auto w-full max-w-[1226px]">
        <div className="h-8 w-48 rounded-md bg-zinc-100" />
        <div className="mt-8 grid gap-[37px] md:grid-cols-2 xl:grid-cols-3">
          <div className="h-[410px] rounded-[13px] border border-zinc-200/80 bg-zinc-50" />
          <div className="h-[410px] rounded-[13px] border border-zinc-200/80 bg-zinc-50" />
          <div className="h-[410px] rounded-[13px] border border-zinc-200/80 bg-zinc-50" />
        </div>
      </div>
    </section>
  );
};
