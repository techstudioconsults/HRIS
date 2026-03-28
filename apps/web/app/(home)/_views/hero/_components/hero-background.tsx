export const HeroBackground = () => {
  return (
    <>
      <div
        className="pointer-events-none -z-1 absolute inset-x-0 top-0
      h-svh sm:h-[108svh] lg:h-dvh bg-[radial-gradient(circle_at_50%_0%,rgba(179,210,255,1)_6%,rgba(217,217,217,0)_70%)]"
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px]
         bg-[radial-gradient(#0266F3_1px,transparent_1px)] bg-size-[14px_14px] opacity-35
         sm:h-[500px] sm:bg-size-[16px_16px] sm:opacity-40 lg:h-[560px] lg:bg-size-[18px_18px] lg:opacity-45"
        style={{
          maskImage: 'linear-gradient(to bottom, black 30%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 30%, transparent 100%)',
        }}
      />
    </>
  );
};
