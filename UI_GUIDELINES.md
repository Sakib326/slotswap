# SlotSwap UI Guidelines

Follow this for every page and component. If something isn't covered, pick the option that is simpler, more consistent with existing components, and more accessible.

## 1. Principles

1. **Clear over clever.** Students use this under time pressure during advising. Every screen has one obvious primary action.
2. **The routine sheet identity.** The site feels like a well-made class routine that came alive: flat color blocks, crisp grid lines, tabular numbers, and a calm paper-like background.
3. **Calm and trustworthy.** Lots of whitespace, crisp structural grid lines, no loud gradients, no drop shadows (except floating hero chip), and no heavy marketing bloat.
4. **Mobile first.** Most students will use phones. Design at 375px first, then scale up.
5. **Accessible by default.** Keyboard usable, readable contrast (minimum 4.5:1), visible focus (2px Pine with 2px offset), labeled inputs.

## 2. Design tokens

Defined as CSS variables in `app/globals.css` and mapped in Tailwind. Use tokens, never raw hex values in components.

### Colors (light theme only)

| Token           | Hex       | Use                                                    |
| --------------- | --------- | ------------------------------------------------------ |
| `paper`         | `#F4F6F3` | Page background (cool, slightly green-gray, not cream) |
| `ink`           | `#16231F` | Text and grid lines (deep green-black, not pure black) |
| `pine`          | `#1D5B4A` | Primary buttons, links, active nav                     |
| `pine-hover`    | `#164639` | Hover and pressed states for buttons                   |
| `marker-blue`   | `#BCD7F2` | Routine block fill                                     |
| `marker-yellow` | `#F5E39B` | Routine block fill                                     |
| `marker-pink`   | `#F2C4C4` | Routine block fill                                     |
| `marker-mint`   | `#C2E4CE` | Routine block fill                                     |
| `signal`        | `#D9381E` | Swap highlight, error text, destructive warnings       |

Marker colors identify courses or sections, like a highlighted routine. Use them as fills for blocks, tags, and diagrams with Ink text on top. No gradients. No other accent colors.

### Typography

- Headlines: `Bricolage Grotesque` (700/800, tight tracking, tight leading).
- Body and UI: `IBM Plex Sans` (400, 500, 600) with Bangla fallback `Hind Siliguri`.
- Schedule times, section numbers, course codes, and counts: Plex Sans with `font-variant-numeric: tabular-nums` (`.tabular-nums`). Do not use monospace fonts for labels.
- Line length: under 75 characters for prose (`max-w-[70ch]`).
- Sentence case everywhere.

### Spacing, radius, borders, shadows

- Radius hierarchy:
  - Routine blocks and tags: `rounded-[4px]`
  - Buttons and inputs: `rounded-[8px]`
  - Larger containers (form panel, notice box): `rounded-[12px]`
- Borders: `1px` Ink at 15% opacity (`border-ink/15`) for structure.
- Shadows: **No drop shadows**, except one soft shadow on the floating hero swap chip.
- Never wrap everything in a card. Use plain text on Paper wherever a container card isn't needed.
- Container: `max-w-[1200px] mx-auto px-4 sm:px-6`. Left-aligned, asymmetric structure.

### Motion

- Exactly one non-user-triggered animation: on the homepage hero routine grid, two blocks glide to swap places, followed by the appearance of the "Swap found" chip.
- Respect `prefers-reduced-motion` by displaying the post-swap state immediately without motion.
- All other animations respond strictly to user actions (mobile drawer, dropdown, accordion).

## 3. Ban list (never use)

- Indigo, teal, purple or blue-purple gradients, glassmorphism, blurred blobs
- Cream background with terracotta; near-black with acid green
- Eyebrow labels above headings, ALL-CAPS tracked labels, middle-dot meta strings (`A · B · C`), `WORD — fragment` labels
- One word of a headline in a different color, italic or underline
- `→` appended to button or link text
- Numbered markers (`01/02/03`) unless the content is a true sequential process (such as How it works)
- Rows of identical icon-in-circle feature cards
- Identical shadow and radius applied uniformly to every element
- Stock photos, emoji as icons, generic 3D blobs, fake testimonials, fake logos, invented statistics
