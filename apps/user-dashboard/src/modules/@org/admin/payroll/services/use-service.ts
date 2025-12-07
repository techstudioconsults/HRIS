/* eslint-disable @typescript-eslint/no-explicit-any */

import { queryKeys } from "@/lib/react-query/query-keys";
import { createServiceHooks } from "@/lib/react-query/use-service-query";
import { dependencies } from "@/lib/tools/dependencies";
import { useQueryClient } from "@tanstack/react-query";

import type { ActiveStatus, ValueType } from "../types";
import { PayrollService } from "./service";

export const usePayrollService = () => {
  const { useServiceQuery, useServiceMutation } = createServiceHooks<PayrollService>(dependencies.PAYROLL_SERVICE);

  // Queries
  const useGetCompanyWallet = (options?: any) =>
    useServiceQuery(queryKeys.payroll.wallet(), (service) => service.getCompanyWallet(), options);

  const useGetCompanyPayrollPolicy = (options?: any) =>
    useServiceQuery(queryKeys.payroll.policy(), (service) => service.getCompanyPayrollPolicy(), options);

  const useGetAllPayrolls = (filters: Filters = {}, options?: any) =>
    useServiceQuery(queryKeys.payroll.list(filters), (service) => service.getAllPayrolls(filters), options);

  const useDownloadPayrolls = (options?: any) =>
    useServiceQuery(queryKeys.payroll.download({}), (service) => service.downloadPayrolls(), options);

  // Payroll actions
  const useCreatePayroll = (options?: any) =>
    useServiceMutation((service, data: { paymentDate: string }) => service.createPayroll(data), options);

  const useRunPayroll = (options?: any) =>
    useServiceMutation((service, data: { payrollId: string; date: string }) => service.runPayroll(data), options);

  const useRetryPayroll = (options?: any) =>
    useServiceMutation((service, data: { payslipIds: string[] }) => service.retryPayroll(data), options);

  const useGetApprovedBanks = (options?: any) =>
    useServiceQuery(queryKeys.payroll.approvedBanks(), (service) => service.getApprovedBanks(), options);

  const useGetPayrollByID = (payrollId: string, options?: any) =>
    useServiceQuery(queryKeys.payroll.details(payrollId), (service) => service.getPayrollByID(payrollId), options);

  const useGetPayrollApprovals = (payrollId: string, options?: any) =>
    useServiceQuery(
      queryKeys.payroll.approvals(payrollId),
      (service) => service.getPayrollApprovals(payrollId),
      options,
    );

  // Decide payroll approval (approve / decline)
  const useDecidePayrollApproval = (options?: any) =>
    useServiceMutation(
      (service, data: { payrollId: string; status: "approved" | "declined" }) => service.decidePayrollApproval(data),
      {
        ...options,
        invalidateQueries: (result: any, variables: { payrollId: string; status: string }, context: unknown) => {
          const keys: ReadonlyArray<readonly unknown[]> = [
            queryKeys.payroll.approvals(variables.payrollId),
            queryKeys.payroll.details(variables.payrollId),
            queryKeys.payroll.list({}),
          ];

          // Merge with any caller-provided invalidations
          const extra = options?.invalidateQueries?.(result, variables, context);
          if (extra && Array.isArray(extra) && extra.length > 0) {
            return [...keys, ...extra] as ReadonlyArray<readonly unknown[]>;
          }
          return keys;
        },
      },
    );

  // Wallet
  const useUpdateCompanyWallet = (options?: any) =>
    useServiceMutation(
      (service, data: { firstName: string; lastName: string; email: string; phoneNumber: string }) =>
        service.updateCompanyWallet(data),
      options,
    );

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
  const useCreateBonus = (options?: any) => {
    const queryClient = useQueryClient();
    return useServiceMutation(
      (
        service,
        data: {
          name: string;
          amount: number;
          type: ValueType;
          status: ActiveStatus;
          payrollPolicyId: string;
        },
      ) => service.createBonus(data),
      {
        ...options,
        invalidateQueries: (result: any, variables: any, context: unknown) => {
          const keys: (readonly unknown[])[] = [
            ["payrolls", "bonuses"],
            ["payrolls", "list"],
          ];
          const extra = options?.invalidateQueries?.(result, variables, context);
          return extra && Array.isArray(extra) ? [...keys, ...extra] : keys;
        },
        onSuccess: async (data: any, variables: any, context: unknown) => {
          // Broad invalidate all payroll detail & payslip queries (policy bonuses affect aggregates)
          await queryClient.invalidateQueries({
            predicate: (q) =>
              Array.isArray(q.queryKey) &&
              q.queryKey[0] === "payrolls" &&
              ["detail", "payslips", "payslip"].includes(String(q.queryKey[1])),
          });
          await options?.onSuccess?.(data, variables, context);
        },
      },
    );
  };
  const useUpdateBonus = (options?: any) => {
    const queryClient = useQueryClient();
    return useServiceMutation(
      (
        service,
        payload: {
          id: string;
          data: Partial<{ name: string; amount: number; type: ValueType; status: ActiveStatus }>;
        },
      ) => service.updateBonus(payload.id, payload.data),
      {
        ...options,
        invalidateQueries: (result: any, variables: any, context: unknown) => {
          const keys: (readonly unknown[])[] = [
            ["payrolls", "bonuses"],
            ["payrolls", "list"],
          ];
          const extra = options?.invalidateQueries?.(result, variables, context);
          return extra && Array.isArray(extra) ? [...keys, ...extra] : keys;
        },
        onSuccess: async (data: any, variables: any, context: unknown) => {
          await queryClient.invalidateQueries({
            predicate: (q) =>
              Array.isArray(q.queryKey) &&
              q.queryKey[0] === "payrolls" &&
              ["detail", "payslips", "payslip"].includes(String(q.queryKey[1])),
          });
          await options?.onSuccess?.(data, variables, context);
        },
      },
    );
  };
  const useDeleteBonus = (options?: any) => {
    const queryClient = useQueryClient();
    return useServiceMutation((service, id: string) => service.deleteBonus(id), {
      ...options,
      invalidateQueries: () => {
        const keys: (readonly unknown[])[] = [
          ["payrolls", "bonuses"],
          ["payrolls", "list"],
        ];
        return keys;
      },
      onSuccess: async (data: any, variables: any, context: unknown) => {
        await queryClient.invalidateQueries({
          predicate: (q) =>
            Array.isArray(q.queryKey) &&
            q.queryKey[0] === "payrolls" &&
            ["detail", "payslips", "payslip"].includes(String(q.queryKey[1])),
        });
        await options?.onSuccess?.(data, variables, context);
      },
    });
  };

  // Deductions
  const useGetDeductions = (filters: { payrollPolicyId?: string; payProfileId?: string } = {}, options?: any) =>
    useServiceQuery(
      queryKeys.payroll.deductions(filters as unknown as Filters),
      (service) => service.getDeductions(filters),
      options,
    );
  const useCreateDeduction = (options?: any) => {
    const queryClient = useQueryClient();
    return useServiceMutation(
      (
        service,
        data: {
          name: string;
          amount: number;
          type: ValueType;
          status: ActiveStatus;
          payrollPolicyId: string;
        },
      ) => service.createDeduction(data),
      {
        ...options,
        invalidateQueries: () => {
          const keys: (readonly unknown[])[] = [
            ["payrolls", "deductions"],
            ["payrolls", "list"],
          ];
          return keys;
        },
        onSuccess: async (data: any, variables: any, context: unknown) => {
          await queryClient.invalidateQueries({
            predicate: (q) =>
              Array.isArray(q.queryKey) &&
              q.queryKey[0] === "payrolls" &&
              ["detail", "payslips", "payslip"].includes(String(q.queryKey[1])),
          });
          await options?.onSuccess?.(data, variables, context);
        },
      },
    );
  };
  const useUpdateDeduction = (options?: any) => {
    const queryClient = useQueryClient();
    return useServiceMutation(
      (
        service,
        payload: {
          id: string;
          data: Partial<{ name: string; amount: number; type: ValueType; status: ActiveStatus }>;
        },
      ) => service.updateDeduction(payload.id, payload.data),
      {
        ...options,
        invalidateQueries: () => {
          const keys: (readonly unknown[])[] = [
            ["payrolls", "deductions"],
            ["payrolls", "list"],
          ];
          return keys;
        },
        onSuccess: async (data: any, variables: any, context: unknown) => {
          await queryClient.invalidateQueries({
            predicate: (q) =>
              Array.isArray(q.queryKey) &&
              q.queryKey[0] === "payrolls" &&
              ["detail", "payslips", "payslip"].includes(String(q.queryKey[1])),
          });
          await options?.onSuccess?.(data, variables, context);
        },
      },
    );
  };
  const useDeleteDeduction = (options?: any) => {
    const queryClient = useQueryClient();
    return useServiceMutation((service, id: string) => service.deleteDeduction(id), {
      ...options,
      invalidateQueries: () => {
        const keys: (readonly unknown[])[] = [
          ["payrolls", "deductions"],
          ["payrolls", "list"],
        ];
        return keys;
      },
      onSuccess: async (data: any, variables: any, context: unknown) => {
        await queryClient.invalidateQueries({
          predicate: (q) =>
            Array.isArray(q.queryKey) &&
            q.queryKey[0] === "payrolls" &&
            ["detail", "payslips", "payslip"].includes(String(q.queryKey[1])),
        });
        await options?.onSuccess?.(data, variables, context);
      },
    });
  };

  // Payslips
  const useGetPayslips = (payrollID: string, filters: Filters = {}, options?: any) =>
    useServiceQuery(
      queryKeys.payroll.payslips(payrollID, filters),
      (service) => service.getPayslips(payrollID, filters),
      options,
    );

  const useGetPayslipById = (payrollId: string, payslipId: string, options?: any) =>
    useServiceQuery(
      queryKeys.payroll.payslipDetails(payslipId),
      (service) => service.getPayslipById(payrollId, payslipId),
      options,
    );

  const useCreatePayslip = (options?: any) =>
    useServiceMutation(
      (
        service,
        data: {
          payrollId: string;
          employeeId: string;
        },
      ) => service.createPayslip(data),
      {
        ...options,
        invalidateQueries: (_, variables: any) => {
          const keys: ReadonlyArray<readonly unknown[]> = [
            ["payrolls", "payslips"] as const,
            ["payrolls", "payslip"] as const,
            queryKeys.payroll.list({}),
            queryKeys.payroll.details(variables.payrollId),
            queryKeys.employee.suspendedByPayroll(variables.payrollId, {}),
          ];

          return keys;
        },
      },
    );

  const useDeletePayslip = (options?: any) =>
    useServiceMutation(
      (service, payload: { payrollId: string; payslipId: string }) =>
        service.deletePayslip(payload.payrollId, payload.payslipId),
      {
        ...options,
        invalidateQueries: (_, variables: any) => {
          const keys: ReadonlyArray<readonly unknown[]> = [
            ["payrolls", "payslips"] as const,
            ["payrolls", "payslip"] as const,
            queryKeys.payroll.list({}),
            queryKeys.payroll.details(variables.payrollId),
            queryKeys.employee.suspendedByPayroll(variables.payrollId, {}),
          ];

          return keys;
        },
      },
    );

  return {
    // Queries
    useGetCompanyPayrollPolicy,
    useCreatePayroll,
    useRunPayroll,
    useRetryPayroll,
    useGetApprovedBanks,
    useGetPayrollByID,
    useGetPayrollApprovals,
    useDecidePayrollApproval,
    useGetAllPayrolls,
    useDownloadPayrolls,
    useUpdateCompanyWallet,
    useUpdateCompanyPayrollPolicy,
    useGetBonuses,
    useCreateBonus,
    useUpdateBonus,
    useDeleteBonus,
    useGetDeductions,
    useCreateDeduction,
    useUpdateDeduction,
    useDeleteDeduction,
    useGetCompanyWallet,
    useGetPayslips,
    useGetPayslipById,
    useCreatePayslip,
    useDeletePayslip,
  };
};
