import { useState, useEffect } from 'react';

export interface SiteSettings {
  phone1: string;
  phone1Name: string;
  phone2: string;
  phone2Name: string;
  email: string;
  abn: string;
  licence: string;
}

export interface StatItem { value: string; label: string; }

export interface HomeContent {
  heroSubtitle: string;
  servicesHeading: string;
}

export interface PagePhones {
  phone1: string;
  phone1Name: string;
  phone2: string;
  phone2Name: string;
}

export interface AboutContent extends PagePhones {
  storyHeading: string;
  storyPara1: string;
  storyPara2: string;
  stats: StatItem[];
  teamHeading: string;
  teamSubheading: string;
}

// Configurable card item used for guarantees, services, benefits.
export interface ConfigItem {
  id: string;
  icon: string;       // name from ICON_MAP
  title: string;      // primary label
  subtitle: string;   // secondary label (optional usage per section)
}

export interface ReviewItem {
  id: string;
  name: string;
  initials: string;
  rating: number;
  date: string;
  text: string;
  photo: string;
}

export interface PlumbingContent extends PagePhones {
  heroHeading: string;
  heroSubtitle: string;
  guarantees: ConfigItem[];
  services: ConfigItem[];
  benefits: ConfigItem[];
  reviews: ReviewItem[];
  mapsUrl: string;
  overallRating: number;
  reviewCountLabel: string;
  showReviews: boolean;
}

export interface ElectricalContent extends PagePhones {
  heroHeading: string;
  heroSubtitle: string;
  guarantees: ConfigItem[];
  services: ConfigItem[];
  benefits: ConfigItem[];
  reviews: ReviewItem[];
  mapsUrl: string;
  overallRating: number;
  reviewCountLabel: string;
  showReviews: boolean;
}

export interface BuildingContent extends PagePhones {
  heroLine1: string;
  heroLine2: string;
  heroSubtitle: string;
  contactHeading: string;
  contactSubtitle: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  photo: string;
  imgStyle: Record<string, string> | null;
}

export interface BuildingProject {
  id: string;
  title: string;
  location: string;
  description: string;
  image: string;
  photos: string[];
  beforePhotos: string[];
  floorPlanBefore: string;
  floorPlanAfter: string;
  category: string;
  pano: string;
}

export interface SiteContent {
  settings: SiteSettings;
  home: HomeContent;
  about: AboutContent;
  plumbing: PlumbingContent;
  electrical: ElectricalContent;
  building: BuildingContent;
  team: TeamMember[];
  buildingProjects: BuildingProject[];
  buildingCategories: string[];
}

const DEFAULT_SETTINGS: SiteSettings = {
  phone1: '+61412242997',
  phone1Name: 'John',
  phone2: '+61426051275',
  phone2Name: 'Leo',
  email: 'service@urbanproplumbing.com.au',
  abn: '48 694 251 888',
  licence: '280492C',
};

const PLUMBING_GUARANTEES: ConfigItem[] = [
  { id: 'pg1', icon: 'BadgeDollarSign', title: 'NO CALL OUT FEE', subtitle: 'Transparent honest pricing' },
  { id: 'pg2', icon: 'Wrench', title: '$250 FIXED RATE', subtitle: 'Drain cleaning special' },
  { id: 'pg3', icon: 'ShieldCheck', title: 'NO FIX NO PAY', subtitle: 'Our ultimate guarantee' },
];

const PLUMBING_SERVICES: ConfigItem[] = [
  { id: 'ps1', icon: 'Wrench', title: 'General Plumbing', subtitle: '' },
  { id: 'ps2', icon: 'ShowerHead', title: 'Hot Water', subtitle: '' },
  { id: 'ps3', icon: 'Flame', title: 'Gas Heating', subtitle: '' },
  { id: 'ps4', icon: 'Waves', title: 'Blockages', subtitle: '' },
  { id: 'ps5', icon: 'Droplets', title: 'Water Leak Detection', subtitle: '' },
];

const PLUMBING_BENEFITS: ConfigItem[] = [
  { id: 'pb1', icon: 'CheckCircle', title: 'Fully Licensed & Insured Plumbers', subtitle: '' },
  { id: 'pb2', icon: 'CheckCircle', title: 'No Call Out Fees', subtitle: '' },
  { id: 'pb3', icon: 'CheckCircle', title: 'Fixed $250 limit for Drain Cleaning', subtitle: '' },
  { id: 'pb4', icon: 'CheckCircle', title: 'No Fix No Pay Guarantee', subtitle: '' },
  { id: 'pb5', icon: 'CheckCircle', title: 'Fast Emergency 24/7 Deployment', subtitle: '' },
  { id: 'pb6', icon: 'CheckCircle', title: 'Commercial & Domestic Coverage', subtitle: '' },
];

const ELECTRICAL_GUARANTEES: ConfigItem[] = [
  { id: 'eg1', icon: 'Shield', title: 'LIFETIME WORKMANSHIP', subtitle: 'On all electrical services' },
  { id: 'eg2', icon: 'BadgeDollarSign', title: 'FIXED UPFRONT PRICING', subtitle: 'No hidden costs promised' },
  { id: 'eg3', icon: 'Zap', title: 'MASTER ELECTRICIANS', subtitle: "Sydney's finest technicians" },
];

const ELECTRICAL_SERVICES: ConfigItem[] = [
  { id: 'es1', icon: 'Activity', title: 'Residential Wiring', subtitle: '' },
  { id: 'es2', icon: 'Lightbulb', title: 'Lighting Installation', subtitle: '' },
  { id: 'es3', icon: 'Shield', title: 'Switchboard Upgrades', subtitle: '' },
  { id: 'es4', icon: 'Search', title: 'Fault Diagnostics', subtitle: '' },
  { id: 'es5', icon: 'BatteryCharging', title: 'EV Chargers', subtitle: '' },
  { id: 'es6', icon: 'Power', title: 'Home Automation', subtitle: '' },
];

const ELECTRICAL_BENEFITS: ConfigItem[] = [
  { id: 'eb1', icon: 'CheckCircle', title: 'Fully Licensed Master Electricians', subtitle: '' },
  { id: 'eb2', icon: 'CheckCircle', title: 'Transparent Upfront Pricing', subtitle: '' },
  { id: 'eb3', icon: 'CheckCircle', title: 'Latest Diagnostics Technology', subtitle: '' },
  { id: 'eb4', icon: 'CheckCircle', title: 'Clean & Respectful Team', subtitle: '' },
];

const DEFAULT_MAPS_URL = 'https://www.google.com/maps/place/UrbanPro+Plumbing+Sydney/@-33.8461026,150.3081854,10z/data=!4m15!1m8!3m7!1s0xaa99133edb90a697:0xe93f25ae63342f5d!2sUrbanPro+Plumbing+Sydney!8m2!3d-33.8482439!4d150.9319747!10e1!16s%2Fg%2F11n4td_svt';

const DEFAULT: SiteContent = {
  settings: DEFAULT_SETTINGS,
  home: {
    heroSubtitle: "Sydney's all-in-one property specialists — architecture, plumbing & electrical under one uncompromising standard.",
    servicesHeading: 'Our Capabilities',
  },
  about: {
    phone1: DEFAULT_SETTINGS.phone1,
    phone1Name: DEFAULT_SETTINGS.phone1Name,
    phone2: DEFAULT_SETTINGS.phone2,
    phone2Name: DEFAULT_SETTINGS.phone2Name,
    storyHeading: 'Serving Greater Sydney Since 2015',
    storyPara1: 'Urban Pro Plumbing was founded with a straightforward mission: give Sydney homeowners and businesses access to reliable, honest plumbing without the runaround.',
    storyPara2: 'Led by John Zhao and Leo, our team brings decades of combined experience to every job — from emergency burst pipes at midnight to full bathroom renovations. We show up on time, price fairly, and never leave until the work is done right.',
    stats: [
      { value: '10+', label: 'Years in Sydney' },
      { value: '500+', label: 'Happy Customers' },
      { value: '24/7', label: 'Emergency Service' },
      { value: '100%', label: 'Licensed & Insured' },
    ],
    teamHeading: 'Meet the Team',
    teamSubheading: 'Three experienced tradespeople. One shared commitment to doing the job right.',
  },
  plumbing: {
    phone1: DEFAULT_SETTINGS.phone1,
    phone1Name: DEFAULT_SETTINGS.phone1Name,
    phone2: DEFAULT_SETTINGS.phone2,
    phone2Name: DEFAULT_SETTINGS.phone2Name,
    heroHeading: 'Expert Plumbing Solutions',
    heroSubtitle: 'Fast, reliable, and upfront pricing. From emergency blockages to full renovations, we solve your plumbing problems without the guesswork.',
    guarantees: PLUMBING_GUARANTEES,
    services: PLUMBING_SERVICES,
    benefits: PLUMBING_BENEFITS,
    reviews: [],
    overallRating: 4.9,
    reviewCountLabel: '150+ Google reviews',
    showReviews: true,
    mapsUrl: DEFAULT_MAPS_URL,
  },
  electrical: {
    phone1: DEFAULT_SETTINGS.phone1,
    phone1Name: DEFAULT_SETTINGS.phone1Name,
    phone2: DEFAULT_SETTINGS.phone2,
    phone2Name: DEFAULT_SETTINGS.phone2Name,
    heroHeading: 'Expert Electrical Solutions',
    heroSubtitle: 'Safe, efficient, and innovative electrical services. From rapid fault-finding to complete smart home installations, we keep the lights on.',
    guarantees: ELECTRICAL_GUARANTEES,
    services: ELECTRICAL_SERVICES,
    benefits: ELECTRICAL_BENEFITS,
    reviews: [],
    overallRating: 4.9,
    reviewCountLabel: '120+ Google reviews',
    showReviews: true,
    mapsUrl: DEFAULT_MAPS_URL,
  },
  building: {
    phone1: DEFAULT_SETTINGS.phone1,
    phone1Name: DEFAULT_SETTINGS.phone1Name,
    phone2: DEFAULT_SETTINGS.phone2,
    phone2Name: DEFAULT_SETTINGS.phone2Name,
    heroLine1: 'Spaces of',
    heroLine2: 'Distinction',
    heroSubtitle: "We don't just build walls. We construct lifestyles. From full-scale New Home Builds, to masterly executed Renovations, and precise Small Projects (carpentry, ceilings, specialized fixes). We handle everything end-to-end.",
    contactHeading: 'Ready to Build?',
    contactSubtitle: "Transform your vision into reality with Sydney's most trusted architects and builders.",
  },
  team: [],
  buildingProjects: [],
  buildingCategories: ['New Builds', 'Renovations', 'Small Projects'],
};

// Module-level cache so components sharing the hook don't double-fetch
let _cache: SiteContent | null = null;

export function bustContentCache() {
  _cache = null;
}

function withDefaults<T extends ConfigItem>(items: T[] | undefined, fallback: ConfigItem[]): ConfigItem[] {
  if (!items) return fallback;
  return items.map(it => ({ id: it.id, icon: it.icon || 'CheckCircle', title: it.title || '', subtitle: it.subtitle || '' }));
}

function sanitizeReviews(items: ReviewItem[] | undefined): ReviewItem[] {
  if (!items?.length) return [];
  return items.map(r => ({
    id: r.id || '',
    name: r.name || '',
    initials: r.initials || (r.name ? r.name.trim().split(/\s+/).map(p => p[0] || '').join('').slice(0, 2).toUpperCase() : ''),
    rating: typeof r.rating === 'number' && r.rating >= 1 && r.rating <= 5 ? r.rating : 5,
    date: r.date || '',
    text: r.text || '',
    photo: r.photo || '',
  }));
}

export function merge(data: Partial<SiteContent>): SiteContent {
  // Resolve settings first so per-page phones can fall back to them
  const settings: SiteSettings = { ...DEFAULT_SETTINGS, ...(data.settings || {}) };

  const pagePhoneDefaults: PagePhones = {
    phone1: settings.phone1,
    phone1Name: settings.phone1Name,
    phone2: settings.phone2,
    phone2Name: settings.phone2Name,
  };

  return {
    settings,
    home: { ...DEFAULT.home, ...(data.home || {}) },
    about: {
      ...DEFAULT.about,
      ...pagePhoneDefaults,
      ...(data.about || {}),
      stats: data.about?.stats ?? DEFAULT.about.stats,
    },
    plumbing: {
      ...DEFAULT.plumbing,
      ...pagePhoneDefaults,
      ...(data.plumbing || {}),
      guarantees: withDefaults(data.plumbing?.guarantees, DEFAULT.plumbing.guarantees),
      services: withDefaults(data.plumbing?.services, DEFAULT.plumbing.services),
      benefits: withDefaults(data.plumbing?.benefits, DEFAULT.plumbing.benefits),
      reviews: sanitizeReviews(data.plumbing?.reviews ?? DEFAULT.plumbing.reviews),
      overallRating: data.plumbing?.overallRating ?? DEFAULT.plumbing.overallRating,
      reviewCountLabel: data.plumbing?.reviewCountLabel ?? DEFAULT.plumbing.reviewCountLabel,
      showReviews: data.plumbing?.showReviews ?? DEFAULT.plumbing.showReviews,
      mapsUrl: data.plumbing?.mapsUrl ?? DEFAULT.plumbing.mapsUrl,
    },
    electrical: {
      ...DEFAULT.electrical,
      ...pagePhoneDefaults,
      ...(data.electrical || {}),
      guarantees: withDefaults(data.electrical?.guarantees, DEFAULT.electrical.guarantees),
      services: withDefaults(data.electrical?.services, DEFAULT.electrical.services),
      benefits: withDefaults(data.electrical?.benefits, DEFAULT.electrical.benefits),
      reviews: sanitizeReviews(data.electrical?.reviews ?? DEFAULT.electrical.reviews),
      overallRating: data.electrical?.overallRating ?? DEFAULT.electrical.overallRating,
      reviewCountLabel: data.electrical?.reviewCountLabel ?? DEFAULT.electrical.reviewCountLabel,
      showReviews: data.electrical?.showReviews ?? DEFAULT.electrical.showReviews,
      mapsUrl: data.electrical?.mapsUrl ?? DEFAULT.electrical.mapsUrl,
    },
    building: {
      ...DEFAULT.building,
      ...pagePhoneDefaults,
      ...(data.building || {}),
      heroLine1: data.building?.heroLine1 ?? DEFAULT.building.heroLine1,
      heroLine2: data.building?.heroLine2 ?? DEFAULT.building.heroLine2,
      heroSubtitle: data.building?.heroSubtitle ?? DEFAULT.building.heroSubtitle,
    },
    team: data.team ?? DEFAULT.team,
    buildingProjects: (data.buildingProjects ?? DEFAULT.buildingProjects).map(p => ({
      ...p,
      photos: p.photos ?? [],
      beforePhotos: p.beforePhotos ?? [],
      floorPlanBefore: p.floorPlanBefore ?? '',
      floorPlanAfter: p.floorPlanAfter ?? '',
    })),
    buildingCategories: data.buildingCategories ?? DEFAULT.buildingCategories,
  };
}

export function useContent() {
  const [content, setContent] = useState<SiteContent>(_cache || DEFAULT);
  const [loading, setLoading] = useState(!_cache);

  useEffect(() => {
    if (_cache) {
      setContent(_cache);
      setLoading(false);
      return;
    }
    fetch('/data/content.json')
      .then(r => {
        if (!r.ok) throw new Error('not found');
        return r.json();
      })
      .then((data: Partial<SiteContent>) => {
        const merged = merge(data);
        _cache = merged;
        setContent(merged);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return { content, loading };
}
