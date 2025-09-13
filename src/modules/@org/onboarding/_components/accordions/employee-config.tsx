import MainButton from "@/components/shared/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useFieldArray, useFormContext } from "react-hook-form";

import { Employee } from "../../_views/step-three";
import { OnboardingService } from "../../services/service";
import { SingleEmployeeForm } from "../forms/employee/single-employee";

export const EmployeeConfig = ({ onBoardingService }: { onBoardingService: OnboardingService }) => {
  const { control } = useFormContext<{ employees: Employee[] }>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "employees",
  });

  const addTeamMember = () => {
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
    <Accordion type="multiple" className="w-full space-y-4">
      {fields.map((field, index) => (
        <AccordionItem key={field.id} value={`member-${field.id}`} className="relative">
          <AccordionTrigger className="p-4 text-left text-sm lg:text-xl/[120%]">
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
                  className="text-destructive hover:text-destructive text-xs"
                >
                  Remove
                </span>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 border-t py-4 font-medium">
            <SingleEmployeeForm index={index} onBoardingService={onBoardingService} />
          </AccordionContent>
        </AccordionItem>
      ))}

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
    </Accordion>
  );
};
