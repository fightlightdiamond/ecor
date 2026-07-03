import type { Preview } from "@storybook/nextjs-vite"

import { STOREFRONT_THEME } from "../src/lib/theme"
import "../src/styles/globals.css"
import "../src/styles/theme.css"

const preview: Preview = {
  decorators: [
    (Story) => (
      <div
        data-accent={STOREFRONT_THEME.accentScale}
        data-mode={STOREFRONT_THEME.appearance}
        className={STOREFRONT_THEME.appearance === "dark" ? "dark" : undefined}
      >
        <Story />
      </div>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    nextjs: {
      appDirectory: true,
    },
  },
}

export default preview