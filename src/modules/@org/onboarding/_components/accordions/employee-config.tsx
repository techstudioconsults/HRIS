import MainButton from "@/components/shared/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

import { SingleEmployeeForm } from "../forms/employee/single-employee";

export const EmployeeConfig = () => {
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
          // onClick={
          //   // add more accordion form
          // }
        >
          Add team member
        </MainButton>
      </Accordion>
    </>
  );
};
