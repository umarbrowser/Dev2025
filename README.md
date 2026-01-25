# Esther Tenzies

A React implementation of the **Tenzies** dice game built with Vite.

Roll until all dice show the same value. Click a die to hold it so it will not change on the next roll. This version adds a modern "neon glass" UI, stats, and keyboard shortcuts.

## Features

- **Core gameplay**
  - 10 dice, each with `value`, `isHeld`, and a stable `id`
  - Click (or keyboard focus + Space/Enter) to hold/unhold dice
  - Win when all dice are held and show the same value

- **Extra UX & game features**
  - Live **roll counter**
  - Live **timer** (seconds, formatted as `m:ss`)
  - **Best score** persisted in `localStorage` (fewest rolls, then fastest time)
  - **Reset Best** button to clear the saved record
  - **Keyboard shortcuts**:
    - `R` – roll (or start a new game after a win)
    - `N` – new game (only when the current game is won)
  - Accessible dice buttons with ARIA labels and pressed state

- **Visuals**
  - Centered glassmorphism card on a gradient background
  - Custom die component with pips rendered in a 3×3 grid
  - Subtle glow effect when you win

## Getting started

### Prerequisites

- Node.js (LTS is recommended)
- npm (comes with Node)

### Install dependencies

```bash
npm install
```

### Run the app in development

```bash
npm run dev
```

Then open the URL shown in the terminal (usually `http://localhost:5173`).

### Build for production

```bash
npm run build
```

The compiled assets will be output to the `dist` folder.

## Project structure (app code)

Key files under `src/`:

- `main.jsx` – React entry point that mounts `<App />`
- `App.jsx` – main Tenzies game component (state, timer, keyboard shortcuts, layout)
- `App.css` – layout and component-level styles for the game view
- `index.css` – global styles and CSS variables (theme/background)

- `components/Die.jsx` – interactive die button with pips
- `components/Die.module.css` – styles for the die component
- `components/StatsBar.jsx` – rolls/time/best stats display

- `lib/dice.js` – pure helpers for dice creation, rolling, holding, and win detection
- `lib/time.js` – time formatting helper
- `lib/storage.js` – safe helpers for reading/writing/removing JSON from `localStorage`

## Notes

- The app is designed to be self-contained; it does not call any remote APIs.
- If `localStorage` is unavailable (for example, in some private browsing modes), the app will still run, but best scores will not persist across reloads.
