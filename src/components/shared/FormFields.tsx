"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { BlurImage } from "../core/miscellaneous/blur-image";
import { Badge } from "../ui/badge";
import { Checkbox } from "../ui/checkbox";
import { Switch } from "../ui/switch";

interface FormFieldProperties {
  label?: string;
  labelDetailedNode?: React.ReactNode;
  name: string;
  type?: "text" | "textarea" | "select" | "number" | "password" | "email";
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options?: { value: string; label: string }[];
  className?: string;
  containerClassName?: string;
  leftAddon?: React.ReactNode; // Add left icon or button
  rightAddon?: React.ReactNode; // Add right icon or button
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function FormField({
  label,
  name,
  type = "text",
  placeholder,
  required = false,
  disabled = false,
  options = [],
  className = "",
  containerClassName,
  leftAddon,
  rightAddon,
  labelDetailedNode,
  onChange,
}: FormFieldProperties) {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const error = errors[name];
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((previous) => !previous);
  };

  return (
    <div className="space-y-2">
      {label && (
        <div>
          <Label className="text-[16px] font-medium">
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </Label>
          {labelDetailedNode && <div className="text-mid-grey-II text-xs">{labelDetailedNode}</div>}
        </div>
      )}

      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const inputClassName = cn("flex h-10 w-full border-gray-100", error && "border-destructive", className);

          const inputWithAddons = (
            <div className={cn(`flex items-center gap-2`, containerClassName)}>
              {leftAddon && <div className="flex items-center">{leftAddon}</div>}
              {type === "textarea" ? (
                <Textarea
                  {...field}
                  placeholder={placeholder}
                  disabled={disabled}
                  className={cn(inputClassName, "resize-y")}
                />
              ) : type === "select" ? (
                <Select onValueChange={field.onChange} value={field.value} disabled={disabled}>
                  <SelectTrigger className={cn(inputClassName, "w-full")}>
                    <SelectValue placeholder={placeholder} />
                  </SelectTrigger>
                  <SelectContent className={`bg-background`}>
                    {options.map((option, index) => (
                      <SelectItem key={index} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : type === "number" ? (
                <input
                  {...field}
                  type="number"
                  placeholder={placeholder}
                  disabled={disabled}
                  className={inputClassName}
                  value={field.value || ""}
                  onChange={(event) => field.onChange(event.target.valueAsNumber)}
                />
              ) : type === "password" ? (
                <div className="relative w-full">
                  <Input
                    {...field}
                    type={showPassword ? "text" : "password"}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={inputClassName}
                    onChange={(event) => {
                      field.onChange(event);
                      onChange?.(event);
                    }}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              ) : (
                <Input
                  {...field}
                  type={type}
                  placeholder={placeholder}
                  disabled={disabled}
                  className={inputClassName}
                />
              )}
              {rightAddon && <div className="flex items-center">{rightAddon}</div>}
            </div>
          );

          return inputWithAddons;
        }}
      />

      {error && <p className="text-destructive text-sm">{error.message?.toString()}</p>}
    </div>
  );
}

export function MultiSelect({
  label,
  name,
  options,
  placeholder = "Select options",
  required = false,
  className = "",
}: {
  label?: string;
  name: string;
  options: { value: string; label: string; thumbnail?: string | File | null }[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}) {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const error = errors[name];

  return (
    <div className="space-y-2">
      {label && (
        <Label className="text-[16px] font-medium">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}

      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const selectedValues = field.value || [];

          const handleSelect = (value: string) => {
            const newSelectedValues = selectedValues.includes(value)
              ? selectedValues.filter((v: string) => v !== value) // Deselect if already selected
              : [...selectedValues, value]; // Select if not already selected
            field.onChange(newSelectedValues);
          };

          return (
            <>
              <Select>
                <SelectTrigger className={cn(error && "border-destructive", className)}>
                  <SelectValue placeholder={placeholder}>
                    {selectedValues.length > 0 ? `${selectedValues.length} selected` : placeholder}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {options.map((option) => (
                    <section
                      key={option.value}
                      className="flex items-center justify-between space-x-2 p-2"
                      onClick={() => handleSelect(option.value)}
                    >
                      <div className="flex items-center space-x-2">
                        {option.thumbnail && (
                          <BlurImage
                            src={typeof option.thumbnail === "string" ? option.thumbnail : ""}
                            alt={option.label}
                            width={40}
                            height={40}
                            className="h-[20px] w-[20px] rounded-full object-cover"
                          />
                        )}

                        <label className="text-sm">{option.label}</label>
                      </div>
                      <Checkbox
                        checked={selectedValues.includes(option.value)}
                        onCheckedChange={() => handleSelect(option.value)}
                      />
                    </section>
                  ))}
                </SelectContent>
              </Select>

              {/* Display selected values below the input */}
              {selectedValues.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedValues.map((value: string) => {
                    const selectedOption = options.find((opt) => opt.value === value);
                    return selectedOption ? (
                      <Badge key={value} className="text-xs">
                        {selectedOption.thumbnail && (
                          <Image
                            src={typeof selectedOption.thumbnail === "string" ? selectedOption.thumbnail : ""}
                            alt={selectedOption.label}
                            width={40}
                            height={40}
                            className="mr-1 h-[20px] w-[20px] rounded-full object-cover"
                          />
                        )}
                        {selectedOption.label}
                      </Badge>
                    ) : null;
                  })}
                </div>
              )}
            </>
          );
        }}
      />

      {error && <p className="text-destructive text-sm">{error.message?.toString()}</p>}
    </div>
  );
}

export function SwitchField({
  label,
  name,
  required = false,
  disabled = false,
  description,
  className = "",
  onChange, // Add an onChange prop
}: {
  label?: string | React.ReactNode;
  name: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  description?: string;
  onChange?: (checked: boolean) => void; // Callback function to handle switch toggle
}) {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const error = errors[name];

  return (
    <div>
      <div className={cn(className)}>
        {label && (
          <div className={`space-y-1`}>
            <Label className="h-fit font-medium">
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <p className={`text-gray text-xs`}>{description}</p>
          </div>
        )}

        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Switch
              checked={field.value}
              onCheckedChange={(checked) => {
                field.onChange(checked); // Update the form state
                if (onChange) {
                  onChange(checked); // Trigger the onChange callback
                }
              }}
              disabled={disabled}
              className={cn(error && "border-destructive", "mt-0")}
            />
          )}
        />
      </div>

      {error && <p className="text-destructive text-sm">{error.message?.toString()}</p>}
    </div>
  );
}

export const PasswordValidation = ({ password }: { password: string }) => {
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[#$%&@^]/.test(password);

  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center space-x-2">
        <Checkbox className={`rounded-full border-black px-[1px]`} checked={hasMinLength} />
        <span className="text-mid-grey-II text-[10px]">Password should be at least 8 characters long</span>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox className={`rounded-full border-black px-[1px]`} checked={hasUppercase} />
        <span className="text-mid-grey-II text-[10px]">Password should contain at least one uppercase letter</span>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox className={`rounded-full border-black px-[1px]`} checked={hasNumber} />
        <span className="text-mid-grey-II text-[10px]">Password should contain at least one number</span>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox className={`rounded-full border-black px-[1px]`} checked={hasSpecialChar} />
        <span className="text-mid-grey-II text-[10px]">
          Password should contain at least one special character (@#$%^&)
        </span>
      </div>
    </div>
  );
};
// export {};
