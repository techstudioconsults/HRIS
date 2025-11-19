import { PageSection, PageWrapper } from "@/lib/animation";

import { EditEmployeeForm } from "../../_components/forms/edit-employee";

export const EditEmployee = () => {
  return (
    <PageWrapper>
      <PageSection index={0}>
        <EditEmployeeForm />
      </PageSection>
    </PageWrapper>
  );
};
