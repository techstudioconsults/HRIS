"use client";

import MainButton from "@/components/shared/button";
import { FormField } from "@/components/shared/FormFields";
import { WithDependency } from "@/HOC/withDependencies";
import { cityOptions, countries, industryOptions, sizeOptions, stateOptions } from "@/lib/tools/constants";
import { dependencies } from "@/lib/tools/dependencies";
import { CompanyProfileFormData, companyProfileSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

import { OnboardingService } from "../../services/service";

const BaseCompanyProfile = ({ onBoardingService }: { onBoardingService: OnboardingService }) => {
  const router = useRouter();
  const methods = useForm<CompanyProfileFormData>({
    resolver: zodResolver(companyProfileSchema),
    defaultValues: {
      domain: "tsa.com",
      industry: "Tech Education",
      size: "medium",
      addressLine1: "205",
      addressLine2: "lewsham rd",
      city: "Manhattan",
      state: "london",
      country: "united kingdom",
      postcode: "CR20 3NL",
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = methods;

  const handleSubmitForm = async (data: CompanyProfileFormData) => {
    // console.log(data);

    const response = await onBoardingService.updateCompanyProfile(data);

    if (response?.success) {
      toast.success("Company's Profile", {
        description: `Company profile saved successfully`,
      });
      router.push(`/onboarding?step=2`);
    }
  };

  return (
    <section className="rounded-[10px] p-7 shadow-xl">
      <div className={`mb-8 space-y-2`}>
        <h3 className="text-2xl/[120%] font-[600] tracking-[-2%]">Set up your company profile</h3>
        <p className="text-gray-500">Complete your company information to get started</p>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleSubmitForm)}>
          <section className={`hide-scrollbar max-h-[500px] space-y-4 overflow-auto`}>
            <FormField
              placeholder="Enter company name"
              className="h-14 w-full"
              label="Company's Name"
              name="domain"
              required
            />

            <FormField
              type="select"
              placeholder="Select industry"
              className="!h-14 w-full"
              label="Industry"
              name="industry"
              options={industryOptions}
              required
            />

            <FormField
              type="select"
              placeholder="Select size"
              className="!h-14 w-full"
              label="Company Size"
              name="size"
              options={sizeOptions}
              required
            />

            <FormField
              placeholder="Enter address line 1"
              className="h-14 w-full"
              label="Address Line 1"
              name="addressLine1"
              required
            />

            <FormField
              placeholder="Enter address line 2 (optional)"
              className="h-14 w-full"
              label="Address Line 2"
              name="addressLine2"
            />

            <FormField
              type="select"
              placeholder="Select country"
              className="!h-14 w-full"
              label="Country"
              name="country"
              options={countries}
              required
            />

            <FormField
              type="select"
              placeholder="Select state"
              className="!h-14 w-full"
              label="State"
              name="state"
              options={stateOptions}
              required
            />

            <FormField
              type="select"
              placeholder="Select city"
              className="!h-14 w-full"
              label="City"
              name="city"
              options={cityOptions}
              required
            />

            <FormField
              placeholder="Enter postal code"
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
              isDisabled={isSubmitting || !isValid}
              isLoading={isSubmitting}
              className="w-full"
              size="2xl"
            >
              Continue
            </MainButton>
          </div>
        </form>
      </FormProvider>
    </section>
  );
};

export const CompanyProfile = WithDependency(BaseCompanyProfile, {
  onBoardingService: dependencies.ONBOARDING_SERVICE,
});
