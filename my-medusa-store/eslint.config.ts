// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import { defineConfig } from "eslint/config"
import medusa from "@medusajs/eslint-plugin"

export default defineConfig([...medusa.configs.recommended, ...storybook.configs["flat/recommended"]])
