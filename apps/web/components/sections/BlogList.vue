<script setup lang="ts">
const { t, locale } = useI18n()
const localePath = useLocalePath()
const { posts: rawPosts } = useBlog()

const posts = computed(() =>
  rawPosts.value.map(post => {
    const date = new Date(post.date || Date.now())
    return {
      id: post.slug,
      slug: post.slug,
      day: date.getDate().toString().padStart(2, '0'),
      month: date.toLocaleDateString(locale.value === 'vi' ? 'vi-VN' : 'en-US', { month: 'short' }).toUpperCase(),
      year: date.getFullYear(),
      title: post.title,
      excerpt: post.excerpt,
    }
  }),
)
</script>

<template>
  <section class="section-py bg-dark-800 text-white" aria-labelledby="blog-list-heading">
    <div class="container-page">
      <h2 id="blog-list-heading" class="sr-only">{{ t('blog.title') }}</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <article
          v-for="post in posts"
          :key="post.id"
          class="group flex gap-5 md:gap-6 animate-on-scroll border border-white/10 p-5 md:p-6
                 hover:border-primary-500/50 transition-colors"
        >
          <div
            class="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 flex flex-col items-center justify-center
                   bg-primary-500 text-white"
          >
            <span class="text-xl md:text-2xl font-bold leading-none">{{ post.day }}</span>
            <span class="text-[10px] md:text-xs tracking-widest mt-1">{{ post.month }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <time class="text-white/40 text-xs">{{ post.year }}</time>
            <h3 class="font-heading text-lg md:text-xl font-semibold text-white mt-1 mb-2
                       group-hover:text-primary-400 transition-colors">
              <NuxtLink :to="localePath(`/tin-tuc/${post.slug}`)">
                {{ post.title }}
              </NuxtLink>
            </h3>
            <p class="text-white/50 text-sm leading-relaxed">
              {{ post.excerpt }}
            </p>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
