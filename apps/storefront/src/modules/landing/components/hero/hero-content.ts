import type { LandingHeroProps } from "./hero.types"

/** Default copy for the storefront landing hero. Paths are relative to `/{countryCode}`. */
export const DEFAULT_LANDING_HERO_CONTENT: LandingHeroProps = {
  eyebrow: "Thăng Long Chè Việt",
  title: "Không gian thư giãn giữa lòng Hà Nội",
  subtitle:
    "Trải nghiệm salon & spa với liệu pháp chăm sóc tóc, da và cơ thể — phong cách Việt, tiêu chuẩn quốc tế.",
  imageSrc:
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1920&q=80",
  imageAlt: "Không gian salon Thăng Long Chè Việt",
  primaryCta: {
    label: "Đặt lịch ngay",
    href: "/store",
  },
  secondaryCta: {
    label: "Khám phá dịch vụ",
    href: "/store",
  },
  align: "left",
  overlay: "medium",
  size: "default",
}

/** Background images — pick in Storybook Controls or reuse in CMS. */
export const HERO_IMAGE_PRESETS = {
  salon: {
    label: "Salon / tóc",
    src: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1920&q=80",
    alt: "Không gian salon hiện đại",
  },
  spa: {
    label: "Spa / thư giãn",
    src: "https://images.unsplash.com/photo-1540555700478-4be289fbec23?auto=format&fit=crop&w=1920&q=80",
    alt: "Không gian spa thư giãn",
  },
  tea: {
    label: "Trà / ẩm thực",
    src: "https://images.unsplash.com/photo-1556678727-4f8f6a55e9c1?auto=format&fit=crop&w=1920&q=80",
    alt: "Không gian thưởng trà",
  },
  interior: {
    label: "Nội thất tối giản",
    src: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1920&q=80",
    alt: "Nội thất tối giản sang trọng",
  },
} as const

export type HeroImagePresetKey = keyof typeof HERO_IMAGE_PRESETS

/** Ready-made copy packs — switch entire hero content from Controls. */
export const HERO_CONTENT_PRESETS = {
  thangLongVi: {
    label: "Thăng Long Chè Việt (Tiếng Việt)",
    content: DEFAULT_LANDING_HERO_CONTENT,
  },
  thangLongEn: {
    label: "Thăng Long (English)",
    content: {
      eyebrow: "Thang Long Tea Vietnam",
      title: "A calm retreat in the heart of Hanoi",
      subtitle:
        "Salon & spa experiences for hair, skin, and body — Vietnamese soul, international standards.",
      imageSrc: HERO_IMAGE_PRESETS.spa.src,
      imageAlt: "Thang Long spa interior",
      primaryCta: { label: "Book now", href: "/store" },
      secondaryCta: { label: "Explore services", href: "/store" },
      align: "left" as const,
      overlay: "medium" as const,
      size: "default" as const,
    },
  },
  medusaStarter: {
    label: "Medusa starter (demo)",
    content: {
      eyebrow: "Medusa Storefront",
      title: "Ecommerce Starter Template",
      subtitle: "Powered by Medusa and Next.js — customize this hero in Storybook.",
      imageSrc: undefined,
      imageAlt: "",
      primaryCta: {
        label: "View on GitHub",
        href: "https://github.com/medusajs/medusa",
        external: true,
      },
      secondaryCta: {
        label: "Browse store",
        href: "/store",
      },
      align: "center" as const,
      overlay: "medium" as const,
      size: "default" as const,
    },
  },
  minimal: {
    label: "Chỉ chữ (không ảnh)",
    content: {
      eyebrow: "Thăng Long Chè Việt",
      title: "Đặt lịch trực tuyến",
      subtitle: "Chọn dịch vụ và thời gian phù hợp — xác nhận trong vài phút.",
      imageSrc: undefined,
      imageAlt: "",
      primaryCta: { label: "Bắt đầu", href: "/store" },
      secondaryCta: undefined,
      align: "center" as const,
      overlay: "medium" as const,
      size: "compact" as const,
    },
  },
} as const

export type HeroContentPresetKey = keyof typeof HERO_CONTENT_PRESETS
