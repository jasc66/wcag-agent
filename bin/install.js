#!/usr/bin/env node
'use strict'

const readline = require('readline')
const fs = require('fs')
const path = require('path')
const os = require('os')

const AGENT_CONTENT = fs.readFileSync(
  path.join(__dirname, '../agent/accessibility-reviewer.md'),
  'utf8'
)

const HEADERS = {
  'claude-global': `---
name: accessibility-reviewer
description: >
  Use this agent to audit web accessibility (WCAG 2.2) directly from source code —
  no running server required. Covers semantic HTML, forms, tables, images, links, ARIA,
  keyboard navigation, animations, SVG icons, charts/data visualizations, progress
  indicators, Server Action form errors, Next.js SPA routing, Vue 3 / Nuxt patterns
  (v-model labels, Teleport modals, Transition reduced-motion, NuxtImg alt text,
  aria-live in SSR, useHead page titles), and common theme systems.
  Works with React/Next.js and Vue 3/Nuxt projects.

  Examples:
  - "audit accessibility on the dashboard page"
  - "check if this form is accessible"
  - "review this table component for WCAG"
  - "does this chart component have accessible alternatives?"
  - "audit this Nuxt page for WCAG 2.2"
  - "check if this Vue modal handles focus correctly"
tools: Read, Glob, Grep, Write, Edit
model: sonnet
color: green
---

`,
  'claude-project': null,
  cursor: `---
description: WCAG 2.2 AA accessibility reviewer — audit React/Next.js components from source code without a running server
globs:
alwaysApply: false
---

`,
  windsurf: `---
trigger: manual
description: WCAG 2.2 AA accessibility reviewer for React/Next.js projects
---

`,
}
HEADERS['claude-project'] = HEADERS['claude-global']

const PLATFORMS = [
  {
    id: 'claude-global',
    label: 'Claude Code — global (all projects)',
    getPath: () => path.join(os.homedir(), '.claude', 'agents', 'accessibility-reviewer.md'),
    usage: 'In Claude Code: use @accessibility-reviewer in any project',
  },
  {
    id: 'claude-project',
    label: 'Claude Code — project only (current directory)',
    getPath: () => path.join(process.cwd(), '.claude', 'agents', 'accessibility-reviewer.md'),
    usage: 'In Claude Code: use @accessibility-reviewer in this project',
  },
  {
    id: 'cursor',
    label: 'Cursor',
    getPath: () => path.join(process.cwd(), '.cursor', 'rules', 'accessibility.mdc'),
    usage: 'In Cursor: reference this rule in your prompt for accessibility reviews',
  },
  {
    id: 'copilot',
    label: 'GitHub Copilot',
    getPath: () => path.join(process.cwd(), '.github', 'copilot-instructions.md'),
    usage: 'GitHub Copilot will apply these instructions automatically in this repository',
  },
  {
    id: 'windsurf',
    label: 'Windsurf',
    getPath: () => path.join(process.cwd(), '.windsurf', 'rules', 'accessibility.md'),
    usage: 'In Windsurf: trigger the rule manually when reviewing accessibility',
  },
]

function ensureDir(filePath) {
  const dir = path.dirname(filePath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

function isInstalled(platform) {
  const targetPath = platform.getPath()
  if (!fs.existsSync(targetPath)) return false
  try {
    return fs.readFileSync(targetPath, 'utf8').includes('WCAG 2.2 AA')
  } catch {
    return false
  }
}

function install(platform) {
  const targetPath = platform.getPath()

  let content
  if (platform.id === 'copilot') {
    if (fs.existsSync(targetPath)) {
      const existing = fs.readFileSync(targetPath, 'utf8')
      if (existing.includes('WCAG 2.2 AA')) {
        console.log('\n  Already installed in ' + targetPath)
        console.log('\n  Run again after removing the existing WCAG section to reinstall.\n')
        return
      }
      content = existing.trimEnd() + '\n\n---\n\n' + AGENT_CONTENT
    } else {
      content = AGENT_CONTENT
    }
  } else {
    content = HEADERS[platform.id] + AGENT_CONTENT
  }

  ensureDir(targetPath)

  if (fs.existsSync(targetPath)) {
    const backupPath = targetPath + '.bak'
    fs.copyFileSync(targetPath, backupPath)
    console.log('  Backed up existing file → ' + path.basename(backupPath))
  }

  fs.writeFileSync(targetPath, content, 'utf8')

  console.log('\n  Installed → ' + targetPath)
  console.log('\n  Usage: ' + platform.usage + '\n')
}

function uninstallPlatform(platform) {
  const targetPath = platform.getPath()
  try {
    if (platform.id === 'copilot') {
      const existing = fs.readFileSync(targetPath, 'utf8')
      const marker = '\n\n---\n\n'
      const idx = existing.indexOf(marker)
      if (idx !== -1 && existing.slice(idx + marker.length).includes('WCAG 2.2 AA')) {
        const before = existing.slice(0, idx).trim()
        if (before.length === 0) {
          fs.unlinkSync(targetPath)
        } else {
          fs.writeFileSync(targetPath, before + '\n', 'utf8')
        }
      } else {
        fs.unlinkSync(targetPath)
      }
    } else {
      fs.unlinkSync(targetPath)
    }
    console.log('\n  Removed → ' + targetPath + '\n')
  } catch (err) {
    console.error('\n  Error removing ' + targetPath + ': ' + err.message + '\n')
  }
}

function upgrade() {
  console.log('\n  WCAG 2.2 AA Accessibility Reviewer Agent — Upgrade')
  console.log('  ───────────────────────────────────────────────────\n')

  const installed = PLATFORMS.filter(isInstalled)

  if (installed.length === 0) {
    console.log('  No installations found. Run `wcag-agent` to install first.\n')
    return
  }

  console.log('  Found ' + installed.length + ' installation(s). Updating...\n')
  installed.forEach((p) => {
    // For copilot, temporarily remove the WCAG section so install() can re-append it cleanly
    if (p.id === 'copilot') {
      const targetPath = p.getPath()
      const existing = fs.readFileSync(targetPath, 'utf8')
      const marker = '\n\n---\n\n'
      const idx = existing.indexOf(marker)
      if (idx !== -1) {
        const before = existing.slice(0, idx).trim()
        fs.writeFileSync(targetPath, before.length > 0 ? before + '\n' : '', 'utf8')
      }
    }
    install(p)
  })

  console.log('  ✓ ' + installed.length + ' installation(s) updated to the latest version.\n')
}

function uninstall() {
  console.log('\n  WCAG 2.2 AA Accessibility Reviewer Agent — Uninstall')
  console.log('  ──────────────────────────────────────────────────────\n')

  const installed = PLATFORMS.filter(isInstalled)

  if (installed.length === 0) {
    console.log('  No installations found.\n')
    return
  }

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

  if (installed.length === 1) {
    const p = installed[0]
    rl.question('  Remove from ' + p.label + ' (' + p.getPath() + ')? [y/N]: ', (answer) => {
      rl.close()
      if (answer.trim().toLowerCase() === 'y') {
        uninstallPlatform(p)
      } else {
        console.log('\n  Cancelled.\n')
      }
    })
    return
  }

  console.log('  Found installations in:\n')
  installed.forEach((p, i) => console.log('  ' + (i + 1) + '. ' + p.label))
  console.log('  ' + (installed.length + 1) + '. All of the above')
  console.log()

  rl.question('  Remove which? [1-' + (installed.length + 1) + ']: ', (answer) => {
    rl.close()
    const idx = parseInt(answer, 10) - 1
    if (isNaN(idx) || idx < 0 || idx > installed.length) {
      console.log('\n  Invalid choice.\n')
      return
    }
    if (idx === installed.length) {
      installed.forEach(uninstallPlatform)
    } else {
      uninstallPlatform(installed[idx])
    }
  })
}

function main() {
  const args = process.argv.slice(2)

  if (args.includes('--upgrade')) {
    upgrade()
    return
  }

  if (args.includes('--uninstall')) {
    uninstall()
    return
  }

  console.log('\n  WCAG 2.2 AA Accessibility Reviewer Agent')
  console.log('  ─────────────────────────────────────────\n')
  console.log('  Select your AI coding assistant:\n')
  PLATFORMS.forEach((p, i) => console.log('  ' + (i + 1) + '. ' + p.label))
  console.log()

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

  rl.question('  Choice [1-' + PLATFORMS.length + ']: ', (answer) => {
    rl.close()
    const idx = parseInt(answer, 10) - 1
    if (isNaN(idx) || idx < 0 || idx >= PLATFORMS.length) {
      console.log('\n  Invalid choice. Enter a number between 1 and ' + PLATFORMS.length + '.\n')
      process.exit(1)
    }
    install(PLATFORMS[idx])
  })
}

main()
