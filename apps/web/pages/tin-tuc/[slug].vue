<script setup lang="ts">
import blogData from '~/content/blog.json'

const { t, locale } = useI18n()
const route = useRoute()
const localePath = useLocalePath()

const localText = (field: Record<string, string> | undefined) =>
  field?.[locale.value] ?? field?.vi ?? ''

const post = computed(() =>
  blogData.find(p => p.slug === route.params.slug),
)

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Post not found' })
}

const title = computed(() => localText(post.value!.title))
const excerpt = computed(() => localText(post.value!.excerpt))

useSeoMeta({
  title: () => `${title.value} | ${t('nav.blog')}`,
  description: () => excerpt.value,
})
</script>

<template>
  <div class="bg-dark min-h-[60vh]">
    <LayoutPageHero
      :label="t('blog.eyebrow')"
      :title="title"
    />
    <article class="section-py bg-dark-800 text-white">
      <div class="container-page max-w-3xl">
        <time class="text-primary-400 text-sm">{{ post!.date }}</time>
        <p class="mt-6 text-white/70 leading-relaxed text-base md:text-lg">
          {{ excerpt }}
        </p>
        <p class="mt-6 text-white/40 text-sm">
          {{ t('blog.comingSoon') }}
        </p>
        <NuxtLink
          :to="localePath('/tin-tuc')"
          class="btn-ghost mt-10 inline-flex"
        >
          ← {{ t('common.back') }}
        </NuxtLink>
      </div>
    </article>
  </div>
</template>
