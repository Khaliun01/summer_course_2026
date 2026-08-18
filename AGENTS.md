# AGENTS.md

Teaching repo for a p5.js/HTML/CSS summer course. Static exercises by week (`week01`–`week07`) and day (`monday`/`tuesday`/`thursday`/`friday`); a Firebase Hosting workspace holds course projects.

## No toolchain
No package.json, build, test, or lint. Verify changes by opening the `.html` file in a browser. Commit messages are terse lowercase ("monday hicheel", "tuesday", "project02").

## p5.js conventions
- `p5.min.js` is vendored per folder; reference it relatively (`<script src="./p5.min.js"></script>`). Never use a CDN or npm.
- Sketches use the global-mode API: plain `<script>` with global `setup()`, `draw()`, `mousePressed()`, etc. No imports, no `new p5()`.
- Weeks 05–07 convention: `exNN.html` + `js/exNN.js` + optional `css/exNN.css`. Older weeks are inconsistent (e.g. `idex.html`, `Ex.html`, hidden `.css/` dirs in week03/Friday) — search before assuming a scheme.

## Firebase Hosting (`my-firebase-workspace/`)
- One Firebase project `summer-course-2026-khaliun`; `firebase.json` defines 3 hosting targets (project01/02/03), each `public: projects/<name>`.
- Deploy a single site from this dir: `firebase deploy --only hosting:project01` (project02/project03 likewise).
- Ignore `week04/tuesday/project02/deployment.md` — it holds a stale single-site deploy command.
- `.firebaserc` is gitignored; `firebase-debug.log` files are ignored too.

## Git
- Only the repo root is the main git repo. `week02/monday/` contains its own untracked nested `.git` — don't run git commands there.
- Repo is mid-restructure: old root-level `projects/` files are deleted; new ones live in `my-firebase-workspace/projects/`.