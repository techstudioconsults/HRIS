"use client";

import {WithDependency} from "@/HOC/withDependencies";
import {dependencies} from "@/lib/tools/dependencies";
import {Wrapper} from "@workspace/ui/components/core/layout/wrapper";
// import { AuthService } from "@/modules/@org/auth/services/auth.service";
import {useRouter} from "next/navigation";

import {ActiveUser} from "./_views/active-user";
import {NewUser} from "./_views/new-user";
import {Onboarding} from "./_views/onboarding";

const BaseDashboardHomePage = () => {
    const router = useRouter();

    const ONBOARDING_STEPS: OnboardingStep[] = [
        {
            title: "Add your first department/team",
            description: "",
            buttonLabel: "Configure",
            icon: "/images/verify_email.svg",
            isCompleted: false,
            action: () => {
            },
        },
        {
            title: "Create roles and assign permissions",
            description: "",
            buttonLabel: "Configure",
            icon: "/images/verify_email.svg",
            // isCompleted: user?.password_is_set,
            isCompleted: false,
            action: () => router.push(`/dashboard/settings`),
        },
        {
            title: "Add your first employee",
            description: "",
            buttonLabel: "Configure",
            icon: "/images/profile.svg",
            isCompleted: false,
            action: () => router.push(`/dashboard/profile`),
        },
        {
            title: "Set up clock-in system",
            description: "",
            buttonLabel: "Configure",
            icon: "/images/first_product.svg",
            isCompleted: false,
            action: () => router.push(`/dashboard/products/new`),
        },
        {
            title: "Configure payroll info",
            description: "",
            buttonLabel: "Configure",
            icon: "/images/payout.svg",
            isCompleted: false,
            action: () => router.push(`/dashboard/settings?tab=payment`),
        },
        {
            title: "Invite other HR team members",
            description: "",
            buttonLabel: "Configure",
            icon: "/images/first_sale.svg",
            isCompleted: false,
            action: () => router.push(`/dashboard/products/new`),
        },
    ];

    const completedSteps = ONBOARDING_STEPS.filter((step) => step.isCompleted).length || 7;
    // Less than 4 steps completed -> Onboarding
    if (completedSteps < 4) {
        return (
            <Wrapper className="max-w-[800px]">
                <Onboarding steps={ONBOARDING_STEPS}/>
            </Wrapper>
        );
    }
    // Exactly 4 steps completed -> NewUser
    if (completedSteps >= 4 && completedSteps < ONBOARDING_STEPS.length) {
        return <NewUser steps={ONBOARDING_STEPS} completedSteps={completedSteps}/>;
    }
    // All 5 steps completed -> ActiveUser
    return <ActiveUser/>;
};

export const DashboardHomePage = WithDependency(BaseDashboardHomePage, {
    authService: dependencies.AUTH_SERVICE,
});
