"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

export function InputField({
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
    setShowPassword((previous: boolean) => !previous);
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
          const inputClassName = cn(
            "flex h-10 w-full min-w-[400px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-destructive",
            className,
          );

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
                  <SelectContent>
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
