"use client";

import { industryOptions, sizeOptions } from "@/lib/tools/constants";
import { useOnboardingService } from "@/modules/@org/onboarding/services/use-onboarding-service";
import { CompanyProfileFormData, companyProfileSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@workspace/ui/components/label";
import { useLocationData } from "@workspace/ui/hooks";
import { ComboBox, FormField } from "@workspace/ui/lib";
import { MainButton } from "@workspace/ui/lib/button";
import { cn } from "@workspace/ui/lib/utils";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useRef } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

export const AccountSettingsTab = () => {
  const { data: session } = useSession();
  const { useGetCompanyProfile, useUpdateCompanyProfile } = useOnboardingService();

  const employeeFullName = session?.user.employee.fullName || "";
  const [adminFirstName, adminLastName] = useMemo(() => {
    const parts = employeeFullName.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return ["-", "-"] as const;
    const [first, ...rest] = parts;
    return [first || "-", rest.join(" ") || "-"] as const;
  }, [employeeFullName]);

  const { data: companyProfile, isPending: isLoadingCompanyProfile } = useGetCompanyProfile();
  const { mutateAsync: updateCompanyProfile, isPending: isSaving } = useUpdateCompanyProfile();

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

  const lastLoadedValuesReference = useRef<CompanyProfileFormData | null>(null);

  const methods = useForm<CompanyProfileFormData>({
    resolver: zodResolver(companyProfileSchema),
    defaultValues: {
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
    mode: "onChange",
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

  const hydratedValues = useMemo<CompanyProfileFormData | null>(() => {
    if (!companyProfile) return null;

    return {
      name: companyProfile?.name || "",
      industry: companyProfile?.industry || "",
      size: companyProfile?.size || "",
      addressLine1: companyProfile?.address?.addressLine1 || "",
      addressLine2: companyProfile?.address?.addressLine2 || ".",
      city: companyProfile?.address?.city || "",
      state: companyProfile?.address?.state || "",
      country: companyProfile?.address?.country || "",
      postcode: companyProfile?.address?.postcode || "",
    };
  }, [companyProfile]);

  useEffect(() => {
    if (!hydratedValues) return;
    reset(hydratedValues);
    lastLoadedValuesReference.current = hydratedValues;
  }, [hydratedValues, reset]);

  const isDisabled = isLoadingCompanyProfile || isSaving;

  const onSubmit = async (data: CompanyProfileFormData) => {
    await updateCompanyProfile(data, {
      onSuccess: () => {
        toast.success("Settings updated", {
          description: "Account settings saved successfully.",
        });
      },
      onError: () => {
        toast.error("Failed to update settings", {
          description: "Please try again.",
        });
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold">Account Settings</h2>
        <p className="text-muted-foreground mt-1 text-sm">Manage your company profile and preferences</p>
      </div>

      <div className="bg-background shadow rounded-lg border border-none p-6">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
            {/* Company Information */}
            <section className="space-y-4">
              <h3 className="text-base font-semibold">Company Information</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
                <FormField
                  name="name"
                  label="Company Name"
                  type="text"
                  placeholder={isLoadingCompanyProfile ? "Loading..." : "Enter company name"}
                  className="border-border !h-14 w-full"
                  disabled={isDisabled}
                  required
                />

                <div className="space-y-2">
                  <Label className="text-[16px] font-medium">Company Domain</Label>
                  <div
                    className={cn(
                      "border-border bg-muted flex h-14 w-full items-center rounded-md border px-4 text-sm",
                      "text-muted-foreground",
                    )}
                  >
                    {companyProfile?.domain || (isLoadingCompanyProfile ? "Loading..." : "-")}
                  </div>
                </div>

                <FormField
                  name="industry"
                  label="Industry"
                  type="select"
                  placeholder={isLoadingCompanyProfile ? "Loading..." : "Select industry"}
                  className="bg-background border-border !h-14 w-full"
                  options={industryOptions}
                  disabled={isDisabled}
                  required
                />

                <FormField
                  name="size"
                  label="Company Size"
                  type="select"
                  placeholder={isLoadingCompanyProfile ? "Loading..." : "Select company size"}
                  className="bg-background border-border !h-14 w-full"
                  options={sizeOptions}
                  disabled={isDisabled}
                  required
                />
              </div>
            </section>

            {/* Primary Admin Information */}
            <section className="space-y-4">
              <h3 className="text-base font-semibold">Primary Admin Information</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
                <div className="space-y-2">
                  <Label className="text-[16px] font-medium">First Name</Label>
                  <div className="border-border bg-muted h-14 w-full rounded-md border px-4 py-4 text-sm text-gray-700">
                    {adminFirstName}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[16px] font-medium">Last Name</Label>
                  <div className="border-border bg-muted h-14 w-full rounded-md border px-4 py-4 text-sm text-gray-700">
                    {adminLastName}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[16px] font-medium">Email</Label>
                  <div className="border-border bg-muted h-14 w-full rounded-md border px-4 py-4 text-sm text-gray-700">
                    {session?.user.employee.email || "-"}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[16px] font-medium">Role</Label>
                  <div className="border-border bg-muted h-14 w-full rounded-md border px-4 py-4 text-sm text-gray-700">
                    {session?.user.employee.role?.name || "-"}
                  </div>
                </div>
              </div>
            </section>

            {/* Address Details */}
            <section className="space-y-4">
              <h3 className="text-base font-semibold">Address Details</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
                <FormField
                  name="addressLine1"
                  label="Address Line 1"
                  type="text"
                  placeholder={isLoadingCompanyProfile ? "Loading..." : "Enter address"}
                  className="border-border !h-14 w-full"
                  disabled={isDisabled}
                  required
                />

                <FormField
                  name="addressLine2"
                  label="Address Line 2"
                  type="text"
                  placeholder={isLoadingCompanyProfile ? "Loading..." : "Enter address (optional)"}
                  className="border-border !h-14 w-full"
                  disabled={isDisabled}
                />

                <div className="space-y-2">
                  <Label className="text-[16px] font-medium">
                    Country<span className="text-destructive -ml-1">*</span>
                  </Label>
                  <Controller
                    name="country"
                    control={methods.control}
                    render={({ field, fieldState }) => (
                      <ComboBox
                        options={countries}
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder={countriesLoading || isLoadingCompanyProfile ? "Loading..." : "Select your country"}
                        disabled={isDisabled || countriesLoading}
                        className={cn("h-14", fieldState.error && "border-destructive")}
                      />
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[16px] font-medium">
                    State<span className="text-destructive -ml-1">*</span>
                  </Label>
                  <Controller
                    name="state"
                    control={methods.control}
                    render={({ field, fieldState }) => (
                      <ComboBox
                        options={states}
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder={
                          statesLoading || isLoadingCompanyProfile
                            ? "Loading..."
                            : countryValue
                              ? "Select state"
                              : "Select a country first"
                        }
                        disabled={isDisabled || statesLoading || !countryValue}
                        className={cn("h-14", fieldState.error && "border-destructive")}
                      />
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[16px] font-medium">
                    City<span className="text-destructive -ml-1">*</span>
                  </Label>
                  <Controller
                    name="city"
                    control={methods.control}
                    render={({ field, fieldState }) => (
                      <ComboBox
                        options={cities}
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder={
                          citiesLoading || isLoadingCompanyProfile
                            ? "Loading..."
                            : countryValue
                              ? "Select city"
                              : "Select a country first"
                        }
                        disabled={isDisabled || citiesLoading || !countryValue}
                        className={cn("h-14", fieldState.error && "border-destructive")}
                      />
                    )}
                  />
                </div>

                <FormField
                  name="postcode"
                  label="Postal Code"
                  type="text"
                  placeholder={isLoadingCompanyProfile ? "Loading..." : "Enter postal code"}
                  className="border-border !h-14 w-full"
                  disabled={isDisabled}
                  required
                />
              </div>
            </section>

            <div className="flex w-full flex-col gap-3 pt-2 sm:flex-row sm:justify-start">
              <MainButton
                type="button"
                variant="outline"
                className="text-destructive border-destructive w-full sm:w-[200px]"
                isDisabled={isSaving}
                onClick={() => {
                  if (lastLoadedValuesReference.current) reset(lastLoadedValuesReference.current);
                }}
              >
                Cancel
              </MainButton>
              <MainButton
                type="submit"
                variant="primary"
                className="w-full sm:w-[200px]"
                isDisabled={isDisabled || !isValid}
                isLoading={isSaving}
              >
                Save Changes
              </MainButton>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};
