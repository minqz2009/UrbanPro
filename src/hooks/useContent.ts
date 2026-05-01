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

export interface PlumbingContent extends PagePhones {
  heroHeading: string;
  heroSubtitle: string;
}

export interface ElectricalContent extends PagePhones {
  heroHeading: string;
  heroSubtitle: string;
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
  },
  electrical: {
    phone1: DEFAULT_SETTINGS.phone1,
    phone1Name: DEFAULT_SETTINGS.phone1Name,
    phone2: DEFAULT_SETTINGS.phone2,
    phone2Name: DEFAULT_SETTINGS.phone2Name,
    heroHeading: 'Expert Electrical Solutions',
    heroSubtitle: 'Safe, efficient, and innovative electrical services. From rapid fault-finding to complete smart home installations, we keep the lights on.',
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
    },
    electrical: {
      ...DEFAULT.electrical,
      ...pagePhoneDefaults,
      ...(data.electrical || {}),
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
