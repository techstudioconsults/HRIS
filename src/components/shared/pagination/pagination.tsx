import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import React from "react";

interface PaginationsProperties {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Paginations: React.FC<PaginationsProperties> = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageChange = (page: number, event: React.MouseEvent) => {
    event.preventDefault();
    onPageChange(page);
  };

  return (
    <div>
      <Pagination className="w-[300px]">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              size={"default"}
              onClick={(event) => {
                event.preventDefault();
                handlePageChange(Math.max(currentPage - 1, 1), event);
              }}
              // disabled={currentPage === 1}
            />
          </PaginationItem>

          {Array.from({ length: totalPages }, (_, index) => (
            <PaginationItem key={index + 1}>
              <PaginationLink
                href="#"
                size={"default"}
                onClick={(event) => handlePageChange(index + 1, event)}
                className={`${currentPage === index + 1 ? "bg-primary text-white" : ""}`}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              href="#"
              size={"default"}
              onClick={(event) => {
                event.preventDefault();
                handlePageChange(Math.min(currentPage + 1, totalPages), event);
              }}
              // disabled={currentPage === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};
