import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// -----------------------------
// Mocks: UI primitives
// -----------------------------

vi.mock("@workspace/ui/components/tabs", () => {
  type TabsContextValue = {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
  };

  const React_ = require("react") as typeof import("react");
  const TabsContext = React_.createContext<TabsContextValue>({});

  function Tabs({ value, defaultValue, onValueChange, children }: any) {
    const [internalValue, setInternalValue] = React_.useState<string>(defaultValue ?? "");
    const resolvedValue = value ?? internalValue;

    return (
      <TabsContext.Provider
        value={{
          value: resolvedValue,
          defaultValue,
          onValueChange: (next) => {
            setInternalValue(next);
            onValueChange?.(next);
          },
        }}
      >
        <div data-testid="tabs">{children}</div>
      </TabsContext.Provider>
    );
  }

  function TabsList({ children }: any) {
    return <div data-testid="tabs-list">{children}</div>;
  }

  function TabsTrigger({ value, children, className }: any) {
    const context = React_.useContext(TabsContext);
    const active = context.value === value;
    return (
      <button
        type="button"
        className={className}
        data-state={active ? "active" : "inactive"}
        onClick={() => context.onValueChange?.(value)}
      >
        {children}
      </button>
    );
  }

  function TabsContent({ value, children, className }: any) {
    const context = React_.useContext(TabsContext);
    if (context.value !== value) return null;
    return (
      <div className={className} data-testid={`tabs-content-${value}`}>
        {children}
      </div>
    );
  }

  return { Tabs, TabsContent, TabsList, TabsTrigger };
});

vi.mock("@workspace/ui/lib", async () => {
  const React_ = (await import("react")) as typeof import("react");
  const { useFormContext, useController } = await import("react-hook-form");

  function DashboardHeader({ title, subtitle }: { title: string; subtitle?: string }) {
    return (
      <header>
        <h1>{title}</h1>
        {subtitle ? <p>{subtitle}</p> : null}
      </header>
    );
  }

  function FormField({ name, label, type = "text", placeholder, disabled }: any) {
    const { register } = useFormContext();

    return (
      <label>
        <span>{label}</span>
        <input aria-label={label} placeholder={placeholder} disabled={disabled} type={type} {...register(name)} />
      </label>
    );
  }

  function SwitchField({ name, label }: any) {
    const { field } = useController({ name });
    return (
      <label>
        <span>{label}</span>
        <input
          aria-label={label}
          type="checkbox"
          checked={Boolean(field.value)}
          onChange={(event) => field.onChange(event.target.checked)}
        />
      </label>
    );
  }

  return { DashboardHeader, FormField, SwitchField };
});

vi.mock("@workspace/ui/lib/button", () => {
  function MainButton({ children, onClick, type = "button", isDisabled, isLoading, ...rest }: any) {
    return (
      <button type={type} onClick={onClick} disabled={Boolean(isDisabled) || Boolean(isLoading)} {...rest}>
        {children}
      </button>
    );
  }

  return { MainButton };
});

vi.mock("@workspace/ui/lib/dialog", () => {
  function AlertModal({ isOpen, title, description, confirmText, onConfirm }: any) {
    if (!isOpen) return null;
    return (
      <div role="dialog" aria-label={title}>
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
        <button type="button" onClick={onConfirm}>
          {confirmText ?? "Confirm"}
        </button>
      </div>
    );
  }

  return { AlertModal };
});

// -----------------------------
// Mocks: Settings tabs (SettingsView tests)
// -----------------------------

vi.mock("../_views/tabs/account-settings-tab", () => ({
  AccountSettingsTab: () => <div>Account Settings Content</div>,
}));
vi.mock("../_views/tabs/roles-management-tab", () => ({
  RolesManagementTab: () => <div>Roles Management Content</div>,
}));
vi.mock("../_views/tabs/hr-settings-tab", () => ({
  HRSettingsTab: () => <div>HR Settings Content</div>,
}));
vi.mock("../_views/tabs/notification-settings-tab", () => ({
  NotificationSettingsTab: () => <div>Notification Settings Content</div>,
}));
vi.mock("../_views/tabs/security-settings-tab", async () => {
  const actual = await vi.importActual<typeof import("../_views/tabs/security-settings-tab")>(
    "../_views/tabs/security-settings-tab",
  );
  return actual;
});

describe("settings module", () => {
  describe("settingsView", () => {
    it("renders the settings header", async () => {expect.hasAssertions();
      const { SettingsView } = await import("../_views/settings");
      render(<SettingsView />);

      expect(screen.getByRole("heading", { name: "Settings" })).toBeInTheDocument();
      expect(screen.getByText("Manage your organization settings")).toBeInTheDocument();
    });

    it("shows the Account tab by default and allows switching tabs", async () => {expect.hasAssertions();
      const { SettingsView } = await import("../_views/settings");
      render(<SettingsView />);

      // Default state
      expect(screen.getByText("Account Settings Content")).toBeInTheDocument();

      // Switch to Roles
      fireEvent.click(screen.getByRole("button", { name: "Roles Management" }));
      expect(screen.getByText("Roles Management Content")).toBeInTheDocument();

      // Switch to HR
      fireEvent.click(screen.getByRole("button", { name: "HR Settings" }));
      expect(screen.getByText("HR Settings Content")).toBeInTheDocument();

      // Switch to Notifications
      fireEvent.click(screen.getByRole("button", { name: "Notification Settings" }));
      expect(screen.getByText("Notification Settings Content")).toBeInTheDocument();

      // Switch to Security
      fireEvent.click(screen.getByRole("button", { name: "Security Settings" }));
      expect(screen.getByRole("heading", { name: "Security Settings" })).toBeInTheDocument();
    });
  });

  describe("securitySettingsTab", () => {
    it("opens success modal on submit and closes on confirm", async () => {expect.hasAssertions();
      const { SecuritySettingsTab } = await import("../_views/tabs/security-settings-tab");
      render(<SecuritySettingsTab />);

      fireEvent.click(screen.getByRole("button", { name: "Save Changes" }));
      expect(screen.getByRole("dialog", { name: "Password Updated" })).toBeInTheDocument();
      expect(screen.getByText("Your password have been changed successfully")).toBeInTheDocument();

      fireEvent.click(screen.getByRole("button", { name: "Continue" }));
      expect(screen.queryByRole("dialog", { name: "Password Updated" })).not.toBeInTheDocument();
    });

    it("resets the 2FA toggle back to default on cancel", async () => {expect.hasAssertions();
      const { SecuritySettingsTab } = await import("../_views/tabs/security-settings-tab");
      render(<SecuritySettingsTab />);

      const toggle = screen.getByLabelText("Enable 2factor authentication") as HTMLInputElement;
      expect(toggle.checked).toBeTruthy();

      fireEvent.click(toggle);
      expect(toggle.checked).toBeFalsy();

      fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
      expect(toggle.checked).toBeTruthy();
    });
  });
});
