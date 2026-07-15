import Image from "next/image"

import { Heading, Text, clx } from "@modules/common/components/ui"

import { getStrapiMediaUrl } from "@lib/strapi-media"
import type { FeatureListBlock } from "@types/strapi-blocks"

const ICON_LABELS: Record<string, string> = {
  shipping: "shipping",
  gift: "gift",
  refresh: "refresh",
  leaf: "leaf",
  star: "star",
  heart: "heart",
}

function FeatureMark({
  iconUrl,
  iconName,
}: {
  iconUrl?: string | null
  iconName?: string | null
}) {
  if (iconUrl) {
    return (
      <Image
        src={iconUrl}
        alt=""
        width={40}
        height={40}
        className="h-10 w-10 object-contain"
      />
    )
  }

  const label = iconName && ICON_LABELS[iconName] ? iconName : "leaf"

  return (
    <span
      className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-solid/10 text-brand-solid"
      aria-hidden
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" focusable="false">
        {label === "shipping" ? (
          <path d="M3 7h11v10H3V7zm12 2h3l3 3v5h-1.5a2 2 0 11-4 0H15V9zm1.5 8a.75.75 0 100 1.5.75.75 0 000-1.5zM7.5 17a.75.75 0 100 1.5.75.75 0 000-1.5z" />
        ) : label === "gift" ? (
          <path d="M11 7V5.5A1.5 1.5 0 009.5 4 1.5 1.5 0 008 5.5V7H5v4h6V7h2v4h6V7h-3V5.5A1.5 1.5 0 0014.5 4 1.5 1.5 0 0013 5.5V7h-2zm-6 6v6h6v-6H5zm8 0v6h6v-6h-6z" />
        ) : (
          <path d="M17.7 6.3C14.2 5.2 10.2 6 7.8 8.8 5.4 11.6 5.2 15.7 7 19c2.7-1.3 5-3.6 6.3-6.5 1.4-3.1 1.5-6.3.2-8.7-.1-.1-.3-.3-.4-.4-.1.3-.3.7-.4 1-.9 2.3-2.6 4.2-4.9 5.4 2.5-3.2 5.7-5.1 9.9-5.5z" />
        )}
      </svg>
    </span>
  )
}

type FeatureListBlockProps = {
  block: FeatureListBlock
}

export default function FeatureListBlock({ block }: FeatureListBlockProps) {
  const features = block.features ?? []

  if (features.length === 0) {
    return null
  }

  return (
    <section className="content-container py-16 small:py-20">
      {block.section_title ? (
        <div className="mb-12 sm:mb-14 text-center">
          <p className="text-xs uppercase tracking-[0.28em] text-brand-solid mb-3">
            Cam kết
          </p>
          <Heading
            level="h2"
            className="font-display text-3xl sm:text-4xl font-medium tracking-tight"
          >
            {block.section_title}
          </Heading>
        </div>
      ) : null}

      <ul
        className={clx(
          "flex gap-10 sm:gap-12 overflow-x-auto pb-4 snap-x snap-mandatory",
          "sm:grid sm:overflow-visible sm:pb-0",
          features.length >= 4
            ? "sm:grid-cols-2 lg:grid-cols-4"
            : "sm:grid-cols-2 lg:grid-cols-3"
        )}
      >
        {features.map((feature, index) => {
          const iconUrl = getStrapiMediaUrl(feature.icon)

          return (
            <li
              key={feature.id ?? index}
              className={clx(
                "flex min-w-[220px] sm:min-w-0 snap-start flex-col items-start gap-4",
                "animate-rise-fade border-t border-brand-solid/25 pt-6"
              )}
              style={{ animationDelay: `${index * 90}ms` }}
            >
              <FeatureMark iconUrl={iconUrl} iconName={feature.icon_name} />
              <Text className="font-display text-xl font-medium leading-snug">
                {feature.title}
              </Text>
              {feature.description ? (
                <Text className="text-ui-fg-subtle text-sm leading-relaxed">
                  {feature.description}
                </Text>
              ) : null}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
