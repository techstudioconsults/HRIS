"use server";

import { LoginFormData, LoginOTPFormData } from "@/schemas";
import { CredentialsSignin } from "next-auth";

import { signIn } from "../lib/next-auth/auth";

export const login = async (data: LoginFormData) => {
  try {
    const result = await signIn("credentials", {
      redirect: false,
      ...data,
    });
    if (result?.ok) {
      return { success: true };
    }
  } catch (error) {
    if (error instanceof CredentialsSignin) {
      return { error: error.message || "Invalid email or password, please try again" };
    }
    return { error: "An unexpected error occurred. Please try again." };
  }
};

export const OTPLogin = async (data: LoginOTPFormData) => {
  try {
    const result = await signIn("OTP", {
      redirect: false,
      ...data,
    });
    if (result?.ok) {
      return { success: true };
    }
  } catch (error) {
    if (error instanceof CredentialsSignin) {
      return { error: error.message || "Invalid email or password, please try again" };
    }
    return { error: "An unexpected error occurred" };
  }
};
