"use client";

import { AlertModal } from "@/components/shared/dialog/alert-modal";
import { useState } from "react";

import { BonusDeduction, BonusDeductionFormData } from "../types";
import { BonusDeductionFormModal } from "./bonus-deduction-form-modal";
import { BonusDeductionTable } from "./bonus-deduction-table";

interface BonusDeductionManagerProperties {
  type: "bonus" | "deduction";
  initialItems?: BonusDeduction[];
}

const generateId = () => {
  return Math.random().toString(36).slice(2, 11);
};

export function BonusDeductionManager({ type, initialItems = [] }: BonusDeductionManagerProperties) {
  const [items, setItems] = useState<BonusDeduction[]>(initialItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BonusDeduction | null>(null);

  // Success alert state for delete actions
  const [isDeletedAlertOpen, setIsDeletedAlertOpen] = useState(false);
  const [deletedAlertTitle, setDeletedAlertTitle] = useState("");
  const [deletedAlertDescription, setDeletedAlertDescription] = useState("");

  const handleAdd = (formData: BonusDeductionFormData) => {
    const newItem: BonusDeduction = {
      id: generateId(),
      name: formData.name,
      valueType: formData.valueType,
      value: formData.value,
      status: formData.status ? "active" : "inactive",
      type: formData.type,
      createdAt: new Date(),
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

  const handleEditSubmit = (formData: BonusDeductionFormData) => {
    if (editingItem) {
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
    }
  };

  const handleDelete = (id: string) => {
    setItems((previous) => previous.filter((item) => item.id !== id));

    const title = type === "bonus" ? "Bonus Deleted" : "Deduction Deleted";
    const description =
      type === "bonus" ? "Bonus has been deleted successfully!" : "Deduction has been deleted successfully!";

    setDeletedAlertTitle(title);
    setDeletedAlertDescription(description);
    setIsDeletedAlertOpen(true);
  };

  const handleToggleStatus = (id: string) => {
    setItems((previous) =>
      previous.map((item) =>
        item.id === id
          ? {
              ...item,
              status: item.status === "active" ? "inactive" : "active",
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
