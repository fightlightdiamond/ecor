<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()
const { site } = useSettings()
const { categories, byCategory, pending } = useProducts()

useScrollAnimation()

const slug = computed(() => String(route.params.slug))
const category = computed(() => categories.value.find(c => c.slug === slug.value) ?? null)
const categoryProducts = computed(() => (category.value ? byCategory(category.value.id) : []))

watchEffect(() => {
  if (!pending.value && categories.value.length && !category.value) {
    throw createError({ statusCode: 404, statusMessage: 'Category not found', fatal: true })
  }
})

useSeoMeta({
  title: () => `${category.value?.label ?? ''} | ${t('products.title')} | ${site.value.name}`,
  description: () => `${category.value?.label ?? ''} — ${t('products.subtitle')}`,
  ogImage: () => categoryProducts.value[0]?.image || undefined,
})
</script>

<template>
  <SectionsProductGroupShowcase
    :pending="pending"
    :group-label="t('products.browseCategories')"
    :heading="category?.label ?? ''"
    :items="categories"
    :active-slug="slug"
    base-path="/san-pham/danh-muc"
    :empty-message="t('products.empty')"
    :products="categoryProducts"
  />
</template>
