import { locales } from "@/lib/i18n/config";
import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locale || !locales.includes(locale as (typeof locales)[number])) notFound();

  const messagesModule = await import(`@/lib/i18n/messages/${locale}.json`);
  const messages = messagesModule.default;

  return {
    locale,
    messages,
  };
});
