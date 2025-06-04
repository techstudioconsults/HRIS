"use server";

import { LoginFormData } from "@/schemas";
import { CredentialsSignin } from "next-auth";

import { signIn } from "../lib/next-auth/auth";

export const login = async (data: LoginFormData) => {
  try {
    const result = await signIn("credentials", {
      redirect: false,
      ...data,
    });
    if (result?.error) {
      return { error: result.error };
    }
    return { success: true };
  } catch (error) {
    if (error instanceof CredentialsSignin) {
      return { error: error.message, cause: error.cause };
    }
    return { error: "An unexpected error occurred" };
  }
};
