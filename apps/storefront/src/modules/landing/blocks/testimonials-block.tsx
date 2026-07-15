"use client"

import { useEffect, useState } from "react"

import { Heading, Text, clx } from "@modules/common/components/ui"

import { getStrapiMediaUrl } from "@lib/strapi-media"
import type { TestimonialsBlock } from "@types/strapi-blocks"

type TestimonialsBlockProps = {
  block: TestimonialsBlock
}

const AUTOPLAY_MS = 5000

export default function TestimonialsBlock({ block }: TestimonialsBlockProps) {
  const reviews = block.reviews ?? []
  const [activeIndex, setActiveIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (reviews.length <= 1) {
      return
    }

    const timer = window.setInterval(() => {
      setIsVisible(false)
      window.setTimeout(() => {
        setActiveIndex((current) => (current + 1) % reviews.length)
        setIsVisible(true)
      }, 200)
    }, AUTOPLAY_MS)

    return () => window.clearInterval(timer)
  }, [reviews.length])

  if (reviews.length === 0) {
    return null
  }

  const active = reviews[activeIndex]
  const avatarUrl = getStrapiMediaUrl(active.avatar)

  return (
    <section className="content-container py-16 small:py-20">
      {block.heading ? (
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.28em] text-brand-solid mb-3">
            Cảm nhận
          </p>
          <Heading
            level="h2"
            className="font-display text-3xl sm:text-4xl font-medium tracking-tight"
          >
            {block.heading}
          </Heading>
        </div>
      ) : null}

      <div
        className={clx(
          "max-w-3xl mx-auto text-center px-4 transition-all duration-300",
          isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"
        )}
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={active.name}
            className="h-16 w-16 rounded-full object-cover mx-auto mb-4"
            loading="lazy"
          />
        ) : null}

        {active.rating ? (
          <p className="text-amber-500 mb-4" aria-label={`${active.rating} sao`}>
            {"★".repeat(active.rating)}
            {"☆".repeat(5 - active.rating)}
          </p>
        ) : null}

        <Text className="font-display text-xl sm:text-2xl text-ui-fg-base mb-5 leading-relaxed">
          &ldquo;{active.content}&rdquo;
        </Text>
        <Text className="txt-medium-plus">{active.name}</Text>
        {active.role ? (
          <Text className="text-ui-fg-subtle text-sm">{active.role}</Text>
        ) : null}
      </div>

      {reviews.length > 1 ? (
        <div className="flex justify-center gap-2 mt-6">
          {reviews.map((review, index) => (
            <button
              key={review.id ?? index}
              type="button"
              aria-label={`Xem đánh giá ${index + 1}`}
              className={clx(
                "h-2.5 w-2.5 rounded-full transition-colors",
                index === activeIndex ? "bg-ui-fg-base" : "bg-ui-bg-subtle-hover"
              )}
              onClick={() => {
                setIsVisible(false)
                window.setTimeout(() => {
                  setActiveIndex(index)
                  setIsVisible(true)
                }, 150)
              }}
            />
          ))}
        </div>
      ) : null}
    </section>
  )
}
