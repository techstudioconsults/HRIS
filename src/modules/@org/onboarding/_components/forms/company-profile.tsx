"use client";

import MainButton from "@/components/shared/button";
import { FormField } from "@/components/shared/inputs/FormFields";
import { ComboBox } from "@/components/shared/select-dropdown/combo-box";
import { cityOptions, countries, industryOptions, sizeOptions, stateOptions } from "@/lib/tools/constants";
import { cn } from "@/lib/utils";
import { CompanyProfileFormData, companyProfileSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

import { useOnboardingService } from "../../services/use-onboarding-service";

export const CompanyProfile = () => {
  const { useGetCompanyProfile, useUpdateCompanyProfile } = useOnboardingService();
  const { data: companyProfile, isPending } = useGetCompanyProfile();
  const { mutateAsync: updateCompanyProfile, isPending: isUpdatePending } = useUpdateCompanyProfile();
  const router = useRouter();

  const methods = useForm<CompanyProfileFormData>({
    resolver: zodResolver(companyProfileSchema),
    defaultValues: {
      // domain: "",
      industry: "",
      size: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      country: "",
      postcode: "",
    },
  });

  const {
    handleSubmit,
    formState: { isValid },
    reset,
  } = methods;

  const handleSubmitForm = async (data: CompanyProfileFormData) => {
    await updateCompanyProfile(data, {
      onSuccess: () => {
        toast.success("Company's Profile", {
          description: `Company profile saved successfully`,
        });
        router.push(`/onboarding/step-2`);
      },
    });
  };

  useEffect(() => {
    if (companyProfile) {
      reset({
        // domain: companyProfile?.data.domain || "",
        industry: companyProfile?.data.industry || "",
        size: companyProfile?.data.size || "",
        addressLine1: companyProfile?.data.address?.addressLine1 || "",
        addressLine2: companyProfile?.data.address?.addressLine2 || "",
        city: companyProfile?.data.address?.city || "",
        state: companyProfile?.data.address?.state || "",
        country: companyProfile?.data.address?.country || "",
        postcode: companyProfile?.data.address?.postcode || "",
      });
    }
  }, [companyProfile, reset]);

  return (
    <section className="rounded-[10px] p-7 shadow-xl">
      <div className={`mb-8 space-y-2`}>
        <h3 className="text-2xl/[120%] font-[600] tracking-[-2%]">Set up your company profile</h3>
        <p className="text-gray-500">Complete your company information to get started</p>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleSubmitForm)}>
          <section className={`hide-scrollbar max-h-[500px] space-y-4 overflow-auto px-1`}>
            {/* <FormField
              placeholder={isPending ? `Getting company's profile` : `"Enter company name"`}
              className="h-14 w-full"
              label="Company's Name"
              name="domain"
              required
            /> */}

            <FormField
              type="select"
              placeholder={isPending ? `Getting company's profile` : `Select industry`}
              className="!h-14 w-full"
              label="Industry"
              name="industry"
              options={industryOptions}
              required
            />

            <FormField
              type="select"
              placeholder={isPending ? `Getting company's profile` : `Select size`}
              className="!h-14 w-full"
              label="Company Size"
              name="size"
              options={sizeOptions}
              required
            />

            <FormField
              placeholder={isPending ? `Getting company's profile` : `Enter address line 1`}
              className="h-14 w-full"
              label="Address Line 1"
              name="addressLine1"
              required
            />

            <FormField
              placeholder={isPending ? `Getting company's profile` : `Enter address line 2 (optional)`}
              className="h-14 w-full"
              label="Address Line 2"
              name="addressLine2"
            />

            <div className="space-y-2">
              <div>
                <label className="text-[16px] font-medium">
                  Country
                  <span className="text-destructive -ml-1">*</span>
                </label>
              </div>
              <Controller
                name="country"
                control={methods.control}
                render={({ field, fieldState }) => (
                  <ComboBox
                    options={countries}
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder={isPending ? `Getting company's profile` : `Select your country`}
                    disabled={isPending}
                    className={cn(fieldState.error && "border-destructive")}
                  />
                )}
              />
            </div>

            <FormField
              type="select"
              placeholder={isPending ? `Getting company's profile` : `"Select state"`}
              className="!h-14 w-full"
              label="State"
              name="state"
              options={stateOptions}
              required
            />

            <FormField
              type="select"
              placeholder={isPending ? `Getting company's profile` : `Select city`}
              className="!h-14 w-full"
              label="City"
              name="city"
              options={cityOptions}
              required
            />

            <FormField
              placeholder={isPending ? `Getting company's profile` : `Enter postal code`}
              className="!h-14 w-full"
              label="Postal Code"
              name="postcode"
              required
            />
          </section>

          <div className="pt-8">
            <MainButton
              type="submit"
              variant="primary"
              isDisabled={isUpdatePending || !isValid}
              isLoading={isUpdatePending}
              className="w-full"
              size="2xl"
            >
              Continue
            </MainButton>
            <MainButton
              href={`/admin/dashboard`}
              type="button"
              variant="link"
              className="w-full font-semibold"
              size="2xl"
            >
              Skip for Later
            </MainButton>
          </div>
        </form>
      </FormProvider>
    </section>
  );
};
