"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  // Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MainButton } from "@workspace/ui/lib/button";
import { cn } from "@workspace/ui/lib/utils";
// import { MoreHorizontal } from "lucide-react";
import { Add, Export, Filter, More } from "iconsax-reactjs";
import Image from "next/image";
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
          <h1 className="text-2xl font-bold">Employee</h1>
          <p>All Employees</p>
        </div>
        <div className="">
          <div className="flex items-center gap-2">
            <Input placeholder="Filter employees..." className="border-gray-75 h-10 border-1" />
            <MainButton
              className="border-gray-75 bg-background border-1 px-3 text-black dark:text-white"
              variant="outline"
              isLeftIconVisible={true}
              size="lg"
              icon={<Filter />}
            >
              Filter
            </MainButton>
            <MainButton
              className="border-gray-75 bg-background border-1 px-3 text-black dark:text-white"
              variant="outline"
              size="lg"
              isLeftIconVisible={true}
              icon={<Export />}
            >
              Export
            </MainButton>
            <Link href="/admin/employees/add-employee">
              <MainButton variant="primary" isLeftIconVisible={true} size="lg" icon={<Add />}>
                Add Employee
              </MainButton>
            </Link>
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
      <div className="bg-background">
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
                <TableCell className="flex items-center gap-2 font-medium">
                  <Image src="/images/Frame 20955855692.svg" alt="employee image" width="30" height="30" />
                  <span>{employee.name}</span>
                </TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.role}</TableCell>
                <TableCell>{employee.department}</TableCell>
                <TableCell>
                  <span
                    className={cn("inline-flex items-center rounded-full px-3 py-1 text-xs font-medium", {
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

      <div className="flex w-full items-center justify-between">
        {/* Entries per page */}
        <div className="text-muted-foreground text-sm whitespace-nowrap">{itemsPerPage} Entries per page</div>

        {/* Page info */}
        <div className="flex flex-grow justify-center">
          <span className="text-muted-foreground text-sm">
            Page {currentPage} of {totalPages}
          </span>
        </div>

        <PaginationContent className="flex items-center gap-1">
          <PaginationItem>
            <PaginationPrevious
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              // disabled={currentPage === 1}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} />
          </PaginationItem>
        </PaginationContent>
      </div>
    </div>
  );
}
