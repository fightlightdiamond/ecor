<script setup lang="ts">
const { team } = useTeam()

const { t, locale } = useI18n()
</script>

<template>
  <section class="section-py bg-dark-700 text-white" aria-labelledby="team-full-heading">
    <div class="container-page">
      <h2 id="team-full-heading" class="sr-only">{{ t('team.title') }}</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
        <article
          v-for="member in team"
          :key="member.id"
          class="text-center group animate-on-scroll"
        >
          <div class="relative inline-block mb-5">
            <div
              class="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden mx-auto
                     ring-4 ring-white/10 shadow-lg group-hover:ring-primary-500/50 transition-all duration-300"
            >
              <NuxtImg
                :src="member.avatar"
                :alt="member.name"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="192px"
                format="webp"
                loading="lazy"
              />
            </div>
          </div>
          <h3 class="font-heading text-xl font-semibold text-white mb-1">
            {{ member.name }}
          </h3>
          <p class="text-primary-400 text-sm font-medium mb-3">
            {{ member.role }}
          </p>
          <p class="text-white/50 text-sm leading-relaxed mb-4 max-w-xs mx-auto">
            {{ member.bio }}
          </p>
          <div class="flex flex-wrap gap-2 justify-center">
            <span
              v-for="spec in member.specialties"
              :key="spec"
              class="text-xs bg-primary-500/10 text-primary-300 border border-primary-500/30
                     px-3 py-1 rounded-full"
            >
              {{ spec }}
            </span>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
