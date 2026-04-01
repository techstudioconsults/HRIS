/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChangeEventHandler,
  FocusEventHandler,
  HTMLAttributes,
  MouseEventHandler,
  ReactNode,
} from 'react';
import type { CarouselApi } from '@workspace/ui/components/carousel';
import type { EmblaOptionsType } from 'embla-carousel';

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
    state?: 'default' | 'primary' | 'error';
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
    type: 'link' | 'dropdown';
    subLinks?: Array<{
      id: number;
      title: string;
      href: string;
      description: string;
    }> | null;
  }

  interface NavbarProperties extends HTMLAttributes<HTMLDivElement> {
    logo?: ReactNode;
    links?: NavLink[];
    cta?: ReactNode;
    user?: ReactNode;
    sticky?: boolean;
    navbarStyle?: string;
  }

  interface FormFieldProperties {
    label?: string;
    labelDetailedNode?: ReactNode;
    name: string;
    type?: 'text' | 'textarea' | 'select' | 'number' | 'password' | 'email';
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    options?: { value: string; label: string }[];
    className?: string;
    containerClassName?: string;
    leftAddon?: ReactNode; // Add left icon or button
    rightAddon?: ReactNode; // Add right icon or button
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  }

  interface UniversalSwiperProperties {
    items: any[];
    renderItem: (item: any, index: number) => ReactNode;
    swiperOptions?: EmblaOptionsType;
    showNavigation?: boolean;
    showPagination?: boolean;
    showScrollbar?: boolean;
    navigationVariant?: 'default' | 'minimal' | 'none';
    navigationSize?: number;
    navigationOffset?: number;
    className?: string;
    swiperClassName?: string;
    slideClassName?: string;
    thumbsSwiper?: null;
    breakpoints?: Record<string | number, unknown>;
    freeMode?: boolean;
    onSwiperInit?: (api: CarouselApi) => void;
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
