# wcag-agent

WCAG 2.2 accessibility reviewer agent for AI coding assistants.

Install once, audit any React / Next.js or Vue 3 / Nuxt component directly from source code — no running server, no browser extension.

## Install

```bash
# npm
npx wcag-agent

# pnpm
pnpm dlx wcag-agent
```

You will be prompted to choose one or more AI assistants:

```
  WCAG 2.2 Accessibility Reviewer Agent
  ─────────────────────────────────────────

  Select your AI coding assistant(s):

  1. Claude Code — global (all projects)
  2. Claude Code — project only (current directory)
  3. Cursor
  4. GitHub Copilot
  5. Windsurf
  6. Zed — global (all projects)
  7. Zed — project only (current directory)
  8. Continue.dev — global (all projects)
  9. Continue.dev — project only (current directory)
  10. Aider

  Choice(s) [1-10, space/comma-separated, or "all"]:
```

Enter a single number, multiple numbers (`1 3 8`), or `all` to install everywhere at once. The agent file is copied to the correct location for each tool with the right frontmatter. If a previous version exists, a `.bak` backup is created automatically.

### Install to all platforms at once

```bash
npx wcag-agent --all
```

### Conformance level

By default the agent reviews for WCAG 2.2 **Level AA**. Override with `--level`:

```bash
# Level A only (minimum compliance)
npx wcag-agent --level A

# Level AA — default
npx wcag-agent --level AA

# Level AAA (exhaustive — government / Section 508 projects)
npx wcag-agent --level AAA
```

The level flag works with all commands: `--upgrade`, `--all`, and interactive mode.

## Supported platforms

| Platform | Install path |
|---|---|
| Claude Code (global) | `~/.claude/agents/accessibility-reviewer.md` |
| Claude Code (project) | `.claude/agents/accessibility-reviewer.md` |
| Cursor | `.cursor/rules/accessibility.mdc` |
| GitHub Copilot | `.github/copilot-instructions.md` |
| Windsurf | `.windsurf/rules/accessibility.md` |
| Zed (global) | `~/.config/zed/prompts/accessibility-reviewer.md` |
| Zed (project) | `.zed/rules/accessibility.md` |
| Continue.dev (global) | `~/.continue/rules/accessibility-reviewer.md` |
| Continue.dev (project) | `.continue/rules/accessibility-reviewer.md` |
| Aider | `.aider/accessibility.md` |

## Usage

**Claude Code**
```
@accessibility-reviewer audit the dashboard page
@accessibility-reviewer check if this form is accessible
@accessibility-reviewer review this table component for WCAG
```

**Cursor / Copilot / Windsurf / Continue.dev**

Reference the rule in your prompt:
```
Using the accessibility rule, review src/components/LoginForm.tsx for WCAG 2.2 issues
Using the accessibility rule, audit pages/dashboard.vue for WCAG 2.2 issues
```

**Zed**

In the AI panel, type `/prompt accessibility-reviewer` to apply the prompt, then describe what to audit.

### Report modes

By default the agent returns a **developer report** (WCAG success criteria, file:line, code fixes). Add `--report stakeholder` to get a **business report** instead — plain language, grouped by High/Medium/Low impact, with user impact, effort estimate (S/M/L), and a legal/compliance note (ADA / Section 508 / EAA / Ley 7600). No SC codes or code snippets.

```
@accessibility-reviewer --report stakeholder audit the checkout flow
```

Useful when presenting audit results to a PM, client, or legal team.

**Aider**

Pass the file when starting aider:
```bash
aider --read .aider/accessibility.md src/components/LoginForm.tsx
```

Or add it permanently to `.aider.conf.yml`:
```yaml
read:
  - .aider/accessibility.md
```

## Update & uninstall

**Update all installations to the latest version:**
```bash
npx wcag-agent --upgrade
```
Detects every platform where the agent is installed and overwrites it with the current version. A `.bak` backup is created automatically.

**Remove an installation:**
```bash
npx wcag-agent --uninstall
```
Shows an interactive menu of detected installations so you can choose which one (or all) to remove.

## What it covers

21 evaluation categories mapped to WCAG 2.2 success criteria:

1. Page structure and landmarks
2. Links and navigation
3. Images and alt text
4. Forms and error handling
5. Tables
6. Keyboard navigation and focus management
7. ARIA usage
8. Color contrast
9. Theme support (dark / high-contrast)
10. Text scaling and responsive layout
11. Native HTML elements
12. Animations and reduced motion
13. SVG and icon accessibility
14. SPA route announcements (Next.js App Router, Vue Router, Nuxt 3)
15. Language, media, and context changes
16. WCAG 2.2 new criteria (2.5.7, 3.2.6, 3.3.7, 3.3.8)
17. Cognitive accessibility
18. Charts and data visualizations
19. Progress indicators
20. Server Actions and form error handling (Next.js 14/15)
21. Vue 3 / Nuxt patterns — `v-model` labels, `<Teleport>` modals, `<Transition>` reduced-motion, `<NuxtImg>` alt text, `aria-live` in SSR, `useHead()` page titles, component library guidance (Radix Vue, Headless UI, NuxtUI, Vuetify, PrimeVue)

Category 17 also flags the **manual-only criteria** most easily missed in code review — Sensory Characteristics (1.3.3), Images of Text (1.4.5), Multiple Ways (2.4.5), Pointer Gestures/Cancellation/Motion Actuation (2.5.1/2.5.2/2.5.4), and Content on Hover or Focus (1.4.13) — which no automated tool reliably detects.

Each finding includes the WCAG success criterion, the affected file and line, the issue, and a concrete fix with code examples.

## Output format

Every developer audit returns:

- **Critical** — WCAG violations that break access for one or more user groups
- **Important** — issues that degrade the experience but don't fully block access
- **Minor** — polish and best-practice gaps
- **Passes correctly** — what is already implemented well
- **Manual testing checklist** — what must be verified in a real browser

## Background

This agent was developed and battle-tested as part of a larger accessibility audit project before being published as a standalone tool.

## Requirements

- Node.js ≥ 16
- One of the supported AI coding assistants

## Author

Built by [Alonso Salguero](https://portafolio-pro-jasc.vercel.app/)

## License

MIT
