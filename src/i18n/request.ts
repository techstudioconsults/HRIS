import { locales } from "@/lib/i18n/config";
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ requestLocale }) => {
  // Validate that the incoming `locale` parameter is valid
  const locale = await requestLocale;
  const validLocale = locales.includes(locale as (typeof locales)[number]) ? locale : "en";

  try {
    const messagesModule = await import(`@/lib/i18n/messages/${validLocale}.json`);
    const messages = messagesModule.default;

    return {
      locale: validLocale as string,
      messages,
    };
  } catch {
    // Fallback to default locale if messages file doesn't exist
    const defaultMessagesModule = await import(`@/lib/i18n/messages/en.json`);
    const defaultMessages = defaultMessagesModule.default;

    return {
      locale: "en",
      messages: defaultMessages,
    };
  }
});
