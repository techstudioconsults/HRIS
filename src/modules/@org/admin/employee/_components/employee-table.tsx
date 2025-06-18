"use client";

import MainButton from "@/components/shared/button";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
// import { MoreHorizontal } from "lucide-react";
import { Add, Export, Filter, More } from "iconsax-reactjs";
import Link from "next/link";
import { useState } from "react";

interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: string;
}

interface EmployeeTableProperties {
  employees: Employee[];
  departments: string[];
  roles: string[];
  className?: string;
}

export function EmployeeTable({ employees, className }: EmployeeTableProperties) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(employees.length / itemsPerPage);

  // Get current page employees
  // const currentEmployees = employees.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Filter Controls */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="">
          <h1 className="text-2xl font-bold">Employees</h1>
          <p>All Employee</p>
        </div>
        <div className="">
          <div className="flex items-center gap-2">
            <Input placeholder="Filter employees..." className="h-8" />
            <MainButton
              className="border-gray-75 text-black dark:text-white"
              variant="outline"
              isLeftIconVisible={true}
              size="sm"
              icon={<Filter />}
            >
              Filter
            </MainButton>
            <MainButton
              className="border-gray-75 text-black dark:text-white"
              variant="outline"
              size="sm"
              isLeftIconVisible={true}
              icon={<Export />}
            >
              Export
            </MainButton>
            <MainButton variant="primary" isLeftIconVisible={true} size="sm" icon={<Add />}>
              Add Employee
            </MainButton>
          </div>
        </div>
        {/* 
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:flex md:gap-2">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Department</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {roles.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="on-leave">On Leave</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Newest first" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="oldest">Oldest first</SelectItem>
              <SelectItem value="name-asc">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
            </SelectContent>
          </Select>
        </div> */}
      </div>

      {/* Employee Table */}
      <div className="border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email Address</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell className="font-medium">{employee.name}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.role}</TableCell>
                <TableCell>{employee.department}</TableCell>
                <TableCell>
                  <span
                    className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", {
                      "bg-green-100 text-green-800": employee.status === "Active",
                      "bg-yellow-100 text-yellow-800": employee.status === "On Leave",
                      "bg-red-100 text-red-800": employee.status === "Inactive",
                    })}
                  >
                    {employee.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Open actions menu">
                        <More className="h-5 w-5 text-black" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white shadow-lg">
                      <DropdownMenuItem>Edit Employee</DropdownMenuItem>
                      <Link href={`/admin/employees/${employee.id}`}>
                        <DropdownMenuItem>View Employee</DropdownMenuItem>
                      </Link>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Custom Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-muted-foreground text-sm">{itemsPerPage} Entries per page</div>

        <Pagination className="mx-0 w-auto">
          <PaginationContent>
            <PaginationItem>
              <span className="text-muted-foreground text-sm">
                Page {currentPage} of {totalPages}
              </span>
            </PaginationItem>
            <PaginationItem>
              <PaginationPrevious
                // variant="outline"
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                // disabled={currentPage === 1}
                className="ml-2"
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                // variant="outline"
                className=""
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                // disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Pagination */}
      {/* <div className="flex items-center justify-between">
        <div className="text-muted-foreground text-sm">
          Showing <strong>1-{employees.length}</strong> of <strong>{employees.length}</strong> employees
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div> */}
    </div>
  );
}
