import { useSearchParams } from "next/navigation";

export const useSearchParameters = (key: string) => {
  const searchParameters = useSearchParams();
  const value = searchParameters.get(key);
  return value;
};
