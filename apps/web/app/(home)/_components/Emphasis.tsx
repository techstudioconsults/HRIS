import { ReactNode } from 'react';

export const Emphasis = ({ children }: { children: ReactNode }) => {
  return <span className="font-mono text-primary italic">{children}</span>;
};
