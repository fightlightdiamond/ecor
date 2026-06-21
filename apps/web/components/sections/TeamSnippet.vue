<script setup lang="ts">
import teamData from '~/content/team.json'

const { t, locale } = useI18n()
const localePath = useLocalePath()

const localText = (field: Record<string, string> | undefined) =>
  field?.[locale.value] ?? field?.vi ?? ''

const team = computed(() =>
  teamData
    .filter(m => m.featured)
    .map(m => ({
      ...m,
      name: localText(m.name),
      role: localText(m.role),
      bio: localText(m.bio),
      specialties: m.specialties.map(s => localText(s)),
    })),
)
</script>

<template>
  <section class="section-py bg-[#27282b] text-white" aria-labelledby="team-heading">
    <div class="container-page">
      <!-- Heading -->
      <div class="text-center mb-12 animate-on-scroll">
        <p class="text-primary-500 text-sm font-medium tracking-widest uppercase mb-3">
          {{ t('team.specialist') }}
        </p>
        <h2 id="team-heading" class="section-heading text-white mb-4">
          {{ t('team.title') }}
        </h2>
        <div class="divider-gold" />
        <p class="section-subheading mt-4 max-w-2xl mx-auto text-white/60">
          {{ t('team.subtitle') }}
        </p>
      </div>

      <!-- Team grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <article
          v-for="member in team"
          :key="member.id"
          class="text-center group animate-on-scroll"
        >
          <!-- Avatar -->
          <div class="relative inline-block mb-5">
            <div class="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden mx-auto
                        ring-4 ring-white shadow-lg group-hover:ring-primary-300 transition-all duration-300">
              <NuxtImg
                :src="member.avatar"
                :alt="member.name"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="192px"
                format="webp"
                loading="lazy"
              />
            </div>
            <!-- Social link overlay -->
            <a
              v-if="member.social?.instagram"
              :href="member.social.instagram"
              target="_blank"
              rel="noopener noreferrer"
              class="absolute bottom-1 right-4 w-8 h-8 bg-primary-500 text-white rounded-full
                     flex items-center justify-center text-xs font-bold
                     opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              :aria-label="`${member.name} on Instagram`"
            >
              in
            </a>
          </div>

          <!-- Info -->
          <h3 class="font-heading text-xl font-semibold text-white mb-1">
            {{ member.name }}
          </h3>
          <p class="text-primary-500 text-sm font-medium mb-3">
            {{ member.role }}
          </p>
          <p class="text-white/50 text-sm leading-relaxed mb-4 max-w-xs mx-auto">
            {{ member.bio }}
          </p>

          <!-- Specialties -->
          <div class="flex flex-wrap gap-2 justify-center">
            <span
              v-for="spec in member.specialties"
              :key="spec"
              class="text-xs bg-white/5 text-primary-400 border border-primary-500/30
                     px-3 py-1 rounded-full"
            >
              {{ spec }}
            </span>
          </div>
        </article>
      </div>

      <!-- CTA -->
      <div class="text-center mt-12 animate-on-scroll">
        <NuxtLink :to="localePath('/doi-ngu')" class="btn-ghost px-10 py-4">
          {{ t('team.viewAll') }}
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
