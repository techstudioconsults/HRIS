import { withThemeByClassName } from "@storybook/addon-themes";
import type { Preview } from "@storybook/react";

import "../src/styles/global.css";

import { initialize, mswLoader } from "msw-storybook-addon";

initialize();

const preview: Preview = {
  tags: ["autodocs"],
  loaders: [mswLoader],
  parameters: {
    layout: "centered",
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#ffffff" },
        { name: "dark", value: "#09090b" },
      ],
    },
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    withThemeByClassName({
      themes: {
        light: "light",
        dark: "dark",
      },
      defaultTheme: "light",
    }),
  ],
};

export default preview;
