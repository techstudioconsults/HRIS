/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEventHandler, FocusEventHandler, HTMLAttributes, MouseEventHandler } from "react";

declare global {
  interface LogoProperties {
    logo: string;
    width?: number;
    height?: number;
    className?: string;
    alt?: string;
    href?: string;
    onClick?: MouseEventHandler<HTMLAnchorElement>;
  }

  interface InputProperties {
    label?: string;
    isRequired?: boolean;
    state?: "default" | "primary" | "error";
    name?: string;
    placeholder: string;
    type?: string;
    value?: string;
    onChange?: ChangeEventHandler<HTMLInputElement>;
    onFocus?: FocusEventHandler<HTMLInputElement>;
    isDisabled?: boolean;
    className?: string;
    helpText?: string;
    validate?: (value: string) => boolean;
  }

  interface NavLink {
    id: number;
    title: string;
    href: string;
    type: "link" | "dropdown";
    subLinks?: Array<{
      id: number;
      title: string;
      href: string;
      description: string;
    }> | null;
  }

  interface NavbarProperties extends HTMLAttributes<HTMLDivElement> {
    logo?: React.ReactNode;
    links?: NavLink[];
    cta?: React.ReactNode;
    user?: React.ReactNode;
    sticky?: boolean;
    navbarStyle?: string;
  }

  interface FormFieldProperties {
    label?: string;
    labelDetailedNode?: React.ReactNode;
    name: string;
    type?: "text" | "textarea" | "select" | "number" | "password" | "email";
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    options?: { value: string; label: string }[];
    className?: string;
    containerClassName?: string;
    leftAddon?: React.ReactNode; // Add left icon or button
    rightAddon?: React.ReactNode; // Add right icon or button
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  }

  interface UniversalSwiperProperties {
    items: any[];
    renderItem: (item: any, index: number) => React.ReactNode;
    swiperOptions?: SwiperOptions;
    showNavigation?: boolean;
    showPagination?: boolean;
    showScrollbar?: boolean;
    navigationVariant?: "default" | "minimal" | "none";
    navigationSize?: number;
    navigationOffset?: number;
    className?: string;
    swiperClassName?: string;
    slideClassName?: string;
    thumbsSwiper?: SwiperType | null;
    breakpoints?: SwiperBreakpoints;
    freeMode?: boolean;
    onSwiperInit?: (swiper: SwiperType) => void;
  }

  interface AuthCarouselProperties {
    id: number;
    image: string;
    name: string;
    position: string;
    message: string;
    rating: number;
  }

  interface Role {
    id: string;
    name: string;
  }

  interface Employee {
    id: string;
    fullName: string;
    email: string;
    role: Role;
  }

  interface Tokens {
    accessToken: string;
    refreshToken: string;
  }

  interface AuthResponseData {
    employee: Employee;
    tokens: Tokens;
    permissions: string[];
  }

  interface AuthResponse {
    success: boolean;
    data: AuthResponseData;
  }
}
export {};
