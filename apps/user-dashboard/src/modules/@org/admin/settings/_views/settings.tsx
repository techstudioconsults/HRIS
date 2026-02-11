"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { DashboardHeader } from "@workspace/ui/lib";
import { cn } from "@workspace/ui/lib/utils";
import { useState } from "react";

import { AccountSettingsTab } from "./tabs/account-settings-tab";
import { HRSettingsTab } from "./tabs/hr-settings-tab";
import { NotificationSettingsTab } from "./tabs/notification-settings-tab";
import { RolesManagementTab } from "./tabs/roles-management-tab";
import { SecuritySettingsTab } from "./tabs/security-settings-tab";

type SettingsTab = "account" | "roles" | "hr" | "payroll" | "notifications" | "security";

const tabTriggerClassName = cn(
  "text-muted-foreground rounded-none border-none bg-transparent px-0 py-2 text-sm",
  "data-[state=active]:text-primary",
);

export const SettingsView = () => {
  const [tab, setTab] = useState<SettingsTab>("account");

  return (
    <section className="space-y-6">
      <DashboardHeader title="Settings" subtitle="Manage your organization settings" />

      <Tabs value={tab} onValueChange={(value) => setTab(value as SettingsTab)} className="w-full">
        <TabsList className="flex h-auto w-full flex-wrap items-center gap-6 bg-transparent p-0">
          <TabsTrigger value="account" className={tabTriggerClassName}>
            Account
          </TabsTrigger>
          <TabsTrigger value="roles" className={tabTriggerClassName}>
            Roles Management
          </TabsTrigger>
          <TabsTrigger value="hr" className={tabTriggerClassName}>
            HR Settings
          </TabsTrigger>
          <TabsTrigger value="notifications" className={tabTriggerClassName}>
            Notification Settings
          </TabsTrigger>
          <TabsTrigger value="security" className={tabTriggerClassName}>
            Security Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="mt-6">
          <AccountSettingsTab />
        </TabsContent>

        <TabsContent value="roles" className="mt-6">
          <RolesManagementTab />
        </TabsContent>

        <TabsContent value="hr" className="mt-6">
          <HRSettingsTab />
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <NotificationSettingsTab />
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <SecuritySettingsTab />
        </TabsContent>
      </Tabs>
    </section>
  );
};
