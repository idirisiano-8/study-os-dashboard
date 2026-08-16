---
name: Study OS
description: A calm personal study command desk for daily academic orientation.
colors:
  page: "#f6f8f5"
  surface: "#ffffff"
  surface-muted: "#f0f4ef"
  line: "#e1e7e0"
  text-strong: "#18231d"
  text: "#4e5d55"
  text-muted: "#718078"
  teal: "#177358"
  teal-soft: "#e7f3ed"
  amber: "#bf7a26"
  amber-soft: "#fff4e3"
  red: "#b84e4c"
typography:
  display:
    fontFamily: "DM Sans, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "clamp(22px, 2.5vw, 31px)"
    fontWeight: 700
    lineHeight: 1.17
    letterSpacing: "-0.04em"
  title:
    fontFamily: "DM Sans, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "20px"
    fontWeight: 700
    letterSpacing: "-0.035em"
  body:
    fontFamily: "DM Sans, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "14px"
    lineHeight: 1.55
  label:
    fontFamily: "DM Sans, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "11px"
    fontWeight: 700
    letterSpacing: "0.02em"
rounded:
  control: "10px"
  card: "16px"
  shell: "22px"
spacing:
  compact: "9px"
  standard: "16px"
  card: "23px"
  content-gutter: "34px"
components:
  navigation-active:
    backgroundColor: "{colors.teal}"
    textColor: "#ffffff"
    rounded: "{rounded.control}"
    padding: "11px"
  mission-action:
    backgroundColor: "{colors.teal}"
    textColor: "#ffffff"
    rounded: "13px"
    padding: "13px 16px"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.card}"
    padding: "22px 23px"
  summary-cell:
    backgroundColor: "{colors.surface}"
    rounded: "14px"
    padding: "19px"
---

# Design System: Study OS

## Overview

**Creative North Star: "The Study Command Desk"**

Study OS is a calm academic workspace: a desktop-first desk with a persistent pale-mint rail, a white working canvas, and a single deep-teal action voice. It makes study reality legible through compact data panels and a mission-first opening state rather than turning the dashboard into a wall of urgency.

The system uses soft green-tinted neutrals, tight information density, and restrained rounded geometry. The mission panel is the one contextual highlight; all other cards stay quiet so current priorities, performance status, and planning controls can be scanned without competing visual treatments. On narrow viewports, the desk becomes a full-bleed mobile workspace with bottom navigation.

Documentation provenance: concept seed `f1e95899`; direction was selected without external challengers after a degraded direction roll. The supplied direction contract names this world as “Study Command Desk”; the shipped source is the authority for the rules below.

**Key Characteristics:**

- Desktop rail and white work surface framed as one rounded application shell.
- Teal is reserved for the active route, primary completion action, and positive data status.
- The mission panel leads the dashboard; compact white panels organize the supporting facts.
- Mobile removes the rail and restores persistent bottom navigation.

## Colors

The palette is a low-contrast mint-paper field with teal for commitment, amber for caution, and red for risk.

### Primary

- **Command Teal:** Use `teal` for the active rail item, mission checklist action, avatar mark, notification dot, and healthy metric values.
- **Soft Mint:** Use `teal-soft` as the restrained contextual tint behind teal-adjacent interface moments.

### Secondary

- **Study Amber:** Use `amber` for warning metric values, focus outlines, and the active mobile navigation color.
- **Soft Amber:** Use `amber-soft` only where the interface needs a low-intensity amber field.

### Tertiary

- **Risk Red:** Use `red` for critical metric values and error treatment.

### Neutral

- **Paper Field:** Use `page` behind the desktop app shell, with its very subtle green radial wash.
- **White Work Surface:** Use `surface` for the application main area, cards, summary cells, and small icon controls.
- **Quiet Raised Surface:** Use `surface-muted` for restrained control hover and loading treatment.
- **Mint Hairline:** Use `line` for borders and dividers.
- **Ink Hierarchy:** Use `text-strong`, `text`, and `text-muted` for primary, supporting, and low-emphasis information.

**The One Teal Voice Rule.** Teal signifies selection, direct action, or healthy status. Do not turn every panel, badge, or decorative accent teal.

## Typography

**Display Font:** DM Sans, with system sans fallbacks.

**Body Font:** DM Sans, with system sans fallbacks.

**Label/Mono Font:** The global source still defines JetBrains Mono for legacy metadata, but the shipped command-desk overrides use the sans family for visible dashboard labels and values.

**Character:** Dense but friendly sans typography makes study data direct and contemporary. Large type is confined to the mission statement; surrounding hierarchy stays compact and operational.

### Hierarchy

- **Display:** The mission sentence uses the `display` token; it is the dashboard’s only broad, high-emphasis reading moment.
- **Title:** The masthead uses the `title` token; mobile reduces that title to 17px.
- **Body:** Supporting mission copy uses the `body` token to keep status explanations readable without becoming editorial prose.
- **Label:** Card labels and summary labels use the 11px label role; rail group labels add uppercase and `0.1em` tracking.
- **Metric:** Summary values use 26px, 700 weight, and `-0.045em` tracking; use them only for immediate scan targets.

**The Mission-First Type Rule.** Give the day’s next priority the largest type; cards report evidence and should not compete with it.

## Layout

Desktop is a two-column app shell: a 238px persistent rail beside a flexible workspace. The shell is `min(1480px, calc(100% - 48px))`, inset by 24px, bordered, rounded to 22px, and allowed to reach the viewport height. Workspace content uses 34px horizontal gutters and a maximum content width of 1260px.

The dashboard begins with the mission hero, then a four-column summary strip with 12px gaps, then compact card sections. Standard cards use 23px horizontal and 22px vertical padding; their spacing is intentionally closer than a marketing layout.

At 760px and below, the shell becomes full-bleed, the rail disappears, main content reserves 74px for the fixed bottom navigation, and workspace gutters become 16–17px. The summary strip changes to two columns with 9px gaps; the mission layout stacks, and its completion action becomes a horizontal compact control.

## Elevation & Depth

Depth is primarily structural, not card-by-card. The desktop shell receives the only broad ambient shadow (`0 24px 70px rgba(34, 57, 44, 0.09)`); standard cards are flat white with mint hairlines. The mission action and active rail item use compact teal-tinted shadows to signal interaction, while the mobile bottom bar uses a shallow upward shadow to separate itself from scrollable content.

### Shadow Vocabulary

- **Application shell:** `0 24px 70px rgba(34, 57, 44, 0.09)` for the desktop workspace boundary.
- **Selected rail / mission action:** `0 6px 14px rgba(23,115,88,.16)` and `0 8px 16px rgba(23,115,88,.16)` respectively, only for teal commitment states.
- **Mobile bottom bar:** `0 -8px 24px rgba(36,54,43,.05)` to preserve a fixed navigation boundary.

**The Quiet Cards Rule.** Standard information cards stay flat; do not add hover lift or decorative shadows to routine study data.

## Shapes

The form language is softly squared: 10px controls and navigation rows, 16px cards, 13px mission action, and a 22px outer shell. Borders are thin mint-gray lines; circles are reserved for the avatar, notification/status dots, and similar compact indicators. Avoid capsules unless a component is already explicitly circular.

## Components

### Buttons

- **Primary mission action:** A teal 13px-rounded completion control with 13px × 16px padding, white text, a compact teal shadow, and a `translateY(-1px)` hover response. It opens the daily checklist and carries the percentage plus completion count.
- **Icon controls:** Search, notifications, and theme toggle are 34px square white controls with a 10px radius and hairline border; on hover they use the muted surface and a slightly stronger border.
- **Focus:** Native input focus uses teal border emphasis plus a 30% teal color-mix outline; the global keyboard focus fallback is amber.

### Cards / Containers

- **Corner Style:** Gently rounded 16px information panels.
- **Background:** White surface with a 1px mint hairline.
- **Shadow Strategy:** Flat by default; only the outer shell and active teal actions lift.
- **Internal Padding:** 22px × 23px on desktop; 18px on mobile.
- **Mission hero:** The signature card uses a pale green-to-white-to-pale-green diagonal gradient and a slightly greener border. It is the only wide contextual highlight in the dashboard.

### Navigation

- **Desktop rail:** 238px pale-mint sidebar with a 35px teal square brand mark, section label, and 10px-rounded row buttons. The active route becomes a white-on-teal block; hover is a muted mint field.
- **Masthead:** Compact 86px desktop header with title/context on the left and utility controls, date, and avatar on the right.
- **Mobile:** At 760px, hide the rail and secondary masthead utilities; fix the bottom navigation to the viewport edge. Its active item animates to amber and gains a slightly heavier icon stroke.

### Summary Strip

- **Structure:** Four equal white metric cells on desktop, two columns on mobile.
- **Metrics:** 26px heavy values and 11px muted labels; status color applies to the value alone so the rest of the grid remains neutral.
- **Motion:** Cells enter in a 60ms stagger, rising 8px while fading in over 280ms with an ease-out curve.

## Do's and Don'ts

### Do:

- **Do** keep the desktop rail persistent above 760px and move primary routes into the bottom navigation at or below that breakpoint.
- **Do** lead the dashboard with a specific mission and a visible completion action before supporting metrics.
- **Do** use white, bordered panels with compact spacing for recurring data; reserve the pale green gradient for the mission hero.
- **Do** use teal for active, actionable, and healthy states; use amber and red only for warning and critical signals.
- **Do** respect reduced-motion preferences: the build disables animation and transition when the user requests it.

### Don't:

- **Don't** add broad card shadows, card hover lift, or glass effects to ordinary panels.
- **Don't** promote the legacy Newsreader or JetBrains Mono declarations into new command-desk display styles; the shipped workspace uses DM Sans for its visible hierarchy.
- **Don't** make every metric or navigation item colorful; color belongs to status and selection.
- **Don't** retain the desktop rail on mobile or let content sit behind the fixed bottom navigation.
