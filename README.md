# Morphika Hub

Internal workspace for Morphika prototypes, ideas, and R&D.

## Setup

1. Create repo `morphika-hub` on GitHub (public, empty — no README/license/gitignore)
2. Upload all contents
3. **Settings → Pages → main / root → Save**
4. **Settings → Actions → General** → verify Actions enabled
5. Open the live site → click **⚙ Settings** in sidebar
6. Enter your GitHub username and a Personal Access Token
7. Done — you can now create, edit, and delete everything from the browser

### Creating the token

Go to **GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**

- Token name: `morphika-hub`
- Repository access: **Only select repositories** → `morphika-hub`
- Permissions: **Contents → Read and write**
- Generate → copy → paste into Settings

## How it works

Everything lives in the `sections/` folder. The dashboard reads `manifest.json` and lets you manage everything visually.

**To add a prototype from Claude:** drag & drop the HTML file onto the drop zone, fill in the form, done.

**To add an idea:** click "+ New entry", pick type "Idea", write notes.

**To delete:** expand an entry → click "Delete".

**To edit:** expand an entry → click "Edit".

All changes go directly to GitHub via the API. A GitHub Action rebuilds `manifest.json` automatically.

## Sections

| Section      | Purpose                                          |
|-------------|--------------------------------------------------|
| Production  | Client projects, CGI work, deliverables          |
| Tools       | Internal tools (Morphika Review, etc.)           |
| AI Workflows| AI video pipelines — Runway, Kling, Sora         |
| R&D         | Research, experiments, explorations              |

Create new sections from the dashboard: click "+ Section" in the All view.
