export const AuthHeader = ({ title, subTitle }: { title: string; subTitle?: string }) => {
  return (
    <div className={`mb-8 space-y-1`}>
      <h3 className="text-foreground text-[24px]/[120%] font-[600] tracking-[-2%]">{title}</h3>
      <p className={`text-gray text-sm`}>{subTitle}</p>
    </div>
  );
};
