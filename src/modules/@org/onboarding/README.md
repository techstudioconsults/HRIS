# Onboarding Module

This module handles the onboarding flow for new users in the HRIS system.

## Routing Structure

The onboarding flow has been converted from URL parameter-based routing to proper Next.js pages:

### Routes

- `/onboarding` - Redirects to `/onboarding/welcome`
- `/onboarding/welcome` - Welcome page with tour option
- `/onboarding/step-1` - Company profile setup
- `/onboarding/step-2` - Team and role setup
- `/onboarding/step-3` - Employee onboarding

### Navigation

Each step includes:

- Progress indicator showing current step
- Back button to previous step
- Continue button to next step
- Skip option where applicable

### Components

#### Core Components

- `OnboardingProgress` - Shows step progress with visual indicators
- `OnboardingBreadcrumb` - Navigation breadcrumb for all steps

#### Step Components

- `Welcome` - Initial welcome page with tour option
- `StepOne` - Company profile form
- `TeamSetupPage` - Team and role configuration
- `EmployeeSetup` - Employee onboarding form

#### Forms

- `CompanyProfile` - Company information form
- `TeamSetupForm` - Team and role setup form
- `EmployeeSetupForm` - Employee registration form

## Usage

The onboarding flow is automatically accessible at `/onboarding` and will redirect users to the welcome page. Users can navigate between steps using the provided buttons or breadcrumb navigation.

## Dependencies

- Next.js App Router
- React Hook Form for form handling
- Zod for form validation
- NextAuth for authentication
- Tailwind CSS for styling
