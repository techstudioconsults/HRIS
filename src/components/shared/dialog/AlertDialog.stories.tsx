/* eslint-disable no-console */
// alert-modal.stories.tsx

import { Button } from "@/components/ui/button";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { AlertModal } from "./alert-modal";

const meta: Meta<typeof AlertModal> = {
  title: "Molecules/AlertModal",
  component: AlertModal,
  argTypes: {
    isOpen: { control: "boolean" },
    loading: { control: "boolean" },
    onClose: { action: "closed" },
    onConfirm: { action: "confirmed" },
  },
};

export default meta;
type Story = StoryObj<typeof AlertModal>;

export const Default: Story = {
  args: {
    isOpen: false,
    loading: false,
    onClose: () => console.log("Modal closed"),
    onConfirm: () => console.log("Action confirmed"),
  },
};

export const LoadingState: Story = {
  args: {
    isOpen: false,
    loading: true,
  },
};

export const InteractiveExample = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actionResult, setActionResult] = useState("");

  const handleConfirm = () => {
    setLoading(true);
    // Simulate async operation
    setTimeout(() => {
      setLoading(false);
      setIsOpen(false);
      setActionResult("Action was confirmed!");
    }, 1500);
  };

  const handleClose = () => {
    setIsOpen(false);
    setActionResult("Action was cancelled.");
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Button onClick={() => setIsOpen(true)}>Open Alert Modal</Button>
      {actionResult && <div className="mt-4 text-sm text-gray-600">{actionResult}</div>}

      <AlertModal isOpen={isOpen} onClose={handleClose} onConfirm={handleConfirm} loading={loading} />
    </div>
  );
};
InteractiveExample.storyName = "Interactive Example";
