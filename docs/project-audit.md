# Project index & audit notes

## Commands executed during audit
- `ls`
- `find .. -name AGENTS.md -print`
- `rg -n "TODO|FIXME|BUG" -S .`
- `find . -maxdepth 2 -type d`
- `sed -n '1,200p' src/main.js`
- `sed -n '1,220p' src/Game.js`
- `sed -n '220,520p' src/Game.js`
- `sed -n '1,200p' src/Utils/canvas.js`
- `sed -n '1,200p' index.html`
- `sed -n '1,200p' game.html`
- `sed -n '1,220p' src/System/Input/InputManager.js`
- `sed -n '1,200p' src/System/Input/KeyboardManager.js`
- `sed -n '1,240p' src/Manager/SaveManager.js`
- `sed -n '240,520p' src/Manager/SaveManager.js`
- `rg -n "process\\.env" -S src`
- `sed -n '1,240p' src/Manager/MapManager.js`
- `sed -n '1,240p' src/Manager/InteractionManager.js`
- `sed -n '240,520p' src/Manager/InteractionManager.js`
- `sed -n '1,220p' src/System/UI/UIManager.js`
- `sed -n '1,200p' src/Manager/DataManager.js`
- `sed -n '1,240p' src/Manager/PlotManager.js`
- `cat README.md`
- `cat final-verification-report.json`

## High-level project map (selected)
- HTML entry pages: `index.html`, `login.html`, `register.html`, `menu.html`, `game.html`.
- Game logic (modules): `src/` with managers, systems, entities, and utilities.
- Assets: `assets/` (audio, images, stages JSON, styles).
- Plot data: `Plot.V3/plot-data.json`.
- Bundling: Vite config (`vite.config.js`) + `package.json`.
