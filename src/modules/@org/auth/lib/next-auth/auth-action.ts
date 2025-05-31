"use server";

import { CredentialsSignin } from "next-auth";
import { redirect } from "next/navigation";

import { signIn } from "./auth";

export const login = async (data: { email: string; password: string }) => {
  try {
    await signIn("credentials", {
      redirect: false,
      callbackUrl: "/",
      ...data,
    });
  } catch (error) {
    const someError = error as CredentialsSignin;
    return someError.cause;
  }
  redirect("/onboarding");
};
