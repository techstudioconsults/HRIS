/* eslint-disable no-console */
"use client";

import { ReusableDialog } from "@/components/shared/dialog/Dialog";
import { FormField } from "@/components/shared/FormFields";
import { Label } from "@/components/ui/label";
import { RegisterFormData, registerSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { EmployeeRolesAndPermission } from "./employee-roles&permission";

export const SingleEmployeeForm = () => {
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

  const methods = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    // defaultValues: {
    //   full_name: "",
    //   email: "",
    //   password: "",
    //   password_confirmation: "",
    // },
  });

  const {
    handleSubmit,
    // formState: { isSubmitting },
    // watch,
  } = methods;

  const handleSubmitForm = async (data: RegisterFormData) => {
    console.log("Registering user with data:", data);
  };

  return (
    <section className="w-full">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleSubmitForm)} className="">
          <section className={`space-y-4`}>
            <FormField
              placeholder={`Enter first name`}
              className={`h-14 w-full`}
              label={`First Name`}
              name={"first_name"}
            />
            <FormField
              placeholder={`Enter last name`}
              className={`h-14 w-full`}
              label={`Last Name`}
              name={"last_name"}
            />
            <FormField
              type={`email`}
              placeholder={`Enter email address`}
              className={`h-14 w-full`}
              label={`Email Address`}
              name={"email_address"}
            />
            <FormField
              placeholder={`Enter phone number`}
              className={`h-14 w-full`}
              label={`Phone Number`}
              name={"email_address"}
            />
            <FormField
              type={`select`}
              placeholder={`Select department`}
              className={`!h-14 w-full`}
              label={`Department`}
              name={"department"}
            />
            <FormField
              type={`select`}
              placeholder={`Select role`}
              className={`!h-14 w-full`}
              label={`Role`}
              name={"role"}
            />
            <div>
              <Label className={`mb-2 text-[16px]`}>Customize Permissions</Label>
              <div
                onClick={(event) => {
                  event.stopPropagation();
                  handleDialogOpen({
                    title: "Customize Permissions",
                    description:
                      "You can tailor what this employee can view or manage on the platform. These permissions apply only to this employee and can be changed later..",
                  });
                }}
                className={`flex h-14 cursor-pointer items-center justify-between rounded-lg border px-4`}
              >
                <span>Show Permission</span>
                <span>
                  <ChevronRight size={16} className={`text-gray`} />
                </span>
              </div>
            </div>
          </section>
        </form>
      </FormProvider>
      <ReusableDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={dialogContent.title}
        description={dialogContent.description}
        className={``}
      >
        <EmployeeRolesAndPermission />
      </ReusableDialog>
    </section>
  );
};
