/* eslint-disable @typescript-eslint/no-explicit-any */
import { queryKeys } from "@/lib/react-query/query-keys";
import { createServiceHooks } from "@/lib/react-query/use-service-query";
import { dependencies } from "@/lib/tools/dependencies";

import { PayrollService } from "./service";

export const usePayrollService = () => {
  const { useServiceQuery } = createServiceHooks<PayrollService>(dependencies.PAYROLL_SERVICE);
  const { useServiceMutation } = createServiceHooks<PayrollService>(dependencies.PAYROLL_SERVICE);

  // Queries
  const useGetCompanyPayrollPolicy = (options?: any) =>
    useServiceQuery(queryKeys.payroll.policy(), (service) => service.getCompanyPayrollPolicy(), options);

  const useGetAllPayrolls = (filters: Filters = {}, options?: any) =>
    useServiceQuery(queryKeys.payroll.list(filters), (service) => service.getAllPayrolls(filters), options);

  const useDownloadPayrolls = (options?: any) =>
    useServiceQuery(queryKeys.payroll.download({}), (service) => service.downloadPayrolls(), options);

  const useUpdateCompanyPayrollPolicy = (options?: any) =>
    useServiceMutation(
      (
        service,
        data: {
          frequency: string;
          payday: number;
          currency?: string;
          approvers: string[];
          firstName?: string;
          lastName?: string;
          email?: string;
          phoneNumber?: string;
        },
      ) => service.updateCompanyPayrollPolicy(data),
      options,
    );

  // Bonuses
  const useGetBonuses = (filters: { payrollPolicyId?: string; payProfileId?: string } = {}, options?: any) =>
    useServiceQuery(
      queryKeys.payroll.bonuses(filters as unknown as Filters),
      (service) => service.getBonuses(filters),
      options,
    );
  const useCreateBonus = (options?: any) =>
    useServiceMutation(
      (
        service,
        data: {
          name: string;
          amount: number;
          type: "fixed" | "percentage";
          status: "active" | "inactive";
          payrollPolicyId: string;
        },
      ) => service.createBonus(data),
      options,
    );
  const useUpdateBonus = (options?: any) =>
    useServiceMutation(
      (
        service,
        payload: {
          id: string;
          data: Partial<{ name: string; amount: number; type: "fixed" | "percentage"; status: "active" | "inactive" }>;
        },
      ) => service.updateBonus(payload.id, payload.data),
      options,
    );
  const useDeleteBonus = (options?: any) =>
    useServiceMutation((service, id: string) => service.deleteBonus(id), options);

  // Deductions
  const useGetDeductions = (filters: { payrollPolicyId?: string; payProfileId?: string } = {}, options?: any) =>
    useServiceQuery(
      queryKeys.payroll.deductions(filters as unknown as Filters),
      (service) => service.getDeductions(filters),
      options,
    );
  const useCreateDeduction = (options?: any) =>
    useServiceMutation(
      (
        service,
        data: {
          name: string;
          amount: number;
          type: "fixed" | "percentage";
          status: "active" | "inactive";
          payrollPolicyId: string;
        },
      ) => service.createDeduction(data),
      options,
    );
  const useUpdateDeduction = (options?: any) =>
    useServiceMutation(
      (
        service,
        payload: {
          id: string;
          data: Partial<{ name: string; amount: number; type: "fixed" | "percentage"; status: "active" | "inactive" }>;
        },
      ) => service.updateDeduction(payload.id, payload.data),
      options,
    );
  const useDeleteDeduction = (options?: any) =>
    useServiceMutation((service, id: string) => service.deleteDeduction(id), options);

  return {
    // Queries
    useGetCompanyPayrollPolicy,
    useGetAllPayrolls,
    useDownloadPayrolls,
    useUpdateCompanyPayrollPolicy,
    useGetBonuses,
    useCreateBonus,
    useUpdateBonus,
    useDeleteBonus,
    useGetDeductions,
    useCreateDeduction,
    useUpdateDeduction,
    useDeleteDeduction,
  };
};
