// Verify per-page phone configuration across the whole site.
// Run: node tests/verify-phones.mjs

import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

let failures = 0;
function assert(cond, msg) {
  if (!cond) { console.error(`  FAIL: ${msg}`); failures++; }
  else { console.log(`  PASS: ${msg}`); }
}

// ── 1. content.json structure ──────────────────────────────────────────
console.log('\n1. content.json — per-page phone fields');
const content = JSON.parse(readFileSync(join(root, 'public/data/content.json'), 'utf-8'));
assert(typeof content.settings.phone1 === 'string', 'settings.phone1 exists');
assert(typeof content.settings.phone2 === 'string', 'settings.phone2 exists');
assert(typeof content.settings.phone1Name === 'string', 'settings.phone1Name exists');
assert(typeof content.settings.phone2Name === 'string', 'settings.phone2Name exists');
for (const section of ['about', 'plumbing', 'electrical']) {
  assert(typeof content[section].phone1 === 'string', `${section}.phone1 exists`);
  assert(typeof content[section].phone1Name === 'string', `${section}.phone1Name exists`);
  assert(typeof content[section].phone2 === 'string', `${section}.phone2 exists`);
  assert(typeof content[section].phone2Name === 'string', `${section}.phone2Name exists`);
}
// Home should NOT have phone fields (uses global footer)
assert(content.home.phone1 === undefined, 'home.phone1 is absent (uses global footer)');
assert(content.home.phone2 === undefined, 'home.phone2 is absent (uses global footer)');

// ── 2. Merge function behavior ─────────────────────────────────────────
console.log('\n2. useContent.ts — merge() per-page phone fallback');
// Simulate what the TypeScript merge() does
const D = {
  settings: { phone1: '+G1', phone1Name: 'Global1', phone2: '+G2', phone2Name: 'Global2' },
};
function simulateMerge(data) {
  const settings = { ...D.settings, ...(data.settings || {}) };
  const pagePhoneDefaults = { phone1: settings.phone1, phone1Name: settings.phone1Name, phone2: settings.phone2, phone2Name: settings.phone2Name };
  return {
    settings,
    about: { phone1: 'G1fallback', phone1Name: 'G1', phone2: 'G2fallback', phone2Name: 'G2', storyHeading: 'x', ...pagePhoneDefaults, ...(data.about || {}) },
    plumbing: { heroHeading: 'x', ...pagePhoneDefaults, ...(data.plumbing || {}) },
  };
}

// When no per-page override, uses global defaults
const merged = simulateMerge({});
assert(merged.about.phone1 === '+G1', 'about.phone1 falls back to global when no override');
assert(merged.about.phone1Name === 'Global1', 'about.phone1Name falls back to global');
assert(merged.plumbing.phone1 === '+G1', 'plumbing.phone1 falls back to global when no override');

// When per-page overrides, uses override
const overridden = simulateMerge({ about: { phone1: '+Custom', phone1Name: 'CustomName' } });
assert(overridden.about.phone1 === '+Custom', 'about.phone1 uses per-page override');
assert(overridden.about.phone1Name === 'CustomName', 'about.phone1Name uses per-page override');
// Non-overridden fields still fall back
assert(overridden.about.phone2 === '+G2', 'about.phone2 still falls back when not overridden');

// When global settings change, per-page defaults follow
const newGlobal = simulateMerge({ settings: { phone1: '+NewGlobal', phone1Name: 'NewG' } });
assert(newGlobal.about.phone1 === '+NewGlobal', 'about.phone1 follows updated global settings');
assert(newGlobal.plumbing.phone1 === '+NewGlobal', 'plumbing.phone1 follows updated global settings');

// ── 3. Page TSX files reference per-page phones ────────────────────────
console.log('\n3. Page components — per-page phone references');
for (const [file, prefix] of [
  ['src/pages/About.tsx', 'content.about.phone'],
  ['src/pages/Plumbing.tsx', 'content.plumbing.phone'],
  ['src/pages/Electrical.tsx', 'content.electrical.phone'],
]) {
  let src = readFileSync(join(root, file), 'utf-8');
  // Strip JSON-LD script blocks — they legitimately use global phone for business schema
  const srcNoScript = src.replace(/<script\b[\s\S]*?<\/script>/g, '');
  assert(!srcNoScript.includes('content.settings.phone1') && !srcNoScript.includes('content.settings.phone2'),
    `${file.split('/').pop()} — no remaining content.settings.phone references (outside JSON-LD)`);
  assert(src.includes(`${prefix}1`) && src.includes(`${prefix}2`),
    `${file.split('/').pop()} — uses per-page phone1/phone2`);
  assert(src.includes(`${prefix}1Name`) && src.includes(`${prefix}2Name`),
    `${file.split('/').pop()} — uses per-page phone1Name/phone2Name`);
}

// ── 4. Footer (App.tsx) still uses global settings ─────────────────────
console.log('\n4. App.tsx footer — uses global phone settings');
const appTsx = readFileSync(join(root, 'src/App.tsx'), 'utf-8');
assert(appTsx.includes('content.settings.phone1'), 'footer uses global phone1');
assert(appTsx.includes('content.settings.phone2'), 'footer uses global phone2');
assert(!appTsx.includes('content.home.phone'), 'footer does NOT use per-page phones');

// ── 5. Admin.tsx — all three editors have phone fields ──────────────────
console.log('\n5. Admin.tsx — editor phone fields present');
const adminTsx = readFileSync(join(root, 'src/pages/Admin.tsx'), 'utf-8');
for (const editor of ['AboutEditor', 'PlumbingEditor', 'ElectricalEditor']) {
  const start = adminTsx.indexOf(`function ${editor}`);
  const nextFunc = adminTsx.indexOf('\nfunction ', start + 1);
  const block = adminTsx.slice(start, nextFunc > start ? nextFunc : undefined);
  assert(block.includes("phone1") && block.includes("phone1Name"), `${editor} has phone1/phone1Name fields`);
  assert(block.includes("phone2") && block.includes("phone2Name"), `${editor} has phone2/phone2Name fields`);
  assert(block.includes("Contact Buttons"), `${editor} has "Contact Buttons" section heading`);
}

// ── 6. No hardcoded phone numbers in user-facing buttons ────────────────
console.log('\n6. Hardcoded phone check');
const allSrc = ['src/pages/About.tsx', 'src/pages/Plumbing.tsx', 'src/pages/Electrical.tsx']
  .map(f => readFileSync(join(root, f), 'utf-8')).join('\n');
// "Call John"/"Call Leo" should be dynamic from content, not hardcoded
assert(!allSrc.match(/>Call John\b/), 'no hardcoded "Call John"');
assert(!allSrc.match(/>Call Leo\b/), 'no hardcoded "Call Leo"');

// ── 7. Summary ─────────────────────────────────────────────────────────
console.log(`\n${failures ? `FAILURES: ${failures}` : 'All checks passed.'}`);
process.exit(failures ? 1 : 0);
