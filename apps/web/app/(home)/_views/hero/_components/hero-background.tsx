export const HeroBackground = () => {
  return (
    <>
      <div
        className="pointer-events-none -z-1 absolute inset-x-0 top-0
      h-dvh bg-[radial-gradient(circle_at_50%_0%,rgba(179,210,255,1)_6%,rgba(217,217,217,0)_70%)]"
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[560px] bg-[radial-gradient(#0266F3_1px,transparent_1px)] bg-size-[18px_18px] opacity-45"
        style={{
          maskImage: 'linear-gradient(to bottom, black 30%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 30%, transparent 100%)',
        }}
      />
    </>
  );
};
