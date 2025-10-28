/* eslint-disable @typescript-eslint/no-explicit-any */
import { queryKeys } from "@/lib/react-query/query-keys";
import { createServiceHooks } from "@/lib/react-query/use-service-query";
import { dependencies } from "@/lib/tools/dependencies";

import { BonusDeductionService, BonusPayload } from "./bonus-deduction-service";

export const useBonusDeductionService = () => {
  const { useServiceQuery, useServiceMutation } = createServiceHooks<BonusDeductionService>(
    dependencies.BONUS_DEDUCTION_SERVICE,
  );

  // Bonuses
  const useListBonuses = (filters: Filters = {}, options?: any) =>
    useServiceQuery(queryKeys.bonuses.list(filters), (service) => service.listBonuses(filters), options);

  const useCreateBonus = () =>
    useServiceMutation((service, data: BonusPayload) => service.createBonus(data), {
      onSuccess: () => [queryKeys.bonuses.list()],
    });

  const useUpdateBonus = () =>
    useServiceMutation(
      (service, { id, data }: { id: string; data: Partial<BonusPayload> }) => service.updateBonus(id, data),
      {
        onSuccess: () => [queryKeys.bonuses.list()],
      },
    );

  const useDeleteBonus = () =>
    useServiceMutation((service, id: string) => service.deleteBonus(id), {
      onSuccess: () => [queryKeys.bonuses.list()],
    });

  // Deductions
  const useListDeductions = (filters: Filters = {}, options?: any) =>
    useServiceQuery(queryKeys.deductions.list(filters), (service) => service.listDeductions(filters), options);

  const useCreateDeduction = () =>
    useServiceMutation((service, data: BonusPayload) => service.createDeduction(data), {
      onSuccess: () => [queryKeys.deductions.list()],
    });

  const useUpdateDeduction = () =>
    useServiceMutation(
      (service, { id, data }: { id: string; data: Partial<BonusPayload> }) => service.updateDeduction(id, data),
      {
        onSuccess: () => [queryKeys.deductions.list()],
      },
    );

  const useDeleteDeduction = () =>
    useServiceMutation((service, id: string) => service.deleteDeduction(id), {
      onSuccess: () => [queryKeys.deductions.list()],
    });

  return {
    useListBonuses,
    useCreateBonus,
    useUpdateBonus,
    useDeleteBonus,
    useListDeductions,
    useCreateDeduction,
    useUpdateDeduction,
    useDeleteDeduction,
  };
};
