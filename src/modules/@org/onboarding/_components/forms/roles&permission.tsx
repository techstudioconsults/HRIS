/* eslint-disable no-console */
"use client";

import MainButton from "@/components/shared/button";
import { FormField, SwitchField } from "@/components/shared/FormFields";
import { Label } from "@/components/ui/label";
import { RegisterFormData, registerSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

// import { toast } from "sonner";

export const RolesAndPermission = () => {
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
    <section>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-4">
          <div>
            <FormField placeholder={`Enter role`} className={`h-14 w-full`} label={`Role Name`} name={"role"} />
          </div>
          <div className={`space-y-2`}>
            <Label className={`mb-5 text-[16px] font-medium`}>Role Permission</Label>
            <div className={`space-y-4`}>
              <SwitchField name={"payrole"} label={`Payrole`} className={`flex items-center justify-between`} />
              <SwitchField
                name={"leave-management"}
                label={`Leave Management`}
                className={`flex items-center justify-between`}
              />
              <SwitchField name={"attendance"} label={`Attendance`} className={`flex items-center justify-between`} />
              <SwitchField name={"file"} label={`File & Documents`} className={`flex items-center justify-between`} />
              <SwitchField
                name={"settings"}
                label={`View Company Settings`}
                className={`flex items-center justify-between`}
              />
              <SwitchField
                name={"announcement"}
                label={`Announcement`}
                className={`flex items-center justify-between`}
              />
            </div>
          </div>
          <div className="mt-6 flex items-center gap-4">
            <MainButton
              variant="outline"
              //   isDisabled={isSubmitting}
              //   isLoading={isSubmitting}
              className="w-full font-semibold"
              size="xl"
            >
              Cancel
            </MainButton>
            <MainButton
              type="submit"
              onClick={handleSubmit(handleSubmitForm)}
              variant="primary"
              //   isDisabled={isSubmitting}
              //   isLoading={isSubmitting}
              className="w-full"
              size="xl"
            >
              Continue
            </MainButton>
          </div>
        </form>
      </FormProvider>
    </section>
  );
};
