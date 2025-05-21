/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { InputField } from ".";
import type { Meta, StoryObj } from "@storybook/react";
import { Home } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";

import SkiButton from "../button";

const meta: Meta<typeof InputField> = {
  title: "Atoms/InputField",
  component: InputField,
};

export default meta;

type Story = StoryObj<typeof InputField>;

const MockForm = ({ children, onSubmit }: { children: React.ReactNode; onSubmit?: (data: any) => void }) => {
  const methods = useForm();
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit || (() => {}))}>
        {children}
        <SkiButton type="submit" size={`sm`} variant={`primary`} className={`mt-2`}>
          Submit
        </SkiButton>
      </form>
    </FormProvider>
  );
};

const onSubmit = (data: any) => {
  console.log(data);
};

export const Default: Story = {
  args: {
    containerClassName: "w-[700px]",
  },
  render: () => (
    <MockForm onSubmit={() => onSubmit({ name: "example" })}>
      <InputField name="example" label="Example Input" />
    </MockForm>
  ),
};

export const WithValidation: Story = {
  render: () => (
    <MockForm>
      <InputField name="required-field" label="Required Field" required placeholder="This field is required" />
    </MockForm>
  ),
};

export const Password: Story = {
  render: () => (
    <MockForm>
      <InputField name="password" label="Password" type="password" placeholder="Enter password" />
    </MockForm>
  ),
};

export const Select: Story = {
  render: () => (
    <MockForm>
      <InputField name="select-input" label="Select Input" type="select" placeholder="Select Input" />
    </MockForm>
  ),
};

export const TextArea: Story = {
  render: () => (
    <MockForm>
      <InputField
        name="text-area"
        label="TextArea Input"
        type="textarea"
        className={`h-[10rem]`}
        placeholder="Type Something here..."
      />
    </MockForm>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <MockForm>
      <InputField
        name="with-icons"
        label="with Icons"
        type="text"
        placeholder="With icons."
        leftAddon={<Home />}
        rightAddon={<Home />}
      />
    </MockForm>
  ),
};
