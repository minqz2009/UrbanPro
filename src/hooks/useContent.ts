import { useState, useEffect } from 'react';

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
  category: string;
  pano: string;
}

export interface SiteContent {
  team: TeamMember[];
  buildingProjects: BuildingProject[];
}

const DEFAULT: SiteContent = { team: [], buildingProjects: [] };

// Module-level cache so components sharing the hook don't double-fetch
let _cache: SiteContent | null = null;

export function bustContentCache() {
  _cache = null;
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
      .then((data: SiteContent) => {
        _cache = data;
        setContent(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return { content, loading };
}
