import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import Thumbnail from "./index"

const meta = {
  title: "Products/Thumbnail",
  component: Thumbnail,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["small", "medium", "large", "full", "square"],
    },
  },
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof Thumbnail>

export default meta
type Story = StoryObj<typeof meta>

export const Placeholder: Story = {
  args: {
    size: "medium",
  },
}

export const WithImage: Story = {
  args: {
    size: "medium",
    thumbnail: "https://picsum.photos/seed/medusa/440/560",
  },
}

export const Featured: Story = {
  args: {
    size: "full",
    isFeatured: true,
    thumbnail: "https://picsum.photos/seed/featured/880/1120",
  },
  decorators: [
    (Story) => (
      <div className="w-[320px] sm:w-[440px]">
        <Story />
      </div>
    ),
  ],
}

export const Square: Story = {
  args: {
    size: "square",
    thumbnail: "https://picsum.photos/seed/square/400/400",
  },
  decorators: [
    (Story) => (
      <div className="w-40">
        <Story />
      </div>
    ),
  ],
}
