# SlotSwap UI Guidelines

Follow this for every page and component. If something isn't covered, pick the option that is simpler, more consistent with existing components, and more accessible.

## 1. Principles

1. **Clear over clever.** Students use this under time pressure during advising. Every screen has one obvious primary action.
2. **Consistent.** Reuse components from `components/ui/`. Never restyle the same element two different ways.
3. **Calm and trustworthy.** Lots of whitespace, soft shadows, no loud gradients or heavy animation.
4. **Mobile first.** Most students will use phones. Design at 375px first, then scale up.
5. **Accessible by default.** Keyboard usable, readable contrast, visible focus, labeled inputs.

## 2. Design tokens

Define as CSS variables in `app/globals.css` and map them in `tailwind.config.ts`. Use tokens, never raw hex values in components.

### Colors (light theme only)

| Token                      | Hex                   | Use                                       |
| -------------------------- | --------------------- | ----------------------------------------- |
| `primary`                  | `#4F46E5`             | Main buttons, links, active nav           |
| `primary-hover`            | `#4338CA`             | Hover and pressed                         |
| `primary-soft`             | `#EEF2FF`             | Tinted backgrounds, selected rows         |
| `accent`                   | `#14B8A6`             | Swap arrows, highlights                   |
| `accent-soft`              | `#CCFBF1`             | Accent tinted backgrounds                 |
| `bg`                       | `#FFFFFF`             | Page background                           |
| `bg-muted`                 | `#F8FAFC`             | Alternate sections, table headers         |
| `border`                   | `#E2E8F0`             | Borders, dividers                         |
| `text`                     | `#0F172A`             | Headings                                  |
| `text-muted`               | `#475569`             | Body text                                 |
| `text-subtle`              | `#64748B`             | Hints, captions (never smaller than 12px) |
| `success` / `success-soft` | `#16A34A` / `#DCFCE7` | Confirmed, matched                        |
| `warning` / `warning-soft` | `#D97706` / `#FEF3C7` | Pending, expiring soon                    |
| `danger` / `danger-soft`   | `#DC2626` / `#FEE2E2` | Errors, declined, destructive actions     |
| `info` / `info-soft`       | `#0284C7` / `#E0F2FE` | Neutral notices                           |

Never use color alone to carry meaning. Pair status colors with an icon or text label.

### Typography

- Headings: `Plus Jakarta Sans` (700). Body and UI: `Inter` (400, 500, 600). Load with `next/font/google`.
- Scale: `h1 text-4xl md:text-6xl`, `h2 text-3xl`, `h3 text-xl`, body `text-base`, small `text-sm`, caption `text-xs`.
- Body line height `leading-relaxed`. Prose max width `max-w-3xl`.
- Dashboard pages use a smaller scale: page title `text-2xl font-bold`.

### Spacing, radius, shadow

- Spacing: Tailwind's 4px scale only. Section padding `py-16 md:py-24` (marketing), `py-6 md:py-8` (app). Card padding `p-5 md:p-6`. Gap between form fields `space-y-4`.
- Radius: buttons and inputs `rounded-xl`, cards `rounded-2xl`, badges `rounded-full`.
- Shadows: cards `shadow-sm`, hover or menus `shadow-md`, modals `shadow-xl`. No other shadows.
- Container: `max-w-6xl mx-auto px-4 sm:px-6`.

### Breakpoints

`sm 640`, `md 768`, `lg 1024`, `xl 1280`. Test at 375, 768 and 1280.

## 3. Components (build in `components/ui/`)

### Button

- Variants: `primary` (solid indigo), `secondary` (white, border), `ghost` (text only), `danger` (solid red).
- Sizes: `sm` (h-9), `md` (h-11, default), `lg` (h-12). `rounded-xl font-semibold`.
- States: hover (darker, slight lift), focus-visible ring, `disabled` (50% opacity, `cursor-not-allowed`), `loading` (spinner plus text, disabled).
- One primary button per view area. Destructive actions use `danger` and need a confirm dialog.
- Minimum touch target 44px height on mobile.

### Input, Select, Textarea

- `h-11 rounded-xl border border-border px-3`, white background. Focus: `ring-2 ring-primary` and border `primary`.
- Always a visible `<label>` above the field. Placeholder is an example, never a replacement for the label.
- Optional hint text below in `text-subtle`. Error text below in `danger` with an icon, and a red border. Link errors with `aria-describedby`, and set `aria-invalid`.
- Password inputs have a show/hide toggle.

### Card

White, `rounded-2xl border border-border shadow-sm`. Interactive cards add `hover:shadow-md transition`. Header (title and optional action), body, optional footer.

### Badge (status pill)

`rounded-full px-2.5 py-0.5 text-xs font-medium`, soft background plus matching text and a dot or icon.

| Status                               | Style                                |
| ------------------------------------ | ------------------------------------ |
| `OPEN`                               | info                                 |
| `MATCHED`                            | primary                              |
| `AWAITING_CONFIRMATION`              | warning                              |
| `CONFIRMED` / `COMPLETED`            | success                              |
| `DECLINED` / `CANCELLED` / `EXPIRED` | danger (or neutral gray for expired) |

Use these same mappings everywhere, so one status always looks the same.

### Table

Header row `bg-muted text-sm font-semibold`, rows separated by `border-b`, hover row `bg-muted`. On mobile (under `md`), tables become stacked cards, or wrap in `overflow-x-auto`. Never let the page body scroll sideways. Include a pagination bar, a search input, and filter dropdowns for admin lists.

### Modal / Dialog

Centered, `rounded-2xl shadow-xl`, dimmed backdrop, closes on Esc and backdrop click, traps focus, returns focus on close. Used for confirmations such as decline swap, delete user, logout all.

### Toast

Top-right (bottom on mobile), auto-dismiss after 4s, success and error variants with icons. Use for results of actions. Use inline alerts for page-level problems.

### Alert / Notice box

`rounded-xl border` with soft background, icon, title and text. Variants: info, success, warning, danger.

### Empty state

Centered icon, one-line title, one-line explanation, and a primary action (e.g., "No swap requests yet. Create your first request").

### Loading

- Skeleton blocks (`animate-pulse bg-muted rounded`) for lists, cards and tables. Spinner only inside buttons.
- Use Next.js `loading.tsx` for route-level loading.

### Navbar and navigation

- Public: sticky white navbar, bottom border, `backdrop-blur`, logo left, links center/right, "Login" (ghost) and "Get Started" (primary).
- App (student): top bar with logo, a notification bell (badge with unread count), and a user menu (Profile, Sessions, Logout). Main nav as a top bar on desktop and a bottom tab bar on mobile (Dashboard, Requests, Swaps, Profile).
- Admin: left sidebar on desktop (collapsible drawer on mobile): Dashboard, Users, Courses, Sections, Swaps, Settings. The active item uses `primary-soft` background with `primary` text.
- Always show breadcrumbs on admin detail pages.

## 4. Page patterns

### Marketing pages

Alternating `bg` and `bg-muted` sections, centered headings, a max of 2 CTAs per section.

### App pages (dashboard)

Page header (title, short description, primary action on the right), then content in cards. Summary stat cards at the top of dashboards (e.g., Active requests, Pending confirmations, Completed swaps).

### Forms

- Single column, `max-w-md` for auth forms, `max-w-2xl` for longer forms.
- Primary submit button is full width on mobile.
- Validate on blur and on submit. Show all errors at once, and move focus to the first invalid field.
- Preserve what the user typed on error. Never clear the form.
- Auth pages (login, register, forgot password) use a centered card on `bg-muted`, with the logo above.

### Swap-specific UI

- **Swap chain card:** show each participant as a mini card in order, connected by teal arrows, ending with a loop-back arrow. Under each participant, show their confirmation status badge.
- **Confirmation countdown:** visible timer ("Expires in 11h 20m") in a warning-tinted bar. It turns `danger` under 1 hour.
- **Section picker:** department, then course, then section. Each section option shows number, faculty, days and time, and seats.
- **Clash warning:** inline `warning` alert listing the conflicting course and time. Never silently block.
- **Suggestion card (match-unlock):** `accent-soft` card with the suggestion in plain language and a single "Accept suggestion" button.

## 5. Content and tone

- Plain, friendly, short. Say "Create request", not "Submit swap request form".
- Button labels are verbs. Error messages say what happened and what to do next ("Password must be at least 8 characters").
- Never expose raw error messages, stack traces or database errors to users.
- Dates: `6 Nov 2026, 10:40 AM`, in the user's local time. Show relative time ("2 hours ago") for notifications.
- Confirm destructive actions with the specific consequence ("This will cancel the swap for all 3 students").

## 6. Accessibility checklist

- Text contrast at least 4.5:1 (3:1 for large text and UI borders).
- Every interactive element is reachable by keyboard, with a visible `focus-visible` ring (2px primary, 2px offset).
- One `<h1>` per page, ordered headings, landmarks (`<header>`, `<nav>`, `<main>`, `<footer>`).
- Icon-only buttons have `aria-label`. Decorative icons use `aria-hidden`.
- Form errors announced with `aria-live="polite"`. Modals use `role="dialog"` and `aria-modal`.
- Respect `prefers-reduced-motion`: disable non-essential animation.
- Touch targets at least 44x44px.

## 7. Motion

- Transitions `150–200ms ease-out` on hover, focus, menus and modals. No bounce or spring effects.
- Only animate `opacity` and `transform`.
- Allowed: subtle button lift, fade and scale-in for modals, skeleton pulse. Nothing else.

## 8. Icons and assets

- Use `lucide-react` only, 20px default, stroke width 1.75, colored with `currentColor`.
- Logo: two opposing arrows forming a swap symbol plus "SlotSwap" wordmark, built as an inline SVG component.
- No stock photos. Use SVG illustrations and CSS shapes only.

## 9. Do and don't

| Do                                                       | Don't                                  |
| -------------------------------------------------------- | -------------------------------------- |
| Use tokens and shared components                         | Hard-code hex colors or one-off styles |
| One primary button per area                              | Several competing primary buttons      |
| Show empty, loading and error states for every data view | Leave blank screens                    |
| Use badges with text plus color                          | Rely on color alone                    |
| Keep forms single column                                 | Multi-column forms on mobile           |
| Confirm destructive actions                              | Delete or cancel on a single click     |
| Keep copy short and specific                             | Long paragraphs in the app UI          |

## 10. Definition of done for any UI work

- [ ] Uses only tokens and `components/ui/` components
- [ ] Looks correct at 375px, 768px and 1280px with no horizontal scroll
- [ ] Loading, empty and error states exist
- [ ] Keyboard-navigable with visible focus
- [ ] Contrast and labels pass the accessibility checklist
- [ ] No console errors, `npm run build` passes
