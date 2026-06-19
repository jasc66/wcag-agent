# wcag-agent

WCAG 2.2 AA accessibility reviewer agent for AI coding assistants.

Install once, audit any React / Next.js component directly from source code — no running server, no browser extension.

## Install

```bash
# npm
npx wcag-agent

# pnpm
pnpm dlx wcag-agent
```

You will be prompted to choose your AI assistant:

```
  WCAG 2.2 AA Accessibility Reviewer Agent
  ─────────────────────────────────────────

  1. Claude Code — global (all projects)
  2. Claude Code — project only (current directory)
  3. Cursor
  4. GitHub Copilot
  5. Windsurf

  Choice [1-5]:
```

The agent file is copied to the correct location for your tool, with the right frontmatter for each platform. If a previous version exists, a `.bak` backup is created automatically.

## Supported platforms

| Platform | Install path |
|---|---|
| Claude Code (global) | `~/.claude/agents/accessibility-reviewer.md` |
| Claude Code (project) | `.claude/agents/accessibility-reviewer.md` |
| Cursor | `.cursor/rules/accessibility.mdc` |
| GitHub Copilot | `.github/copilot-instructions.md` |
| Windsurf | `.windsurf/rules/accessibility.md` |

## Usage

**Claude Code**
```
@accessibility-reviewer audit the dashboard page
@accessibility-reviewer check if this form is accessible
@accessibility-reviewer review this table component for WCAG
```

**Cursor / Copilot / Windsurf**

Reference the rule in your prompt:
```
Using the accessibility rule, review src/components/LoginForm.tsx for WCAG 2.2 issues
```

## What it covers

20 evaluation categories mapped to WCAG 2.2 success criteria:

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
14. Next.js SPA route announcements
15. Language, media, and context changes
16. WCAG 2.2 new criteria (2.5.7, 3.2.6, 3.3.7, 3.3.8)
17. Cognitive accessibility
18. Charts and data visualizations
19. Progress indicators
20. Server Actions and form error handling (Next.js 14/15)

Each finding includes the WCAG success criterion, the affected file and line, the issue, and a concrete fix with code examples.

## Output format

Every audit returns:

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
