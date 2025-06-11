import MainButton from "@/components/shared/button";
import { ReusableDialog } from "@/components/shared/dialog/Dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState } from "react";

import { SingleEmployeeForm } from "../forms/employee/single-employee";
import { RolesAndPermission } from "../forms/roles&permission";

export const EmployeeConfig = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState<{
    title: string;
    description?: string;
    children?: React.ReactNode;
  }>({ title: "" });

  const handleDialogOpen = (content: { title: string; description?: string; children?: React.ReactNode }) => {
    setDialogContent(content);
    setDialogOpen(true);
  };

  return (
    <>
      <Accordion type="single" collapsible className="w-full space-y-4">
        <AccordionItem className="relative rounded-none !border-b" value="item-2">
          <AccordionTrigger className="p-4 text-left text-sm lg:text-xl/[120%]">
            <p className={`font-semibold`}>Team Member 1</p>
          </AccordionTrigger>
          <AccordionContent className={`space-y-4 border-t py-4 font-medium`}>
            <div className={`flex w-full items-center justify-between`}>
              <SingleEmployeeForm />
            </div>
          </AccordionContent>
        </AccordionItem>
        <MainButton
          variant={`default`}
          size={`sm`}
          isLeftIconVisible
          className={`text-primary text-[16px]`}
          onClick={() =>
            handleDialogOpen({
              title: "Add New Team",
              description: "Create a new team for your organization.",
            })
          }
        >
          Add team member
        </MainButton>
      </Accordion>

      <ReusableDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={dialogContent.title}
        description={dialogContent.description}
        className={``}
      >
        <RolesAndPermission />
      </ReusableDialog>
    </>
  );
};
