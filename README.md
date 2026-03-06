# Bone Gyre 2

A new project with the same tech stack as Bone Gyre Like.

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool
- **Electron** - Cross-platform desktop app
- **Tailwind CSS** (optional) - Utility-first CSS

## Getting Started

### Development

Run the development server with Vite and Electron:

```bash
npm run dev:win
```

Or on macOS/Linux:

```bash
npm run dev
```

### Build

Create a production build:

```bash
npm run build:win
```

Or on macOS/Linux:

```bash
npm run build
```

## Project Structure

```
bone_gyre_2/
├── src/                 # React components and logic
│   ├── main.tsx        # Entry point
│   ├── App.tsx         # Root component
│   └── styles.css      # Global styles
├── electron/           # Electron main process
│   ├── main.js         # Main process entry
│   └── preload.js      # Preload script for IPC
├── index.html          # HTML entry point
├── vite.config.ts      # Vite configuration
├── tsconfig.json       # TypeScript configuration
└── package.json        # Dependencies and scripts
```

## Development Workflow

1. Update React components in `src/`
2. Changes hot-reload in the Electron window
3. Static assets go in `src/` or `public/`
4. IPC communication through `window.boneGyre2`
