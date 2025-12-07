"use client";

import { formatCurrency } from "@/lib/formatters";
import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table";
import { MainButton } from "@workspace/ui/lib/button";
import { cn } from "@workspace/ui/lib/utils";
import { MoreHorizontal, Plus } from "lucide-react";

import { BonusDeductionTableProperties } from "../types";

const formatValue = (value: number, valueType: "percentage" | "fixed") => {
  if (valueType === "percentage") {
    return `${value}%`;
  }
  return formatCurrency(value);
};

export function BonusDeductionTable({
  items,
  type,
  onAdd,
  onEdit,
  onDelete,
  onToggleStatus,
}: BonusDeductionTableProperties) {
  const getStatusBadge = (status: "active" | "inactive") => {
    return (
      <span
        className={cn("inline-flex items-center rounded-full px-3 py-1 text-xs font-medium", {
          "bg-green-100 text-green-800": status === "active",
          "bg-red-100 text-red-800": status === "inactive",
        })}
      >
        {status === "active" ? "Active" : "Inactive"}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold capitalize">{type}</h3>
      </div>

      <div className="rounded-lg border bg-white">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead className="font-semibold">{type} Name</TableHead>
              <TableHead className="font-semibold">Value Type</TableHead>
              <TableHead className="font-semibold">Value</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="text-right font-semibold">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-gray-500">
                  No {type}s added yet
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="capitalize">{item.valueType}</TableCell>
                  <TableCell>{formatValue(item.value, item.valueType ?? "fixed")}</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            onEdit(item.id, {
                              name: item.name,
                              valueType: item.valueType ?? "fixed",
                              value: item.value,
                              status: item.status === "active",
                              type: item.type,
                            })
                          }
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onToggleStatus(item.id)}>
                          {item.status === "active" ? "Deactivate" : "Activate"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(item.id)} className="text-red-600">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <MainButton icon={<Plus className="h-4 w-4" />} isLeftIconVisible variant="link" size="sm" onClick={onAdd}>
        Add {type}
      </MainButton>
    </div>
  );
}
