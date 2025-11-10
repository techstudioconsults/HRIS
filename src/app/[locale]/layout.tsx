import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { ReactNode } from "react";

interface LocaleLayoutProperties {
  children: ReactNode;
  params: {
    locale: string;
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProperties) {
  const { locale } = await params;
  const messages = await getMessages({ locale });

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
