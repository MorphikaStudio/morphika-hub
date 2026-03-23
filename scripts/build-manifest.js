#!/usr/bin/env node

/**
 * Scans sections/ and generates manifest.json
 *
 * Structure:
 *   sections/
 *     {section-id}/
 *       section.json       ← { name, icon, color, description }
 *       {entry-id}/
 *         meta.json         ← { name, type, version?, date, status, description, tags }
 *         index.html        ← optional: the prototype
 *         notes.md          ← optional: markdown notes
 */

const fs = require('fs');
const path = require('path');

const SECTIONS_DIR = path.join(__dirname, '..', 'sections');

function readJSON(filepath) {
  try {
    return JSON.parse(fs.readFileSync(filepath, 'utf8'));
  } catch (e) {
    console.warn(`⚠ Could not read ${filepath}: ${e.message}`);
    return null;
  }
}

function readText(filepath) {
  try {
    return fs.readFileSync(filepath, 'utf8');
  } catch {
    return null;
  }
}

function buildManifest() {
  const sections = [];

  const sectionDirs = fs.readdirSync(SECTIONS_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .sort((a, b) => a.name.localeCompare(b.name));

  for (const secDir of sectionDirs) {
    const secPath = path.join(SECTIONS_DIR, secDir.name);
    const secConfig = readJSON(path.join(secPath, 'section.json'));
    if (!secConfig) {
      console.warn(`⚠ Skipping ${secDir.name} — no section.json`);
      continue;
    }

    const entries = [];

    const entryDirs = fs.readdirSync(secPath, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .sort((a, b) => a.name.localeCompare(b.name));

    for (const entryDir of entryDirs) {
      const entryPath = path.join(secPath, entryDir.name);
      const meta = readJSON(path.join(entryPath, 'meta.json'));
      if (!meta) {
        console.warn(`  ⚠ Skipping ${secDir.name}/${entryDir.name} — no meta.json`);
        continue;
      }

      const hasIndex = fs.existsSync(path.join(entryPath, 'index.html'));
      const notes = readText(path.join(entryPath, 'notes.md'));

      entries.push({
        id: entryDir.name,
        name: meta.name,
        type: meta.type || 'idea',
        version: meta.version || null,
        date: meta.date || new Date().toISOString().split('T')[0],
        status: meta.status || 'concept',
        description: meta.description || '',
        tags: meta.tags || [],
        hasPrototype: hasIndex,
        hasNotes: !!notes,
        path: hasIndex ? `sections/${secDir.name}/${entryDir.name}/index.html` : null,
        notes: notes || null
      });
    }

    // Sort by date newest first
    entries.sort((a, b) => b.date.localeCompare(a.date));

    sections.push({
      id: secDir.name,
      name: secConfig.name,
      icon: secConfig.icon || '●',
      color: secConfig.color || '#888',
      description: secConfig.description || '',
      entries
    });
  }

  const manifest = {
    hub: {
      name: 'Morphika',
      tagline: 'Ideas, prototypes & experiments',
      generated: new Date().toISOString()
    },
    sections
  };

  const outPath = path.join(__dirname, '..', 'manifest.json');
  fs.writeFileSync(outPath, JSON.stringify(manifest, null, 2) + '\n');

  const totalEntries = sections.reduce((a, s) => a + s.entries.length, 0);
  const protos = sections.reduce((a, s) => a + s.entries.filter(e => e.hasPrototype).length, 0);
  const ideas = totalEntries - protos;
  console.log(`✓ manifest.json: ${sections.length} sections, ${totalEntries} entries (${protos} prototypes, ${ideas} ideas/refs)`);
}

buildManifest();
