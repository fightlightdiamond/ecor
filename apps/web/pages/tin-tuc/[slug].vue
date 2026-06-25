<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()
const localePath = useLocalePath()
const { getBySlug } = useBlog()

const slug = computed(() => String(route.params.slug))

const { data: post, pending } = useAsyncData(
  `post-${slug.value}`,
  () => getBySlug(slug.value),
)

watchEffect(() => {
  if (!pending.value && !post.value) {
    throw createError({ statusCode: 404, statusMessage: 'Post not found', fatal: true })
  }
})

const title = computed(() => post.value?.title || '')
const excerpt = computed(() => post.value?.excerpt || '')
const content = computed(() => post.value?.content || '')

useSeoMeta({
  title: () => `${title.value} | ${t('nav.blog')}`,
  description: () => excerpt.value,
  ogImage: () => post.value?.image,
})

useArticleStructuredData(post)
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
        <p v-if="excerpt" class="mt-6 text-white/70 leading-relaxed text-base md:text-lg">
          {{ excerpt }}
        </p>
        <div
          v-if="content"
          class="prose prose-invert max-w-none mt-8 text-white/80 leading-relaxed"
          v-html="content"
        />
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
