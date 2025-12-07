/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { AlertModal } from "@workspace/ui/lib";
import { useEffect, useRef, useState } from "react";
import type React from "react";

import { usePayrollService } from "../services/use-service";
import { BonusDeduction, BonusDeductionFormData } from "../types";
import { BonusDeductionFormModal } from "./bonus-deduction-form-modal";
import { BonusDeductionTable } from "./bonus-deduction-table";

interface BonusDeductionManagerProperties {
  type: "bonus" | "deduction";
  initialItems?: BonusDeduction[];
  onChange?: (items: BonusDeduction[]) => void;
  policyId?: string;
  profileId?: string; // NEW: employee-level (payProfileId)
}

// Local generic response type to satisfy references
interface ApiResponse<T> {
  data: T;
}

const generateId = () => {
  return Math.random().toString(36).slice(2, 11);
};

export function BonusDeductionManager({
  type,
  initialItems = [],
  onChange,
  policyId,
  profileId,
}: BonusDeductionManagerProperties) {
  const [items, setItems] = useState<BonusDeduction[]>(initialItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BonusDeduction | null>(null);

  // Keep local items in sync with initialItems only when they truly change.
  // Avoid overwriting local optimistic updates due to parent re-renders.
  const lastSyncedReference = useRef<BonusDeduction[] | null>(null);

  const areListsEqual = (a: BonusDeduction[] = [], b: BonusDeduction[] = []) => {
    if (a === b) return true;
    if (!a || !b) return false;
    if (a.length !== b.length) return false;
    for (const [index, ai] of a.entries()) {
      const bi = b[index];
      if (
        ai.id !== bi.id ||
        ai.name !== bi.name ||
        ai.value !== bi.value ||
        ai.valueType !== bi.valueType ||
        ai.status !== bi.status ||
        ai.type !== bi.type
      )
        return false;
    }
    return true;
  };

  useEffect(() => {
    if (!areListsEqual(initialItems, lastSyncedReference.current ?? [])) {
      setItems(initialItems);
      lastSyncedReference.current = initialItems;
    }
  }, [initialItems]);

  // Success alert state for delete actions
  const [isDeletedAlertOpen, setIsDeletedAlertOpen] = useState(false);
  const [deletedAlertTitle, setDeletedAlertTitle] = useState("");
  const [deletedAlertDescription, setDeletedAlertDescription] = useState("");

  // Service hooks
  const { useCreateBonus, useUpdateBonus, useDeleteBonus, useCreateDeduction, useUpdateDeduction, useDeleteDeduction } =
    usePayrollService();
  const createBonus = useCreateBonus();
  const updateBonus = useUpdateBonus();
  const deleteBonus = useDeleteBonus();
  const createDeduction = useCreateDeduction();
  const updateDeduction = useUpdateDeduction();
  const deleteDeduction = useDeleteDeduction();

  const handleAdd = async (formData: BonusDeductionFormData) => {
    const hasRemote = !!policyId || !!profileId;
    if (!hasRemote) {
      // If no policy, fallback to local-only behavior
      const fallback: BonusDeduction = {
        id: generateId(),
        name: formData.name,
        valueType: formData.valueType,
        value: formData.value,
        status: formData.status ? "active" : "inactive",
        type: formData.type,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setItems((previous) => [...previous, fallback]);
      setIsModalOpen(false);
      return;
    }
    const payload = {
      name: formData.name,
      amount: formData.value,
      type: formData.valueType,
      status: (formData.status ? "active" : "inactive") as "active" | "inactive",
      ...(policyId ? { payrollPolicyId: policyId } : {}),
      ...(profileId ? { payProfileId: profileId } : {}),
    };

    const response =
      type === "bonus"
        ? await createBonus.mutateAsync(payload as any)
        : await createDeduction.mutateAsync(payload as any);

    type APIEntity = {
      id?: string;
      name?: string;
      amount?: number;
      type?: "fixed" | "percentage";
      status?: "active" | "inactive";
      createdAt?: string;
      updatedAt?: string;
    };
    const data = (response as unknown as ApiResponse<APIEntity> | undefined)?.data ?? ({} as APIEntity);
    const newItem: BonusDeduction = {
      id: data.id ?? generateId(),
      name: data.name ?? formData.name,
      valueType: (data.type ?? formData.valueType) as "percentage" | "fixed",
      value: Number(data.amount ?? formData.value ?? 0),
      status: (data.status ?? (formData.status ? "active" : "inactive")) as "active" | "inactive",
      type,
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      updatedAt: new Date(),
    };

    setItems((previous) => [...previous, newItem]);
    setIsModalOpen(false);
  };

  const handleEdit = (id: string, formData: BonusDeductionFormData) => {
    setEditingItem({
      id,
      name: formData.name,
      valueType: formData.valueType,
      value: formData.value,
      status: formData.status ? "active" : "inactive",
      type: formData.type,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    setIsModalOpen(true);
  };

  const handleEditSubmit = async (formData: BonusDeductionFormData, event?: React.BaseSyntheticEvent) => {
    event?.stopPropagation();
    if (!editingItem) return;

    const hasRemote = !!policyId || !!profileId;
    if (!hasRemote) {
      setItems((previous) =>
        previous.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                name: formData.name,
                valueType: formData.valueType,
                value: formData.value,
                status: formData.status ? "active" : "inactive",
                updatedAt: new Date(),
              }
            : item,
        ),
      );
      setEditingItem(null);
      setIsModalOpen(false);
      return;
    }
    const payload = {
      name: formData.name,
      amount: formData.value,
      type: formData.valueType,
      status: formData.status ? "active" : "inactive",
    } as const;

    const response =
      type === "bonus"
        ? await updateBonus.mutateAsync({ id: editingItem.id, data: payload })
        : await updateDeduction.mutateAsync({ id: editingItem.id, data: payload });

    type APIEntity = {
      id?: string;
      name?: string;
      amount?: number;
      type?: "fixed" | "percentage";
      status?: "active" | "inactive";
      updatedAt?: string;
    };
    const data = (response as unknown as ApiResponse<APIEntity> | undefined)?.data ?? ({} as APIEntity);
    setItems((previous) =>
      previous.map((item) =>
        item.id === editingItem.id
          ? {
              ...item,
              name: data.name ?? formData.name,
              valueType: (data.type ?? formData.valueType) as "percentage" | "fixed",
              value: Number(data.amount ?? formData.value ?? 0),
              status: (data.status ?? (formData.status ? "active" : "inactive")) as "active" | "inactive",
              updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
            }
          : item,
      ),
    );
    setEditingItem(null);
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    const hasRemote = !!policyId || !!profileId;
    if (hasRemote) {
      await (type === "bonus" ? deleteBonus.mutateAsync(id) : deleteDeduction.mutateAsync(id));
    }
    setItems((previous) => previous.filter((item) => item.id !== id));

    const title = type === "bonus" ? "Bonus Deleted" : "Deduction Deleted";
    const description =
      type === "bonus" ? "Bonus has been deleted successfully!" : "Deduction has been deleted successfully!";

    setDeletedAlertTitle(title);
    setDeletedAlertDescription(description);
    setIsDeletedAlertOpen(true);
  };

  const handleToggleStatus = async (id: string) => {
    const current = items.find((item) => item.id === id);
    const nextStatus = current?.status === "active" ? "inactive" : "active";
    const hasRemote = !!policyId || !!profileId;
    if (hasRemote && current) {
      const payload = { status: nextStatus } as const;
      await (type === "bonus"
        ? updateBonus.mutateAsync({ id, data: payload })
        : updateDeduction.mutateAsync({ id, data: payload }));
    }
    setItems((previous) =>
      previous.map((item) =>
        item.id === id
          ? {
              ...item,
              status: nextStatus || item.status,
              updatedAt: new Date(),
            }
          : item,
      ),
    );
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleAddClick = (event: React.BaseSyntheticEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setEditingItem(null);
    setIsModalOpen(true);
  };

  // Notify parent on any items change
  useEffect(() => {
    onChange?.(items);
  }, [items, onChange]);

  const isRemoteContext = !!policyId || !!profileId;
  const isPayslipUpdating =
    isRemoteContext &&
    (createBonus.isPending ||
      updateBonus.isPending ||
      deleteBonus.isPending ||
      createDeduction.isPending ||
      updateDeduction.isPending ||
      deleteDeduction.isPending);

  return (
    <>
      {isPayslipUpdating && (
        <div className="text-muted-foreground mb-2 flex items-center gap-2 text-xs">
          {/* <LoadingSp size={16} /> */}
          <span>Updating payslip...</span>
        </div>
      )}
      <BonusDeductionTable
        items={items}
        type={type}
        onAdd={handleAddClick}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
      />

      <BonusDeductionFormModal
        open={isModalOpen}
        onOpenChange={handleModalClose}
        onSubmit={editingItem ? handleEditSubmit : handleAdd}
        type={type}
        initialData={
          editingItem
            ? {
                name: editingItem.name,
                valueType: editingItem.valueType ?? "fixed",
                value: editingItem.value,
                status: editingItem.status === "active",
                type: editingItem.type,
              }
            : undefined
        }
        isEditing={!!editingItem}
      />

      {/* Delete success alert - independent of any dialog */}
      <AlertModal
        isOpen={isDeletedAlertOpen}
        onClose={() => setIsDeletedAlertOpen(false)}
        type="success"
        title={deletedAlertTitle}
        description={deletedAlertDescription}
        confirmText="Close"
        showCancelButton={false}
        autoClose={false}
      />
    </>
  );
}
