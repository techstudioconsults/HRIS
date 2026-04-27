---
section: architecture
topic: component-tree
---

# Auth — Component Tree

## Password Login

```
/login
└── LoginView                            ("use client" — form interactivity)
    ├── AuthCarousel                     (marketing carousel on left panel)
    └── LoginForm
        ├── EmailField                   (React Hook Form controlled)
        ├── PasswordField + VisibilityToggle
        ├── RememberMe checkbox
        ├── ForgotPasswordLink           → /forgot-password
        ├── SubmitButton                 (disabled while mutation.isPending)
        └── SwitchToOtpLink             → /login/otp
```

## OTP Login (2-step)

```
/login/otp
└── OtpLoginView                         ("use client")
    └── OtpLoginForm
        ├── EmailField
        └── SubmitButton                 → calls requestOTP → navigates to /login/otp-verify

/login/otp-verify
└── OtpVerifyView                        ("use client")
    └── InputOtpCard
        ├── OtpInputDigits               (6-digit, auto-advance)
        ├── ResendOtpButton              (disabled for 60s cooldown)
        └── SubmitButton                 → calls loginWithOTP
```

## Registration

```
/register
└── RegisterView                         ("use client")
    ├── AuthCarousel
    └── RegisterForm
        ├── CompanyNameField
        ├── DomainField
        ├── FirstNameField
        ├── LastNameField
        ├── EmailField
        ├── PasswordField + VisibilityToggle
        ├── ConfirmPasswordField
        └── SubmitButton                 → signUp mutation → /login
```

## Forgot / Reset Password

```
/forgot-password
└── ForgotPasswordView                   ("use client")
    └── ForgotPasswordForm
        ├── EmailField
        └── SubmitButton                 → forgotPassword mutation

    └── CheckMailCard                    (shown on success — "check your email")

/reset-password
└── ResetPasswordView                    ("use client")
    └── ResetPasswordForm
        ├── PasswordField
        ├── ConfirmPasswordField
        └── SubmitButton                 → resetPassword mutation → /login
```

## Shared Auth Components

| Component       | Purpose                                                      |
| --------------- | ------------------------------------------------------------ |
| `AuthCarousel`  | Rotating marketing slides on the auth page left panel        |
| `CheckMailCard` | "Check your inbox" success state after email dispatch        |
| `InputOtp`      | Reusable OTP digit input with auto-advance and paste support |
| `InputOtpCard`  | Wraps `InputOtp` with title, description, and submit action  |
