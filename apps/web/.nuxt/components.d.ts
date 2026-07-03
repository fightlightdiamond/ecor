
import type { DefineComponent, SlotsType } from 'vue'
type IslandComponent<T extends DefineComponent> = T & DefineComponent<{}, {refresh: () => Promise<void>}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, SlotsType<{ fallback: { error: unknown } }>>
type HydrationStrategies = {
  hydrateOnVisible?: IntersectionObserverInit | true
  hydrateOnIdle?: number | true
  hydrateOnInteraction?: keyof HTMLElementEventMap | Array<keyof HTMLElementEventMap> | true
  hydrateOnMediaQuery?: string
  hydrateAfter?: number
  hydrateWhen?: boolean
  hydrateNever?: true
}
type LazyComponent<T> = (T & DefineComponent<HydrationStrategies, {}, {}, {}, {}, {}, {}, { hydrated: () => void }>)
interface _GlobalComponents {
      'HomeMobileTopBanner': typeof import("../components/home/HomeMobileTopBanner.vue")['default']
    'HomeNewsMarquee': typeof import("../components/home/HomeNewsMarquee.vue")['default']
    'HomeNewsTicker': typeof import("../components/home/HomeNewsTicker.vue")['default']
    'HomePageBackground': typeof import("../components/home/HomePageBackground.vue")['default']
    'HomePillarList': typeof import("../components/home/HomePillarList.vue")['default']
    'HomePromotionsList': typeof import("../components/home/HomePromotionsList.vue")['default']
    'LayoutAppFooter': typeof import("../components/layout/AppFooter.vue")['default']
    'LayoutAppHeader': typeof import("../components/layout/AppHeader.vue")['default']
    'LayoutGlobalWidgets': typeof import("../components/layout/GlobalWidgets.vue")['default']
    'LayoutPageHero': typeof import("../components/layout/PageHero.vue")['default']
    'LayoutSiteLogo': typeof import("../components/layout/SiteLogo.vue")['default']
    'SectionsBlogList': typeof import("../components/sections/BlogList.vue")['default']
    'SectionsBlogSnippet': typeof import("../components/sections/BlogSnippet.vue")['default']
    'SectionsContactSection': typeof import("../components/sections/ContactSection.vue")['default']
    'SectionsGalleryFilter': typeof import("../components/sections/GalleryFilter.vue")['default']
    'SectionsHeroSlider': typeof import("../components/sections/HeroSlider.vue")['default']
    'SectionsPromoBanner': typeof import("../components/sections/PromoBanner.vue")['default']
    'SectionsServicesDiscover': typeof import("../components/sections/ServicesDiscover.vue")['default']
    'SectionsServicesOverview': typeof import("../components/sections/ServicesOverview.vue")['default']
    'SectionsServicesTabs': typeof import("../components/sections/ServicesTabs.vue")['default']
    'SectionsSkillsSection': typeof import("../components/sections/SkillsSection.vue")['default']
    'SectionsTeamFull': typeof import("../components/sections/TeamFull.vue")['default']
    'SectionsTeamSnippet': typeof import("../components/sections/TeamSnippet.vue")['default']
    'SectionsTestimonialsSection': typeof import("../components/sections/TestimonialsSection.vue")['default']
    'WidgetsConnectWidget': typeof import("../components/widgets/ConnectWidget.vue")['default']
    'WidgetsLangSwitch': typeof import("../components/widgets/LangSwitch.vue")['default']
    'NuxtWelcome': typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']
    'NuxtLayout': typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']
    'NuxtErrorBoundary': typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
    'ClientOnly': typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']
    'DevOnly': typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']
    'ServerPlaceholder': typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']
    'NuxtLink': typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']
    'NuxtLoadingIndicator': typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
    'NuxtTime': typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
    'NuxtRouteAnnouncer': typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
    'NuxtImg': typeof import("../node_modules/@nuxt/image/dist/runtime/components/NuxtImg.vue")['default']
    'NuxtPicture': typeof import("../node_modules/@nuxt/image/dist/runtime/components/NuxtPicture.vue")['default']
    'NuxtLinkLocale': typeof import("../node_modules/@nuxtjs/i18n/dist/runtime/components/NuxtLinkLocale")['default']
    'SwitchLocalePathLink': typeof import("../node_modules/@nuxtjs/i18n/dist/runtime/components/SwitchLocalePathLink")['default']
    'NuxtPage': typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']
    'NoScript': typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']
    'Link': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']
    'Base': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']
    'Title': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']
    'Meta': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']
    'Style': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']
    'Head': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']
    'Html': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']
    'Body': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']
    'NuxtIsland': typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']
    'NuxtRouteAnnouncer': IslandComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
      'LazyHomeMobileTopBanner': LazyComponent<typeof import("../components/home/HomeMobileTopBanner.vue")['default']>
    'LazyHomeNewsMarquee': LazyComponent<typeof import("../components/home/HomeNewsMarquee.vue")['default']>
    'LazyHomeNewsTicker': LazyComponent<typeof import("../components/home/HomeNewsTicker.vue")['default']>
    'LazyHomePageBackground': LazyComponent<typeof import("../components/home/HomePageBackground.vue")['default']>
    'LazyHomePillarList': LazyComponent<typeof import("../components/home/HomePillarList.vue")['default']>
    'LazyHomePromotionsList': LazyComponent<typeof import("../components/home/HomePromotionsList.vue")['default']>
    'LazyLayoutAppFooter': LazyComponent<typeof import("../components/layout/AppFooter.vue")['default']>
    'LazyLayoutAppHeader': LazyComponent<typeof import("../components/layout/AppHeader.vue")['default']>
    'LazyLayoutGlobalWidgets': LazyComponent<typeof import("../components/layout/GlobalWidgets.vue")['default']>
    'LazyLayoutPageHero': LazyComponent<typeof import("../components/layout/PageHero.vue")['default']>
    'LazyLayoutSiteLogo': LazyComponent<typeof import("../components/layout/SiteLogo.vue")['default']>
    'LazySectionsBlogList': LazyComponent<typeof import("../components/sections/BlogList.vue")['default']>
    'LazySectionsBlogSnippet': LazyComponent<typeof import("../components/sections/BlogSnippet.vue")['default']>
    'LazySectionsContactSection': LazyComponent<typeof import("../components/sections/ContactSection.vue")['default']>
    'LazySectionsGalleryFilter': LazyComponent<typeof import("../components/sections/GalleryFilter.vue")['default']>
    'LazySectionsHeroSlider': LazyComponent<typeof import("../components/sections/HeroSlider.vue")['default']>
    'LazySectionsPromoBanner': LazyComponent<typeof import("../components/sections/PromoBanner.vue")['default']>
    'LazySectionsServicesDiscover': LazyComponent<typeof import("../components/sections/ServicesDiscover.vue")['default']>
    'LazySectionsServicesOverview': LazyComponent<typeof import("../components/sections/ServicesOverview.vue")['default']>
    'LazySectionsServicesTabs': LazyComponent<typeof import("../components/sections/ServicesTabs.vue")['default']>
    'LazySectionsSkillsSection': LazyComponent<typeof import("../components/sections/SkillsSection.vue")['default']>
    'LazySectionsTeamFull': LazyComponent<typeof import("../components/sections/TeamFull.vue")['default']>
    'LazySectionsTeamSnippet': LazyComponent<typeof import("../components/sections/TeamSnippet.vue")['default']>
    'LazySectionsTestimonialsSection': LazyComponent<typeof import("../components/sections/TestimonialsSection.vue")['default']>
    'LazyWidgetsConnectWidget': LazyComponent<typeof import("../components/widgets/ConnectWidget.vue")['default']>
    'LazyWidgetsLangSwitch': LazyComponent<typeof import("../components/widgets/LangSwitch.vue")['default']>
    'LazyNuxtWelcome': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']>
    'LazyNuxtLayout': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
    'LazyNuxtErrorBoundary': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
    'LazyClientOnly': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']>
    'LazyDevOnly': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']>
    'LazyServerPlaceholder': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
    'LazyNuxtLink': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']>
    'LazyNuxtLoadingIndicator': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
    'LazyNuxtTime': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
    'LazyNuxtRouteAnnouncer': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
    'LazyNuxtImg': LazyComponent<typeof import("../node_modules/@nuxt/image/dist/runtime/components/NuxtImg.vue")['default']>
    'LazyNuxtPicture': LazyComponent<typeof import("../node_modules/@nuxt/image/dist/runtime/components/NuxtPicture.vue")['default']>
    'LazyNuxtLinkLocale': LazyComponent<typeof import("../node_modules/@nuxtjs/i18n/dist/runtime/components/NuxtLinkLocale")['default']>
    'LazySwitchLocalePathLink': LazyComponent<typeof import("../node_modules/@nuxtjs/i18n/dist/runtime/components/SwitchLocalePathLink")['default']>
    'LazyNuxtPage': LazyComponent<typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']>
    'LazyNoScript': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']>
    'LazyLink': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']>
    'LazyBase': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']>
    'LazyTitle': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']>
    'LazyMeta': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']>
    'LazyStyle': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']>
    'LazyHead': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']>
    'LazyHtml': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']>
    'LazyBody': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']>
    'LazyNuxtIsland': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']>
    'LazyNuxtRouteAnnouncer': LazyComponent<IslandComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>>
}

declare module 'vue' {
  export interface GlobalComponents extends _GlobalComponents { }
}

export const HomeMobileTopBanner: typeof import("../components/home/HomeMobileTopBanner.vue")['default']
export const HomeNewsMarquee: typeof import("../components/home/HomeNewsMarquee.vue")['default']
export const HomeNewsTicker: typeof import("../components/home/HomeNewsTicker.vue")['default']
export const HomePageBackground: typeof import("../components/home/HomePageBackground.vue")['default']
export const HomePillarList: typeof import("../components/home/HomePillarList.vue")['default']
export const HomePromotionsList: typeof import("../components/home/HomePromotionsList.vue")['default']
export const LayoutAppFooter: typeof import("../components/layout/AppFooter.vue")['default']
export const LayoutAppHeader: typeof import("../components/layout/AppHeader.vue")['default']
export const LayoutGlobalWidgets: typeof import("../components/layout/GlobalWidgets.vue")['default']
export const LayoutPageHero: typeof import("../components/layout/PageHero.vue")['default']
export const LayoutSiteLogo: typeof import("../components/layout/SiteLogo.vue")['default']
export const SectionsBlogList: typeof import("../components/sections/BlogList.vue")['default']
export const SectionsBlogSnippet: typeof import("../components/sections/BlogSnippet.vue")['default']
export const SectionsContactSection: typeof import("../components/sections/ContactSection.vue")['default']
export const SectionsGalleryFilter: typeof import("../components/sections/GalleryFilter.vue")['default']
export const SectionsHeroSlider: typeof import("../components/sections/HeroSlider.vue")['default']
export const SectionsPromoBanner: typeof import("../components/sections/PromoBanner.vue")['default']
export const SectionsServicesDiscover: typeof import("../components/sections/ServicesDiscover.vue")['default']
export const SectionsServicesOverview: typeof import("../components/sections/ServicesOverview.vue")['default']
export const SectionsServicesTabs: typeof import("../components/sections/ServicesTabs.vue")['default']
export const SectionsSkillsSection: typeof import("../components/sections/SkillsSection.vue")['default']
export const SectionsTeamFull: typeof import("../components/sections/TeamFull.vue")['default']
export const SectionsTeamSnippet: typeof import("../components/sections/TeamSnippet.vue")['default']
export const SectionsTestimonialsSection: typeof import("../components/sections/TestimonialsSection.vue")['default']
export const WidgetsConnectWidget: typeof import("../components/widgets/ConnectWidget.vue")['default']
export const WidgetsLangSwitch: typeof import("../components/widgets/LangSwitch.vue")['default']
export const NuxtWelcome: typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']
export const NuxtLayout: typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']
export const NuxtErrorBoundary: typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
export const ClientOnly: typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']
export const DevOnly: typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']
export const ServerPlaceholder: typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']
export const NuxtLink: typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']
export const NuxtLoadingIndicator: typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
export const NuxtTime: typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
export const NuxtRouteAnnouncer: typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
export const NuxtImg: typeof import("../node_modules/@nuxt/image/dist/runtime/components/NuxtImg.vue")['default']
export const NuxtPicture: typeof import("../node_modules/@nuxt/image/dist/runtime/components/NuxtPicture.vue")['default']
export const NuxtLinkLocale: typeof import("../node_modules/@nuxtjs/i18n/dist/runtime/components/NuxtLinkLocale")['default']
export const SwitchLocalePathLink: typeof import("../node_modules/@nuxtjs/i18n/dist/runtime/components/SwitchLocalePathLink")['default']
export const NuxtPage: typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']
export const NoScript: typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']
export const Link: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']
export const Base: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']
export const Title: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']
export const Meta: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']
export const Style: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']
export const Head: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']
export const Html: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']
export const Body: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']
export const NuxtIsland: typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']
export const NuxtRouteAnnouncer: IslandComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
export const LazyHomeMobileTopBanner: LazyComponent<typeof import("../components/home/HomeMobileTopBanner.vue")['default']>
export const LazyHomeNewsMarquee: LazyComponent<typeof import("../components/home/HomeNewsMarquee.vue")['default']>
export const LazyHomeNewsTicker: LazyComponent<typeof import("../components/home/HomeNewsTicker.vue")['default']>
export const LazyHomePageBackground: LazyComponent<typeof import("../components/home/HomePageBackground.vue")['default']>
export const LazyHomePillarList: LazyComponent<typeof import("../components/home/HomePillarList.vue")['default']>
export const LazyHomePromotionsList: LazyComponent<typeof import("../components/home/HomePromotionsList.vue")['default']>
export const LazyLayoutAppFooter: LazyComponent<typeof import("../components/layout/AppFooter.vue")['default']>
export const LazyLayoutAppHeader: LazyComponent<typeof import("../components/layout/AppHeader.vue")['default']>
export const LazyLayoutGlobalWidgets: LazyComponent<typeof import("../components/layout/GlobalWidgets.vue")['default']>
export const LazyLayoutPageHero: LazyComponent<typeof import("../components/layout/PageHero.vue")['default']>
export const LazyLayoutSiteLogo: LazyComponent<typeof import("../components/layout/SiteLogo.vue")['default']>
export const LazySectionsBlogList: LazyComponent<typeof import("../components/sections/BlogList.vue")['default']>
export const LazySectionsBlogSnippet: LazyComponent<typeof import("../components/sections/BlogSnippet.vue")['default']>
export const LazySectionsContactSection: LazyComponent<typeof import("../components/sections/ContactSection.vue")['default']>
export const LazySectionsGalleryFilter: LazyComponent<typeof import("../components/sections/GalleryFilter.vue")['default']>
export const LazySectionsHeroSlider: LazyComponent<typeof import("../components/sections/HeroSlider.vue")['default']>
export const LazySectionsPromoBanner: LazyComponent<typeof import("../components/sections/PromoBanner.vue")['default']>
export const LazySectionsServicesDiscover: LazyComponent<typeof import("../components/sections/ServicesDiscover.vue")['default']>
export const LazySectionsServicesOverview: LazyComponent<typeof import("../components/sections/ServicesOverview.vue")['default']>
export const LazySectionsServicesTabs: LazyComponent<typeof import("../components/sections/ServicesTabs.vue")['default']>
export const LazySectionsSkillsSection: LazyComponent<typeof import("../components/sections/SkillsSection.vue")['default']>
export const LazySectionsTeamFull: LazyComponent<typeof import("../components/sections/TeamFull.vue")['default']>
export const LazySectionsTeamSnippet: LazyComponent<typeof import("../components/sections/TeamSnippet.vue")['default']>
export const LazySectionsTestimonialsSection: LazyComponent<typeof import("../components/sections/TestimonialsSection.vue")['default']>
export const LazyWidgetsConnectWidget: LazyComponent<typeof import("../components/widgets/ConnectWidget.vue")['default']>
export const LazyWidgetsLangSwitch: LazyComponent<typeof import("../components/widgets/LangSwitch.vue")['default']>
export const LazyNuxtWelcome: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']>
export const LazyNuxtLayout: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
export const LazyNuxtErrorBoundary: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
export const LazyClientOnly: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']>
export const LazyDevOnly: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']>
export const LazyServerPlaceholder: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
export const LazyNuxtLink: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']>
export const LazyNuxtLoadingIndicator: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
export const LazyNuxtTime: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
export const LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
export const LazyNuxtImg: LazyComponent<typeof import("../node_modules/@nuxt/image/dist/runtime/components/NuxtImg.vue")['default']>
export const LazyNuxtPicture: LazyComponent<typeof import("../node_modules/@nuxt/image/dist/runtime/components/NuxtPicture.vue")['default']>
export const LazyNuxtLinkLocale: LazyComponent<typeof import("../node_modules/@nuxtjs/i18n/dist/runtime/components/NuxtLinkLocale")['default']>
export const LazySwitchLocalePathLink: LazyComponent<typeof import("../node_modules/@nuxtjs/i18n/dist/runtime/components/SwitchLocalePathLink")['default']>
export const LazyNuxtPage: LazyComponent<typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']>
export const LazyNoScript: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']>
export const LazyLink: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']>
export const LazyBase: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']>
export const LazyTitle: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']>
export const LazyMeta: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']>
export const LazyStyle: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']>
export const LazyHead: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']>
export const LazyHtml: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']>
export const LazyBody: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']>
export const LazyNuxtIsland: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']>
export const LazyNuxtRouteAnnouncer: LazyComponent<IslandComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>>

export const componentNames: string[]
