import { PageSection, PageWrapper } from "@/lib/animation";

import { AddEmployeeForm } from "../../_components/forms/add-employee";

export const AddEmployee = () => {
  return (
    <PageWrapper>
      <PageSection index={0}>
        <AddEmployeeForm />
      </PageSection>
    </PageWrapper>
  );
};
