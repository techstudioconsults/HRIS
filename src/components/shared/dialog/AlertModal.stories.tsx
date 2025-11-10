/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { Button } from "@/components/ui/button";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { AlertModal, AlertType } from "./alert-modal";

const meta: Meta<typeof AlertModal> = {
  title: "Components/Dialog/AlertModal",
  component: AlertModal,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: { type: "select" },
      options: ["success", "error", "warning", "info"],
    },
    autoClose: {
      control: { type: "boolean" },
    },
    showCancelButton: {
      control: { type: "boolean" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const AlertModalWithState = ({ type, ...properties }: { type: AlertType; [key: string]: any }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = () => {
    console.log("Confirmed!");
    setIsOpen(false);
  };

  return (
    <div className="space-y-4">
      <Button onClick={() => setIsOpen(true)}>Open {type} Modal</Button>
      <AlertModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleConfirm}
        type={type}
        title={`${type.charAt(0).toUpperCase() + type.slice(1)} Example`}
        description={`This is a ${type} alert modal example.`}
        {...properties}
      />
    </div>
  );
};

export const Success: Story = {
  render: (arguments_) => <AlertModalWithState type="success" {...arguments_} />,
  args: {
    title: "Success!",
    description: "Your action has been completed successfully.",
    confirmText: "Great!",
    showCancelButton: false,
  },
};

export const Error: Story = {
  render: (arguments_) => <AlertModalWithState type="error" {...arguments_} />,
  args: {
    title: "Error Occurred",
    description: "Something went wrong. Please try again.",
    confirmText: "Try Again",
    cancelText: "Cancel",
  },
};

export const Warning: Story = {
  render: (arguments_) => <AlertModalWithState type="warning" {...arguments_} />,
  args: {
    title: "Warning",
    description: "Are you sure you want to proceed with this action?",
    confirmText: "Proceed",
    cancelText: "Cancel",
  },
};

export const Info: Story = {
  render: (arguments_) => <AlertModalWithState type="info" {...arguments_} />,
  args: {
    title: "Information",
    description: "Here's some important information for you.",
    confirmText: "Got it",
    showCancelButton: false,
  },
};

export const AutoClose: Story = {
  render: (arguments_) => <AlertModalWithState type="success" {...arguments_} />,
  args: {
    title: "Auto Close",
    description: "This modal will close automatically in 3 seconds.",
    confirmText: "OK",
    showCancelButton: false,
    autoClose: true,
    autoCloseDelay: 3000,
  },
};

export const Loading: Story = {
  render: function LoadingStory(arguments_) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
      setLoading(true);
      // Simulate async operation
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setLoading(false);
      setIsOpen(false);
    };

    return (
      <div className="space-y-4">
        <Button onClick={() => setIsOpen(true)}>Open Loading Modal</Button>
        <AlertModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onConfirm={handleConfirm}
          loading={loading}
          type="success"
          title="Processing..."
          description="Please wait while we process your request."
          confirmText="Process"
          {...arguments_}
        />
      </div>
    );
  },
};

export const AllTypes: Story = {
  render: function AllTypesStory() {
    const [currentType, setCurrentType] = useState<AlertType>("success");
    const [isOpen, setIsOpen] = useState(false);

    const types: AlertType[] = ["success", "error", "warning", "info"];

    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          {types.map((type) => (
            <Button
              key={type}
              variant={currentType === type ? "default" : "outline"}
              onClick={() => setCurrentType(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
          ))}
        </div>
        <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
        <AlertModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onConfirm={() => setIsOpen(false)}
          type={currentType}
          title={`${currentType.charAt(0).toUpperCase() + currentType.slice(1)} Modal`}
          description={`This is a ${currentType} alert modal.`}
          confirmText="OK"
          showCancelButton={false}
        />
      </div>
    );
  },
};
