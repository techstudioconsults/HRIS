export const OnboardingPreview = () => {
  return (
    <article className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-[0_10px_28px_rgba(0,0,0,0.08)] lg:p-6">
      <h3 className="text-2xl font-semibold tracking-[-0.01em] text-zinc-900">
        Set up your company profile
      </h3>

      <div className="mt-4 space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-medium text-zinc-700">
            Company Name<span className="text-[#ef4444]">*</span>
          </p>
          <div className="h-11 rounded-md border border-zinc-300 bg-zinc-50 px-3 text-sm leading-11 text-zinc-500">
            Tech Studio Academy
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-zinc-700">
            Industry<span className="text-[#ef4444]">*</span>
          </p>
          <div className="flex h-11 items-center justify-between rounded-md border border-[#9fc0ff] bg-white px-3 text-sm text-zinc-400">
            <span>Select industry</span>
            <span aria-hidden className="text-zinc-400">
              v
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-zinc-700">
            Company Size<span className="text-[#ef4444]">*</span>
          </p>
          <div className="flex h-11 items-center justify-between rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-400">
            <span>Select size</span>
            <span aria-hidden className="text-zinc-400">
              v
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-zinc-700">
            Country<span className="text-[#ef4444]">*</span>
          </p>
          <div className="flex h-11 items-center justify-between rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-400">
            <span>Select country</span>
            <span aria-hidden className="text-zinc-400">
              v
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};
