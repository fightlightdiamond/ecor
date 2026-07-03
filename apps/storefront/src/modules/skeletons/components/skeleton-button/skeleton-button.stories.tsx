import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import SkeletonButton from "./index"

const meta = {
  title: "Skeletons/SkeletonButton",
  component: SkeletonButton,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof SkeletonButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const ConstrainedWidth: Story = {
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
}
