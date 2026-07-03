import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import LandingHero from "./index"
import {
  DEFAULT_HERO_STORY_ARGS,
  HERO_CONTENT_PRESET_LABELS,
  HERO_CONTENT_PRESET_OPTIONS,
  HERO_IMAGE_PRESET_LABELS,
  HERO_IMAGE_PRESET_OPTIONS,
  storyArgsToHeroProps,
  type LandingHeroStoryArgs,
} from "./hero.story-args"

const meta = {
  title: "Landing/Hero",
  component: LandingHero,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
### Cách tùy chỉnh (không cần sửa code)

1. Mở story **Playground**
2. Tab **Controls** → chỉnh theo nhóm:

| Nhóm | Tùy chọn |
|------|----------|
| ⚡ Preset nhanh | Bộ copy VI / EN / Medusa / Chỉ chữ |
| 📝 Nội dung | Eyebrow, tiêu đề, mô tả |
| 🖼 Hình nền | Bật ảnh, preset salon/spa/trà, độ tối lớp phủ |
| 🔘 Nút bấm | Nhãn, link, ẩn nút phụ |
| 📐 Bố cục | Căn trái/giữa, chiều cao |

3. Copy giá trị ưng ý vào \`hero-content.ts\` để đưa lên production.
        `.trim(),
      },
    },
    controls: {
      expanded: true,
      sort: "requiredFirst",
    },
  },
  args: DEFAULT_HERO_STORY_ARGS,
  render: (args) => (
    <LandingHero {...storyArgsToHeroProps(args as Partial<LandingHeroStoryArgs>)} />
  ),
  argTypes: {
    contentPreset: {
      name: "Bộ nội dung",
      description: "Chọn preset có sẵn hoặc Tùy chỉnh để tự nhập từng trường.",
      control: "select",
      options: ["custom", ...HERO_CONTENT_PRESET_OPTIONS.map((o) => o.value)],
      labels: HERO_CONTENT_PRESET_LABELS,
      table: { category: "⚡ Preset nhanh" },
    },

    showEyebrow: {
      name: "Hiện dòng phụ (eyebrow)",
      control: "boolean",
      table: { category: "📝 Nội dung" },
    },
    eyebrow: {
      name: "Eyebrow",
      control: "text",
      if: { arg: "showEyebrow", truthy: true },
      table: { category: "📝 Nội dung" },
    },
    title: {
      name: "Tiêu đề chính",
      control: "text",
      if: { arg: "contentPreset", eq: "custom" },
      table: { category: "📝 Nội dung" },
    },
    subtitle: {
      name: "Mô tả",
      control: { type: "text", rows: 4 },
      if: { arg: "contentPreset", eq: "custom" },
      table: { category: "📝 Nội dung" },
    },

    showBackgroundImage: {
      name: "Hiện ảnh nền",
      control: "boolean",
      table: { category: "🖼 Hình nền" },
    },
    imagePreset: {
      name: "Ảnh có sẵn",
      control: "select",
      options: ["custom", ...HERO_IMAGE_PRESET_OPTIONS.map((o) => o.value)],
      labels: HERO_IMAGE_PRESET_LABELS,
      if: { arg: "showBackgroundImage", truthy: true },
      table: { category: "🖼 Hình nền" },
    },
    imageSrc: {
      name: "URL ảnh (tùy chỉnh)",
      control: "text",
      if: { arg: "imagePreset", eq: "custom" },
      table: { category: "🖼 Hình nền" },
    },
    imageAlt: {
      name: "Alt text ảnh",
      control: "text",
      if: { arg: "imagePreset", eq: "custom" },
      table: { category: "🖼 Hình nền" },
    },
    overlay: {
      name: "Độ tối lớp phủ",
      control: "radio",
      options: ["light", "medium", "dark"],
      labels: {
        light: "Nhẹ",
        medium: "Vừa",
        dark: "Đậm",
      },
      if: { arg: "showBackgroundImage", truthy: true },
      table: { category: "🖼 Hình nền" },
    },

    primaryCtaLabel: {
      name: "Nhãn nút chính",
      control: "text",
      if: { arg: "contentPreset", eq: "custom" },
      table: { category: "🔘 Nút bấm" },
    },
    primaryCtaHref: {
      name: "Link nút chính",
      control: "text",
      if: { arg: "contentPreset", eq: "custom" },
      table: { category: "🔘 Nút bấm" },
    },
    primaryCtaExternal: {
      name: "Mở tab mới (nút chính)",
      control: "boolean",
      if: { arg: "contentPreset", eq: "custom" },
      table: { category: "🔘 Nút bấm" },
    },
    showSecondaryCta: {
      name: "Hiện nút phụ",
      control: "boolean",
      table: { category: "🔘 Nút bấm" },
    },
    secondaryCtaLabel: {
      name: "Nhãn nút phụ",
      control: "text",
      if: { arg: "showSecondaryCta", truthy: true },
      table: { category: "🔘 Nút bấm" },
    },
    secondaryCtaHref: {
      name: "Link nút phụ",
      control: "text",
      if: { arg: "showSecondaryCta", truthy: true },
      table: { category: "🔘 Nút bấm" },
    },
    secondaryCtaExternal: {
      name: "Mở tab mới (nút phụ)",
      control: "boolean",
      if: { arg: "showSecondaryCta", truthy: true },
      table: { category: "🔘 Nút bấm" },
    },

    align: {
      name: "Căn nội dung",
      control: "inline-radio",
      options: ["left", "center"],
      labels: { left: "Trái", center: "Giữa" },
      table: { category: "📐 Bố cục" },
    },
    size: {
      name: "Chiều cao hero",
      control: "radio",
      options: ["compact", "default", "tall"],
      labels: {
        compact: "Thấp",
        default: "Chuẩn",
        tall: "Cao",
      },
      table: { category: "📐 Bố cục" },
    },
  },
} satisfies Meta<LandingHeroStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

/** 🎛 Bắt đầu tại đây — mọi control đều hoạt động trên story này. */
export const Playground: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Story chính để thử nghiệm. Đổi **Bộ nội dung** sang preset có sẵn, hoặc chọn `custom` rồi nhập từng trường. Dùng toolbar Viewport để xem mobile.",
      },
    },
  },
}

export const ThangLongVietnamese: Story = {
  name: "Preset · Thăng Long (VI)",
  args: {
    contentPreset: "thangLongVi",
    showEyebrow: true,
    showBackgroundImage: true,
    imagePreset: "salon",
    showSecondaryCta: true,
    align: "left",
    overlay: "medium",
    size: "default",
  },
}

export const ThangLongEnglish: Story = {
  name: "Preset · Thăng Long (EN)",
  args: {
    contentPreset: "thangLongEn",
    showEyebrow: true,
    showBackgroundImage: true,
    imagePreset: "spa",
    showSecondaryCta: true,
  },
}

export const MinimalTextOnly: Story = {
  name: "Preset · Chỉ chữ",
  args: {
    contentPreset: "minimal",
    showEyebrow: true,
    showBackgroundImage: false,
    showSecondaryCta: false,
    align: "center",
    size: "compact",
  },
}

export const MedusaDemo: Story = {
  name: "Preset · Medusa demo",
  args: {
    contentPreset: "medusaStarter",
    showEyebrow: true,
    showBackgroundImage: false,
    showSecondaryCta: true,
    align: "center",
  },
}

export const DarkOverlaySpa: Story = {
  name: "Ảnh spa · lớp phủ đậm",
  args: {
    contentPreset: "custom",
    showEyebrow: true,
    eyebrow: "Spa & Wellness",
    title: "Thư giãn trọn vẹn cuối tuần",
    subtitle: "Gói chăm sóc body 90 phút — ưu đãi tháng này.",
    showBackgroundImage: true,
    imagePreset: "spa",
    overlay: "dark",
    showSecondaryCta: true,
    primaryCtaLabel: "Đặt lịch",
    primaryCtaHref: "/store",
    secondaryCtaLabel: "Xem bảng giá",
    secondaryCtaHref: "/store",
    align: "left",
    size: "tall",
  },
}

export const CenterAlignedTea: Story = {
  name: "Ảnh trà · căn giữa",
  args: {
    contentPreset: "custom",
    showEyebrow: true,
    eyebrow: "Trà Việt",
    title: "Hương trà xưa, không gian mới",
    subtitle: "Thưởng thức trà artisan trong không gian tĩnh lặng giữa phố.",
    showBackgroundImage: true,
    imagePreset: "tea",
    overlay: "medium",
    showSecondaryCta: false,
    primaryCtaLabel: "Khám phá",
    primaryCtaHref: "/store",
    align: "center",
    size: "default",
  },
}

export const Mobile: Story = {
  name: "Responsive · Mobile",
  args: DEFAULT_HERO_STORY_ARGS,
  parameters: {
    viewport: { defaultViewport: "mobile1" },
    docs: {
      description: {
        story: "Xem hero trên iPhone SE (375px). Nút bấm full-width, chữ xếp dọc.",
      },
    },
  },
}

export const Tablet: Story = {
  name: "Responsive · Tablet",
  parameters: {
    viewport: { defaultViewport: "tablet" },
  },
}

export const Desktop: Story = {
  name: "Responsive · Desktop",
  parameters: {
    viewport: { defaultViewport: "desktop" },
  },
}
