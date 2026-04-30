import { useState, useRef, useEffect, useMemo } from 'react';
import { Plus, Trash2, Upload, LogOut, Save, Eye, EyeOff, ChevronDown, ChevronUp, GripVertical, X } from 'lucide-react';
import {
  verifyToken,
  getFile,
  batchCommit,
  readFileAsBase64,
  sanitiseFilename,
} from '../services/github';
import { bustContentCache, merge } from '../hooks/useContent';
import type { SiteContent, TeamMember, BuildingProject } from '../hooks/useContent';

// ─── Constants ────────────────────────────────────────────────────────────────

const SESSION_KEY = 'urbanpro_admin_token';
const CONTENT_PATH = 'public/data/content.json';
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];
const MAX_MB = 25;

function saveToken(t: string) { sessionStorage.setItem(SESSION_KEY, t); }
function loadToken() { return sessionStorage.getItem(SESSION_KEY) || ''; }
function clearToken() { sessionStorage.removeItem(SESSION_KEY); }

function validatePhoto(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) return `Unsupported format. Use JPG, PNG, WEBP, or AVIF.`;
  if (file.size > MAX_MB * 1024 * 1024) return `Too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Max is ${MAX_MB} MB.`;
  return null;
}

type NavTab = 'settings' | 'home' | 'plumbing' | 'electrical' | 'about' | 'building';

// ─── Shared styles ────────────────────────────────────────────────────────────

const S = {
  page: { minHeight: '100vh', backgroundColor: '#0b1220', color: '#e2e8f0', fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' } as React.CSSProperties,
  input: { width: '100%', padding: '0.7rem 0.9rem', backgroundColor: '#1e293b', color: '#e2e8f0', border: '1px solid #334155', borderRadius: '6px', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' as const, fontFamily: 'inherit' } as React.CSSProperties,
  textarea: { width: '100%', padding: '0.7rem 0.9rem', backgroundColor: '#1e293b', color: '#e2e8f0', border: '1px solid #334155', borderRadius: '6px', fontSize: '0.95rem', outline: 'none', resize: 'vertical' as const, minHeight: '100px', boxSizing: 'border-box' as const, fontFamily: 'inherit', lineHeight: 1.6 } as React.CSSProperties,
  label: { display: 'block', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: '#94a3b8', marginBottom: '0.4rem' } as React.CSSProperties,
  card: { backgroundColor: '#131f35', border: '1px solid #1e3a5f', borderRadius: '10px', padding: '1.5rem', marginBottom: '1.25rem' } as React.CSSProperties,
  btnPrimary: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'inherit' } as React.CSSProperties,
  btnDanger: { display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.75rem', backgroundColor: 'transparent', color: '#f87171', border: '1px solid #7f1d1d', borderRadius: '5px', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'inherit' } as React.CSSProperties,
  btnGhost: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', backgroundColor: 'transparent', color: '#94a3b8', border: '1px solid #334155', borderRadius: '6px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'inherit' } as React.CSSProperties,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function CharCount({ value, max }: { value: string; max: number }) {
  const len = value.length;
  const pct = len / max;
  const color = pct >= 1 ? '#ef4444' : pct >= 0.85 ? '#f59e0b' : '#475569';
  return <div style={{ textAlign: 'right', fontSize: '0.7rem', color, marginTop: '0.3rem', fontVariantNumeric: 'tabular-nums' }}>{len} / {max}</div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div style={{ marginBottom: '1.25rem' }}><label style={S.label}>{label}</label>{children}</div>;
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#60a5fa', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid #1e3a5f' }}>{children}</h3>;
}

// ─── Photo Uploader (single) ──────────────────────────────────────────────────

function PhotoUploader({ currentSrc, previewDataUrl, onFileSelected, label = 'Photo', onError }: {
  currentSrc: string; previewDataUrl: string | null; onFileSelected: (file: File, preview: string) => void; label?: string; onError?: (msg: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleFile = (file: File) => {
    const err = validatePhoto(file);
    if (err) { onError?.(err); return; }
    const reader = new FileReader();
    reader.onload = e => onFileSelected(file, e.target?.result as string);
    reader.readAsDataURL(file);
  };
  const displayed = previewDataUrl || currentSrc;
  return (
    <div>
      <label style={S.label}>{label}</label>
      <div onClick={() => inputRef.current?.click()} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
        style={{ width: '100px', height: '100px', borderRadius: '8px', overflow: 'hidden', border: '2px dashed #334155', cursor: 'pointer', position: 'relative', backgroundColor: '#1e293b', flexShrink: 0 }}>
        {displayed ? <img src={displayed} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} /> : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#475569', fontSize: '0.7rem', gap: '0.4rem' }}><Upload size={20} />Upload</div>
        )}
      </div>
      {previewDataUrl && <p style={{ fontSize: '0.72rem', color: '#22c55e', marginTop: '0.4rem' }}>New photo ready — will upload on save</p>}
      <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
    </div>
  );
}

// ─── Gallery Photo Manager ────────────────────────────────────────────────────

function GalleryManager({ projectId, photos, previews, onPhotoQueued, onRemoveExisting, onRemovePending, pendingKeys }: {
  projectId: string; photos: string[]; previews: Record<string, string>; onPhotoQueued: (key: string, file: File, preview: string) => void;
  onRemoveExisting: (idx: number) => void; onRemovePending: (key: string) => void; pendingKeys: string[];
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [err, setErr] = useState('');

  const handleFiles = (files: FileList) => {
    setErr('');
    Array.from(files).forEach(file => {
      const e = validatePhoto(file);
      if (e) { setErr(e); return; }
      const key = `${projectId}-gallery-${Date.now()}-${Math.random()}`;
      const reader = new FileReader();
      reader.onload = ev => onPhotoQueued(key, file, ev.target?.result as string);
      reader.readAsDataURL(file);
    });
  };

  const allItems: { src: string; key: string; isPending: boolean; idx?: number }[] = [
    ...photos.map((src, idx) => ({ src, key: `existing-${idx}`, isPending: false, idx })),
    ...pendingKeys.map(k => ({ src: previews[k], key: k, isPending: true })),
  ];

  return (
    <div>
      <label style={S.label}>Gallery Photos (shown when visitors click this project)</label>
      <p style={{ fontSize: '0.78rem', color: '#475569', marginBottom: '0.75rem' }}>
        Max {MAX_MB} MB · JPG, PNG, WEBP, AVIF. First photo shown as thumbnail if no cover photo.
      </p>
      {err && <p style={{ fontSize: '0.8rem', color: '#f87171', marginBottom: '0.5rem' }}>{err}</p>}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
        {allItems.map(item => (
          <div key={item.key} style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '6px', overflow: 'hidden', border: `2px solid ${item.isPending ? '#22c55e' : '#1e3a5f'}`, flexShrink: 0 }}>
            <img src={item.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <button onClick={() => item.isPending ? onRemovePending(item.key) : onRemoveExisting(item.idx!)}
              style={{ position: 'absolute', top: '2px', right: '2px', backgroundColor: 'rgba(0,0,0,0.7)', border: 'none', color: 'white', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', borderRadius: '50%', padding: 0 }}>
              <X size={12} />
            </button>
            {item.isPending && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(34,197,94,0.8)', fontSize: '0.55rem', textAlign: 'center', color: 'white', fontWeight: 700, padding: '1px' }}>NEW</div>}
          </div>
        ))}
        <button onClick={() => inputRef.current?.click()}
          style={{ width: '80px', height: '80px', borderRadius: '6px', border: '2px dashed #334155', backgroundColor: '#1e293b', color: '#475569', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: '0.3rem', fontSize: '0.65rem', fontFamily: 'inherit' }}>
          <Plus size={18} />Add
        </button>
      </div>
      <input ref={inputRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={e => { if (e.target.files) handleFiles(e.target.files); e.target.value = ''; }} />
    </div>
  );
}

// ─── Projects Editor ──────────────────────────────────────────────────────────

function ProjectsEditor({ projects, onChange, onPhotoQueued, photoPreviews, onGalleryQueued, onRemoveGalleryExisting, onRemoveGalleryPending, pendingGalleryKeys, dirtyCategories, buildingCategories, onCategoriesChange }: {
  projects: BuildingProject[]; onChange: (p: BuildingProject[]) => void;
  onPhotoQueued: (id: string, file: File, preview: string) => void; photoPreviews: Record<string, string>;
  onGalleryQueued: (key: string, file: File, preview: string) => void;
  onRemoveGalleryExisting: (projectId: string, idx: number) => void; onRemoveGalleryPending: (key: string) => void;
  pendingGalleryKeys: (projectId: string) => string[];
  dirtyCategories: Set<string>;
  buildingCategories: string[]; onCategoriesChange: (cats: string[]) => void;
}) {
  const [activeCategory, setActiveCategory] = useState<string>(buildingCategories[0] || 'New Builds');
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [photoErr, setPhotoErr] = useState<Record<string, string>>({});
  const [dragCat, setDragCat] = useState<string | null>(null);

  const update = (id: string, field: keyof BuildingProject, value: string) => onChange(projects.map(p => p.id === id ? { ...p, [field]: value } : p));
  const remove = (id: string) => { if (!confirm('Remove this project?')) return; onChange(projects.filter(p => p.id !== id)); };
  const add = () => { const id = `project-${Date.now()}`; onChange([...projects, { id, title: 'New Project', location: '', description: '', image: '', photos: [], category: activeCategory, pano: '' }]); };
  const visible = projects.filter(p => p.category === activeCategory);

  const handleDragStart = (e: React.DragEvent, cat: string) => {
    setDragCat(cat);
    e.dataTransfer.setData('text/plain', cat);
    e.dataTransfer.effectAllowed = 'move';
  };
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; };
  const handleDragEnd = () => { setDragCat(null); };
  const handleDrop = (e: React.DragEvent, targetCat: string) => {
    e.preventDefault();
    const draggedCat = e.dataTransfer.getData('text/plain');
    if (!draggedCat || draggedCat === targetCat) { setDragCat(null); return; }
    const cats = [...buildingCategories];
    const fromIdx = cats.indexOf(draggedCat);
    const toIdx = cats.indexOf(targetCat);
    if (fromIdx === -1 || toIdx === -1) { setDragCat(null); return; }
    cats.splice(fromIdx, 1);
    cats.splice(toIdx, 0, draggedCat);
    onCategoriesChange(cats);
    setDragCat(null);
  };

  return (
    <div>
      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>Manage the exhibition gallery on the Building page. Each project can have a cover photo, multiple gallery photos, and an optional 360° panorama link.</p>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {buildingCategories.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            draggable onDragStart={e => handleDragStart(e, cat)} onDragOver={handleDragOver} onDragEnd={handleDragEnd} onDrop={e => handleDrop(e, cat)}
            style={{ padding: '0.5rem 1.1rem', borderRadius: '20px', border: 'none', fontWeight: 600, fontSize: '0.82rem', cursor: 'grab', fontFamily: 'inherit', backgroundColor: activeCategory === cat ? '#3b82f6' : '#1e293b', color: activeCategory === cat ? 'white' : '#94a3b8', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', opacity: dragCat === cat ? 0.5 : 1, transition: 'opacity 0.15s' }}>
            <GripVertical size={12} color={activeCategory === cat ? 'rgba(255,255,255,0.5)' : '#475569'} style={{ flexShrink: 0, cursor: 'grab' }} />
            {dirtyCategories.has(cat) && <span style={{ color: '#f59e0b', marginRight: '0.25rem', fontSize: '0.65rem' }}>●</span>}
            {cat} ({projects.filter(p => p.category === cat).length})
          </button>
        ))}
      </div>
      {visible.length === 0 && <div style={{ textAlign: 'center', padding: '2rem', color: '#475569', border: '1px dashed #1e3a5f', borderRadius: '8px', marginBottom: '1rem' }}>No projects yet. Add one below.</div>}
      {visible.map(p => {
        const open = !collapsed[p.id];
        return (
          <div key={p.id} style={S.card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }} onClick={() => setCollapsed(c => ({ ...c, [p.id]: !c[p.id] }))}>
              <div style={{ width: '52px', height: '40px', borderRadius: '4px', overflow: 'hidden', flexShrink: 0, backgroundColor: '#1e293b', border: '1px solid #1e3a5f' }}>
                {(photoPreviews[p.id] || p.image) && <img src={photoPreviews[p.id] || p.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
              </div>
              <div style={{ flex: 1 }}><div style={{ fontWeight: 700, color: 'white' }}>{p.title || 'Untitled'}</div><div style={{ fontSize: '0.8rem', color: '#64748b' }}>{p.location || 'No location'}</div></div>
              {open ? <ChevronUp size={18} color="#475569" /> : <ChevronDown size={18} color="#475569" />}
            </div>
            {open && (
              <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {photoErr[p.id] && <p style={{ color: '#f87171', fontSize: '0.8rem', margin: 0 }}>{photoErr[p.id]}</p>}
                <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
                  <PhotoUploader currentSrc={p.image} previewDataUrl={photoPreviews[p.id] || null} label="Cover Photo"
                    onFileSelected={(file, preview) => { setPhotoErr(e => ({ ...e, [p.id]: '' })); onPhotoQueued(p.id, file, preview); }}
                    onError={msg => setPhotoErr(e => ({ ...e, [p.id]: msg }))} />
                  <div style={{ flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    <Field label="Project Title">
                      <input style={S.input} value={p.title} maxLength={60} onChange={e => update(p.id, 'title', e.target.value)} placeholder="e.g. The Glass House" />
                      <CharCount value={p.title} max={60} />
                    </Field>
                    <Field label="Location">
                      <input style={S.input} value={p.location} maxLength={50} onChange={e => update(p.id, 'location', e.target.value)} placeholder="e.g. Vaucluse, NSW" />
                      <CharCount value={p.location} max={50} />
                    </Field>
                    <Field label="Category">
                      <select style={{ ...S.input, cursor: 'pointer' }} value={p.category} onChange={e => update(p.id, 'category', e.target.value)}>
                        {buildingCategories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </Field>
                  </div>
                </div>
                <Field label="Project Description">
                  <textarea style={S.textarea} value={p.description} maxLength={200} onChange={e => update(p.id, 'description', e.target.value)} rows={3} placeholder="Describe the project..." />
                  <CharCount value={p.description} max={200} />
                </Field>
                <GalleryManager
                  projectId={p.id}
                  photos={p.photos || []}
                  previews={photoPreviews}
                  onPhotoQueued={onGalleryQueued}
                  onRemoveExisting={idx => onRemoveGalleryExisting(p.id, idx)}
                  onRemovePending={onRemoveGalleryPending}
                  pendingKeys={pendingGalleryKeys(p.id)}
                />
                <Field label="360° Panorama Link (optional)">
                  <input style={S.input} value={p.pano} onChange={e => update(p.id, 'pano', e.target.value)} placeholder="https://..." />
                  <p style={{ fontSize: '0.72rem', color: '#475569', marginTop: '0.3rem' }}>Paste a 360° panorama image URL. If provided, a "360° Panorama" button appears in the gallery.</p>
                </Field>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button style={S.btnDanger} onClick={() => remove(p.id)}><Trash2 size={14} /> Remove Project</button>
                </div>
              </div>
            )}
          </div>
        );
      })}
      <button style={{ ...S.btnGhost, width: '100%', justifyContent: 'center', padding: '0.85rem' }} onClick={add}><Plus size={16} /> Add Project to "{activeCategory}"</button>
    </div>
  );
}

// ─── Settings Editor ──────────────────────────────────────────────────────────

function SettingsEditor({ content, onChange }: { content: SiteContent; onChange: (c: SiteContent) => void }) {
  const s = content.settings;
  const set = (field: keyof typeof s, value: string) => onChange({ ...content, settings: { ...s, [field]: value } });
  return (
    <div>
      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>Business contact details shown in the website footer (the very bottom of every page). Phone numbers here are also the defaults for per-page contact buttons — each page can override them with different numbers.</p>
      <SectionHeading>Contact Information</SectionHeading>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <Field label="Phone 1 — Number">
          <input style={S.input} value={s.phone1} onChange={e => set('phone1', e.target.value)} placeholder="+61412242997" />
        </Field>
        <Field label="Phone 1 — Display Name">
          <input style={S.input} value={s.phone1Name} maxLength={30} onChange={e => set('phone1Name', e.target.value)} placeholder="John" />
          <CharCount value={s.phone1Name} max={30} />
        </Field>
        <Field label="Phone 2 — Number">
          <input style={S.input} value={s.phone2} onChange={e => set('phone2', e.target.value)} placeholder="+61426051275" />
        </Field>
        <Field label="Phone 2 — Display Name">
          <input style={S.input} value={s.phone2Name} maxLength={30} onChange={e => set('phone2Name', e.target.value)} placeholder="Leo" />
          <CharCount value={s.phone2Name} max={30} />
        </Field>
      </div>
      <Field label="Email Address">
        <input style={S.input} type="email" value={s.email} onChange={e => set('email', e.target.value)} placeholder="service@example.com.au" />
      </Field>
      <SectionHeading>Business Details</SectionHeading>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <Field label="ABN">
          <input style={S.input} value={s.abn} onChange={e => set('abn', e.target.value)} placeholder="48 694 251 888" />
        </Field>
        <Field label="Contractor Licence No.">
          <input style={S.input} value={s.licence} onChange={e => set('licence', e.target.value)} placeholder="280492C" />
        </Field>
      </div>
    </div>
  );
}

// ─── Home Editor ──────────────────────────────────────────────────────────────

function HomeEditor({ content, onChange }: { content: SiteContent; onChange: (c: SiteContent) => void }) {
  const h = content.home;
  const set = (field: keyof typeof h, value: string) => onChange({ ...content, home: { ...h, [field]: value } });
  return (
    <div>
      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>Edit the text shown on the Home page hero and services section.</p>
      <SectionHeading>Hero Section</SectionHeading>
      <Field label="Hero Subtitle">
        <textarea style={S.textarea} value={h.heroSubtitle} maxLength={180} onChange={e => set('heroSubtitle', e.target.value)} rows={3} />
        <CharCount value={h.heroSubtitle} max={180} />
      </Field>
      <SectionHeading>Services Section</SectionHeading>
      <Field label="Section Heading">
        <input style={S.input} value={h.servicesHeading} maxLength={40} onChange={e => set('servicesHeading', e.target.value)} />
        <CharCount value={h.servicesHeading} max={40} />
      </Field>
    </div>
  );
}

// ─── Plumbing Editor ──────────────────────────────────────────────────────────

function PlumbingEditor({ content, onChange }: { content: SiteContent; onChange: (c: SiteContent) => void }) {
  const p = content.plumbing;
  const set = (field: keyof typeof p, value: string) => onChange({ ...content, plumbing: { ...p, [field]: value } });
  return (
    <div>
      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>Edit the hero text and contact buttons shown on the Plumbing page.</p>
      <SectionHeading>Hero Section</SectionHeading>
      <Field label="Main Heading">
        <input style={S.input} value={p.heroHeading} maxLength={60} onChange={e => set('heroHeading', e.target.value)} />
        <CharCount value={p.heroHeading} max={60} />
      </Field>
      <Field label="Subtitle">
        <textarea style={S.textarea} value={p.heroSubtitle} maxLength={220} onChange={e => set('heroSubtitle', e.target.value)} rows={3} />
        <CharCount value={p.heroSubtitle} max={220} />
      </Field>
      <SectionHeading>Contact Buttons</SectionHeading>
      <p style={{ color: '#475569', fontSize: '0.8rem', marginBottom: '1rem', marginTop: '-0.75rem' }}>These override the global phone settings for this page only.</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <Field label="Button 1 — Number"><input style={S.input} value={p.phone1} onChange={e => set('phone1', e.target.value)} placeholder="+61412242997" /></Field>
        <Field label="Button 1 — Display Name">
          <input style={S.input} value={p.phone1Name} maxLength={30} onChange={e => set('phone1Name', e.target.value)} placeholder="John" />
          <CharCount value={p.phone1Name} max={30} />
        </Field>
        <Field label="Button 2 — Number"><input style={S.input} value={p.phone2} onChange={e => set('phone2', e.target.value)} placeholder="+61426051275" /></Field>
        <Field label="Button 2 — Display Name">
          <input style={S.input} value={p.phone2Name} maxLength={30} onChange={e => set('phone2Name', e.target.value)} placeholder="Leo" />
          <CharCount value={p.phone2Name} max={30} />
        </Field>
      </div>
    </div>
  );
}

// ─── Electrical Editor ────────────────────────────────────────────────────────

function ElectricalEditor({ content, onChange }: { content: SiteContent; onChange: (c: SiteContent) => void }) {
  const e = content.electrical;
  const set = (field: keyof typeof e, value: string) => onChange({ ...content, electrical: { ...e, [field]: value } });
  return (
    <div>
      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>Edit the hero text and contact buttons shown on the Electrical page.</p>
      <SectionHeading>Hero Section</SectionHeading>
      <Field label="Main Heading">
        <input style={S.input} value={e.heroHeading} maxLength={60} onChange={e2 => set('heroHeading', e2.target.value)} />
        <CharCount value={e.heroHeading} max={60} />
      </Field>
      <Field label="Subtitle">
        <textarea style={S.textarea} value={e.heroSubtitle} maxLength={220} onChange={e2 => set('heroSubtitle', e2.target.value)} rows={3} />
        <CharCount value={e.heroSubtitle} max={220} />
      </Field>
      <SectionHeading>Contact Buttons</SectionHeading>
      <p style={{ color: '#475569', fontSize: '0.8rem', marginBottom: '1rem', marginTop: '-0.75rem' }}>These override the global phone settings for this page only.</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <Field label="Button 1 — Number"><input style={S.input} value={e.phone1} onChange={e2 => set('phone1', e2.target.value)} placeholder="+61412242997" /></Field>
        <Field label="Button 1 — Display Name">
          <input style={S.input} value={e.phone1Name} maxLength={30} onChange={e2 => set('phone1Name', e2.target.value)} placeholder="John" />
          <CharCount value={e.phone1Name} max={30} />
        </Field>
        <Field label="Button 2 — Number"><input style={S.input} value={e.phone2} onChange={e2 => set('phone2', e2.target.value)} placeholder="+61426051275" /></Field>
        <Field label="Button 2 — Display Name">
          <input style={S.input} value={e.phone2Name} maxLength={30} onChange={e2 => set('phone2Name', e2.target.value)} placeholder="Leo" />
          <CharCount value={e.phone2Name} max={30} />
        </Field>
      </div>
    </div>
  );
}

// ─── About Editor ─────────────────────────────────────────────────────────────

function TeamMemberCards({ members, onChange, onPhotoQueued, photoPreviews }: {
  members: TeamMember[]; onChange: (m: TeamMember[]) => void;
  onPhotoQueued: (id: string, file: File, preview: string) => void; photoPreviews: Record<string, string>;
}) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [photoErr, setPhotoErr] = useState<Record<string, string>>({});
  const update = (id: string, field: keyof TeamMember, value: string) => onChange(members.map(m => m.id === id ? { ...m, [field]: value } : m));
  const remove = (id: string) => { if (!confirm('Remove this team member?')) return; onChange(members.filter(m => m.id !== id)); };
  const add = () => { const id = `member-${Date.now()}`; onChange([...members, { id, name: 'New Member', role: 'Role', bio: '', photo: '', imgStyle: null }]); };

  return (
    <div>
      {members.map(m => {
        const open = !collapsed[m.id];
        return (
          <div key={m.id} style={S.card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }} onClick={() => setCollapsed(c => ({ ...c, [m.id]: !c[m.id] }))}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #1e3a5f', flexShrink: 0, backgroundColor: '#1e293b' }}>
                {(photoPreviews[m.id] || m.photo) && <img src={photoPreviews[m.id] || m.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
              </div>
              <div style={{ flex: 1 }}><div style={{ fontWeight: 700, color: 'white' }}>{m.name || 'Unnamed'}</div><div style={{ fontSize: '0.8rem', color: '#64748b' }}>{m.role || 'No role set'}</div></div>
              <GripVertical size={16} color="#475569" />
              {open ? <ChevronUp size={18} color="#475569" /> : <ChevronDown size={18} color="#475569" />}
            </div>
            {open && (
              <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
                  <PhotoUploader currentSrc={m.photo} previewDataUrl={photoPreviews[m.id] || null} label="Photo"
                    onFileSelected={(file, preview) => { setPhotoErr(e => ({ ...e, [m.id]: '' })); onPhotoQueued(m.id, file, preview); }}
                    onError={msg => setPhotoErr(e => ({ ...e, [m.id]: msg }))} />
                  <div style={{ flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    {photoErr[m.id] && <p style={{ color: '#f87171', fontSize: '0.8rem', margin: 0 }}>{photoErr[m.id]}</p>}
                    <Field label="Full Name">
                      <input style={S.input} value={m.name} maxLength={40} onChange={e => update(m.id, 'name', e.target.value)} placeholder="e.g. John Zhao" />
                      <CharCount value={m.name} max={40} />
                    </Field>
                    <Field label="Job Title">
                      <input style={S.input} value={m.role} maxLength={60} onChange={e => update(m.id, 'role', e.target.value)} placeholder="e.g. Lead Plumber & Co-Founder" />
                      <CharCount value={m.role} max={60} />
                    </Field>
                  </div>
                </div>
                <Field label="Short Bio (shown on the website)">
                  <textarea style={S.textarea} value={m.bio} maxLength={600} onChange={e => update(m.id, 'bio', e.target.value)} rows={5} placeholder="Write a short bio..." />
                  <CharCount value={m.bio} max={600} />
                </Field>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button style={S.btnDanger} onClick={() => remove(m.id)}><Trash2 size={14} /> Remove</button>
                </div>
              </div>
            )}
          </div>
        );
      })}
      <button style={{ ...S.btnGhost, width: '100%', justifyContent: 'center', padding: '0.85rem' }} onClick={add}><Plus size={16} /> Add Team Member</button>
    </div>
  );
}

function AboutEditor({ content, onChange, onPhotoQueued, photoPreviews }: {
  content: SiteContent; onChange: (c: SiteContent) => void;
  onPhotoQueued: (id: string, file: File, preview: string) => void; photoPreviews: Record<string, string>;
}) {
  const a = content.about;
  const set = (field: keyof typeof a, value: any) => onChange({ ...content, about: { ...a, [field]: value } });
  const setStat = (idx: number, field: 'value' | 'label', val: string) => {
    const stats = a.stats.map((s, i) => i === idx ? { ...s, [field]: val } : s);
    set('stats', stats);
  };
  return (
    <div>
      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>Edit the story, contact buttons, stats, team heading, and team members shown on the About page.</p>
      <SectionHeading>Our Story Section</SectionHeading>
      <Field label="Section Heading">
        <input style={S.input} value={a.storyHeading} maxLength={60} onChange={e => set('storyHeading', e.target.value)} />
        <CharCount value={a.storyHeading} max={60} />
      </Field>
      <Field label="First Paragraph">
        <textarea style={S.textarea} value={a.storyPara1} maxLength={300} onChange={e => set('storyPara1', e.target.value)} rows={4} />
        <CharCount value={a.storyPara1} max={300} />
      </Field>
      <Field label="Second Paragraph">
        <textarea style={S.textarea} value={a.storyPara2} maxLength={300} onChange={e => set('storyPara2', e.target.value)} rows={4} />
        <CharCount value={a.storyPara2} max={300} />
      </Field>
      <SectionHeading>Contact Buttons</SectionHeading>
      <p style={{ color: '#475569', fontSize: '0.8rem', marginBottom: '1rem', marginTop: '-0.75rem' }}>These override the global phone settings for this page only.</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <Field label="Button 1 — Number"><input style={S.input} value={a.phone1} onChange={e => set('phone1', e.target.value)} placeholder="+61412242997" /></Field>
        <Field label="Button 1 — Display Name">
          <input style={S.input} value={a.phone1Name} maxLength={30} onChange={e => set('phone1Name', e.target.value)} placeholder="John" />
          <CharCount value={a.phone1Name} max={30} />
        </Field>
        <Field label="Button 2 — Number"><input style={S.input} value={a.phone2} onChange={e => set('phone2', e.target.value)} placeholder="+61426051275" /></Field>
        <Field label="Button 2 — Display Name">
          <input style={S.input} value={a.phone2Name} maxLength={30} onChange={e => set('phone2Name', e.target.value)} placeholder="Leo" />
          <CharCount value={a.phone2Name} max={30} />
        </Field>
      </div>
      <SectionHeading>Stats</SectionHeading>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {a.stats.map((stat, idx) => (
          <div key={idx} style={{ ...S.card, marginBottom: 0 }}>
            <Field label={`Stat ${idx + 1} — Value`}>
              <input style={S.input} value={stat.value} maxLength={8} onChange={e => setStat(idx, 'value', e.target.value)} placeholder="e.g. 500+" />
            </Field>
            <Field label="Label">
              <input style={S.input} value={stat.label} maxLength={25} onChange={e => setStat(idx, 'label', e.target.value)} placeholder="e.g. Happy Customers" />
            </Field>
          </div>
        ))}
      </div>
      <div style={{ height: '1.25rem' }} />
      <SectionHeading>Team Section Header</SectionHeading>
      <Field label="Section Heading">
        <input style={S.input} value={a.teamHeading} maxLength={40} onChange={e => set('teamHeading', e.target.value)} />
        <CharCount value={a.teamHeading} max={40} />
      </Field>
      <Field label="Section Subheading">
        <input style={S.input} value={a.teamSubheading} maxLength={100} onChange={e => set('teamSubheading', e.target.value)} />
        <CharCount value={a.teamSubheading} max={100} />
      </Field>
      <div style={{ height: '1.25rem' }} />
      <SectionHeading>Team Members</SectionHeading>
      <TeamMemberCards
        members={content.team}
        onChange={team => onChange({ ...content, team })}
        onPhotoQueued={onPhotoQueued}
        photoPreviews={photoPreviews}
      />
    </div>
  );
}

// ─── Login Screen ─────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: (tok: string) => void }) {
  const [token, setToken] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showHelp, setShowHelp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) return;
    setLoading(true); setError('');
    const ok = await verifyToken(token.trim());
    setLoading(false);
    if (ok === true) { saveToken(token.trim()); onLogin(token.trim()); }
    else if (ok === 'readonly') setError('This token has read-only access. Please generate a new token with Contents set to Read and write.');
    else setError("That token didn't work. Please double-check it and try again.");
  };

  return (
    <div style={{ ...S.page, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '480px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}><span style={{ color: '#60a5fa' }}>URBAN</span><span style={{ color: '#94a3b8' }}>PRO</span></div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'white', margin: '0 0 0.5rem' }}>Admin Portal</h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Enter your GitHub access token to continue</p>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={S.label}>GitHub Access Token</label>
            <div style={{ position: 'relative' }}>
              <input type={show ? 'text' : 'password'} value={token} onChange={e => setToken(e.target.value)} placeholder="github_pat_xxxx..." style={{ ...S.input, paddingRight: '3rem' }} autoComplete="off" />
              <button type="button" onClick={() => setShow(s => !s)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#475569', cursor: 'pointer', display: 'flex' }}>
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          {error && <div style={{ backgroundColor: '#450a0a', border: '1px solid #7f1d1d', borderRadius: '6px', padding: '0.75rem 1rem', color: '#fca5a5', fontSize: '0.875rem' }}>{error}</div>}
          <button type="submit" disabled={loading || !token.trim()} style={{ ...S.btnPrimary, justifyContent: 'center', padding: '0.9rem', opacity: (!token.trim() || loading) ? 0.5 : 1 }}>
            {loading ? 'Checking...' : 'Sign In'}
          </button>
        </form>
        <div style={{ marginTop: '2rem', borderTop: '1px solid #1e293b', paddingTop: '1.5rem' }}>
          <button onClick={() => setShowHelp(h => !h)} style={{ ...S.btnGhost, width: '100%', justifyContent: 'center', fontSize: '0.82rem' }}>
            {showHelp ? '▲' : '▼'} How do I get a token?
          </button>
          {showHelp && (
            <div style={{ marginTop: '1rem', backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', padding: '1.25rem', fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.8 }}>
              <p style={{ fontWeight: 700, color: '#e2e8f0', marginBottom: '0.75rem' }}>Follow these steps:</p>
              <ol style={{ paddingLeft: '1.2rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li>Go to <strong style={{ color: '#60a5fa' }}>github.com</strong> → your profile → <strong>Settings</strong></li>
                <li>Scroll to <strong>Developer settings</strong> → <strong>Personal access tokens</strong> → <strong>Fine-grained tokens</strong></li>
                <li>Click <strong>Generate new token</strong> and give it any name</li>
                <li>Under <strong>Repository access</strong> select <strong>Only select repositories</strong> → choose <strong>UrbanPro</strong></li>
                <li>Under <strong>Permissions → Contents</strong> set to <strong>Read and write</strong></li>
                <li>Click <strong>Generate token</strong>, copy it, paste it above</li>
              </ol>
              <p style={{ marginTop: '0.75rem', color: '#475569', fontSize: '0.8rem' }}>Treat this like a password. It's stored only in this browser tab and cleared when you close it.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Admin ───────────────────────────────────────────────────────────────

const NAV_TABS: { id: NavTab; label: string }[] = [
  { id: 'settings', label: 'Settings' },
  { id: 'home', label: 'Home' },
  { id: 'building', label: 'Building' },
  { id: 'plumbing', label: 'Plumbing' },
  { id: 'electrical', label: 'Electrical' },
  { id: 'about', label: 'About' },
];

export default function Admin() {
  const [token, setToken] = useState(loadToken);
  const [authed, setAuthed] = useState(!!loadToken());
  const [content, setContent] = useState<SiteContent | null>(null);
  const [activeTab, setActiveTab] = useState<NavTab>('settings');
  const [pendingPhotos, setPendingPhotos] = useState<Record<string, File>>({});
  const [photoPreviews, setPhotoPreviews] = useState<Record<string, string>>({});
  // gallery: key = `${projectId}-gallery-${timestamp}`, value = File
  const [pendingGallery, setPendingGallery] = useState<Record<string, File>>({});
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loadError, setLoadError] = useState('');
  const snapshotRef = useRef('');

  useEffect(() => {
    const saved = loadToken();
    if (saved && !content) loadContent(saved);
  }, []);

  const loadContent = async (tok: string) => {
    setLoadError('');
    try {
      const { content: raw } = await getFile(tok, CONTENT_PATH);
      const merged = merge(JSON.parse(raw));
      setContent(merged);
      snapshotRef.current = JSON.stringify(merged);
    } catch (e: any) {
      setLoadError('Could not load site content: ' + e.message);
    }
  };

  const handleLogin = async (tok: string) => { setToken(tok); setAuthed(true); await loadContent(tok); };
  const handleLogout = () => { clearToken(); setToken(''); setAuthed(false); setContent(null); };
  const queuePhoto = (id: string, file: File, preview: string) => { setPendingPhotos(p => ({ ...p, [id]: file })); setPhotoPreviews(p => ({ ...p, [id]: preview })); };
  const queueGallery = (key: string, file: File, preview: string) => { setPendingGallery(g => ({ ...g, [key]: file })); setPhotoPreviews(p => ({ ...p, [key]: preview })); };

  const removeGalleryExisting = (projectId: string, idx: number) => {
    if (!content) return;
    setContent(c => c ? { ...c, buildingProjects: c.buildingProjects.map(p => p.id === projectId ? { ...p, photos: p.photos.filter((_, i) => i !== idx) } : p) } : c);
  };
  const removeGalleryPending = (key: string) => {
    setPendingGallery(g => { const n = { ...g }; delete n[key]; return n; });
    setPhotoPreviews(p => { const n = { ...p }; delete n[key]; return n; });
  };
  const pendingGalleryKeys = (projectId: string) => Object.keys(pendingGallery).filter(k => k.startsWith(projectId + '-gallery-'));

  const { dirtyTabs, dirtyBuildingCategories } = useMemo(() => {
    const tabs = new Set<NavTab>();
    const cats = new Set<string>();
    if (!content || !snapshotRef.current) return { dirtyTabs: tabs, dirtyBuildingCategories: cats };
    const snap = JSON.parse(snapshotRef.current) as SiteContent;

    if (JSON.stringify(content.settings) !== JSON.stringify(snap.settings)) tabs.add('settings');
    if (JSON.stringify(content.home) !== JSON.stringify(snap.home)) tabs.add('home');
    if (JSON.stringify(content.plumbing) !== JSON.stringify(snap.plumbing)) tabs.add('plumbing');
    if (JSON.stringify(content.electrical) !== JSON.stringify(snap.electrical)) tabs.add('electrical');
    if (JSON.stringify(content.about) !== JSON.stringify(snap.about)
        || JSON.stringify(content.team) !== JSON.stringify(snap.team)) tabs.add('about');

    if (JSON.stringify(content.buildingProjects) !== JSON.stringify(snap.buildingProjects)) {
      tabs.add('building');
      const snapByCat = new Map<string, Set<string>>();
      for (const p of snap.buildingProjects) {
        if (!snapByCat.has(p.category)) snapByCat.set(p.category, new Set());
        snapByCat.get(p.category)!.add(JSON.stringify(p));
      }
      for (const p of content.buildingProjects) {
        const catSet = snapByCat.get(p.category);
        if (!catSet) { cats.add(p.category); continue; }
        if (!catSet.has(JSON.stringify(p))) cats.add(p.category);
        else catSet.delete(JSON.stringify(p));
      }
      for (const [cat, remaining] of snapByCat) {
        if (remaining.size > 0) cats.add(cat);
      }
    }

    for (const id of Object.keys(pendingPhotos)) {
      if (content.team.some(m => m.id === id)) tabs.add('about');
      if (content.buildingProjects.some(p => p.id === id)) tabs.add('building');
    }
    if (Object.keys(pendingGallery).length > 0) tabs.add('building');

    return { dirtyTabs: tabs, dirtyBuildingCategories: cats };
  }, [content, pendingPhotos, pendingGallery]);

  const handleSave = async () => {
    if (!content) return;
    setSaving(true); setSaveMsg(null);
    try {
      const updated = JSON.parse(JSON.stringify(content)) as SiteContent;
      const files: Array<{ path: string; content: string }> = [];

      // Prepare cover photo uploads
      for (const [id, file] of Object.entries(pendingPhotos)) {
        const base64 = await readFileAsBase64(file);
        const fname = sanitiseFilename(file.name);
        const imagePath = `images/${fname}`;
        files.push({ path: `public/images/${fname}`, content: base64 });
        updated.team = updated.team.map(m => m.id === id ? { ...m, photo: imagePath } : m);
        updated.buildingProjects = updated.buildingProjects.map(p => p.id === id ? { ...p, image: imagePath } : p);
      }

      // Prepare gallery photo uploads
      for (const [key, file] of Object.entries(pendingGallery)) {
        const projectId = key.split('-gallery-')[0];
        const base64 = await readFileAsBase64(file);
        const fname = sanitiseFilename(file.name);
        files.push({ path: `public/images/${fname}`, content: base64 });
        updated.buildingProjects = updated.buildingProjects.map(p =>
          p.id === projectId ? { ...p, photos: [...(p.photos || []), `images/${fname}`] } : p
        );
      }

      // Add content.json as the last file
      files.push({ path: CONTENT_PATH, content: JSON.stringify(updated, null, 2) });

      // Single atomic commit — all or nothing
      await batchCommit(token, files, 'Admin: update site content');

      setContent(updated);
      snapshotRef.current = JSON.stringify(updated);
      setPendingPhotos({}); setPhotoPreviews({}); setPendingGallery({});
      bustContentCache();
      setSaveMsg({ type: 'success', text: '✓ Saved! Your website will update in 1–2 minutes.' });
    } catch (e: any) {
      setSaveMsg({ type: 'error', text: 'Something went wrong: ' + e.message });
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg(null), 10000);
    }
  };

  if (!authed) return <LoginScreen onLogin={handleLogin} />;
  const hasPending = Object.keys(pendingPhotos).length + Object.keys(pendingGallery).length;
  const hasAnyChanges = dirtyTabs.size > 0;

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={{ position: 'sticky', top: 0, zIndex: 50, backgroundColor: '#0b1220', borderBottom: '1px solid #1e293b', padding: '0.9rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>
          <span style={{ color: '#60a5fa' }}>URBAN</span><span style={{ color: '#94a3b8' }}>PRO</span>
          <span style={{ color: '#475569', fontWeight: 400, fontSize: '0.8rem', marginLeft: '0.75rem' }}>Admin</span>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {hasPending > 0 && <span style={{ fontSize: '0.78rem', color: '#f59e0b', fontWeight: 600 }}>{hasPending} photo{hasPending > 1 ? 's' : ''} ready to upload</span>}
          <button onClick={handleSave} disabled={saving || !content || !hasAnyChanges}
            style={{ ...S.btnPrimary, opacity: (saving || !hasAnyChanges) ? 0.45 : 1, cursor: (!hasAnyChanges) ? 'not-allowed' : 'pointer' }}>
            <Save size={16} />{saving ? 'Saving...' : 'Save All Changes'}
          </button>
          <button onClick={handleLogout} style={S.btnGhost}><LogOut size={15} /> Sign Out</button>
        </div>
      </div>

      {/* Save banner */}
      {saveMsg && (
        <div style={{ padding: '0.85rem 1.5rem', backgroundColor: saveMsg.type === 'success' ? '#052e16' : '#450a0a', borderBottom: `1px solid ${saveMsg.type === 'success' ? '#15803d' : '#7f1d1d'}`, color: saveMsg.type === 'success' ? '#4ade80' : '#fca5a5', fontSize: '0.9rem', fontWeight: 600, textAlign: 'center' }}>
          {saveMsg.text}
        </div>
      )}

      {/* Nav tabs — styled like website nav */}
      <div style={{ borderBottom: '1px solid #1e293b', overflowX: 'auto' }}>
        <div style={{ display: 'flex', minWidth: 'max-content', padding: '0 1.5rem' }}>
          {NAV_TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{ padding: '1rem 1.4rem', background: 'none', border: 'none', borderBottom: activeTab === tab.id ? '2px solid #3b82f6' : '2px solid transparent', color: activeTab === tab.id ? '#60a5fa' : '#64748b', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'inherit', textTransform: 'uppercase', letterSpacing: '0.1em', whiteSpace: 'nowrap', marginBottom: '-1px', transition: 'color 0.2s' }}>
              {dirtyTabs.has(tab.id) && <span style={{ color: '#f59e0b', marginRight: '0.3rem', fontSize: '0.65rem' }}>●</span>}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {!content && !loadError && <div style={{ textAlign: 'center', padding: '4rem', color: '#475569' }}>Loading site content...</div>}
      {loadError && (
        <div style={{ margin: '2rem', padding: '1.25rem', backgroundColor: '#450a0a', border: '1px solid #7f1d1d', borderRadius: '8px', color: '#fca5a5' }}>
          <strong>Could not load content.</strong> {loadError}
          <br /><br />
          <button onClick={() => loadContent(token)} style={S.btnGhost}>Try Again</button>
        </div>
      )}

      {content && (
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '2rem 1.25rem' }}>
          {activeTab === 'settings' && <SettingsEditor content={content} onChange={setContent} />}
          {activeTab === 'home' && <HomeEditor content={content} onChange={setContent} />}
          {activeTab === 'plumbing' && <PlumbingEditor content={content} onChange={setContent} />}
          {activeTab === 'electrical' && <ElectricalEditor content={content} onChange={setContent} />}
          {activeTab === 'about' && <AboutEditor content={content} onChange={setContent} onPhotoQueued={queuePhoto} photoPreviews={photoPreviews} />}
          {activeTab === 'building' && (
            <ProjectsEditor
              projects={content.buildingProjects}
              onChange={buildingProjects => setContent(c => c ? { ...c, buildingProjects } : c)}
              onPhotoQueued={queuePhoto}
              photoPreviews={photoPreviews}
              onGalleryQueued={queueGallery}
              onRemoveGalleryExisting={removeGalleryExisting}
              onRemoveGalleryPending={removeGalleryPending}
              pendingGalleryKeys={pendingGalleryKeys}
              dirtyCategories={dirtyBuildingCategories}
              buildingCategories={content.buildingCategories}
              onCategoriesChange={cats => setContent(c => c ? { ...c, buildingCategories: cats } : c)}
            />
          )}
        </div>
      )}
    </div>
  );
}

