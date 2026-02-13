"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { cn } from "@workspace/ui/lib/utils";
import { HRSettingsGeneralRulesTab } from "./hr-settings/hr-settings-general-rules-tab";
import { HRSettingsLeaveTab } from "./hr-settings/hr-settings-leave-tab";

const subTabTriggerClassName = cn(
  "text-muted-foreground rounded-none border-none bg-transparent px-0 py-2 text-xs sm:text-sm",
  "data-[state=active]:text-primary data-[state=active]:border-primary data-[state=active]:border-b",
);

export const HRSettingsTab = () => {
  return (
    <section className="space-y-6">
      <div>
        <h3 className="text-base font-semibold">HR Settings</h3>
      </div>

      <Tabs defaultValue="leave" className="w-full">
        <TabsList className="flex h-auto w-fit flex-wrap items-center gap-10 bg-transparent p-0">
          <TabsTrigger value="leave" className={subTabTriggerClassName}>
            Leave
          </TabsTrigger>
          <TabsTrigger value="attendance" className={subTabTriggerClassName}>
            Attendance
          </TabsTrigger>
          <TabsTrigger value="general" className={subTabTriggerClassName}>
            General HR Rules
          </TabsTrigger>
        </TabsList>

        <TabsContent value="leave" className="mt-6">
          <HRSettingsLeaveTab />
        </TabsContent>

        <TabsContent value="attendance" className="mt-6">
          <div className="bg-background border-border rounded-lg border p-6 shadow-sm">
            <p className="text-muted-foreground text-sm">Attendance settings is not implemented yet.</p>
          </div>
        </TabsContent>

        <TabsContent value="general" className="mt-6">
          <HRSettingsGeneralRulesTab />
        </TabsContent>
      </Tabs>
    </section>
  );
};
