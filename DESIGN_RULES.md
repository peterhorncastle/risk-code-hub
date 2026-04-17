# Risk Code Hub — Design Rules & Colour Standards

**Version:** 1.0  
**Last updated:** 2026-04-17  
**Scope:** All hub HTML files across all ~60 Lloyd's class hubs

---

## 1. Core Principle: Explicit Beats Inherited

The site uses a body-level rule `p { color: var(--text); }` where `--text` is a dark colour (typically `#1e2d3d`). Because CSS specificity means a direct element selector (`p`) beats an inherited colour from a parent container, **you cannot rely on `color: white` on a dark container to cascade down to `<p>` or `<li>` children**.

**The rule is simple: if a container has a dark background, its child text elements must be explicitly coloured.**

### Required pattern for every dark-background container:

```css
/* 1. Colour the container itself */
.dark-box {
    background: #061e35;
    color: #fff;         /* ← sets color for direct text / headings */
}

/* 2. MANDATORY — explicitly colour child p and li */
.dark-box p,
.dark-box li {
    color: #c8d8f0;      /* ← light tint matching the hub theme */
}
```

Never omit step 2. If step 2 is missing, paragraph text will render in dark `#1e2d3d` on a dark background and become unreadable.

---

## 2. Dark Background Threshold

Any container whose background colour has RGB values below approximately `60, 60, 60` (i.e. hex `#3c3c3c` or darker) is considered a **dark background** and requires step 2 above.

Common dark backgrounds used in this project:

| Variable / Hex | Used in |
|---|---|
| `#061e35` / `var(--marine-dark)` | Marine Hull |
| `#0b3d6b` / `var(--marine)` | Marine Hull |
| `#1a2a3a` | Space, UK Household, Aviation |
| `#0a1628` / `var(--space-dark)` | Space |
| `#0d1b2a` | Various hubs |
| `#1a1a2e` | Cyber, Tech PI |
| `#0f2027` | Energy Offshore |
| `#1e2d3d` (header gradients) | All hubs |
| Any `linear-gradient` using the above | All hubs |

If you add a new dark hex colour in a future hub, apply the same rule.

---

## 3. Light Text Colours by Hub Theme

Each hub uses a themed light-text tint for child elements inside dark containers. Do not use plain `#fff` for body paragraphs — use the tint so text feels part of the theme rather than floating.

| Hub | Light text colour | Usage |
|---|---|---|
| Marine Hull | `#c8d8f0` | `.dark-box p, .dark-box li` |
| Space | `#c8d8e8` | dark container children |
| Aviation | `#d0e0f0` | dark container children |
| Cyber / Tech PI | `#c8d4e8` | dark container children |
| Energy Offshore | `#c8dde8` | dark container children |
| Renewable Energy | `#c8dde8` | dark container children |
| Downstream Energy | `#c8dde8` | dark container children |
| D&O | `#d0d8f0` | dark container children |
| EPLI | `#d0d8f0` | dark container children |
| Environmental Liability | `#c8e0d0` | dark container children |
| Transactional Liability | `#d0d8f0` | dark container children |
| PI E&O Legal | `#d0d8f0` | dark container children |
| PI E&O Tech | `#c8d4e8` | dark container children |
| Financial Lines Misc | `#d0d4e8` | dark container children |
| UK Household | `#d0e0f0` | dark container children |
| Product Recall | `#e0d8c8` | dark container children |
| General (fallback) | `#d0dce8` | use if no hub tint defined |

Headings (`h3`, `h4`) inside dark boxes should use `#fff` directly.

---

## 4. Table Rules

### Table headers (`th`)

```css
th {
    background: VAR_OR_HEX;
    color: #fff;             /* always white on any coloured header */
}

th:hover {
    background: DARKER_SHADE;
    color: #fff;             /* MANDATORY — must repeat color here */
}
```

**Never omit `color: #fff` from `th:hover`.** Without it, browsers may fall back to the body text colour, causing dark-on-dark text on hover.

### Zebra-stripe rows

```css
tr:nth-child(even) { background: rgba(0,0,0,0.04); }   /* very light — body text colour is fine */
tr:nth-child(odd)  { background: #fff; }
```

Zebra stripes are always light so no special child colouring is needed.

---

## 5. Named Dark Element Classes

Some elements use semantic class names rather than generic `.dark-box`. These still require explicit child colouring.

### Timeline event dot labels
```css
.tl-dot { background: HUB_COLOUR; color: #fff; }
.tl-dot span { color: #fff; }   /* year label inside dot */
```

### Programme tower layers (Global Programme page)
```css
.tower-layer { color: #fff; }
.tower-layer p, .tower-layer li { color: #e8f0ff; }
```

### Badge / type-tag labels on dark backgrounds
```css
.type-tag { background: DARK; color: #fff; }
/* If the tag sits inside a dark parent, also: */
.dark-parent .type-tag { color: #fff; }
```

### Aviation weather / leasing rows
```css
.t-weather, .t-leasing { background: DARK; color: #fff; }
.t-weather td, .t-leasing td { color: #fff; }
```

---

## 6. Confidence Badges

Badges use coloured backgrounds with white text. Always keep:

```css
.badge-ver  { background: #1a7a3a; color: #fff; }
.badge-est  { background: #c07820; color: #fff; }
.badge-illus{ background: #2060a0; color: #fff; }
.badge-gap  { background: #a03030; color: #fff; }
```

Do not override badge text colour in dark-container child rules — badges already specify `color: #fff` explicitly and are not affected by the cascade issue.

---

## 7. Header Gradients

Every hub uses a full-width dark gradient header. Text inside must always be `#fff`:

```css
header {
    background: linear-gradient(135deg, DARK1 0%, HUB_COLOUR 50%, DARK2 100%);
    color: #fff;
}

header h1, header p, header .subtitle { color: #fff; }
```

The `color: #fff` on the `header` element itself is not sufficient for `<p>` — always include `header p { color: #fff; }` or use a more specific selector.

---

## 8. Quick Checklist for New Hub Builds

Before marking a hub complete, verify every item below:

- [ ] Every dark-background container has `.container p, .container li { color: LIGHT_TINT; }`
- [ ] Every `th` has `color: #fff`
- [ ] Every `th:hover` has `color: #fff`
- [ ] Header tag has `header p { color: #fff; }`
- [ ] Timeline dot year labels are white
- [ ] Programme tower layer paragraphs are light
- [ ] Any `.badge-*` class has explicit `color: #fff`
- [ ] Spot-check: view file in browser and scan for any dark-on-dark text

---

## 9. Why This Exists

During the v2.7 Marine Hull build (April 2026), a systematic audit found that paragraph text in dark-background containers across all 17 completed hubs was inheriting the body-level dark text colour (`#1e2d3d`) instead of the intended white/light colour. The root cause is CSS specificity: a `p { color: ... }` rule at body level beats colour inherited from a parent container.

A batch fix script corrected 51 files across all 17 hubs. This document formalises the rules so future hub builds do not repeat the issue.

---

*This document is part of the Risk Code Hub project. Update the version and date whenever rules change.*
