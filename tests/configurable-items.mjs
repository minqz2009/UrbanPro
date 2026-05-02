// Tests for configurable items (guarantees/services/benefits), reviews,
// optional phones, building contact, and ChevronDown removal.
// Run: node tests/configurable-items.mjs

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

const content = JSON.parse(readFileSync(join(root, 'public/data/content.json'), 'utf-8'));
const adminTsx = readFileSync(join(root, 'src/pages/Admin.tsx'), 'utf-8');
const useContentTs = readFileSync(join(root, 'src/hooks/useContent.ts'), 'utf-8');
const plumbingTsx = readFileSync(join(root, 'src/pages/Plumbing.tsx'), 'utf-8');
const electricalTsx = readFileSync(join(root, 'src/pages/Electrical.tsx'), 'utf-8');
const buildingTsx = readFileSync(join(root, 'src/pages/Building.tsx'), 'utf-8');
const appTsx = readFileSync(join(root, 'src/App.tsx'), 'utf-8');
const iconsTsx = readFileSync(join(root, 'src/icons.tsx'), 'utf-8');

console.log('\n=== 1. Content schema additions ===');
for (const section of ['plumbing', 'electrical']) {
  assert(Array.isArray(content[section].guarantees), `${section}.guarantees is array`);
  assert(Array.isArray(content[section].services), `${section}.services is array`);
  assert(Array.isArray(content[section].benefits), `${section}.benefits is array`);
  assert(Array.isArray(content[section].reviews), `${section}.reviews is array`);
  assert(typeof content[section].mapsUrl === 'string', `${section}.mapsUrl is string`);
  for (const list of ['guarantees', 'services', 'benefits']) {
    for (const it of content[section][list]) {
      assert(typeof it.id === 'string' && it.id.length > 0, `${section}.${list} item has id`);
      assert(typeof it.icon === 'string', `${section}.${list} item has icon`);
      assert(typeof it.title === 'string', `${section}.${list} item has title`);
      assert(typeof it.subtitle === 'string', `${section}.${list} item has subtitle`);
    }
  }
}
assert(content.building && typeof content.building === 'object', 'content.building exists');
for (const k of ['phone1','phone1Name','phone2','phone2Name','contactHeading','contactSubtitle']) {
  assert(k in content.building, `content.building.${k} exists`);
}

console.log('\n=== 2. useContent.ts types ===');
assert(useContentTs.includes('export interface ConfigItem'), 'ConfigItem interface exported');
assert(useContentTs.includes('export interface ReviewItem'), 'ReviewItem interface exported');
assert(useContentTs.includes('guarantees: ConfigItem[]'), 'guarantees typed in PlumbingContent');
assert(useContentTs.includes('services: ConfigItem[]'), 'services typed');
assert(useContentTs.includes('benefits: ConfigItem[]'), 'benefits typed');
assert(useContentTs.includes('reviews: ReviewItem[]'), 'reviews typed');
assert(useContentTs.includes('export interface BuildingContent'), 'BuildingContent exported');

console.log('\n=== 3. Icon registry ===');
assert(iconsTsx.includes('export const ICON_MAP'), 'ICON_MAP exported');
assert(iconsTsx.includes('export const ICON_NAMES'), 'ICON_NAMES exported');
assert(iconsTsx.includes('export function Icon'), 'Icon component exported');
// Verify icons referenced in content.json all exist in registry
const allIcons = new Set();
for (const section of ['plumbing', 'electrical']) {
  for (const list of ['guarantees', 'services', 'benefits']) {
    for (const it of content[section][list]) allIcons.add(it.icon);
  }
}
for (const name of allIcons) {
  assert(iconsTsx.includes(`  ${name},`) || iconsTsx.includes(`${name},`), `icon "${name}" registered in icons.tsx`);
}

console.log('\n=== 4. Admin editors ===');
assert(adminTsx.includes('function ConfigItemListEditor'), 'ConfigItemListEditor exists');
assert(adminTsx.includes('function ReviewsEditor'), 'ReviewsEditor exists');
assert(adminTsx.includes('function IconPicker'), 'IconPicker exists');
assert(adminTsx.includes('function BuildingContactEditor'), 'BuildingContactEditor exists');
assert(adminTsx.includes('label="Guarantees"'), 'Guarantees section editor');
assert(adminTsx.includes('label="Services"'), 'Services section editor');
assert(adminTsx.includes('label="Benefits"'), 'Benefits section editor');
// Drag handlers in ConfigItemListEditor
const cilStart = adminTsx.indexOf('function ConfigItemListEditor');
const cilEnd = adminTsx.indexOf('function ReviewsEditor');
const cilBlock = adminTsx.slice(cilStart, cilEnd);
assert(cilBlock.includes('draggable'), 'ConfigItemListEditor uses draggable');
assert(cilBlock.includes('onDragStart'), 'ConfigItemListEditor onDragStart');
assert(cilBlock.includes('onDrop'), 'ConfigItemListEditor onDrop');
assert(cilBlock.includes('GripVertical'), 'ConfigItemListEditor shows grip handle');
assert(cilBlock.includes('IconPicker'), 'ConfigItemListEditor uses IconPicker');
assert(cilBlock.includes('maxLength={titleMax}'), 'ConfigItemListEditor enforces title char limit');
assert(cilBlock.includes('maxLength={subtitleMax}'), 'ConfigItemListEditor enforces subtitle char limit');

console.log('\n=== 5. Pages render from content (not hardcoded) ===');
// fake reviewer names removed from page code
for (const fakeName of ['Sarah M.', 'James T.', 'Michelle K.', 'Tom W.', 'Amy L.']) {
  assert(!plumbingTsx.includes(fakeName), `Plumbing.tsx no longer hardcodes "${fakeName}"`);
  assert(!electricalTsx.includes(fakeName), `Electrical.tsx no longer hardcodes "${fakeName}"`);
}
// Pages reference reviews from content
assert(plumbingTsx.includes('content.plumbing.reviews') || plumbingTsx.includes('plumbing.reviews'), 'Plumbing renders reviews from content');
assert(electricalTsx.includes('content.electrical.reviews') || electricalTsx.includes('electrical.reviews'), 'Electrical renders reviews from content');
// Pages render guarantees/services/benefits from content
assert(plumbingTsx.includes('plumbing.guarantees.map'), 'Plumbing maps guarantees');
assert(plumbingTsx.includes('plumbing.services.map'), 'Plumbing maps services');
assert(plumbingTsx.includes('plumbing.benefits.map'), 'Plumbing maps benefits');
assert(electricalTsx.includes('electrical.guarantees.map'), 'Electrical maps guarantees');
assert(electricalTsx.includes('electrical.services.map'), 'Electrical maps services');
assert(electricalTsx.includes('electrical.benefits.map'), 'Electrical maps benefits');
// Icons used dynamically
assert(plumbingTsx.includes('<Icon name='), 'Plumbing uses dynamic Icon');
assert(electricalTsx.includes('<Icon name='), 'Electrical uses dynamic Icon');

console.log('\n=== 6. ChevronDown removed from Plumbing & Electrical ===');
assert(!plumbingTsx.includes('ChevronDown'), 'Plumbing has no ChevronDown');
assert(!electricalTsx.includes('ChevronDown'), 'Electrical has no ChevronDown');

console.log('\n=== 7. Optional phone handling ===');
// Plumbing/Electrical/Building/About/Footer guard phone tels
assert(plumbingTsx.match(/content\.plumbing\.phone1\s*&&/) || plumbingTsx.match(/phone1\s*&&\s*\{/), 'Plumbing guards phone1');
assert(plumbingTsx.match(/content\.plumbing\.phone2\s*&&/) || plumbingTsx.match(/phone2\s*&&\s*\{/), 'Plumbing guards phone2');
assert(electricalTsx.match(/content\.electrical\.phone1\s*&&/) || electricalTsx.match(/phone1\s*&&\s*\{/), 'Electrical guards phone1');
assert(electricalTsx.match(/content\.electrical\.phone2\s*&&/) || electricalTsx.match(/phone2\s*&&\s*\{/), 'Electrical guards phone2');
assert(buildingTsx.includes('content.building.phone1 &&'), 'Building guards phone1');
assert(buildingTsx.includes('content.building.phone2 &&'), 'Building guards phone2');
assert(appTsx.includes('content.settings.phone1 && ('), 'Footer guards phone1');
assert(appTsx.includes('content.settings.phone2 && ('), 'Footer guards phone2');

console.log('\n=== 8. Building page contact section ===');
assert(buildingTsx.includes('content.building.contactHeading'), 'Building uses contactHeading from content');
assert(buildingTsx.includes('content.building.contactSubtitle'), 'Building uses contactSubtitle from content');
assert(buildingTsx.includes('Call '), 'Building has Call button text');
assert(buildingTsx.includes('PhoneCall'), 'Building imports PhoneCall icon');
// Same-style: ABN + Licence row exists like other pages
assert(buildingTsx.includes('ABN:'), 'Building shows ABN');
assert(buildingTsx.includes('Contractor Licence NO:'), 'Building shows licence');

console.log('\n=== 9a. Review photos + drag ===');
assert(useContentTs.includes('photo: string'), 'ReviewItem has photo field');
const revStart = adminTsx.indexOf('function ReviewsEditor');
const revEnd = adminTsx.indexOf('// ─── Settings Editor');
const revBlock = adminTsx.slice(revStart, revEnd);
assert(revBlock.includes('PhotoUploader'), 'ReviewsEditor uses PhotoUploader');
assert(revBlock.includes('draggable'), 'ReviewsEditor supports drag');
assert(revBlock.includes('GripVertical'), 'ReviewsEditor shows grip handle');
assert(revBlock.includes('onDragStart') && revBlock.includes('onDrop'), 'ReviewsEditor has drag handlers');
assert(adminTsx.includes("id.startsWith('rev-')"), 'handleSave routes review photo uploads');
assert(adminTsx.includes('updated.plumbing.reviews = updated.plumbing.reviews.map'), 'handleSave updates plumbing review photos');
assert(adminTsx.includes('updated.electrical.reviews = updated.electrical.reviews.map'), 'handleSave updates electrical review photos');
assert(adminTsx.includes('for (const r of updated.plumbing.reviews)'), 'safe-delete refs include plumbing reviews');
assert(adminTsx.includes('for (const r of updated.electrical.reviews)'), 'safe-delete refs include electrical reviews');
assert(plumbingTsx.includes('review.photo ?'), 'Plumbing renders review photo when set');
assert(electricalTsx.includes('review.photo ?'), 'Electrical renders review photo when set');

console.log('\n=== 9. Merge fallback for new fields ===');
assert(useContentTs.includes('withDefaults'), 'merge() uses withDefaults helper');
assert(useContentTs.includes('plumbing?.guarantees'), 'merge handles plumbing guarantees');
assert(useContentTs.includes('electrical?.guarantees'), 'merge handles electrical guarantees');

console.log('\n=== 10. overallRating field ===');
assert(useContentTs.includes('overallRating: number'), 'PlumbingContent has overallRating');
assert(useContentTs.includes('overallRating: 4.9'), 'DEFAULT has overallRating default');
assert(useContentTs.includes('overallRating ?? DEFAULT.plumbing.overallRating'), 'merge handles plumbing overallRating');
assert(useContentTs.includes('overallRating ?? DEFAULT.electrical.overallRating'), 'merge handles electrical overallRating');
assert(content.plumbing.overallRating === 4.9, 'content.json plumbing has overallRating');
assert(adminTsx.includes('Overall Rating (e.g. 4.9)'), 'ReviewsEditor has overallRating select');
assert(adminTsx.includes('onOverallRatingChange'), 'ReviewsEditor has onOverallRatingChange prop');
assert(plumbingTsx.includes('plumbing.overallRating'), 'Plumbing page reads overallRating');
assert(electricalTsx.includes('electrical.overallRating'), 'Electrical page reads overallRating');

console.log('\n=== 11. reviewCountLabel field ===');
assert(useContentTs.includes('reviewCountLabel: string'), 'PlumbingContent has reviewCountLabel');
assert(useContentTs.includes("reviewCountLabel: '150+ Google reviews'"), 'DEFAULT plumbing has reviewCountLabel');
assert(useContentTs.includes("reviewCountLabel: '120+ Google reviews'"), 'DEFAULT electrical has reviewCountLabel');
assert(useContentTs.includes('reviewCountLabel ?? DEFAULT.plumbing.reviewCountLabel'), 'merge handles plumbing reviewCountLabel');
assert(useContentTs.includes('reviewCountLabel ?? DEFAULT.electrical.reviewCountLabel'), 'merge handles electrical reviewCountLabel');
assert(content.plumbing.reviewCountLabel === '150+ Google reviews', 'content.json plumbing has reviewCountLabel');
assert(content.electrical.reviewCountLabel === '120+ Google reviews', 'content.json electrical has reviewCountLabel');
assert(adminTsx.includes('Review Count Label'), 'ReviewsEditor has reviewCountLabel input');
assert(adminTsx.includes('onReviewCountLabelChange'), 'ReviewsEditor has onReviewCountLabelChange');
assert(plumbingTsx.includes('plumbing.reviewCountLabel'), 'Plumbing page reads reviewCountLabel');
assert(electricalTsx.includes('electrical.reviewCountLabel'), 'Electrical page reads reviewCountLabel');

console.log('\n=== 12. showReviews toggle field ===');
assert(useContentTs.includes('showReviews: boolean'), 'PlumbingContent has showReviews');
assert(useContentTs.includes('showReviews: true'), 'DEFAULT has showReviews default');
assert(useContentTs.includes('showReviews ?? DEFAULT.plumbing.showReviews'), 'merge handles plumbing showReviews');
assert(useContentTs.includes('showReviews ?? DEFAULT.electrical.showReviews'), 'merge handles electrical showReviews');
assert(typeof content.plumbing.showReviews === 'boolean', 'content.json plumbing has showReviews');
assert(typeof content.electrical.showReviews === 'boolean', 'content.json electrical has showReviews');
assert(adminTsx.includes('Show Reviews Section'), 'ReviewsEditor has showReviews toggle label');
assert(adminTsx.includes('onShowReviewsChange'), 'ReviewsEditor has onShowReviewsChange prop');
assert(plumbingTsx.includes('plumbing.showReviews && plumbing.reviews.length'), 'Plumbing gates reviews on showReviews');
assert(electricalTsx.includes('electrical.showReviews && electrical.reviews.length'), 'Electrical gates reviews on showReviews');

console.log('\n=== 13. imgStyle editor field ===');
assert(adminTsx.includes('updateImgStyle'), 'TeamMemberCards has updateImgStyle handler');
assert(adminTsx.includes('Transform Origin'), 'TeamMemberCards has transformOrigin input');
assert(adminTsx.includes('Transform (CSS)'), 'TeamMemberCards has transform input');

console.log('\n=== 14. Filename collision fix ===');
const githubTs = readFileSync(join(root, 'src/services/github.ts'), 'utf-8');
assert(githubTs.includes('random()'), 'sanitiseFilename uses Math.random() for uniqueness');

console.log('\n=== 15. Atomic content load ===');
assert(adminTsx.includes('getHeadSha(tok)'), 'loadContent fetches HEAD SHA first');
assert(adminTsx.includes('getFile(tok, CONTENT_PATH, headSha)'), 'loadContent passes headSha to getFile');

// =======================================================================
console.log(`\n${'='.repeat(60)}`);
console.log(`Total: ${total} | Passed: ${total - failures} | Failed: ${failures}`);
if (failures > 0) { console.error('SOME TESTS FAILED'); process.exit(1); }
else console.log('ALL TESTS PASSED');
