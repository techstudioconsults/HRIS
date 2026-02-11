'use client'

import { Label } from '@workspace/ui/components/label'
import { Textarea } from '@workspace/ui/components/textarea'
import { Eye, EyeOff } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { cn } from '../utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select'
import { Input } from '@workspace/ui/components/input'
import { BlurImage } from '@workspace/ui/components/core/miscellaneous/blur-image'
import { Checkbox } from '@workspace/ui/components/checkbox'
import { Badge } from '@workspace/ui/components/badge'
import { Switch } from '@workspace/ui/components/switch'

interface FormFieldProperties {
  label?: string
  labelDetailedNode?: React.ReactNode
  name: string
  type?:
    | 'text'
    | 'textarea'
    | 'select'
    | 'number'
    | 'password'
    | 'email'
    | 'date'
  placeholder?: string
  required?: boolean
  disabled?: boolean
  readOnly?: boolean
  options?: { value: string; label: string }[]
  className?: string
  containerClassName?: string
  leftAddon?: React.ReactNode // Add left icon or button
  rightAddon?: React.ReactNode // Add right icon or button
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  [key: string]: unknown // Allow any additional props like data-tour
}

export function FormField({
  label,
  name,
  type = 'text',
  placeholder,
  required = false,
  disabled = false,
  readOnly = false,
  options = [],
  className = '',
  containerClassName,
  leftAddon,
  rightAddon,
  labelDetailedNode,
  onChange,
  ...rest
}: FormFieldProperties) {
  const {
    control,
    formState: { errors },
  } = useFormContext()
  const error = errors[name]
  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword((previous) => !previous)
  }

  return (
    <div className='space-y-2'>
      {label && (
        <div>
          <Label className='text-[16px] font-medium'>
            {label}
            {required && <span className='text-destructive -ml-1'>*</span>}
          </Label>
          {labelDetailedNode && (
            <div className='text-mid-grey-II text-xs'>{labelDetailedNode}</div>
          )}
        </div>
      )}

      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const inputClassName = cn(
            'flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-gray-200 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all shadow-none',
            error && 'border-destructive',
            className,
          )

          const inputWithAddons = (
            <div
              className={cn(`flex items-center gap-2`, containerClassName)}
              {...rest}
            >
              {leftAddon && (
                <div className='flex items-center'>{leftAddon}</div>
              )}
              {type === 'textarea' ? (
                <Textarea
                  {...field}
                  placeholder={placeholder}
                  disabled={disabled}
                  readOnly={readOnly}
                  className={cn(inputClassName, 'min-h-20 resize-y')}
                />
              ) : type === 'select' ? (
                (() => {
                  const selectValue =
                    field.value == null ? '' : String(field.value)
                  const selectKey = `${options.map((o) => o.value).join('|')}::${selectValue}`
                  return (
                    <Select
                      key={selectKey}
                      onValueChange={readOnly ? undefined : field.onChange}
                      value={selectValue}
                      disabled={disabled}
                    >
                      <SelectTrigger
                        className={cn(
                          readOnly &&
                            'pointer-events-none cursor-not-allowed opacity-100',
                          inputClassName,
                          'w-full shadow-none',
                        )}
                      >
                        <SelectValue
                          placeholder={placeholder || 'Select a value'}
                        />
                      </SelectTrigger>
                      <SelectContent className='bg-background shadow-none'>
                        {options.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            className='hover:bg-gray-50'
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )
                })()
              ) : type === 'number' ? (
                <Input
                  {...field}
                  type='number'
                  placeholder={placeholder}
                  disabled={disabled}
                  readOnly={readOnly}
                  className={inputClassName}
                  value={field.value || ''}
                  onChange={(event) =>
                    field.onChange(event.target.valueAsNumber)
                  }
                />
              ) : type === 'password' ? (
                <div className='relative w-full'>
                  <Input
                    {...field}
                    type={showPassword ? 'text' : 'password'}
                    placeholder={placeholder}
                    disabled={disabled}
                    readOnly={readOnly}
                    className={inputClassName}
                    onChange={(event) => {
                      // Ensure we store the actual string value, not the event object
                      const value = event.target.value
                      field.onChange(value)
                      onChange?.(event)
                    }}
                  />
                  <button
                    type='button'
                    onClick={togglePasswordVisibility}
                    className='text-primary hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 hover:cursor-pointer'
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              ) : type === 'date' ? (
                <Input
                  {...field}
                  type={type}
                  placeholder={placeholder}
                  disabled={disabled}
                  readOnly={readOnly}
                  className={cn(inputClassName, 'cursor-pointer pr-10')}
                  onClick={(event) => {
                    // Prevent the click from being handled by the input itself
                    event.preventDefault()
                    // Trigger the date picker by focusing and then clicking
                    const input = event.target as HTMLInputElement
                    input.focus()
                    input.showPicker?.()
                  }}
                />
              ) : (
                <Input
                  {...field}
                  type={type}
                  placeholder={placeholder}
                  disabled={disabled}
                  readOnly={readOnly}
                  className={inputClassName}
                />
              )}
              {rightAddon && (
                <div className='flex items-center'>{rightAddon}</div>
              )}
            </div>
          )

          return inputWithAddons
        }}
      />

      {error && (
        <p className='text-destructive text-sm'>{error.message?.toString()}</p>
      )}
    </div>
  )
}

export function MultiSelect({
  label,
  name,
  options,
  placeholder = 'Select options',
  required = false,
  disabled = false,
  readOnly = false,
  className = '',
  ...rest
}: {
  label?: string
  name: string
  options: { value: string; label: string; thumbnail?: string | File | null }[]
  placeholder?: string
  required?: boolean
  disabled?: boolean
  readOnly?: boolean
  className?: string
  [key: string]: unknown
}) {
  const {
    control,
    formState: { errors },
  } = useFormContext()
  const error = errors[name]

  return (
    <div className='space-y-2'>
      {label && (
        <Label className='text-[16px] font-medium'>
          {label}
          {required && <span className='text-destructive ml-1'>*</span>}
        </Label>
      )}

      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const selectedValues = field.value || []
          const placeholderText =
            selectedValues.length > 0
              ? `${selectedValues.length} selected`
              : placeholder

          const handleSelect = (value: string) => {
            if (disabled || readOnly) return
            const newSelectedValues = selectedValues.includes(value)
              ? selectedValues.filter((v: string) => v !== value) // Deselect if already selected
              : [...selectedValues, value] // Select if not already selected
            field.onChange(newSelectedValues)
          }

          return (
            <>
              <Select>
                <SelectTrigger
                  className={cn(error && 'border-destructive', className)}
                  disabled={disabled || readOnly}
                  {...rest}
                >
                  <SelectValue placeholder={placeholderText} />
                </SelectTrigger>
                <SelectContent>
                  {options.map((option) => (
                    <section
                      key={option.value}
                      className='flex items-center justify-between space-x-2 p-2'
                      onClick={() => handleSelect(option.value)}
                    >
                      <div className='flex items-center space-x-2'>
                        {option.thumbnail && (
                          <BlurImage
                            src={
                              typeof option.thumbnail === 'string'
                                ? option.thumbnail
                                : ''
                            }
                            alt={option.label}
                            width={40}
                            height={40}
                            className='h-5 w-5 rounded-full object-cover'
                          />
                        )}

                        <label className='text-sm'>{option.label}</label>
                      </div>
                      <Checkbox
                        checked={selectedValues.includes(option.value)}
                        onCheckedChange={() => handleSelect(option.value)}
                        disabled={disabled || readOnly}
                      />
                    </section>
                  ))}
                </SelectContent>
              </Select>

              {/* Display selected values below the input */}
              {selectedValues.length > 0 && (
                <div className='mt-2 flex flex-wrap gap-2'>
                  {selectedValues.map((value: string) => {
                    const selectedOption = options.find(
                      (opt) => opt.value === value,
                    )
                    return selectedOption ? (
                      <Badge key={value} className='text-xs'>
                        {selectedOption.thumbnail && (
                          <Image
                            src={
                              typeof selectedOption.thumbnail === 'string'
                                ? selectedOption.thumbnail
                                : ''
                            }
                            alt={selectedOption.label}
                            width={40}
                            height={40}
                            className='mr-1 h-5 w-5 rounded-full object-cover'
                          />
                        )}
                        {selectedOption.label}
                      </Badge>
                    ) : null
                  })}
                </div>
              )}
            </>
          )
        }}
      />

      {error && (
        <p className='text-destructive text-sm'>{error.message?.toString()}</p>
      )}
    </div>
  )
}

export function SwitchField({
  label,
  labelClassname,
  name,
  required = false,
  disabled = false,
  readOnly = false,
  description,
  className = '',
  onChange, // Add an onChange prop
}: {
  label?: string | React.ReactNode
  labelClassname?: string
  name: string
  required?: boolean
  disabled?: boolean
  readOnly?: boolean
  className?: string
  description?: string
  onChange?: (checked: boolean) => void // Callback function to handle switch toggle
}) {
  const {
    control,
    formState: { errors },
  } = useFormContext()
  const error = errors[name]

  return (
    <div>
      <div className={cn(className)}>
        {label && (
          <div className={`space-y-1`}>
            <Label className={cn('h-fit font-medium', labelClassname)}>
              {label}
              {required && <span className='text-destructive ml-1'>*</span>}
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
                if (readOnly) return
                field.onChange(checked) // Update the form state
                if (onChange) {
                  onChange(checked) // Trigger the onChange callback
                }
              }}
              disabled={disabled || readOnly}
              className={cn(error && 'border-destructive', 'mt-0')}
            />
          )}
        />
      </div>

      {error && (
        <p className='text-destructive text-sm'>{error.message?.toString()}</p>
      )}
    </div>
  )
}

export const PasswordValidation = ({ password }: { password: string }) => {
  const hasMinLength = password.length >= 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecialChar = /[#$%&@^]/.test(password)

  return (
    <div className='mt-2 space-y-2'>
      <div className='flex items-center space-x-2'>
        <Checkbox
          className={`rounded-full border-black px-px`}
          checked={hasMinLength}
        />
        <span className='text-mid-grey-II text-[10px]'>
          Password should be at least 8 characters long
        </span>
      </div>
      <div className='flex items-center space-x-2'>
        <Checkbox
          className={`rounded-full border-black px-px`}
          checked={hasUppercase}
        />
        <span className='text-mid-grey-II text-[10px]'>
          Password should contain at least one uppercase letter
        </span>
      </div>
      <div className='flex items-center space-x-2'>
        <Checkbox
          className={`rounded-full border-black px-px`}
          checked={hasNumber}
        />
        <span className='text-mid-grey-II text-[10px]'>
          Password should contain at least one number
        </span>
      </div>
      <div className='flex items-center space-x-2'>
        <Checkbox
          className={`rounded-full border-black px-px`}
          checked={hasSpecialChar}
        />
        <span className='text-mid-grey-II text-[10px]'>
          Password should contain at least one special character (@#$%^&)
        </span>
      </div>
    </div>
  )
}
// export {};
