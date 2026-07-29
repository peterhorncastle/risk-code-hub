# Risk Code Hub — Backlog (deferred ideas)

Items parked for a later iteration. Newest first.

## Cycle Modeller — Save & Reset buttons
_Parked 2026-07-23 (Peter)._

Add a **Save** (persist current slider state) and **Reset** (restore defaults) control to the Cycle Modeller (`reinsurance-general/cycle-modeller.html`).

**Decide the state/naming convention first**, because the Cycle Modeller is likely to be rolled out to every hub:
- Namespace saved state per hub + tool (e.g. `localStorage` key `cyclemodeller:<hub-id>:v1`) so hubs don't collide.
- Use a shared save/reset pattern so every hub's modeller behaves identically.
- At that point, consider promoting the Cycle Modeller into a **shared component** (`shared/cycle-modeller.js` + a thin per-hub HTML wrapper passing hub id, theme and anchor presets) rather than copy-pasting the page into each hub.
- Reset should return every slider to its coded default and re-run `recompute()`.
