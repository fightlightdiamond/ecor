<script setup lang="ts">
import { stripHtml } from '~/utils/storefront'

const { t, locale } = useI18n()
const route = useRoute()
const localePath = useLocalePath()
const { getBySlug, posts: allPosts } = useBlog()

useScrollAnimation()

const slug = computed(() => String(route.params.slug))

const { data: post, pending } = useAsyncData(
  () => `post-${slug.value}`,
  () => getBySlug(slug.value),
  { watch: [slug] },
)

watchEffect(() => {
  if (!pending.value && !post.value) {
    throw createError({ statusCode: 404, statusMessage: 'Post not found', fatal: true })
  }
})

const title = computed(() => post.value?.title || '')
const excerpt = computed(() => post.value?.excerpt || '')
const content = computed(() => post.value?.content || '')
const topic = computed(() => post.value?.topic ?? null)

const dateLabel = computed(() => {
  if (!post.value?.date) return ''
  return new Date(post.value.date).toLocaleDateString(
    locale.value === 'vi' ? 'vi-VN' : 'en-US',
    { day: 'numeric', month: 'long', year: 'numeric' },
  )
})

/** ~200 words/min, minimum 1 minute */
const readingMinutes = computed(() => {
  const words = stripHtml(content.value).split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
})

const relatedPosts = computed(() => {
  const current = slug.value
  const sameTopic = allPosts.value.filter(
    p => p.slug !== current && topic.value && p.topic?.slug === topic.value.slug,
  )
  const others = allPosts.value.filter(
    p => p.slug !== current && !sameTopic.includes(p),
  )
  return [...sameTopic, ...others].slice(0, 3).map((p) => {
    const date = new Date(p.date || Date.now())
    return {
      ...p,
      dateLabel: date.toLocaleDateString(locale.value === 'vi' ? 'vi-VN' : 'en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    }
  })
})

useSeoMeta({
  title: () => `${title.value} | ${t('nav.blog')}`,
  description: () => excerpt.value,
  ogImage: () => post.value?.image,
})

useArticleStructuredData(post)
</script>

<template>
  <div class="bg-dark min-h-[60vh]">
    <template v-if="post">
      <!-- ── Article header ─────────────────────────── -->
      <header class="container-page pt-10 md:pt-16 pb-8 text-center">
        <nav class="mb-6 text-[11px] uppercase tracking-[0.2em] text-white/50" aria-label="breadcrumb">
          <ol class="flex flex-wrap items-center justify-center gap-2">
            <li>
              <NuxtLink :to="localePath('/')" class="hover:text-primary-300 transition-colors">
                {{ t('nav.home') }}
              </NuxtLink>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <NuxtLink :to="localePath('/tin-tuc')" class="hover:text-primary-300 transition-colors">
                {{ t('nav.blog') }}
              </NuxtLink>
            </li>
            <li v-if="topic" aria-hidden="true">/</li>
            <li v-if="topic">
              <NuxtLink
                :to="localePath(`/tin-tuc/chu-de/${topic.slug}`)"
                class="text-primary-300 hover:text-primary-200 transition-colors"
              >
                {{ topic.name }}
              </NuxtLink>
            </li>
          </ol>
        </nav>

        <NuxtLink
          v-if="topic"
          :to="localePath(`/tin-tuc/chu-de/${topic.slug}`)"
          class="inline-flex items-center rounded-full bg-primary-500/15 px-4 py-1.5 mb-5
                 text-[11px] font-semibold uppercase tracking-wider text-primary-300
                 hover:bg-primary-500/25 transition-colors"
        >
          {{ topic.name }}
        </NuxtLink>

        <h1 class="font-heading text-3xl sm:text-4xl md:text-5xl font-bold leading-tight max-w-4xl mx-auto text-white">
          {{ title }}
        </h1>

        <div class="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs uppercase tracking-[0.18em] text-white/50">
          <span class="inline-flex items-center gap-2">
            <svg class="w-4 h-4 text-primary-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
            <time>{{ dateLabel }}</time>
          </span>
          <span class="inline-flex items-center gap-2">
            <svg class="w-4 h-4 text-primary-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
            </svg>
            {{ t('blog.readingTime', { minutes: readingMinutes }) }}
          </span>
          <span class="inline-flex items-center gap-2">
            <svg class="w-4 h-4 text-primary-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
            {{ post.author }}
          </span>
        </div>
      </header>

      <!-- ── Hero image ─────────────────────────────── -->
      <div class="container-page">
        <div class="max-w-5xl mx-auto overflow-hidden rounded-2xl md:rounded-3xl shadow-lg shadow-black/30 ring-1 ring-white/10">
          <img
            :src="post.image"
            :alt="title"
            class="w-full aspect-[16/9] md:aspect-[21/9] object-cover"
          >
        </div>
      </div>

      <!-- ── Article body ───────────────────────────── -->
      <article class="container-page py-10 md:py-16">
        <div class="max-w-3xl mx-auto">
          <p
            v-if="excerpt"
            class="text-base md:text-lg leading-relaxed text-white/80 border-l-4 border-primary-400 bg-primary-500/10 rounded-r-xl px-5 py-4 mb-10"
          >
            {{ excerpt }}
          </p>

          <div
            v-if="content"
            class="article-body"
            v-html="content"
          />
          <p v-else class="text-white/50 italic">{{ t('blog.comingSoon') }}</p>

          <!-- Footer actions -->
          <div class="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <NuxtLink
              v-if="topic"
              :to="localePath(`/tin-tuc/chu-de/${topic.slug}`)"
              class="inline-flex items-center gap-2 text-primary-400 text-xs font-condensed uppercase tracking-[0.15em] hover:text-primary-300 transition-colors"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              {{ t('blog.backToTopic', { topic: topic.name }) }}
            </NuxtLink>
            <NuxtLink
              :to="localePath('/tin-tuc')"
              class="btn-ghost rounded-full"
            >
              {{ t('blog.viewAll') }}
            </NuxtLink>
          </div>
        </div>
      </article>

      <!-- ── Related posts ──────────────────────────── -->
      <section
        v-if="relatedPosts.length"
        class="bg-dark-800 border-t border-white/10"
        aria-labelledby="related-posts-heading"
      >
        <div class="container-page py-12 md:py-16">
          <div class="text-center mb-10">
            <p class="modis-eyebrow mb-3 justify-center">{{ t('blog.eyebrow') }}</p>
            <h2 id="related-posts-heading" class="font-heading text-2xl md:text-3xl font-semibold text-white">
              {{ t('blog.related') }}
            </h2>
            <div class="divider-gold" />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <article
              v-for="item in relatedPosts"
              :key="item.slug"
              class="group flex flex-col overflow-hidden rounded-2xl bg-white/[0.04]
                     ring-1 ring-white/10 hover:ring-primary-400/50
                     hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30 transition-all duration-300"
            >
              <NuxtLink
                :to="localePath(`/tin-tuc/${item.slug}`)"
                class="relative block aspect-[16/10] overflow-hidden"
                :aria-label="item.title"
              >
                <img
                  :src="item.image"
                  :alt="item.title"
                  loading="lazy"
                  class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                >
                <span
                  v-if="item.topic"
                  class="absolute left-4 top-4 inline-flex items-center rounded-full
                         bg-primary-500 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white shadow"
                >
                  {{ item.topic.name }}
                </span>
              </NuxtLink>
              <div class="flex flex-1 flex-col p-6">
                <time class="text-primary-400 text-xs uppercase tracking-[0.2em]">{{ item.dateLabel }}</time>
                <h3 class="font-heading text-lg font-semibold text-white mt-2 group-hover:text-primary-400 transition-colors line-clamp-2">
                  <NuxtLink :to="localePath(`/tin-tuc/${item.slug}`)">
                    {{ item.title }}
                  </NuxtLink>
                </h3>
              </div>
            </article>
          </div>
        </div>
      </section>
    </template>

    <!-- Loading state -->
    <div v-else class="container-page py-20">
      <div class="max-w-3xl mx-auto space-y-6 animate-pulse">
        <div class="h-4 w-40 mx-auto rounded bg-white/10" />
        <div class="h-10 w-3/4 mx-auto rounded bg-white/10" />
        <div class="aspect-[21/9] rounded-3xl bg-white/10" />
        <div class="h-4 w-full rounded bg-white/10" />
        <div class="h-4 w-5/6 rounded bg-white/10" />
      </div>
    </div>
  </div>
</template>

<style scoped>
/*
 * TipTap content styling — matches the site's dark theme (bg-dark, white
 * text, primary-400 gold accents). :deep() because the HTML comes from v-html.
 */
.article-body {
  @apply text-white/75 leading-[1.85] text-base md:text-lg;
}
.article-body :deep(p) {
  @apply my-5;
}
.article-body :deep(h1),
.article-body :deep(h2) {
  @apply font-heading text-2xl md:text-3xl font-semibold text-white mt-12 mb-4 relative pl-4;
}
.article-body :deep(h1)::before,
.article-body :deep(h2)::before {
  content: '';
  @apply absolute left-0 top-1 bottom-1 w-[4px] rounded-full bg-primary-500;
}
.article-body :deep(h3) {
  @apply font-heading text-xl md:text-2xl font-semibold text-white mt-10 mb-3;
}
.article-body :deep(h4),
.article-body :deep(h5),
.article-body :deep(h6) {
  @apply font-heading text-lg font-semibold text-white mt-8 mb-2;
}
.article-body :deep(a) {
  @apply text-primary-400 underline decoration-primary-400/40 underline-offset-4 transition-colors;
}
.article-body :deep(a:hover) {
  @apply text-primary-300 decoration-primary-300;
}
.article-body :deep(strong) {
  @apply text-white font-semibold;
}
.article-body :deep(blockquote) {
  @apply my-8 border-l-4 border-primary-400 bg-primary-500/10 rounded-r-xl px-6 py-4 italic text-white/80;
}
.article-body :deep(blockquote p) {
  @apply my-0;
}
.article-body :deep(ul),
.article-body :deep(ol) {
  @apply my-5 pl-6 space-y-2;
}
.article-body :deep(ul) {
  @apply list-disc marker:text-primary-400;
}
.article-body :deep(ol) {
  @apply list-decimal marker:text-primary-400 marker:font-semibold;
}
.article-body :deep(img) {
  @apply my-8 w-full rounded-2xl shadow-md shadow-black/30 ring-1 ring-white/10;
}
.article-body :deep(iframe) {
  @apply my-8 rounded-2xl shadow-md shadow-black/30;
}
.article-body :deep(hr) {
  @apply my-10 border-0 h-[2px] bg-gradient-to-r from-transparent via-primary-400/60 to-transparent;
}
.article-body :deep(code) {
  @apply rounded bg-white/10 px-1.5 py-0.5 text-sm text-primary-300;
}
.article-body :deep(pre) {
  @apply my-6 overflow-x-auto rounded-xl bg-black/30 p-5 text-sm text-white/90;
}
.article-body :deep(pre code) {
  @apply bg-transparent p-0 text-inherit;
}
.article-body :deep(mark) {
  @apply bg-primary-400/80 text-dark rounded px-1;
}
.article-body :deep(table) {
  @apply my-6 w-full border-collapse text-sm md:text-base;
}
.article-body :deep(th) {
  @apply bg-primary-500/10 text-white font-semibold border border-primary-400/30 px-4 py-2.5 text-left;
}
.article-body :deep(td) {
  @apply border border-white/10 px-4 py-2.5 bg-white/[0.02] text-white/80;
}
</style>
