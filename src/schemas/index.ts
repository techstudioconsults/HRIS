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
export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required").optional(),
  // email: z.string().min(1, "Email is required").email("Please enter a valid email address").optional(),
  password: z.string().min(1, "Password is required").min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Confirm password is required"),
});

export const bankFormSchema = z.object({
  name: z.string().min(1, "Account name is required"),
  bank_code: z.string().min(1, "Bank name is required"),
  account_number: z.string().min(10, "Account number is required"),
});

export const reviewSchema = z.object({
  rating: z.number().min(1, "Rating is required"),
  comment: z.string().optional(),
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

export const profileSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  username: z.string().min(2, "Username must be at least 2 characters"),
  email: z.string().optional(),
  phone_number: z.string().min(10, "Phone number is required").max(11, "Phone number is required"),
  bio: z.string().min(1, "Message is required"),
  logo: z.any().optional(),
  twitter_account: z.string().optional(),
  facebook_account: z.string().optional(),
  youtube_account: z.string().optional(),
});

export const emailNotificationSettingSchema = z.object({
  purchase: z.boolean().optional(),
  news_updates: z.boolean().optional(),
  product_creation: z.boolean().optional(),
  payout: z.boolean().optional(),
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

export const kycSchema = z.object({
  country: z.string().min(1, "Select a country"),
  document_type: z.string().min(1, "Document type is required"),
  document_image: z.any().refine((file) => file !== null, "document image is required"),
});

export const companyProfileSchema = z.object({
  domain: z.string().min(1, "Company name is required"),
  industry: z.string().min(1, "Industry is required"),
  size: z.string().min(1, "Company size is required"),
  addressLine1: z.string().min(1, "Address line 1 is required"),
  addressLine2: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  postcode: z.string().min(1, "Postal code is required"),
});

// Define validation schema
export const employeeSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  gender: z.string().min(1, "Gender is required"),
  phone_number: z.string().min(1, "Phone number is required"),
  date_of_birth: z.string().min(1, "Date of birth is required"),
  work_email: z.string().email("Invalid email format"),
  start_date: z.string().min(1, "Start date is required"),
  work_mode: z.string().optional(),
  role: z.string().min(1, "Role is required"),
  department: z.string().min(1, "Department is required"),
  employment_type: z.string().optional(),
  teams: z.string().min(1, "Teams selection is required"),
  monthly_gross_salary: z.number().min(0, "Salary must be positive"),
  bank_name: z.string().optional(),
  account_name: z.string().min(1, "Account name is required"),
  account_number: z.string().min(1, "Account number is required"),
  documents: z.any().optional(),
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
export type ReviewFormData = z.infer<typeof reviewSchema>;
export type ContactFormData = z.infer<typeof contactSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
export type EmailNotificationSettingFormData = z.infer<typeof emailNotificationSettingSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type ChangeEmailFormData = z.infer<typeof changeEmailSchema>;
export type KycFormData = z.infer<typeof kycSchema>;
export type ExternalContactFormData = z.infer<typeof externalContactSchema>;
