<script setup lang="ts">
const { t, locale } = useI18n()
const { contact, hours } = useSettings()

const form = reactive({
  name: '',
  phone: '',
  email: '',
  service: '',
  message: '',
})

const status = ref<'idle' | 'submitting' | 'success' | 'error'>('idle')

async function handleSubmit() {
  if (!form.name || !form.phone) return
  status.value = 'submitting'
  // Phase 1: simulated — Phase 4 sẽ kết nối API thật
  await new Promise(resolve => setTimeout(resolve, 1200))
  status.value = 'success'
  setTimeout(() => {
    status.value = 'idle'
    form.name = form.phone = form.email = form.service = form.message = ''
  }, 5000)
}

const localText = (field: Record<string, string> | undefined) =>
  field?.[locale.value] ?? field?.vi ?? ''
</script>

<template>
  <section id="contact" class="section-py bg-[#222] text-white" aria-labelledby="contact-heading">
    <div class="container-page">

      <!-- Heading -->
      <div class="text-center mb-12 md:mb-16 animate-on-scroll">
        <p class="modis-eyebrow mb-3 justify-center">{{ t('nav.contact') }}</p>
        <h2 id="contact-heading" class="section-heading text-white mb-4">
          {{ t('contact.title') }}
        </h2>
        <div class="divider-gold" />
        <p class="text-white/60 mt-4 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
          {{ t('contact.subtitle') }}
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

        <!-- Left: info -->
        <div class="animate-on-scroll space-y-6">

          <div class="flex gap-4">
            <div class="w-10 h-10 flex-shrink-0 bg-primary-500/20 border border-primary-500/30
                        flex items-center justify-center text-primary-400 text-base">
              📍
            </div>
            <div>
              <h3 class="text-xs uppercase tracking-widest text-primary-400 mb-1">
                {{ t('contact.address') }}
              </h3>
              <p class="text-white/70 text-sm leading-relaxed">
                {{ localText(contact.address as Record<string, string>) }}
              </p>
            </div>
          </div>

          <div class="flex gap-4">
            <div class="w-10 h-10 flex-shrink-0 bg-primary-500/20 border border-primary-500/30
                        flex items-center justify-center text-primary-400 text-base">
              📞
            </div>
            <div>
              <h3 class="text-xs uppercase tracking-widest text-primary-400 mb-1">
                {{ t('contact.phone') }}
              </h3>
              <a
                :href="`tel:${contact.phone}`"
                class="text-white font-semibold hover:text-primary-400 transition-colors text-lg"
              >
                {{ contact.phoneDisplay }}
              </a>
            </div>
          </div>

          <div class="flex gap-4">
            <div class="w-10 h-10 flex-shrink-0 bg-primary-500/20 border border-primary-500/30
                        flex items-center justify-center text-primary-400 text-base">
              🕐
            </div>
            <div>
              <h3 class="text-xs uppercase tracking-widest text-primary-400 mb-2">
                {{ t('contact.hours') }}
              </h3>
              <ul class="space-y-0.5">
                <li v-for="h in hours" :key="h.days" class="text-sm text-white/70">
                  <span class="text-white">{{ h.days }}:</span> {{ h.time }}
                </li>
              </ul>
            </div>
          </div>

          <div class="flex gap-4">
            <div class="w-10 h-10 flex-shrink-0 bg-primary-500/20 border border-primary-500/30
                        flex items-center justify-center text-primary-400 text-base">
              ✉️
            </div>
            <div>
              <h3 class="text-xs uppercase tracking-widest text-primary-400 mb-1">
                {{ t('contact.email') }}
              </h3>
              <a
                :href="`mailto:${contact.email}`"
                class="text-white/70 hover:text-primary-400 transition-colors text-sm"
              >
                {{ contact.email }}
              </a>
            </div>
          </div>

          <!-- Map placeholder -->
          <div class="mt-6 h-48 bg-white/5 border border-white/10 flex items-center justify-center">
            <p class="text-white/30 text-sm">📍 Google Maps</p>
          </div>
        </div>

        <!-- Right: form -->
        <div class="animate-on-scroll">
          <form
            class="bg-white/5 border border-white/10 p-6 md:p-8 space-y-5"
            novalidate
            @submit.prevent="handleSubmit"
          >
            <!-- Name -->
            <div>
              <label for="contact-name" class="block text-xs uppercase tracking-widest text-primary-400 mb-1.5">
                {{ t('contact.form.name') }} <span class="text-red-400">*</span>
              </label>
              <input
                id="contact-name"
                v-model="form.name"
                type="text"
                :placeholder="t('contact.form.namePlaceholder')"
                required
                class="w-full px-4 py-3 bg-white/5 border border-white/15 text-white placeholder-white/30
                       text-sm focus:outline-none focus:border-primary-500 transition-colors min-h-[44px]"
              >
            </div>

            <!-- Phone -->
            <div>
              <label for="contact-phone" class="block text-xs uppercase tracking-widest text-primary-400 mb-1.5">
                {{ t('contact.form.phone') }} <span class="text-red-400">*</span>
              </label>
              <input
                id="contact-phone"
                v-model="form.phone"
                type="tel"
                inputmode="numeric"
                :placeholder="t('contact.form.phonePlaceholder')"
                required
                class="w-full px-4 py-3 bg-white/5 border border-white/15 text-white placeholder-white/30
                       text-sm focus:outline-none focus:border-primary-500 transition-colors min-h-[44px]"
              >
            </div>

            <!-- Email -->
            <div>
              <label for="contact-email" class="block text-xs uppercase tracking-widest text-primary-400 mb-1.5">
                {{ t('contact.form.email') }}
              </label>
              <input
                id="contact-email"
                v-model="form.email"
                type="email"
                :placeholder="t('contact.form.emailPlaceholder')"
                class="w-full px-4 py-3 bg-white/5 border border-white/15 text-white placeholder-white/30
                       text-sm focus:outline-none focus:border-primary-500 transition-colors min-h-[44px]"
              >
            </div>

            <!-- Service -->
            <div>
              <label for="contact-service" class="block text-xs uppercase tracking-widest text-primary-400 mb-1.5">
                {{ t('contact.form.service') }}
              </label>
              <select
                id="contact-service"
                v-model="form.service"
                class="w-full px-4 py-3 bg-dark border border-white/15 text-white/70
                       text-sm focus:outline-none focus:border-primary-500 transition-colors min-h-[44px]"
              >
                <option value="">{{ t('contact.form.servicePlaceholder') }}</option>
                <option value="hair">{{ locale === 'vi' ? 'Tóc' : 'Hair' }}</option>
                <option value="nail">Nail</option>
                <option value="spa">Spa & Massage</option>
              </select>
            </div>

            <!-- Message -->
            <div>
              <label for="contact-message" class="block text-xs uppercase tracking-widest text-primary-400 mb-1.5">
                {{ t('contact.form.message') }}
              </label>
              <textarea
                id="contact-message"
                v-model="form.message"
                rows="3"
                :placeholder="t('contact.form.messagePlaceholder')"
                class="w-full px-4 py-3 bg-white/5 border border-white/15 text-white placeholder-white/30
                       text-sm resize-none focus:outline-none focus:border-primary-500 transition-colors"
              />
            </div>

            <!-- Honeypot -->
            <input type="text" name="_honey" class="hidden" tabindex="-1" autocomplete="off">

            <!-- Submit -->
            <button
              type="submit"
              :disabled="status === 'submitting'"
              class="btn-primary w-full justify-center py-4 text-sm uppercase tracking-wider
                     disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="status === 'submitting'">{{ t('contact.form.submitting') }}</span>
              <span v-else>{{ t('contact.form.submit') }}</span>
            </button>

            <!-- Feedback -->
            <Transition enter-active-class="transition-opacity duration-300" enter-from-class="opacity-0">
              <div
                v-if="status === 'success'"
                class="text-green-400 bg-green-500/10 border border-green-500/30 p-3 text-sm"
              >
                ✅ {{ t('contact.form.success') }}
              </div>
              <div
                v-else-if="status === 'error'"
                class="text-red-400 bg-red-500/10 border border-red-500/30 p-3 text-sm"
              >
                ❌ {{ t('contact.form.error') }}
              </div>
            </Transition>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
