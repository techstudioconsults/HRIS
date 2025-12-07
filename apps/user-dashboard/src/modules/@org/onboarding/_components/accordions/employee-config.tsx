import { MainButton } from "@workspace/ui/lib/button";
import { useFieldArray, useFormContext } from "react-hook-form";

import { Employee } from "../../_views/step-three";
import { useTour } from "../../context/tour-context";
import { SingleEmployeeForm } from "../forms/employee/single-employee";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@workspace/ui/components/accordion";

export const EmployeeConfig = () => {
  const { stopTour } = useTour();
  const { control } = useFormContext<{ employees: Employee[] }>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "employees",
  });

  const addTeamMember = () => {
    stopTour();
    append({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "PleaseSetAdefaultHere1.",
      teamId: "",
      roleId: "",
    });
  };

  const removeTeamMember = (index: number) => {
    if (fields.length <= 1) return;
    remove(index);
  };

  return (
    <>
      <div className="max-h-[500px] space-y-4 overflow-auto">
        <Accordion
          type="multiple"
          className="w-full space-y-8"
          defaultValue={fields.map((field) => `member-${field.id}`)}
        >
          {fields.map((field, index) => (
            <AccordionItem key={field.id} value={`member-${field.id}`} className="relative">
              <AccordionTrigger className="cursor-pointer p-4 text-left text-sm lg:text-lg">
                <div className="flex w-full items-center justify-between">
                  <p className="font-semibold">
                    {field.firstName ? `${field.firstName} ${field.lastName}` : `Team Member ${index + 1}`}
                  </p>
                  {fields.length > 1 && (
                    <span
                      onClick={(event) => {
                        event.stopPropagation();
                        removeTeamMember(index);
                      }}
                      className="text-destructive hover:text-destructive cursor-pointer text-xs"
                    >
                      Remove
                    </span>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 border-t px-0.5 py-4 font-medium">
                <SingleEmployeeForm index={index} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      <div data-tour="add-another-employee" className="w-fit">
        <MainButton
          variant="default"
          size="sm"
          isLeftIconVisible
          className="text-primary text-[16px]"
          onClick={addTeamMember}
          type="button"
        >
          Add team member
        </MainButton>
      </div>
    </>
  );
};
