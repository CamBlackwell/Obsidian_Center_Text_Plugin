# Center Text — Obsidian Plugin

A simple Obsidian plugin that centers all text in your notes and lets you control how wide the text column is.

## Features

- Toggle text centering on and off
- Slider to control the maximum text width (20–100%)
- Works in both reading view and live preview
- Settings persist across restarts

## Installation

1. Copy the plugin folder into your vault at `.obsidian/plugins/center-text/`
2. Run `npm install` then `npm run build` to compile
3. In Obsidian go to **Settings → Community Plugins** and enable **center Text**

## Usage

There are three ways to toggle centering:

| Method | How |
|---|---|
| Ribbon icon | Click the align-center icon in the left sidebar |
| Command palette | `Ctrl/Cmd+P` → "Toggle center text" |
| Settings | Settings → center Text → flip the switch |

To adjust the text width, go to **Settings → center Text** and drag the **Maximum Text Width** slider.

## Hotkeys

No default hotkeys are set to avoid conflicts. You can assign your own in **Settings → Hotkeys** by searching for "center":

- Toggle center text
- Increase text width
- Decrease text width

## Development

```bash
npm install       # install dependencies
npm run dev       # watch mode — rebuilds on save
npm run build     # one-off production build
```
