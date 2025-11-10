"use client";

import { AlertModal } from "@/components/shared/dialog/alert-modal";
import { useEffect, useState } from "react";

import { usePayrollService } from "../services/use-service";
import { BonusDeduction, BonusDeductionFormData } from "../types";
import { BonusDeductionFormModal } from "./bonus-deduction-form-modal";
import { BonusDeductionTable } from "./bonus-deduction-table";

interface BonusDeductionManagerProperties {
  type: "bonus" | "deduction";
  initialItems?: BonusDeduction[];
  onChange?: (items: BonusDeduction[]) => void;
  policyId?: string; // Needed for API calls
}

const generateId = () => {
  return Math.random().toString(36).slice(2, 11);
};

export function BonusDeductionManager({
  type,
  initialItems = [],
  onChange,
  policyId,
}: BonusDeductionManagerProperties) {
  const [items, setItems] = useState<BonusDeduction[]>(initialItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BonusDeduction | null>(null);

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
    // If no policy, fallback to local-only behavior
    if (!policyId) {
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
      payrollPolicyId: policyId,
    };

    const response =
      type === "bonus" ? await createBonus.mutateAsync(payload) : await createDeduction.mutateAsync(payload);

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

  const handleEditSubmit = async (formData: BonusDeductionFormData) => {
    if (!editingItem) return;

    if (!policyId) {
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
    if (policyId) {
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
    if (policyId && current) {
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

  return (
    <>
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
                valueType: editingItem.valueType,
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
