/* eslint-disable no-console */
// confirmation-dialog.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import SkiButton from "../button";
import { ConfirmationDialog } from "./confirmation-dialog";

const meta: Meta<typeof ConfirmationDialog> = {
  title: "Molecules/ConfirmationDialog",
  component: ConfirmationDialog,
  tags: ["autodocs"],
  argTypes: {
    action: {
      control: {
        type: "object",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ConfirmationDialog>;

export const Default: Story = {
  args: {
    children: <SkiButton>Open Dialog</SkiButton>,
    action: {
      pending: false,
      onOpenChange: (open) => console.log("Open state changed:", open),
      title: "Confirm Action",
      description: "Are you sure you want to perform this action? This cannot be undone.",
      onConfirm: () => console.log("Action confirmed"),
      buttonName: "Confirm",
    },
  },
};

export const WithImage: Story = {
  args: {
    children: <SkiButton>Open Dialog</SkiButton>,
    action: {
      pending: false,
      onOpenChange: (open) => console.log("Open state changed:", open),
      title: "Delete Item",
      description: "This will permanently delete the item from your collection.",
      onConfirm: () => console.log("Item deleted"),
      buttonName: "Delete",
      img: "/images/skicom.svg",
    },
  },
};

export const LoadingState: Story = {
  args: {
    children: <SkiButton>Open Dialog</SkiButton>,
    action: {
      pending: true,
      onOpenChange: (open) => console.log("Open state changed:", open),
      title: "Processing",
      description: "Please wait while we complete your request...",
      onConfirm: () => console.log("Action confirmed"),
      buttonName: "Processing",
    },
  },
};

export const InteractiveExample = () => {
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState("");

  const handleConfirm = () => {
    setPending(true);
    // Simulate async action
    setTimeout(() => {
      setPending(false);
      setResult("Action completed successfully!");
    }, 2000);
  };

  return (
    <div className="flex flex-col gap-4">
      <ConfirmationDialog
        action={{
          pending,
          onOpenChange: (open) => !open && setResult("Action was cancelled"),
          title: "Submit Form",
          description: "Are you ready to submit your information?",
          onConfirm: handleConfirm,
          buttonName: "Submit",
        }}
      >
        <SkiButton>Open Confirmation</SkiButton>
      </ConfirmationDialog>

      {result && <div className="mt-4 text-sm text-gray-600">{result}</div>}
    </div>
  );
};
InteractiveExample.storyName = "Interactive Example";

export const CustomTrigger: Story = {
  args: {
    children: (
      <SkiButton variant="outline" size="sm">
        🗑️ Delete Item
      </SkiButton>
    ),
    action: {
      pending: false,
      onOpenChange: (open) => console.log("Open state changed:", open),
      title: "Delete Confirmation",
      description: "This will permanently remove the item from your collection.",
      onConfirm: () => console.log("Item deleted"),
      buttonName: "Delete Forever",
    },
  },
};
