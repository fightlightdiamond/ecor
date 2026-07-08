import vi from "./json/vi.json" with { type: "json" }
import en from "./json/en.json" with { type: "json" }

// "en" là fallbackLng của dashboard — mọi ngôn ngữ khác (fr, de, ja...)
// khi thiếu key custom sẽ tự rơi về bản tiếng Anh thay vì hiện raw key.
export default {
  vi: {
    translation: vi,
  },
  en: {
    translation: en,
  },
}
