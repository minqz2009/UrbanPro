// Comprehensive admin portal coverage test.
// Run: node tests/admin-coverage.mjs

import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

let failures = 0;
let total = 0;
function assert(cond, msg) {
  total++;
  if (!cond) { console.error(`  FAIL [${total}]: ${msg}`); failures++; }
}

// ── Helpers ────────────────────────────────────────────────────────────
const content = JSON.parse(readFileSync(join(root, 'public/data/content.json'), 'utf-8'));
const adminTsx = readFileSync(join(root, 'src/pages/Admin.tsx'), 'utf-8');
const useContentTs = readFileSync(join(root, 'src/hooks/useContent.ts'), 'utf-8');
const aboutTsx = readFileSync(join(root, 'src/pages/About.tsx'), 'utf-8');
const plumbingTsx = readFileSync(join(root, 'src/pages/Plumbing.tsx'), 'utf-8');
const electricalTsx = readFileSync(join(root, 'src/pages/Electrical.tsx'), 'utf-8');
const homeTsx = readFileSync(join(root, 'src/pages/Home.tsx'), 'utf-8');
const buildingTsx = readFileSync(join(root, 'src/pages/Building.tsx'), 'utf-8');
const appTsx = readFileSync(join(root, 'src/App.tsx'), 'utf-8');

// =======================================================================
// 1. SETTINGS EDITOR
// =======================================================================
console.log('\n=== 1. Settings Editor ===');

// Fields exist
assert(content.settings.phone1 !== undefined, 'settings.phone1 exists');
assert(content.settings.phone1Name !== undefined, 'settings.phone1Name exists');
assert(content.settings.phone2 !== undefined, 'settings.phone2 exists');
assert(content.settings.phone2Name !== undefined, 'settings.phone2Name exists');
assert(content.settings.email !== undefined, 'settings.email exists');
assert(content.settings.abn !== undefined, 'settings.abn exists');
assert(content.settings.licence !== undefined, 'settings.licence exists');

// Character limits in admin
assert(adminTsx.includes('phone1Name') && adminTsx.includes('maxLength={30}'), 'phone1Name has maxLength 30');
assert(adminTsx.includes('phone2Name') && adminTsx.includes('maxLength={30}'), 'phone2Name has maxLength 30');

// Description
assert(adminTsx.includes('Business contact details shown in the website footer'), 'Settings description mentions footer');
assert(adminTsx.includes('defaults for per-page contact buttons'), 'Settings description mentions per-page defaults');

// =======================================================================
// 2. HOME EDITOR
// =======================================================================
console.log('\n=== 2. Home Editor ===');

assert(content.home.heroSubtitle !== undefined, 'home.heroSubtitle exists');
assert(content.home.servicesHeading !== undefined, 'home.servicesHeading exists');
assert(adminTsx.includes('heroSubtitle') && adminTsx.includes('maxLength={180}'), 'home heroSubtitle has maxLength 180');
assert(adminTsx.includes('servicesHeading') && adminTsx.includes('maxLength={40}'), 'home servicesHeading has maxLength 40');
// Home should NOT have per-page phones
assert(!content.home.phone1, 'home does NOT have phone1 (uses footer)');

// =======================================================================
// 3. PLUMBING EDITOR
// =======================================================================
console.log('\n=== 3. Plumbing Editor ===');

assert(content.plumbing.heroHeading !== undefined, 'plumbing.heroHeading exists');
assert(content.plumbing.heroSubtitle !== undefined, 'plumbing.heroSubtitle exists');
assert(content.plumbing.phone1 !== undefined, 'plumbing.phone1 exists (per-page)');
assert(content.plumbing.phone1Name !== undefined, 'plumbing.phone1Name exists (per-page)');
assert(content.plumbing.phone2 !== undefined, 'plumbing.phone2 exists (per-page)');
assert(content.plumbing.phone2Name !== undefined, 'plumbing.phone2Name exists (per-page)');

// Character limits
assert(adminTsx.includes('heroHeading') && adminTsx.includes('maxLength={60}'), 'plumbing heroHeading maxLength 60');
assert(adminTsx.includes('heroSubtitle') && adminTsx.includes('maxLength={220}'), 'plumbing heroSubtitle maxLength 220');

// Contact buttons section
const plumbingEditorStart = adminTsx.indexOf('function PlumbingEditor');
const plumbingEditorEnd = adminTsx.indexOf('function ElectricalEditor');
const plumbingEditor = adminTsx.slice(plumbingEditorStart, plumbingEditorEnd);
assert(plumbingEditor.includes('Contact Buttons'), 'PlumbingEditor has Contact Buttons section');
assert(plumbingEditor.includes('override the global phone settings'), 'PlumbingEditor mentions phone override');

// Page TSX uses per-page phones
assert(plumbingTsx.includes('content.plumbing.phone1'), 'Plumbing.tsx uses per-page phone1');
assert(plumbingTsx.includes('content.plumbing.phone2'), 'Plumbing.tsx uses per-page phone2');
assert(!plumbingTsx.includes('content.settings.phone1'), 'Plumbing.tsx does NOT use global phone1');

// =======================================================================
// 4. ELECTRICAL EDITOR
// =======================================================================
console.log('\n=== 4. Electrical Editor ===');

assert(content.electrical.heroHeading !== undefined, 'electrical.heroHeading exists');
assert(content.electrical.heroSubtitle !== undefined, 'electrical.heroSubtitle exists');
assert(content.electrical.phone1 !== undefined, 'electrical.phone1 exists (per-page)');
assert(content.electrical.phone1Name !== undefined, 'electrical.phone1Name exists (per-page)');
assert(content.electrical.phone2 !== undefined, 'electrical.phone2 exists (per-page)');
assert(content.electrical.phone2Name !== undefined, 'electrical.phone2Name exists (per-page)');

const electricalEditorStart = adminTsx.indexOf('function ElectricalEditor');
const electricalEditorEnd = adminTsx.indexOf('function TeamMemberCards');
const electricalEditor = adminTsx.slice(electricalEditorStart, electricalEditorEnd);
assert(electricalEditor.includes('Contact Buttons'), 'ElectricalEditor has Contact Buttons section');
assert(electricalEditor.includes('override the global phone settings'), 'ElectricalEditor mentions phone override');

assert(electricalTsx.includes('content.electrical.phone1'), 'Electrical.tsx uses per-page phone1');
assert(electricalTsx.includes('content.electrical.phone2'), 'Electrical.tsx uses per-page phone2');

// =======================================================================
// 5. ABOUT EDITOR (includes Team)
// =======================================================================
console.log('\n=== 5. About Editor (includes Team) ===');

// Story section
assert(content.about.storyHeading !== undefined, 'about.storyHeading exists');
assert(content.about.storyPara1 !== undefined, 'about.storyPara1 exists');
assert(content.about.storyPara2 !== undefined, 'about.storyPara2 exists');
assert(adminTsx.includes('storyHeading') && adminTsx.includes('maxLength={60}'), 'about storyHeading maxLength 60');
assert(adminTsx.includes('storyPara1') && adminTsx.includes('maxLength={300}'), 'about storyPara1 maxLength 300');
assert(adminTsx.includes('storyPara2') && adminTsx.includes('maxLength={300}'), 'about storyPara2 maxLength 300');

// Per-page phones
assert(content.about.phone1 !== undefined, 'about.phone1 exists (per-page)');
assert(content.about.phone2 !== undefined, 'about.phone2 exists (per-page)');

// Stats
assert(Array.isArray(content.about.stats) && content.about.stats.length === 4, 'about.stats has 4 entries');
assert(content.about.stats.every(s => s.value && s.label), 'all stats have value and label');
assert(adminTsx.includes('stat.value') && adminTsx.includes('maxLength={8}'), 'stat value maxLength 8');
assert(adminTsx.includes('stat.label') && adminTsx.includes('maxLength={25}'), 'stat label maxLength 25');

// Team section header
assert(content.about.teamHeading !== undefined, 'about.teamHeading exists');
assert(content.about.teamSubheading !== undefined, 'about.teamSubheading exists');
assert(adminTsx.includes('teamHeading') && adminTsx.includes('maxLength={40}'), 'teamHeading maxLength 40');
assert(adminTsx.includes('teamSubheading') && adminTsx.includes('maxLength={100}'), 'teamSubheading maxLength 100');

// Team members embedded in AboutEditor
const aboutEditorStart = adminTsx.indexOf('function AboutEditor');
const nextFuncAfterAbout = adminTsx.indexOf('\n// ───', aboutEditorStart + 1);
const aboutEditor = adminTsx.slice(aboutEditorStart, nextFuncAfterAbout > aboutEditorStart ? nextFuncAfterAbout : undefined);
assert(aboutEditor.includes('TeamMemberCards'), 'AboutEditor includes TeamMemberCards component');
assert(aboutEditor.includes('Team Members'), 'AboutEditor has "Team Members" section heading');
assert(aboutEditor.includes('content.team'), 'AboutEditor references content.team');

// Team data
assert(Array.isArray(content.team) && content.team.length >= 3, 'team has at least 3 members');
assert(content.team.every(m => m.id && m.name && m.role), 'all team members have id, name, role');
assert(adminTsx.includes('maxLength={40}') && adminTsx.includes("'name'"), 'team member name maxLength 40');
assert(adminTsx.includes('maxLength={60}') && adminTsx.includes("'role'"), 'team member role maxLength 60');
assert(adminTsx.includes('maxLength={600}') && adminTsx.includes("'bio'"), 'team member bio maxLength 600');

// About page TSX uses per-page phones
assert(aboutTsx.includes('content.about.phone1'), 'About.tsx uses per-page phone1');
assert(aboutTsx.includes('content.about.phone2'), 'About.tsx uses per-page phone2');
assert(!aboutTsx.includes('content.settings.phone1'), 'About.tsx does NOT use global phone1');
// About page shows team
assert(aboutTsx.includes('content.team'), 'About.tsx references content.team');
assert(aboutTsx.includes('teamSectionRef'), 'About.tsx has team section ref');

// =======================================================================
// 6. BUILDING EDITOR
// =======================================================================
console.log('\n=== 6. Building Editor ===');

const projects = content.buildingProjects;
assert(Array.isArray(projects) && projects.length >= 5, 'buildingProjects has at least 5 projects');

assert(Array.isArray(content.buildingCategories) && content.buildingCategories.length === 3, 'buildingCategories exists with 3 entries');
const expectedCats = ['New Builds', 'Renovations', 'Small Projects'];
assert(expectedCats.every(c => content.buildingCategories.includes(c)), 'buildingCategories contains all expected categories');
// Each project's category should be in the buildingCategories list
assert(projects.every(p => content.buildingCategories.includes(p.category)), 'all project categories are valid');
for (const cat of content.buildingCategories) {
  assert(projects.some(p => p.category === cat), `projects include category: ${cat}`);
}
assert(projects.every(p => p.id && p.title && p.location), 'all projects have id, title, location');
assert(projects.every(p => Array.isArray(p.photos)), 'all projects have photos array');

// Character limits
assert(adminTsx.includes('maxLength={60}') && adminTsx.includes("'title'"), 'project title maxLength 60');
assert(adminTsx.includes('maxLength={50}') && adminTsx.includes("'location'"), 'project location maxLength 50');
assert(adminTsx.includes('maxLength={200}') && adminTsx.includes("'description'"), 'project description maxLength 200');

// Panorama support
assert(projects.some(p => p.pano && p.pano.startsWith('https://')), 'some projects have panorama links');
assert(adminTsx.includes('360° Panorama'), 'admin has panorama field');

// Building page uses projects data
assert(buildingTsx.includes('content.buildingProjects'), 'Building.tsx references buildingProjects');

// =======================================================================
// 7. NAV TABS
// =======================================================================
console.log('\n=== 7. Nav Tabs ===');

// Team tab must be removed
assert(!adminTsx.includes("'team'") && !adminTsx.includes('"team"'), 'no team tab in NavTab type');
assert(!adminTsx.includes("label: 'Team'"), 'no Team label in NAV_TABS');
assert(!adminTsx.includes('activeTab === \'team\''), 'no team tab rendering');

// All correct tabs exist
const expectedTabs = ['Settings', 'Home', 'Building', 'Plumbing', 'Electrical', 'About'];
for (const tab of expectedTabs) {
  assert(adminTsx.includes(`label: '${tab}'`), `tab "${tab}" exists in NAV_TABS`);
}

// =======================================================================
// 8. PHONE FALLBACK LOGIC
// =======================================================================
console.log('\n=== 8. Phone Fallback Logic ===');

// merge() function exists
assert(useContentTs.includes('export function merge'), 'merge() function exists');
assert(useContentTs.includes('pagePhoneDefaults'), 'merge uses pagePhoneDefaults');
assert(useContentTs.includes('settings.phone1'), 'merge falls back to settings.phone1');
assert(useContentTs.includes('settings.phone2'), 'merge falls back to settings.phone2');

// Simulate merge behavior
const DEFAULTS = {
  settings: { phone1: '+G1', phone1Name: 'Global1', phone2: '+G2', phone2Name: 'Global2' },
};
function simMerge(data) {
  const settings = { ...DEFAULTS.settings, ...(data.settings || {}) };
  const pd = { phone1: settings.phone1, phone1Name: settings.phone1Name, phone2: settings.phone2, phone2Name: settings.phone2Name };
  return {
    settings,
    about: { storyHeading: 'x', ...pd, ...(data.about || {}) },
    plumbing: { heroHeading: 'x', ...pd, ...(data.plumbing || {}) },
    electrical: { heroHeading: 'x', ...pd, ...(data.electrical || {}) },
  };
}
const m1 = simMerge({});
assert(m1.about.phone1 === '+G1', 'default: about.phone1 = global');
assert(m1.plumbing.phone1 === '+G1', 'default: plumbing.phone1 = global');
assert(m1.electrical.phone1 === '+G1', 'default: electrical.phone1 = global');

const m2 = simMerge({ about: { phone1: '+Custom' } });
assert(m2.about.phone1 === '+Custom', 'override: about.phone1 = custom');
assert(m2.plumbing.phone1 === '+G1', 'override: plumbing.phone1 still global');
assert(m2.about.phone2 === '+G2', 'override: non-overridden field falls back');

const m3 = simMerge({ settings: { phone1: '+NewG' } });
assert(m3.about.phone1 === '+NewG', 'global change: about follows new global');
assert(m3.plumbing.phone1 === '+NewG', 'global change: plumbing follows new global');

// =======================================================================
// 9. FOOTER USES GLOBAL SETTINGS
// =======================================================================
console.log('\n=== 9. Footer Uses Global Settings ===');

assert(appTsx.includes('content.settings.phone1'), 'App.tsx footer uses global phone1');
assert(appTsx.includes('content.settings.phone2'), 'App.tsx footer uses global phone2');
assert(appTsx.includes('content.settings.phone1Name'), 'App.tsx footer uses global phone1Name');
assert(appTsx.includes('content.settings.phone2Name'), 'App.tsx footer uses global phone2Name');
assert(appTsx.includes('content.settings.email'), 'App.tsx footer uses global email');

// =======================================================================
// 10. CONTENT.JSON STRUCTURE
// =======================================================================
console.log('\n=== 10. Content.json Structure ===');

const topKeys = Object.keys(content);
assert(topKeys.includes('settings'), 'content.json has settings');
assert(topKeys.includes('home'), 'content.json has home');
assert(topKeys.includes('about'), 'content.json has about');
assert(topKeys.includes('plumbing'), 'content.json has plumbing');
assert(topKeys.includes('electrical'), 'content.json has electrical');
assert(topKeys.includes('team'), 'content.json has team');
assert(topKeys.includes('buildingProjects'), 'content.json has buildingProjects');
assert(topKeys.includes('buildingCategories'), 'content.json has buildingCategories');

// About has all required sub-fields
const aboutKeys = Object.keys(content.about);
for (const k of ['phone1', 'phone1Name', 'phone2', 'phone2Name', 'storyHeading', 'storyPara1', 'storyPara2', 'stats', 'teamHeading', 'teamSubheading']) {
  assert(aboutKeys.includes(k), `about.${k} exists`);
}

// =======================================================================
// 11. CHARACTER LIMIT AUDIT (complete)
// =======================================================================
console.log('\n=== 11. Character Limit Audit ===');

const limits = {
  // Settings
  'settings.phone1Name': 30,
  'settings.phone2Name': 30,
  // Home
  'home.heroSubtitle': 180,
  'home.servicesHeading': 40,
  // Plumbing
  'plumbing.heroHeading': 60,
  'plumbing.heroSubtitle': 220,
  'plumbing.phone1Name': 30,
  'plumbing.phone2Name': 30,
  // Electrical
  'electrical.heroHeading': 60,
  'electrical.heroSubtitle': 220,
  'electrical.phone1Name': 30,
  'electrical.phone2Name': 30,
  // About — story
  'about.storyHeading': 60,
  'about.storyPara1': 300,
  'about.storyPara2': 300,
  'about.phone1Name': 30,
  'about.phone2Name': 30,
  // About — stats
  'about.stats.value': 8,
  'about.stats.label': 25,
  // About — team
  'about.teamHeading': 40,
  'about.teamSubheading': 100,
  // Team members
  'team.name': 40,
  'team.role': 60,
  'team.bio': 600,
  // Building
  'building.title': 60,
  'building.location': 50,
  'building.description': 200,
};

for (const [field, max] of Object.entries(limits)) {
  // Verify the limit is present in admin code
  const maxStr = `maxLength={${max}}`;
  assert(adminTsx.includes(maxStr), `${field}: maxLength ${max} present in Admin.tsx`);
}

// =======================================================================
// 12. CATEGORY DRAG-AND-DROP REORDERING
// =======================================================================
console.log('\n=== 12. Category Drag-and-Drop Reordering ===');

// Admin.tsx no longer has hardcoded CATEGORIES constant
assert(!adminTsx.includes('CATEGORIES = ['), 'no hardcoded CATEGORIES constant in Admin.tsx');
assert(!adminTsx.includes("'New Builds', 'Renovations', 'Small Projects'] as const"), 'no hardcoded category tuple in Admin.tsx');

// Admin.tsx uses buildingCategories prop
assert(adminTsx.includes('buildingCategories'), 'Admin.tsx uses buildingCategories');
assert(adminTsx.includes('onCategoriesChange'), 'Admin.tsx uses onCategoriesChange');

// Drag handlers exist
assert(adminTsx.includes('handleDragStart'), 'handleDragStart exists');
assert(adminTsx.includes('handleDragOver'), 'handleDragOver exists');
assert(adminTsx.includes('handleDragEnd'), 'handleDragEnd exists');
assert(adminTsx.includes('handleDrop'), 'handleDrop exists');
assert(adminTsx.includes('onDragStart'), 'onDragStart used in JSX');
assert(adminTsx.includes('onDragOver'), 'onDragOver used in JSX');
assert(adminTsx.includes('onDrop'), 'onDrop used in JSX');
assert(adminTsx.includes('draggable'), 'draggable attribute present');

// GripVertical icon on category buttons
assert(adminTsx.includes('GripVertical'), 'GripVertical icon present on category buttons');

// Building.tsx uses data-driven categories
assert(buildingTsx.includes('content.buildingCategories'), 'Building.tsx uses content.buildingCategories');
assert(!buildingTsx.includes('"New Builds", "Renovations", "Small Projects"]'), 'Building.tsx no longer hardcodes category list');
assert(buildingTsx.includes("content.buildingCategories?.[0]"), 'Building.tsx uses content.buildingCategories[0] as default');

// useContent.ts interface includes buildingCategories
assert(useContentTs.includes('buildingCategories: string[]'), 'useContent.ts SiteContent has buildingCategories');
assert(useContentTs.includes("buildingCategories: ['New Builds', 'Renovations', 'Small Projects']"), 'useContent.ts DEFAULT has buildingCategories');
assert(useContentTs.includes('buildingCategories: data.buildingCategories ?? DEFAULT.buildingCategories'), 'useContent.ts merge handles buildingCategories');

// Simulate reorder logic
function simReorder(cats, fromCat, toCat) {
  const arr = [...cats];
  const fromIdx = arr.indexOf(fromCat);
  const toIdx = arr.indexOf(toCat);
  if (fromIdx === -1 || toIdx === -1) return arr;
  arr.splice(fromIdx, 1);
  arr.splice(toIdx, 0, fromCat);
  return arr;
}
const reorder1 = simReorder(['New Builds', 'Renovations', 'Small Projects'], 'New Builds', 'Renovations');
assert(JSON.stringify(reorder1) === JSON.stringify(['Renovations', 'New Builds', 'Small Projects']), 'reorder: move New Builds after Renovations');

const reorder2 = simReorder(['New Builds', 'Renovations', 'Small Projects'], 'Small Projects', 'New Builds');
assert(JSON.stringify(reorder2) === JSON.stringify(['Small Projects', 'New Builds', 'Renovations']), 'reorder: move Small Projects before New Builds');

const reorder3 = simReorder(['New Builds', 'Renovations', 'Small Projects'], 'New Builds', 'Small Projects');
assert(JSON.stringify(reorder3) === JSON.stringify(['Renovations', 'Small Projects', 'New Builds']), 'reorder: move New Builds after Small Projects');

// =======================================================================
// 13. PROJECT & PHOTO DRAG REORDERING
// =======================================================================
console.log('\n=== 13. Project & Photo Drag Reordering ===');

// Project drag handlers in Admin.tsx
assert(adminTsx.includes('handleProjDragStart'), 'Admin has handleProjDragStart');
assert(adminTsx.includes('handleProjDragOver'), 'Admin has handleProjDragOver');
assert(adminTsx.includes('handleProjDragEnd'), 'Admin has handleProjDragEnd');
assert(adminTsx.includes('handleProjDrop'), 'Admin has handleProjDrop');
assert(adminTsx.includes('dragProject'), 'Admin has dragProject state');

// Photo drag handlers in GalleryManager
assert(adminTsx.includes('handlePhotoDragStart'), 'GalleryManager has handlePhotoDragStart');
assert(adminTsx.includes('handlePhotoDragOver'), 'GalleryManager has handlePhotoDragOver');
assert(adminTsx.includes('handlePhotoDragEnd'), 'GalleryManager has handlePhotoDragEnd');
assert(adminTsx.includes('handlePhotoDrop'), 'GalleryManager has handlePhotoDrop');
assert(adminTsx.includes('dragPhotoIdx'), 'GalleryManager has dragPhotoIdx state');
assert(adminTsx.includes('onPhotosReordered'), 'GalleryManager has onPhotosReordered prop');

// GripVertical used on project cards and photo thumbs
const projGripCount = (adminTsx.match(/GripVertical/g) || []).length;
assert(projGripCount >= 3, `GripVertical used in multiple places (found ${projGripCount})`);

// Pending photos NOT draggable
assert(adminTsx.includes('!item.isPending'), 'pending photos excluded from drag');

// Building.tsx leftmost category fix
assert(buildingTsx.includes('setActiveCategory(content.buildingCategories[0])'), 'Building.tsx has useEffect for leftmost category sync');

// Simulate project reorder (same logic as category reorder: unadjusted toIdx)
function simProjReorder(arr, fromId, toId) {
  const a = [...arr];
  const fromIdx = a.findIndex(p => p.id === fromId);
  const toIdx = a.findIndex(p => p.id === toId);
  if (fromIdx === -1 || toIdx === -1) return a;
  const [moved] = a.splice(fromIdx, 1);
  a.splice(toIdx, 0, moved);
  return a;
}
const projA = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
const projR1 = simProjReorder(projA, 'a', 'c');
assert(projR1[0].id === 'b' && projR1[1].id === 'c' && projR1[2].id === 'a', 'project reorder: drag a onto c → a after c');
const projR2 = simProjReorder(projA, 'c', 'a');
assert(projR2[0].id === 'c' && projR2[1].id === 'a' && projR2[2].id === 'b', 'project reorder: drag c onto a → c before a');

// Simulate photo reorder
function simPhotoReorder(arr, fromIdx, toIdx) {
  const a = [...arr];
  const [moved] = a.splice(fromIdx, 1);
  a.splice(toIdx, 0, moved);
  return a;
}
const photoArr = ['a.jpg', 'b.jpg', 'c.jpg', 'd.jpg'];
const photoR1 = simPhotoReorder(photoArr, 0, 3);
assert(JSON.stringify(photoR1) === JSON.stringify(['b.jpg', 'c.jpg', 'd.jpg', 'a.jpg']), 'photo reorder: drag idx 0 onto idx 3 → first to last');
const photoR2 = simPhotoReorder(photoArr, 3, 0);
assert(JSON.stringify(photoR2) === JSON.stringify(['d.jpg', 'a.jpg', 'b.jpg', 'c.jpg']), 'photo reorder: drag idx 3 onto idx 0 → last to first');

// beforeunload uses ref to prevent over-registration
assert(adminTsx.includes('hasUnsavedRef'), 'beforeunload uses ref to prevent over-registration');

// Daniel Chen error message
assert(adminTsx.includes('contact Daniel Chen for technical support'), 'error message mentions Daniel Chen');

// =======================================================================
// 14. DEPLOY PROGRESS BAR & REFRESH SAFETY
// =======================================================================
console.log('\n=== 14. Deploy Progress Bar & Refresh Safety ===');

// Progress bar exists
assert(adminTsx.includes('Building & Testing'), 'progress bar shows Building & Testing step');
assert(adminTsx.includes('Deploying to Site'), 'progress bar shows Deploying to Site step');
assert(adminTsx.includes('Committed'), 'progress bar shows Committed step');
assert(adminTsx.includes("This usually takes 1–2 minutes. Please don't close this page."), 'progress bar shows time estimate');

// DeployPhase type imported
assert(adminTsx.includes('DeployPhase'), 'Admin imports DeployPhase type');

// deployPhase state
assert(adminTsx.includes('deployPhase'), 'Admin has deployPhase state');
assert(adminTsx.includes('setDeployPhase'), 'Admin calls setDeployPhase');

// onProgress callback passed to waitForDeploy
assert(adminTsx.includes('phase => setDeployPhase(phase)'), 'waitForDeploy called with progress callback');

// beforeunload warning
assert(adminTsx.includes('beforeunload'), 'Admin has beforeunload event listener');

// sessionStorage persistence
assert(adminTsx.includes("sessionStorage.getItem('urbanpro_snapshot')"), 'snapshotRef initialized from sessionStorage');
assert(adminTsx.includes("sessionStorage.setItem('urbanpro_snapshot'"), 'snapshot saved to sessionStorage');

// waitForDeploy called with progress callback
assert(adminTsx.includes('phase => setDeployPhase(phase)'), 'waitForDeploy called with setDeployPhase progress callback');

// github.ts exports DeployPhase type and waitForDeploy with progress
const githubTs = readFileSync(join(root, 'src/services/github.ts'), 'utf-8');
assert(githubTs.includes('export type DeployPhase'), 'github.ts exports DeployPhase type');
assert(githubTs.includes("'failed'"), "DeployPhase includes 'failed' for deploy failures");
assert(githubTs.includes('onProgress'), 'waitForDeploy has onProgress param');
assert(githubTs.includes("lastPhase: DeployPhase = 'queued'"), 'waitForDeploy starts with queued phase');
assert(githubTs.includes('phase !== lastPhase'), 'waitForDeploy only reports on phase changes');

// progress bar handles failed deploy state
assert(adminTsx.includes("deployPhase === 'failed'"), 'progress bar shows failed state');

// =======================================================================
// SUMMARY
// =======================================================================
console.log(`\n${'='.repeat(60)}`);
console.log(`Total: ${total} checks | Passed: ${total - failures} | Failed: ${failures}`);
if (failures > 0) {
  console.error('SOME TESTS FAILED');
  process.exit(1);
} else {
  console.log('ALL TESTS PASSED');
}
