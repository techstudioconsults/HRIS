// reusable-dialog.stories.tsx
import { Button } from "@/components/ui/button";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { ReusableDialog } from "./Dialog";

const meta: Meta<typeof ReusableDialog> = {
  title: "Molecules/ReusableDialog",
  component: ReusableDialog,
  tags: ["autodocs"],
  argTypes: {
    open: { control: "boolean" },
    hideClose: { control: "boolean" },
    onOpenChange: { action: "openChanged" },
    className: { control: "text" },
    headerClassName: { control: "text" },
    wrapperClassName: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof ReusableDialog>;

export const BasicDialog: Story = {
  args: {
    trigger: <Button variant={`primary`}>Open Basic Dialog</Button>,
    title: "Basic Dialog",
    description: "This is a basic dialog with title and description",
    children: (
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="subtle">Cancel</Button>
        <Button>Confirm</Button>
      </div>
    ),
  },
};

export const WithImage: Story = {
  args: {
    trigger: <Button>Open Dialog with Image</Button>,
    title: "Warning",
    description: "This action cannot be undone",
    img: "/images/skicom.svg",
    children: (
      <div className="space-x-2 pt-4">
        <Button variant="subtle">Cancel</Button>
        <Button variant="destructive">Delete</Button>
      </div>
    ),
    className: "flex flex-col",
    wrapperClassName: "flex items-center",
    headerClassName: "text-destructive",
  },
};

export const ControlledDialog = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col gap-4">
      <Button onClick={() => setOpen(true)}>Open Controlled Dialog</Button>
      <ReusableDialog
        open={open}
        onOpenChange={setOpen}
        trigger={<span className="hidden" />} // Hidden since we control it via button
        title="Controlled Dialog"
        description="This dialog is controlled by parent state"
      >
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
          <Button onClick={() => setOpen(false)}>Confirm</Button>
        </div>
      </ReusableDialog>
    </div>
  );
};
ControlledDialog.storyName = "Controlled State Example";

export const CustomStyledDialog: Story = {
  args: {
    trigger: <Button variant="outline">Open Styled Dialog</Button>,
    title: "Custom Styled Dialog",
    description: "This dialog has custom styling applied",
    className: "bg-background border-2 border-primary",
    headerClassName: "text-primary font-bold",
    wrapperClassName: "items-center gap-4",
    children: (
      <div className="flex flex-col gap-2 pt-4">
        <p className="text-muted-foreground text-sm">Additional custom content goes here</p>
        <div className="flex justify-end gap-2">
          <Button variant="outline">Cancel</Button>
          <Button>Submit</Button>
        </div>
      </div>
    ),
  },
};

export const WithoutCloseButton: Story = {
  args: {
    trigger: <Button>Dialog Without Close</Button>,
    title: "No Close Button",
    description: "This dialog hides the default close button",
    hideClose: true,
    children: (
      <div className="flex justify-end gap-2 pt-4">
        <Button onClick={() => alert("You must use this button to close")}>Close Dialog</Button>
      </div>
    ),
  },
};

export const FullScreenOnMobile: Story = {
  args: {
    trigger: <Button>Full Screen on Mobile</Button>,
    title: "Mobile Optimized",
    description: "This dialog takes full height on mobile devices",
    className: "sm:max-h-[80vh]",
    children: (
      <div className="flex flex-1 flex-col">
        <div className="flex-1 overflow-y-auto">
          {Array.from({ length: 20 }).map((_, index) => (
            <p key={index} className="py-2">
              Scrollable content item {index + 1}
            </p>
          ))}
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline">Cancel</Button>
          <Button>Confirm</Button>
        </div>
      </div>
    ),
  },
};
