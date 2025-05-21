import MainButton from ".";
import type { Meta, StoryObj } from "@storybook/react";
import { Home } from "lucide-react";

const meta: Meta<typeof MainButton> = {
  title: "Atoms/Button",
  component: MainButton,
  argTypes: {
    variant: {
      control: {
        type: "select",
        options: ["default", "primary", "destructive", "subtle", "loading", "outline", "secondary", "ghost", "link"],
      },
    },
    size: {
      control: {
        type: "select",
        options: ["default", "sm", "lg", "xl", "link", "icon", "circle"],
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof MainButton>;

export const Primary: Story = {
  args: {
    variant: "primary",
    children: "Primary Button",
  },
};

export const WithIcon: Story = {
  args: {
    variant: "primary",
    children: "Button with Icon",
    icon: <Home />,
    isLeftIconVisible: true,
  },
};

export const IconOnly: Story = {
  args: {
    variant: "primary",
    icon: <Home />,
    isIconOnly: true,
    ariaLabel: "Home",
    size: "icon",
  },
};

export const Loading: Story = {
  args: {
    variant: "primary",
    children: "Loading Button",
    isLoading: true,
  },
};

export const Disabled: Story = {
  args: {
    variant: "primary",
    children: "Disabled Button",
    isDisabled: true,
  },
};

export const LinkButton: Story = {
  args: {
    variant: "link",
    children: "Link Button",
    href: "/example",
  },
  parameters: {
    chromatic: { delay: 1000 },
  },
};

export const ExternalLink: Story = {
  args: {
    variant: "link",
    children: "External Link",
    href: "https://example.com",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Outline Link",
    href: "https://example.com",
    className: `border-primary text-primary`,
  },
};
