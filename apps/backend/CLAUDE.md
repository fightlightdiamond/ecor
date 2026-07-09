# Medusa Admin extensions — table row-actions rule

Every data table (or table-like row list) in a custom admin page keeps its
per-row action controls in the **last column**, never mixed between data
columns:

- Header key: `<namespace>.columns.actions` (vi: "Thao tác", en: "Actions"),
  added to both `src/admin/i18n/json/vi.json` and `en.json`.
- **Exactly one action** → render it inline in that column (e.g. a `Copy` or
  an `IconButton`).
- **Two or more actions** → collapse them into a `DropdownMenu` triggered by
  an `IconButton` with the `EllipsisHorizontal` icon (see the folder tiles in
  `src/admin/routes/media/page.tsx` for the reference pattern; destructive
  items get `className="text-ui-fg-error"`).
- Tables use `onRowClick` to navigate, so the actions cell must wrap its
  content in a container with `onClick={(e) => e.stopPropagation()}`
  (see `src/admin/routes/campaign-topics/page.tsx`).

This applies to every existing table and to **all new admin pages** — do not
add per-row buttons anywhere except the trailing actions column.

# Medusa Admin extensions — i18n rule

The admin dashboard's language switcher (`src/admin/components/language-switcher`)
lets a user flip the whole UI between Vietnamese and English (and any other
Medusa-supported locale). **Every custom admin extension must respect that —
never hardcode a user-facing string.**

## Sidebar menu labels (`defineRouteConfig`)

`label` in `defineRouteConfig` is treated as a **literal string** unless
`translationNs` is also set — in which case it's resolved as an i18next key
via `t(label, { ns: translationNs })`. Our extension translations
(`src/admin/i18n/json/vi.json` + `en.json`) are merged by
`src/admin/i18n/index.ts` into i18next's default `translation` namespace, so
every custom route's sidebar entry must look like this:

```ts
export const config = defineRouteConfig({
  label: "menu.<key>",       // add "<key>" under "menu" in BOTH vi.json and en.json
  translationNs: "translation",
  icon: SomeIcon,
})
```

Adding a new custom route (a new entry under `src/admin/routes/`) means
adding a matching `menu.<key>` entry to **both**
`src/admin/i18n/json/vi.json` and `src/admin/i18n/json/en.json` — not just
one. Forgetting the Vietnamese (or English) side silently falls back to the
raw key/English string for the other language.

## Everything else inside a route/component

Same rule, no exception: buttons, table columns, toasts, modals, hints —
route through `useTranslation()` + a key in both `vi.json`/`en.json` (see the
existing `campaign-posts`, `campaign-topics`, `cards`, `mediaLib` namespaces
for the pattern). Never inline an English or Vietnamese string directly in a
`.tsx` file.
