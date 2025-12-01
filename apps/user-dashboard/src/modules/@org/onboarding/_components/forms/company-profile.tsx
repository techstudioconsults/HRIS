"use client";

import { industryOptions, sizeOptions } from "@/lib/tools/constants";
import { CompanyProfileFormData, companyProfileSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocationData } from "@workspace/ui/hooks";
import { ComboBox, FormField, FormHeader } from "@workspace/ui/lib";
import { MainButton } from "@workspace/ui/lib/button";
import { cn } from "@workspace/ui/lib/utils";
import { AxiosError } from "axios";
import { Building2 } from "lucide-react";
import Link from "next/link";
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

  const {
    countries,
    states,
    cities,
    selectedCountry,
    selectedState,
    countriesLoading,
    statesLoading,
    citiesLoading,
    handleCountryChange,
    handleStateChange,
  } = useLocationData();

  const methods = useForm<CompanyProfileFormData>({
    resolver: zodResolver(companyProfileSchema),
    defaultValues: {
      // domain: "",
      name: "",
      industry: "",
      size: "",
      addressLine1: "",
      addressLine2: ".",
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
    watch,
  } = methods;

  const countryValue = watch("country");
  const stateValue = watch("state");

  useEffect(() => {
    if (countryValue !== selectedCountry) {
      handleCountryChange(countryValue || null);
    }
  }, [countryValue, selectedCountry, handleCountryChange]);

  useEffect(() => {
    if (stateValue !== selectedState) {
      handleStateChange(stateValue || null);
    }
  }, [stateValue, selectedState, handleStateChange]);

  const handleSubmitForm = async (data: CompanyProfileFormData) => {
    await updateCompanyProfile(data, {
      onSuccess: () => {
        toast.success("Company's Profile", {
          description: `Company profile saved successfully`,
        });
        router.push(`/onboarding/step-2`);
      },
      onError: (error) => {
        toast.error("Failed to save company profile", {
          description: error instanceof AxiosError ? error.response?.data?.message : "An unknown error occurred",
        });
      },
    });
  };

  useEffect(() => {
    if (companyProfile) {
      reset({
        // domain: companyProfile?.data.domain || "",
        name: companyProfile?.name || "",
        industry: companyProfile?.industry || "",
        size: companyProfile?.size || "",
        addressLine1: companyProfile?.address?.addressLine1 || "",
        addressLine2: companyProfile?.address?.addressLine2 || ".",
        city: companyProfile?.address?.city || "",
        state: companyProfile?.address?.state || "",
        country: companyProfile?.address?.country || "",
        postcode: companyProfile?.address?.postcode || "",
      });
    }
  }, [companyProfile, reset]);

  return (
    <section data-tour="company-form" className="border-border rounded-[10px] border p-7">
      <div className={`mb-8 space-y-2`}>
        <FormHeader
          icon={<Building2 />}
          title="Set up your company profile"
          subTitle="Complete your company information to get started"
        />
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleSubmitForm)}>
          <section className={`hide-scrollba max-h-[500px] space-y-4 overflow-auto px-1`}>
            <div>
              <FormField
                placeholder={isPending ? `Getting company's profile` : `"Enter company name"`}
                className="h-12 w-full"
                label="Company's Name"
                name="name"
                // readOnly
              />
            </div>

            <div>
              <FormField
                type="select"
                placeholder={isPending ? `Getting company's profile` : `Select industry`}
                className="!h-12 w-full"
                label="Industry"
                name="industry"
                options={industryOptions}
                required
              />
            </div>

            <div>
              <FormField
                type="select"
                placeholder={isPending ? `Getting company's profile` : `Select size`}
                className="!h-12 w-full"
                label="Company Size"
                name="size"
                options={sizeOptions}
                required
              />
            </div>

            <div>
              <FormField
                placeholder={isPending ? `Getting company's profile` : `Enter address line 1`}
                className="h-12 w-full"
                label="Address Line 1"
                name="addressLine1"
                required
              />
            </div>

            <FormField
              placeholder={isPending ? `Getting company's profile` : `Enter address line 2 (optional)`}
              className="h-12 w-full"
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
                    placeholder={
                      countriesLoading
                        ? "Loading countries..."
                        : isPending
                          ? `Getting company's profile`
                          : `Select your country`
                    }
                    disabled={isPending || countriesLoading}
                    className={cn(`h-12`, fieldState.error && "border-destructive")}
                  />
                )}
              />
            </div>

            <div className="space-y-2">
              <div>
                <label className="text-[16px] font-medium">
                  State
                  <span className="text-destructive -ml-1">*</span>
                </label>
              </div>
              <Controller
                name="state"
                control={methods.control}
                render={({ field, fieldState }) => (
                  <ComboBox
                    options={states}
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder={
                      statesLoading
                        ? "Loading states..."
                        : countryValue
                          ? isPending
                            ? `Getting company's profile`
                            : `Select state`
                          : "Select a country first"
                    }
                    disabled={isPending || statesLoading || !countryValue}
                    className={cn(`h-12`, fieldState.error && "border-destructive")}
                  />
                )}
              />
            </div>

            <div className="space-y-2">
              <div>
                <label className="text-[16px] font-medium">
                  City
                  <span className="text-destructive -ml-1">*</span>
                </label>
              </div>
              <Controller
                name="city"
                control={methods.control}
                render={({ field, fieldState }) => (
                  <ComboBox
                    options={cities}
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder={
                      citiesLoading
                        ? "Loading cities..."
                        : countryValue
                          ? isPending
                            ? `Getting company's profile`
                            : `Select city`
                          : "Select a country first"
                    }
                    disabled={isPending || citiesLoading || !countryValue}
                    className={cn(`h-12`, fieldState.error && "border-destructive")}
                  />
                )}
              />
            </div>

            <FormField
              placeholder={isPending ? `Getting company's profile` : `Enter postal code`}
              className="!h-12 w-full"
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
              size="xl"
            >
              Continue
            </MainButton>
            <div className="flex w-full items-center justify-center py-5">
              <Link
                data-tour="skip-form"
                href={`/admin/dashboard`}
                className="text-primary font-medium hover:underline"
              >
                Skip for Later
              </Link>
            </div>
          </div>
        </form>
      </FormProvider>
    </section>
  );
};
