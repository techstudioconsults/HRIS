import MainButton from "@/components/shared/button";
import { ReusableDialog } from "@/components/shared/dialog/Dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Plus } from "lucide-react";
import { useState } from "react";

import { RolesAndPermission } from "../forms/roles&permission";

export const TeamConfig = () => {
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
        <AccordionItem className="rounded-lg !border" value="item-2">
          <AccordionTrigger className="flex-row-reverse p-4 text-left text-sm md:text-[16px]">
            <div className={`flex w-full items-center justify-between`}>
              <p>Human Resources</p>
              <div className={`space-x-2 text-sm`}>
                <span
                  className={`text-gray cursor-pointer rounded-md px-3 py-2`}
                  onClick={(event) => {
                    event.stopPropagation();
                    handleDialogOpen({
                      title: "Edit Team",
                      description: "Make changes to the team here.",
                    });
                  }}
                >
                  Edit
                </span>
                <span
                  className={`text-destructive cursor-pointer rounded-md px-3 py-2`}
                  onClick={(event) => {
                    event.stopPropagation();
                    handleDialogOpen({
                      title: "Delete Team",
                      description: "Are you sure you want to delete this team?",
                    });
                  }}
                >
                  Delete
                </span>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className={`space-y-4 border-t p-4 font-medium`}>
            <div className={`flex w-full items-center justify-between`}>
              <p>Human Resources</p>
              <div className={`space-x-2 text-sm`}>
                <MainButton
                  variant={`default`}
                  size={`sm`}
                  className={`text-gray`}
                  onClick={() =>
                    handleDialogOpen({
                      title: "Edit Role",
                      description: "Make changes to the role here.",
                    })
                  }
                >
                  Edit
                </MainButton>
                <MainButton
                  variant={`default`}
                  size={`sm`}
                  className={`text-destructive`}
                  onClick={() =>
                    handleDialogOpen({
                      title: "Delete Role",
                      description: "Are you sure you want to delete this role?",
                    })
                  }
                >
                  Delete
                </MainButton>
              </div>
            </div>
            <div className={`flex w-full items-center justify-between`}>
              <p>Recruiter</p>
              <div className={`space-x-2 text-sm`}>
                <MainButton
                  variant={`default`}
                  size={`sm`}
                  className={`text-gray`}
                  onClick={() =>
                    handleDialogOpen({
                      title: "Edit Role",
                      description: "Make changes to the role here.",
                    })
                  }
                >
                  Edit
                </MainButton>
                <MainButton
                  variant={`default`}
                  size={`sm`}
                  className={`text-destructive`}
                  onClick={() =>
                    handleDialogOpen({
                      title: "Delete Role",
                      description: "Are you sure you want to delete this role?",
                    })
                  }
                >
                  Delete
                </MainButton>
              </div>
            </div>
            <div className={`mt-4`}>
              <span
                className={`text-primary flex cursor-pointer items-center gap-1 font-medium`}
                onClick={() =>
                  handleDialogOpen({
                    title: "Add New Role",
                    description: "Create a new role for this team.",
                  })
                }
              >
                <Plus /> Add New Role
              </span>
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
          Add New Team
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
