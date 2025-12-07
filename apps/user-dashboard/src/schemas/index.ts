import * as z from "zod";

export const registerSchema = z
  .object({
    companyName: z.string(),
    domain: z.string(),
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["password_confirmation"],
  });

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  // .min(8, "Password must be at least 8 characters"),
});

export const loginOTPSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});
export const loginOTPFormSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  // password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
});
export const resetPasswordSchema = z
  .object({
    // token: z.string().min(1, "Token is required").optional(),
    // email: z.string().min(1, "Email is required").email("Please enter a valid email address").optional(),
    password: z.string().min(1, "Password is required").min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["password_confirmation"],
  });

export const bankFormSchema = z.object({
  name: z.string().min(1, "Account name is required"),
  bank_code: z.string().min(1, "Bank name is required"),
  account_number: z.string().min(10, "Account number is required"),
});

export const contactSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

export const externalContactSchema = z.object({
  firstname: z.string().min(2, "First name must be at least 2 characters"),
  lastname: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

export const changePasswordSchema = z
  .object({
    password: z.string().min(8, "Your current Password is Required"),
    new_password: z.string().min(8, "Password must be at least 8 characters"),
    new_password_confirmation: z.string(),
  })
  .refine((data) => data.new_password === data.new_password_confirmation, {
    message: "Passwords don't match",
    path: ["new_password_confirmation"],
  });

export const changeEmailSchema = z.object({
  email: z.string().optional(),
  alt_email: z.string().email("Please enter a valid email address").optional(),
});

export const companyProfileSchema = z.object({
  // domain: z.string().min(1, "Company name is required"),
  name: z.string().min(1, "Name is required"),
  industry: z.string().min(1, "Industry is required"),
  size: z.string().min(1, "Company size is required"),
  addressLine1: z.string().min(1, "Address line 1 is required"),
  addressLine2: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  postcode: z.string().min(1, "Postal code is required"),
});

export const onboardEmployeeSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  teamId: z.string().min(1, "Department is required"),
  roleId: z.string().min(1, "Role is required"),
});

// Define validation schema
export const employeeSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .refine(
      (value) => {
        // Accept E.164 format (starts with +) or plain numbers
        return /^\+?[1-9]\d{1,14}$/.test(value);
      },
      { message: "Please enter a valid phone number" },
    ),
  teamId: z.string().min(1, "Teams selection is required"),
  roleId: z.string().min(1, "Role is required"),
  // documents: z.array(z.any()),
  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date of birth must be in YYYY-MM-DD format"),
  gender: z.enum(["male", "female"], { required_error: "Gender is required" }),
  startDate: z
    .string()
    .min(1, "Start date is required")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Start date must be in YYYY-MM-DD format"),
  employmentType: z.enum(["full time", "part time", "contract"]),
  workMode: z.enum(["remote", "onsite", "hybrid"]),
  // Salary Details
  baseSalary: z.number().min(1, "Base salary is required"),
  bankName: z.string().min(1, "Bank name is required"),
  accountName: z.string().min(1, "Account name is required"),
  accountNumber: z.string().min(1, "Account number is required"),
  bankCode: z.string().min(1, "Bank code is required"),
  // Optional permissions
  permissions: z.array(z.string()).optional(),
});

export const folderSchema = z.object({
  name: z.string().min(1, "Folder name is required"),
  file: z.array(z.instanceof(File)).optional(),
});

export const fileSchema = z.object({
  folderId: z.string().min(1, "Folder name is required").optional(),
  file: z
    .array(z.instanceof(File))
    .min(1, "Please select at least one file")
    .refine((files) => files.every((file) => file.size > 0), "File cannot be empty")
    .refine((files) => files.every((file) => file.size <= 10 * 1024 * 1024), "File size must be less than 10MB"),
});

// Payroll Policy Setup Form Schema
export const payrollPolicyFormSchema = z.object({
  payroll_frequency: z.string().min(1, "Payroll frequency is required"),
  payday: z.string().min(1, "Payday is required"), // kept as string for select; convert to number on submit
  currency: z.string().min(1, "Currency is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .refine(
      (value) => {
        // Accept E.164 format (starts with +) or plain numbers
        return /^\+?[1-9]\d{1,14}$/.test(value);
      },
      { message: "Please enter a valid phone number" },
    ),
  approvers: z.array(z.string()).min(1, "Select at least one approver"),
});

export type EmployeeFormData = z.infer<typeof employeeSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type LoginOTPFormData = z.infer<typeof loginOTPSchema>;
export type LoginOTPFFormData = z.infer<typeof loginOTPFormSchema>;
export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;
export type CompanyProfileFormData = z.infer<typeof companyProfileSchema>;
export type BankFormData = z.infer<typeof bankFormSchema>;
export type ContactFormData = z.infer<typeof contactSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type ChangeEmailFormData = z.infer<typeof changeEmailSchema>;
export type ExternalContactFormData = z.infer<typeof externalContactSchema>;
export type FolderFormData = z.infer<typeof folderSchema>;
export type FileFormData = z.infer<typeof fileSchema>;
export type PayrollPolicyFormData = z.infer<typeof payrollPolicyFormSchema>;
