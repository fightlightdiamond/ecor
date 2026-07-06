import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { DropdownMenu } from "@medusajs/ui"
import { Check, Languages } from "lucide-react"
import { useTranslation } from "react-i18next"
import { createPortal } from "react-dom"

/**
 * Bộ chuyển đổi ngôn ngữ cho Medusa Admin.
 *
 * Medusa Admin không có "injection zone" cho phần header chung, nên nút này
 * được render qua React portal vào `document.body` với `position: fixed` để
 * luôn nằm ở góc trên bên phải màn hình (khu vực header). Widget được đăng ký
 * ở các zone `.before` chính (mỗi trang chỉ khớp đúng một zone) nên chỉ hiển
 * thị một nút duy nhất trên mỗi trang.
 *
 * Việc đổi ngôn ngữ dùng chung instance i18next của dashboard, nên toàn bộ
 * giao diện admin sẽ đổi ngôn ngữ ngay lập tức và được lưu theo từng người
 * dùng trong localStorage (giống hệt Settings → Profile → Language).
 *
 * Danh sách LANGUAGES bên dưới lấy đúng theo
 * `@medusajs/dashboard/src/i18n/languages.ts` — toàn bộ ngôn ngữ mà lõi
 * Medusa Admin đang hỗ trợ. Mã ngôn ngữ (code) phải khớp chính xác (phân
 * biệt hoa/thường) với mã đã đăng ký trong i18next, ví dụ "enGB" khác "en",
 * "zhCN" khác "zhTW".
 */

const LANGUAGES = [
  { code: "bs", label: "Bosanski", short: "BS", flag: "🇧🇦" },
  { code: "bg", label: "Български", short: "BG", flag: "🇧🇬" },
  { code: "en", label: "English", short: "EN", flag: "🇺🇸" },
  { code: "enGB", label: "English (UK)", short: "EN-GB", flag: "🇬🇧" },
  { code: "es", label: "Español", short: "ES", flag: "🇪🇸" },
  { code: "el", label: "Ελληνικά", short: "EL", flag: "🇬🇷" },
  { code: "de", label: "Deutsch", short: "DE", flag: "🇩🇪" },
  { code: "fr", label: "Français", short: "FR", flag: "🇫🇷" },
  { code: "he", label: "עברית", short: "HE", flag: "🇮🇱" },
  { code: "hr", label: "Hrvatski", short: "HR", flag: "🇭🇷" },
  { code: "hu", label: "Magyar", short: "HU", flag: "🇭🇺" },
  { code: "it", label: "Italiano", short: "IT", flag: "🇮🇹" },
  { code: "ja", label: "日本語", short: "JA", flag: "🇯🇵" },
  { code: "pl", label: "Polski", short: "PL", flag: "🇵🇱" },
  { code: "ptBR", label: "Português (Brasil)", short: "PT-BR", flag: "🇧🇷" },
  { code: "ptPT", label: "Português (Portugal)", short: "PT-PT", flag: "🇵🇹" },
  { code: "tr", label: "Türkçe", short: "TR", flag: "🇹🇷" },
  { code: "th", label: "ไทย", short: "TH", flag: "🇹🇭" },
  { code: "uk", label: "Українська", short: "UK", flag: "🇺🇦" },
  { code: "ro", label: "Română", short: "RO", flag: "🇷🇴" },
  { code: "mk", label: "Македонски", short: "MK", flag: "🇲🇰" },
  { code: "mn", label: "Монгол", short: "MN", flag: "🇲🇳" },
  { code: "ar", label: "العربية", short: "AR", flag: "🇸🇦" },
  { code: "zhCN", label: "简体中文", short: "ZH-CN", flag: "🇨🇳" },
  { code: "fa", label: "فارسی", short: "FA", flag: "🇮🇷" },
  { code: "cs", label: "Čeština", short: "CS", flag: "🇨🇿" },
  { code: "ru", label: "Русский", short: "RU", flag: "🇷🇺" },
  { code: "lt", label: "Lietuviškai", short: "LT", flag: "🇱🇹" },
  { code: "vi", label: "Tiếng Việt", short: "VI", flag: "🇻🇳" },
  { code: "id", label: "Bahasa Indonesia", short: "ID", flag: "🇮🇩" },
  { code: "ko", label: "한국어", short: "KO", flag: "🇰🇷" },
  { code: "nl", label: "Nederlands", short: "NL", flag: "🇳🇱" },
  { code: "zhTW", label: "繁體中文(臺灣)", short: "ZH-TW", flag: "🇹🇼" },
] as const

const LanguageSwitcher = () => {
  const { i18n } = useTranslation()

  const current =
    LANGUAGES.find((l) => l.code === i18n.language) ?? LANGUAGES[0]

  const control = (
    <div className="fixed right-4 top-3 z-50">
      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <button
            type="button"
            aria-label="Đổi ngôn ngữ / Change language"
            className="bg-ui-bg-base text-ui-fg-subtle border-ui-border-base shadow-elevation-card-rest hover:bg-ui-bg-base-hover txt-compact-small-plus flex items-center gap-x-2 rounded-md border px-3 py-1.5 outline-none transition-colors"
          >
            <Languages className="h-4 w-4" />
            <span>{current.short}</span>
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end" className="max-h-[70vh] overflow-y-auto">
          {LANGUAGES.map((lang) => (
            <DropdownMenu.Item
              key={lang.code}
              onClick={() => i18n.changeLanguage(lang.code)}
              className="gap-x-2"
            >
              <span className="w-5 text-center">{lang.flag}</span>
              <span className="flex-1">{lang.label}</span>
              {lang.code === current.code && <Check className="h-4 w-4" />}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu>
    </div>
  )

  return createPortal(control, document.body)
}

/**
 * Đăng ký ở các zone `.before` chính. Mỗi trang chỉ khớp đúng một zone (một
 * trang hoặc là list, hoặc là details) nên nút không bị nhân đôi. Trang mặc
 * định của admin là danh sách đơn hàng (`order.list.before`).
 */
export const config = defineWidgetConfig({
  zone: [
    "login.before",
    "order.list.before",
    "order.details.before",
    "draft_order.list.before",
    "draft_order.details.before",
    "product.list.before",
    "product.details.before",
    "product_variant.details.before",
    "product_collection.list.before",
    "product_collection.details.before",
    "product_category.list.before",
    "product_category.details.before",
    "customer.list.before",
    "customer.details.before",
    "customer_group.list.before",
    "customer_group.details.before",
    "inventory_item.list.before",
    "inventory_item.details.before",
    "reservation.list.before",
    "reservation.details.before",
    "price_list.list.before",
    "price_list.details.before",
    "promotion.list.before",
    "promotion.details.before",
    "campaign.list.before",
    "campaign.details.before",
  ],
})

export default LanguageSwitcher
