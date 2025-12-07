export const FormHeader = ({ title, subTitle, icon }: { title: string; subTitle?: string; icon?: React.ReactNode }) => {
  return (
    <div className={`mb-8 flex items-center gap-4`}>
      {icon && (
        <div className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-md p-2">{icon}</div>
      )}
      <div className="space-y-1">
        <h3 className="text-foreground text-[24px]/[120%] font-[600] tracking-[-2%]">{title}</h3>
        <p className={`text-gray text-sm`}>{subTitle}</p>
      </div>
    </div>
  );
};
