import { useState, useRef, useEffect, useMemo } from 'react';
import { Plus, Trash2, Upload, LogOut, Save, Eye, EyeOff, ChevronDown, ChevronUp, GripVertical, X } from 'lucide-react';
import {
  verifyToken,
  getFile,
  getHeadSha,
  batchCommit,
  waitForDeploy,
  readFileAsBase64,
  sanitiseFilename,
} from '../services/github';
import type { DeployPhase } from '../services/github';
import { bustContentCache, merge } from '../hooks/useContent';
import type { SiteContent, TeamMember, BuildingProject, ConfigItem, ReviewItem } from '../hooks/useContent';
import { ICON_NAMES, Icon } from '../icons';

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

function GalleryManager({ projectId, photos, previews, onPhotoQueued, onRemoveExisting, onRemovePending, pendingKeys, onPhotosReordered, label, galleryPrefix }: {
  projectId: string; photos: string[]; previews: Record<string, string>; onPhotoQueued: (key: string, file: File, preview: string) => void;
  onRemoveExisting: (idx: number) => void; onRemovePending: (key: string) => void; pendingKeys: string[];
  onPhotosReordered: (newOrder: string[]) => void; label?: string; galleryPrefix?: string;
}) {
  const prefix = galleryPrefix || 'gallery';
  const inputRef = useRef<HTMLInputElement>(null);
  const [err, setErr] = useState('');
  const [dragPhotoIdx, setDragPhotoIdx] = useState<number | null>(null);

  const handleFiles = (files: FileList) => {
    setErr('');
    Array.from(files).forEach(file => {
      const e = validatePhoto(file);
      if (e) { setErr(e); return; }
      const key = `${projectId}-${prefix}-${Date.now()}-${Math.random()}`;
      const reader = new FileReader();
      reader.onload = ev => onPhotoQueued(key, file, ev.target?.result as string);
      reader.readAsDataURL(file);
    });
  };

  const handlePhotoDragStart = (e: React.DragEvent, idx: number) => {
    setDragPhotoIdx(idx);
    e.dataTransfer.setData('text/plain', String(idx));
    e.dataTransfer.effectAllowed = 'move';
  };
  const handlePhotoDragOver = (e: React.DragEvent) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; };
  const handlePhotoDragEnd = () => { setDragPhotoIdx(null); };
  const handlePhotoDrop = (e: React.DragEvent, targetIdx: number) => {
    e.preventDefault();
    const fromIdx = parseInt(e.dataTransfer.getData('text/plain'));
    if (isNaN(fromIdx) || fromIdx === targetIdx) { setDragPhotoIdx(null); return; }
    const arr = [...photos];
    const [moved] = arr.splice(fromIdx, 1);
    arr.splice(targetIdx, 0, moved);
    onPhotosReordered(arr);
    setDragPhotoIdx(null);
  };

  const allItems: { src: string; key: string; isPending: boolean; idx?: number }[] = [
    ...photos.map((src, idx) => ({ src, key: `existing-${idx}`, isPending: false, idx })),
    ...pendingKeys.map(k => ({ src: previews[k], key: k, isPending: true })),
  ];

  return (
    <div>
      <label style={S.label}>{label || 'Gallery Photos'}</label>
      <p style={{ fontSize: '0.78rem', color: '#475569', marginBottom: '0.75rem' }}>
        Max {MAX_MB} MB · JPG, PNG, WEBP, AVIF. Drag to reorder.
      </p>
      {err && <p style={{ fontSize: '0.8rem', color: '#f87171', marginBottom: '0.5rem' }}>{err}</p>}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
        {allItems.map(item => (
          <div key={item.key}
            draggable={!item.isPending}
            onDragStart={item.isPending ? undefined : e => handlePhotoDragStart(e, item.idx!)}
            onDragOver={item.isPending ? undefined : handlePhotoDragOver}
            onDragEnd={item.isPending ? undefined : handlePhotoDragEnd}
            onDrop={item.isPending ? undefined : e => handlePhotoDrop(e, item.idx!)}
            style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '6px', overflow: 'hidden', border: `2px solid ${item.isPending ? '#22c55e' : '#1e3a5f'}`, flexShrink: 0, opacity: dragPhotoIdx === item.idx ? 0.5 : 1, transition: 'opacity 0.15s', cursor: item.isPending ? 'default' : 'grab' }}>
            <img src={item.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            {!item.isPending && <GripVertical size={10} color="rgba(255,255,255,0.5)" style={{ position: 'absolute', top: '2px', left: '2px' }} />}
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

function ProjectsEditor({ projects, onChange, onPhotoQueued, photoPreviews, onGalleryQueued, onRemoveGalleryExisting, onRemoveGalleryPending, pendingGalleryKeys, dirtyCategories, buildingCategories, onCategoriesChange, onClearPending }: {
  projects: BuildingProject[]; onChange: (p: BuildingProject[]) => void;
  onPhotoQueued: (id: string, file: File, preview: string) => void; photoPreviews: Record<string, string>;
  onGalleryQueued: (key: string, file: File, preview: string) => void;
  onRemoveGalleryExisting: (projectId: string, idx: number) => void; onRemoveGalleryPending: (key: string) => void;
  pendingGalleryKeys: (projectId: string, prefix?: string) => string[];
  dirtyCategories: Set<string>;
  buildingCategories: string[]; onCategoriesChange: (cats: string[]) => void;
  onClearPending: (id: string) => void;
}) {
  const [activeCategory, setActiveCategory] = useState<string>(buildingCategories[0] || 'New Builds');
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [photoErr, setPhotoErr] = useState<Record<string, string>>({});
  const [dragCat, setDragCat] = useState<string | null>(null);
  const [dragProject, setDragProject] = useState<string | null>(null);

  const update = (id: string, field: keyof BuildingProject, value: string) => onChange(projects.map(p => p.id === id ? { ...p, [field]: value } : p));
  const remove = (id: string) => { if (!confirm('Remove this project?')) return; onChange(projects.filter(p => p.id !== id)); };
  const add = () => { const id = `project-${Date.now()}`; onChange([...projects, { id, title: 'New Project', location: '', description: '', image: '', photos: [], beforePhotos: [], floorPlanBefore: '', floorPlanAfter: '', category: activeCategory, pano: '' }]); };
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

  // ── project drag reorder
  const handleProjDragStart = (e: React.DragEvent, id: string) => {
    setDragProject(id);
    e.dataTransfer.setData('application/project-id', id);
    e.dataTransfer.effectAllowed = 'move';
  };
  const handleProjDragOver = (e: React.DragEvent) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; };
  const handleProjDragEnd = () => { setDragProject(null); };
  const handleProjDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('application/project-id') || e.dataTransfer.getData('text/plain');
    if (!draggedId || draggedId === targetId) { setDragProject(null); return; }
    const arr = [...projects];
    const fromIdx = arr.findIndex(p => p.id === draggedId);
    const toIdx = arr.findIndex(p => p.id === targetId);
    if (fromIdx === -1 || toIdx === -1) { setDragProject(null); return; }
    const [moved] = arr.splice(fromIdx, 1);
    arr.splice(toIdx, 0, moved);
    onChange(arr);
    setDragProject(null);
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
          <div key={p.id} style={{ ...S.card, opacity: dragProject === p.id ? 0.5 : 1, transition: 'opacity 0.15s' }}
            draggable onDragStart={e => handleProjDragStart(e, p.id)} onDragOver={handleProjDragOver} onDragEnd={handleProjDragEnd} onDrop={e => handleProjDrop(e, p.id)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }} onClick={() => setCollapsed(c => ({ ...c, [p.id]: !c[p.id] }))}>
              <GripVertical size={14} color="#475569" style={{ flexShrink: 0, cursor: 'grab' }} />
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
                  pendingKeys={pendingGalleryKeys(p.id, 'gallery')}
                  onPhotosReordered={newOrder => onChange(projects.map(pr => pr.id === p.id ? { ...pr, photos: newOrder } : pr))}
                  label="After Photos (shown first)"
                  galleryPrefix="gallery"
                />
                <GalleryManager
                  projectId={p.id}
                  photos={p.beforePhotos || []}
                  previews={photoPreviews}
                  onPhotoQueued={onGalleryQueued}
                  onRemoveExisting={idx => onChange(projects.map(pr => pr.id === p.id ? { ...pr, beforePhotos: pr.beforePhotos.filter((_, i) => i !== idx) } : pr))}
                  onRemovePending={onRemoveGalleryPending}
                  pendingKeys={pendingGalleryKeys(p.id, 'beforegal')}
                  onPhotosReordered={newOrder => onChange(projects.map(pr => pr.id === p.id ? { ...pr, beforePhotos: newOrder } : pr))}
                  label="Before Photos (optional)"
                  galleryPrefix="beforegal"
                />
                <SectionHeading>Floor Plans (optional)</SectionHeading>
                <p style={{ color: '#475569', fontSize: '0.8rem', marginBottom: '1rem', marginTop: '-0.75rem' }}>Upload before and after floor plan images. Leave empty to hide the floor plan button.</p>
                <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
                  {(['After', 'Before'] as const).map(side => {
                    const fpId = 'fp-' + (side === 'After' ? 'after' : 'before') + '-' + p.id;
                    const currentVal = side === 'After' ? p.floorPlanAfter : p.floorPlanBefore;
                    const hasFp = !!(currentVal || photoPreviews[fpId]);
                    return (
                      <div key={side} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <PhotoUploader currentSrc={currentVal || ''} previewDataUrl={photoPreviews[fpId] || null} label={side + ' Floor Plan'}
                          onFileSelected={(file, preview) => onPhotoQueued(fpId, file, preview)}
                          onError={msg => setPhotoErr(e => ({ ...e, [p.id]: msg }))} />
                        {hasFp && (
                          <button onClick={() => {
                            onClearPending(fpId);
                            onChange(projects.map(pr => pr.id === p.id ? { ...pr, [side === 'After' ? 'floorPlanAfter' : 'floorPlanBefore']: '' } : pr));
                          }} style={{ ...S.btnDanger, alignSelf: 'flex-start', padding: '0.25rem 0.6rem', fontSize: '0.7rem' }}>
                            <X size={11} /> Remove
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
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

// ─── Icon Picker ──────────────────────────────────────────────────────────────

function IconPicker({ value, onChange }: { value: string; onChange: (name: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <button type="button" onClick={() => setOpen(o => !o)} style={{ ...S.input, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', textAlign: 'left', overflow: 'hidden' }}>
        <span style={{ display: 'inline-flex', color: '#60a5fa', flexShrink: 0 }}><Icon name={value} size={18} /></span>
        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}>{value}</span>
        <ChevronDown size={14} color="#475569" style={{ flexShrink: 0 }} />
      </button>
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 20, backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '6px', maxHeight: '260px', overflowY: 'auto', padding: '0.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(64px, 1fr))', gap: '0.35rem' }}>
          {ICON_NAMES.map(name => (
            <button key={name} type="button" onClick={() => { onChange(name); setOpen(false); }} title={name}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem', padding: '0.5rem 0.15rem', backgroundColor: name === value ? '#3b82f6' : 'transparent', border: '1px solid ' + (name === value ? '#3b82f6' : '#334155'), borderRadius: '4px', color: name === value ? 'white' : '#cbd5e1', cursor: 'pointer', fontFamily: 'inherit', overflow: 'hidden', minWidth: 0 }}>
              <Icon name={name} size={18} />
              <span style={{ fontSize: '0.55rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%', lineHeight: 1.2 }}>{name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Config Item List Editor ──────────────────────────────────────────────────

function ConfigItemListEditor({ items, onChange, label, titleMax, subtitleMax, showSubtitle = true, addLabel = 'Add Item' }: {
  items: ConfigItem[]; onChange: (items: ConfigItem[]) => void;
  label: string; titleMax: number; subtitleMax: number; showSubtitle?: boolean; addLabel?: string;
}) {
  const [dragId, setDragId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const update = (id: string, field: keyof ConfigItem, val: string) => onChange(items.map(it => it.id === id ? { ...it, [field]: val } : it));
  const remove = (id: string) => { onChange(items.filter(it => it.id !== id)); setExpanded(e => { const n = { ...e }; delete n[id]; return n; }); };
  const add = () => {
    const newId = `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    onChange([...items, { id: newId, icon: 'CheckCircle', title: '', subtitle: '' }]);
    setExpanded(e => ({ ...e, [newId]: true }));
  };

  const onDragStart = (e: React.DragEvent, id: string) => { setDragId(id); e.dataTransfer.setData('text/plain', id); e.dataTransfer.effectAllowed = 'move'; };
  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; };
  const onDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const fromId = e.dataTransfer.getData('text/plain');
    if (!fromId || fromId === targetId) { setDragId(null); return; }
    const arr = [...items];
    const fromIdx = arr.findIndex(it => it.id === fromId);
    const toIdx = arr.findIndex(it => it.id === targetId);
    if (fromIdx === -1 || toIdx === -1) { setDragId(null); return; }
    const [moved] = arr.splice(fromIdx, 1);
    arr.splice(toIdx, 0, moved);
    onChange(arr);
    setDragId(null);
  };

  return (
    <div style={{ marginTop: '2.5rem' }}>
      <SectionHeading>{label}</SectionHeading>
      <p style={{ color: '#475569', fontSize: '0.78rem', marginTop: '-0.75rem', marginBottom: '1rem' }}>Drag cards to reorder. Click the chevron to edit icon, title, and subtitle.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '0.65rem' }}>
        {items.map(item => {
          const open = !!expanded[item.id];
          return (
            <div key={item.id}
              draggable onDragStart={e => onDragStart(e, item.id)} onDragOver={onDragOver} onDrop={e => onDrop(e, item.id)} onDragEnd={() => setDragId(null)}
              style={{ ...S.card, padding: '0.7rem', opacity: dragId === item.id ? 0.5 : 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {/* Card header: drag + icon + title + expand + delete */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', minWidth: 0 }}>
                <GripVertical size={14} color="#475569" style={{ cursor: 'grab', flexShrink: 0 }} />
                <span style={{ color: '#60a5fa', display: 'inline-flex', flexShrink: 0 }}><Icon name={item.icon} size={18} /></span>
                <span style={{ flex: 1, fontWeight: 600, fontSize: '0.8rem', color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}>
                  {item.title || 'Untitled'}
                </span>
                <button type="button" onClick={() => setExpanded(e => ({ ...e, [item.id]: !open }))}
                  style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', padding: 0, display: 'flex', flexShrink: 0 }}>
                  {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                <button type="button" onClick={() => remove(item.id)}
                  style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: 0, display: 'flex', flexShrink: 0 }}>
                  <Trash2 size={13} />
                </button>
              </div>
              {showSubtitle && <div style={{ fontSize: '0.68rem', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingLeft: '1.9rem' }}>{item.subtitle || 'No subtitle'}</div>}
              {/* Expanded edit area */}
              {open && (
                <div style={{ marginTop: '0.3rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid #1e3a5f' }}>
                  <div>
                    <label style={{ ...S.label, marginBottom: '0.2rem', fontSize: '0.68rem' }}>Icon</label>
                    <IconPicker value={item.icon} onChange={name => update(item.id, 'icon', name)} />
                  </div>
                  <div>
                    <label style={{ ...S.label, marginBottom: '0.2rem', fontSize: '0.68rem' }}>Title</label>
                    <input style={S.input} value={item.title} maxLength={titleMax} onChange={e => update(item.id, 'title', e.target.value)} placeholder="Item title" />
                    <CharCount value={item.title} max={titleMax} />
                  </div>
                  {showSubtitle && (
                    <div>
                      <label style={{ ...S.label, marginBottom: '0.2rem', fontSize: '0.68rem' }}>Subtitle (optional)</label>
                      <input style={S.input} value={item.subtitle} maxLength={subtitleMax} onChange={e => update(item.id, 'subtitle', e.target.value)} placeholder="Optional subtitle" />
                      <CharCount value={item.subtitle} max={subtitleMax} />
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <button style={{ ...S.btnGhost, width: '100%', justifyContent: 'center', padding: '0.7rem', marginTop: '0.65rem' }} onClick={add}><Plus size={16} /> {addLabel}</button>
    </div>
  );
}

// ─── Reviews Editor ───────────────────────────────────────────────────────────

function ReviewsEditor({ reviews, onChange, mapsUrl, onMapsUrlChange, overallRating, onOverallRatingChange, reviewCountLabel, onReviewCountLabelChange, showReviews, onShowReviewsChange, onPhotoQueued, photoPreviews, onClearPending }: {
  reviews: ReviewItem[]; onChange: (r: ReviewItem[]) => void;
  mapsUrl: string; onMapsUrlChange: (s: string) => void;
  overallRating: number; onOverallRatingChange: (v: number) => void;
  reviewCountLabel: string; onReviewCountLabelChange: (s: string) => void;
  showReviews: boolean; onShowReviewsChange: (v: boolean) => void;
  onPhotoQueued: (id: string, file: File, preview: string) => void;
  photoPreviews: Record<string, string>;
  onClearPending: (id: string) => void;
}) {
  const [dragId, setDragId] = useState<string | null>(null);
  const [photoErr, setPhotoErr] = useState<Record<string, string>>({});
  const update = (id: string, field: keyof ReviewItem, val: string | number) => onChange(reviews.map(r => r.id === id ? { ...r, [field]: val } : r));
  const remove = (id: string) => { if (!confirm('Remove this review?')) return; onClearPending(id); onChange(reviews.filter(r => r.id !== id)); };
  const add = () => onChange([...reviews, { id: `rev-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, name: '', initials: '', rating: 5, date: '', text: '', photo: '' }]);
  const initialsFrom = (name: string) => name.trim().split(/\s+/).map(p => p[0] || '').join('').slice(0, 2).toUpperCase();

  const onDragStart = (e: React.DragEvent, id: string) => { setDragId(id); e.dataTransfer.setData('text/plain', id); e.dataTransfer.effectAllowed = 'move'; };
  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; };
  const onDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const fromId = e.dataTransfer.getData('text/plain');
    if (!fromId || fromId === targetId) { setDragId(null); return; }
    const arr = [...reviews];
    const fromIdx = arr.findIndex(r => r.id === fromId);
    const toIdx = arr.findIndex(r => r.id === targetId);
    if (fromIdx === -1 || toIdx === -1) { setDragId(null); return; }
    const [moved] = arr.splice(fromIdx, 1);
    arr.splice(toIdx, 0, moved);
    onChange(arr);
    setDragId(null);
  };

  const clearPhoto = (id: string) => { onClearPending(id); update(id, 'photo', ''); };

  return (
    <div style={{ marginTop: '2.5rem' }}>
      <SectionHeading>Google Reviews</SectionHeading>
      <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '-0.75rem', marginBottom: '1rem' }}>Paste real reviews from your Google Business profile here. They'll appear in the marquee on this page. Drag the grip handle to reorder. If the section is toggled off, it won't appear on the site at all.</p>
      <div style={{ ...S.card, padding: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontWeight: 700, color: '#e2e8f0', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Show Reviews Section</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>When off, the entire Google Reviews section is hidden on this page, even if reviews are configured.</div>
        </div>
        <button type="button" onClick={() => onShowReviewsChange(!showReviews)}
          style={{
            width: '48px', height: '28px', borderRadius: '14px', border: 'none', cursor: 'pointer',
            backgroundColor: showReviews ? '#22c55e' : '#334155',
            position: 'relative', transition: 'background-color 0.2s', flexShrink: 0,
          }}>
          <div style={{
            position: 'absolute', top: '3px', left: showReviews ? '23px' : '3px',
            width: '22px', height: '22px', borderRadius: '50%', backgroundColor: 'white',
            transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
          }} />
        </button>
      </div>
      <Field label="Google Maps Listing URL (View All Reviews button)">
        <input style={S.input} value={mapsUrl} onChange={e => onMapsUrlChange(e.target.value)} placeholder="https://www.google.com/maps/place/..." />
      </Field>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <Field label="Overall Rating (e.g. 4.9)">
          <select style={{ ...S.input, cursor: 'pointer' }} value={overallRating} onChange={e => onOverallRatingChange(Number(e.target.value))}>
            {[5.0, 4.9, 4.8, 4.7, 4.6, 4.5, 4.4, 4.3, 4.2, 4.1, 4.0, 3.9, 3.8, 3.7, 3.6, 3.5].map(n => <option key={n} value={n}>{n.toFixed(1)} ★</option>)}
          </select>
        </Field>
        <Field label="Review Count Label (e.g. 150+ Google reviews)">
          <input style={S.input} value={reviewCountLabel} maxLength={40} onChange={e => onReviewCountLabelChange(e.target.value)} placeholder="150+ Google reviews" />
          <CharCount value={reviewCountLabel} max={40} />
        </Field>
      </div>
      {reviews.map(r => {
        const hasPhoto = !!(photoPreviews[r.id] || r.photo);
        return (
          <div key={r.id} style={{ ...S.card, opacity: dragId === r.id ? 0.5 : 1 }}
            draggable onDragStart={e => onDragStart(e, r.id)} onDragOver={onDragOver} onDrop={e => onDrop(e, r.id)} onDragEnd={() => setDragId(null)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <GripVertical size={16} color="#475569" style={{ cursor: 'grab' }} />
              <span style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600 }}>{r.name || 'Untitled review'}</span>
            </div>
            <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <PhotoUploader currentSrc={r.photo} previewDataUrl={photoPreviews[r.id] || null} label="Profile Photo (optional)"
                  onFileSelected={(file, preview) => { setPhotoErr(e => ({ ...e, [r.id]: '' })); onPhotoQueued(r.id, file, preview); }}
                  onError={msg => setPhotoErr(e => ({ ...e, [r.id]: msg }))} />
                {hasPhoto && (
                  <button onClick={() => clearPhoto(r.id)} style={{ ...S.btnDanger, alignSelf: 'flex-start', padding: '0.25rem 0.6rem', fontSize: '0.7rem' }}>
                    <X size={11} /> Remove
                  </button>
                )}
                {photoErr[r.id] && <p style={{ color: '#f87171', fontSize: '0.75rem', margin: 0 }}>{photoErr[r.id]}</p>}
              </div>
              <div style={{ flex: 1, minWidth: '260px', display: 'grid', gridTemplateColumns: '1fr 100px 100px 1fr', gap: '0.75rem' }}>
                <Field label="Reviewer Name">
                  <input style={S.input} value={r.name} maxLength={60} onChange={e => { update(r.id, 'name', e.target.value); if (!r.initials) update(r.id, 'initials', initialsFrom(e.target.value)); }} placeholder="e.g. Sarah M." />
                </Field>
                <Field label="Initials">
                  <input style={S.input} value={r.initials} maxLength={3} onChange={e => update(r.id, 'initials', e.target.value.toUpperCase())} placeholder="SM" />
                </Field>
                <Field label="Rating">
                  <select style={{ ...S.input, cursor: 'pointer' }} value={r.rating} onChange={e => update(r.id, 'rating', Number(e.target.value))}>
                    {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} ★</option>)}
                  </select>
                </Field>
                <Field label="Date Label">
                  <input style={S.input} value={r.date} maxLength={30} onChange={e => update(r.id, 'date', e.target.value)} placeholder="e.g. 2 weeks ago" />
                </Field>
              </div>
            </div>
            <Field label="Review Text">
              <textarea style={S.textarea} value={r.text} maxLength={500} onChange={e => update(r.id, 'text', e.target.value)} rows={3} />
              <CharCount value={r.text} max={500} />
            </Field>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button style={S.btnDanger} onClick={() => remove(r.id)}><Trash2 size={14} /> Remove Review</button>
            </div>
          </div>
        );
      })}
      <button style={{ ...S.btnGhost, width: '100%', justifyContent: 'center', padding: '0.75rem' }} onClick={add}><Plus size={16} /> Add Review</button>
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

function PlumbingEditor({ content, onChange, onPhotoQueued, photoPreviews, onClearPending }: { content: SiteContent; onChange: (c: SiteContent) => void; onPhotoQueued: (id: string, file: File, preview: string) => void; photoPreviews: Record<string, string>; onClearPending: (id: string) => void }) {
  const p = content.plumbing;
  const setField = (field: keyof typeof p, value: any) => onChange({ ...content, plumbing: { ...p, [field]: value } });
  return (
    <div>
      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>Edit everything shown on the Plumbing page — hero, contact buttons, guarantees, services, benefits, and Google reviews.</p>
      <SectionHeading>Hero Section</SectionHeading>
      <Field label="Main Heading">
        <input style={S.input} value={p.heroHeading} maxLength={60} onChange={e => setField('heroHeading', e.target.value)} />
        <CharCount value={p.heroHeading} max={60} />
      </Field>
      <Field label="Subtitle">
        <textarea style={S.textarea} value={p.heroSubtitle} maxLength={220} onChange={e => setField('heroSubtitle', e.target.value)} rows={3} />
        <CharCount value={p.heroSubtitle} max={220} />
      </Field>
      <SectionHeading>Contact Buttons</SectionHeading>
      <p style={{ color: '#475569', fontSize: '0.8rem', marginBottom: '1rem', marginTop: '-0.75rem' }}>Leave a number empty to hide that call button on this page. These override the global phone settings; if blank, the global numbers are used.</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <Field label="Button 1 — Number (optional)"><input style={S.input} value={p.phone1} onChange={e => setField('phone1', e.target.value)} placeholder="+61412242997 (or leave blank)" /></Field>
        <Field label="Button 1 — Display Name">
          <input style={S.input} value={p.phone1Name} maxLength={30} onChange={e => setField('phone1Name', e.target.value)} placeholder="John" />
          <CharCount value={p.phone1Name} max={30} />
        </Field>
        <Field label="Button 2 — Number (optional)"><input style={S.input} value={p.phone2} onChange={e => setField('phone2', e.target.value)} placeholder="+61426051275 (or leave blank)" /></Field>
        <Field label="Button 2 — Display Name">
          <input style={S.input} value={p.phone2Name} maxLength={30} onChange={e => setField('phone2Name', e.target.value)} placeholder="Leo" />
          <CharCount value={p.phone2Name} max={30} />
        </Field>
      </div>
      <ConfigItemListEditor items={p.guarantees} onChange={v => setField('guarantees', v)} label="Guarantees" titleMax={28} subtitleMax={36} addLabel="Add Guarantee" />
      <ConfigItemListEditor items={p.services} onChange={v => setField('services', v)} label="Services" titleMax={30} subtitleMax={40} showSubtitle={false} addLabel="Add Service" />
      <ConfigItemListEditor items={p.benefits} onChange={v => setField('benefits', v)} label="Benefits" titleMax={50} subtitleMax={40} showSubtitle={false} addLabel="Add Benefit" />
      <ReviewsEditor reviews={p.reviews} onChange={v => setField('reviews', v)} mapsUrl={p.mapsUrl} onMapsUrlChange={v => setField('mapsUrl', v)} overallRating={p.overallRating} onOverallRatingChange={v => setField('overallRating', v)} reviewCountLabel={p.reviewCountLabel} onReviewCountLabelChange={v => setField('reviewCountLabel', v)} showReviews={p.showReviews} onShowReviewsChange={v => setField('showReviews', v)} onPhotoQueued={onPhotoQueued} photoPreviews={photoPreviews} onClearPending={onClearPending} />
    </div>
  );
}

// ─── Electrical Editor ────────────────────────────────────────────────────────

function ElectricalEditor({ content, onChange, onPhotoQueued, photoPreviews, onClearPending }: { content: SiteContent; onChange: (c: SiteContent) => void; onPhotoQueued: (id: string, file: File, preview: string) => void; photoPreviews: Record<string, string>; onClearPending: (id: string) => void }) {
  const e = content.electrical;
  const setField = (field: keyof typeof e, value: any) => onChange({ ...content, electrical: { ...e, [field]: value } });
  return (
    <div>
      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>Edit everything shown on the Electrical page — hero, contact buttons, guarantees, services, benefits, and Google reviews.</p>
      <SectionHeading>Hero Section</SectionHeading>
      <Field label="Main Heading">
        <input style={S.input} value={e.heroHeading} maxLength={60} onChange={e2 => setField('heroHeading', e2.target.value)} />
        <CharCount value={e.heroHeading} max={60} />
      </Field>
      <Field label="Subtitle">
        <textarea style={S.textarea} value={e.heroSubtitle} maxLength={220} onChange={e2 => setField('heroSubtitle', e2.target.value)} rows={3} />
        <CharCount value={e.heroSubtitle} max={220} />
      </Field>
      <SectionHeading>Contact Buttons</SectionHeading>
      <p style={{ color: '#475569', fontSize: '0.8rem', marginBottom: '1rem', marginTop: '-0.75rem' }}>Leave a number empty to hide that call button on this page. These override the global phone settings; if blank, the global numbers are used.</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <Field label="Button 1 — Number (optional)"><input style={S.input} value={e.phone1} onChange={e2 => setField('phone1', e2.target.value)} placeholder="+61412242997 (or leave blank)" /></Field>
        <Field label="Button 1 — Display Name">
          <input style={S.input} value={e.phone1Name} maxLength={30} onChange={e2 => setField('phone1Name', e2.target.value)} placeholder="John" />
          <CharCount value={e.phone1Name} max={30} />
        </Field>
        <Field label="Button 2 — Number (optional)"><input style={S.input} value={e.phone2} onChange={e2 => setField('phone2', e2.target.value)} placeholder="+61426051275 (or leave blank)" /></Field>
        <Field label="Button 2 — Display Name">
          <input style={S.input} value={e.phone2Name} maxLength={30} onChange={e2 => setField('phone2Name', e2.target.value)} placeholder="Leo" />
          <CharCount value={e.phone2Name} max={30} />
        </Field>
      </div>
      <ConfigItemListEditor items={e.guarantees} onChange={v => setField('guarantees', v)} label="Guarantees" titleMax={28} subtitleMax={36} addLabel="Add Guarantee" />
      <ConfigItemListEditor items={e.services} onChange={v => setField('services', v)} label="Services" titleMax={30} subtitleMax={40} showSubtitle={false} addLabel="Add Service" />
      <ConfigItemListEditor items={e.benefits} onChange={v => setField('benefits', v)} label="Benefits" titleMax={50} subtitleMax={40} showSubtitle={false} addLabel="Add Benefit" />
      <ReviewsEditor reviews={e.reviews} onChange={v => setField('reviews', v)} mapsUrl={e.mapsUrl} onMapsUrlChange={v => setField('mapsUrl', v)} overallRating={e.overallRating} onOverallRatingChange={v => setField('overallRating', v)} reviewCountLabel={e.reviewCountLabel} onReviewCountLabelChange={v => setField('reviewCountLabel', v)} showReviews={e.showReviews} onShowReviewsChange={v => setField('showReviews', v)} onPhotoQueued={onPhotoQueued} photoPreviews={photoPreviews} onClearPending={onClearPending} />
    </div>
  );
}

// ─── Building Contact Editor ──────────────────────────────────────────────────

function BuildingContactEditor({ content, onChange }: { content: SiteContent; onChange: (c: SiteContent) => void }) {
  const b = content.building;
  const setField = (field: keyof typeof b, value: any) => onChange({ ...content, building: { ...b, [field]: value } });
  return (
    <div style={{ marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid #1e3a5f' }}>
      <SectionHeading>Building Page — Contact Section</SectionHeading>
      <p style={{ color: '#475569', fontSize: '0.85rem', marginBottom: '1rem' }}>Configure the heading, subtitle, and contact buttons that appear at the bottom of the Building page.</p>
      <Field label="Section Heading">
        <input style={S.input} value={b.contactHeading} maxLength={40} onChange={e => setField('contactHeading', e.target.value)} />
        <CharCount value={b.contactHeading} max={40} />
      </Field>
      <Field label="Section Subtitle">
        <textarea style={S.textarea} value={b.contactSubtitle} maxLength={220} onChange={e => setField('contactSubtitle', e.target.value)} rows={2} />
        <CharCount value={b.contactSubtitle} max={220} />
      </Field>
      <p style={{ color: '#475569', fontSize: '0.8rem', marginBottom: '1rem' }}>Leave a number empty to hide that call button. Numbers default to the global settings.</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <Field label="Button 1 — Number (optional)"><input style={S.input} value={b.phone1} onChange={e => setField('phone1', e.target.value)} placeholder="+61412242997 (or leave blank)" /></Field>
        <Field label="Button 1 — Display Name">
          <input style={S.input} value={b.phone1Name} maxLength={30} onChange={e => setField('phone1Name', e.target.value)} placeholder="John" />
          <CharCount value={b.phone1Name} max={30} />
        </Field>
        <Field label="Button 2 — Number (optional)"><input style={S.input} value={b.phone2} onChange={e => setField('phone2', e.target.value)} placeholder="+61426051275 (or leave blank)" /></Field>
        <Field label="Button 2 — Display Name">
          <input style={S.input} value={b.phone2Name} maxLength={30} onChange={e => setField('phone2Name', e.target.value)} placeholder="Leo" />
          <CharCount value={b.phone2Name} max={30} />
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
  const updateImgStyle = (id: string, key: string, value: string) => onChange(members.map(m => {
    if (m.id !== id) return m;
    const style = { ...(m.imgStyle || {}) };
    if (value) style[key] = value;
    else delete style[key];
    return { ...m, imgStyle: Object.keys(style).length > 0 ? style : null };
  }));
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
                <SectionHeading>Photo Positioning (optional)</SectionHeading>
                <p style={{ color: '#475569', fontSize: '0.78rem', marginTop: '-0.75rem', marginBottom: '1rem' }}>Adjust how the photo is cropped or scaled. Leave blank to use defaults.</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <Field label="Transform Origin">
                    <input style={S.input} value={(m.imgStyle?.transformOrigin) || ''} maxLength={40}
                      onChange={e => updateImgStyle(m.id, 'transformOrigin', e.target.value)}
                      placeholder="e.g. center 55%" />
                  </Field>
                  <Field label="Transform (CSS)">
                    <input style={S.input} value={(m.imgStyle?.transform) || ''} maxLength={40}
                      onChange={e => updateImgStyle(m.id, 'transform', e.target.value)}
                      placeholder="e.g. scale(1.0)" />
                  </Field>
                </div>
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
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Enter your access token to continue</p>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={S.label}>Access Token</label>
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
  const [deploying, setDeploying] = useState(false);
  const [deployPhase, setDeployPhase] = useState<DeployPhase | null>(null);
  const [saveMsg, setSaveMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loadError, setLoadError] = useState('');
  const [pendingDeletes, setPendingDeletes] = useState<Set<string>>(new Set());
  const snapshotRef = useRef(sessionStorage.getItem('urbanpro_snapshot') || '');
  const headShaRef = useRef('');

  useEffect(() => {
    const saved = loadToken();
    if (saved && !content) loadContent(saved);
  }, []);

  const loadContent = async (tok: string) => {
    setLoadError('');
    try {
      const headSha = await getHeadSha(tok);
      const file = await getFile(tok, CONTENT_PATH, headSha);
      const merged = merge(JSON.parse(file.content));
      headShaRef.current = headSha;
      setContent(merged);
      snapshotRef.current = JSON.stringify(merged);
      sessionStorage.setItem('urbanpro_snapshot', snapshotRef.current);
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
    setContent(c => {
      if (!c) return c;
      const project = c.buildingProjects.find(p => p.id === projectId);
      const removedPath = project?.photos?.[idx];
      if (removedPath) setPendingDeletes(d => new Set([...d, 'public/' + removedPath]));
      return { ...c, buildingProjects: c.buildingProjects.map(p => p.id === projectId ? { ...p, photos: p.photos.filter((_, i) => i !== idx) } : p) };
    });
  };
  const removeGalleryPending = (key: string) => {
    setPendingGallery(g => { const n = { ...g }; delete n[key]; return n; });
    setPhotoPreviews(p => { const n = { ...p }; delete n[key]; return n; });
  };
  const clearPendingPhoto = (id: string) => {
    setPendingPhotos(p => { const n = { ...p }; delete n[id]; return n; });
    setPhotoPreviews(p => { const n = { ...p }; delete n[id]; return n; });
  };
  const pendingGalleryKeys = (projectId: string, prefix = 'gallery') => Object.keys(pendingGallery).filter(k => k.startsWith(projectId + '-' + prefix + '-'));

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

    if (JSON.stringify(content.building) !== JSON.stringify(snap.building)) {
      tabs.add('building');
    }
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
      if (id.startsWith('fp-after-') || id.startsWith('fp-before-')) tabs.add('building');
      if (id.startsWith('rev-')) { tabs.add('plumbing'); tabs.add('electrical'); }
    }
    if (Object.keys(pendingGallery).length > 0) tabs.add('building');

    return { dirtyTabs: tabs, dirtyBuildingCategories: cats };
  }, [content, pendingPhotos, pendingGallery]);

  // Warn before leaving if there are unsaved changes (uses ref to avoid re-registering on every keystroke)
  const hasUnsavedRef = useRef(false);
  useEffect(() => {
    const needsWarn = dirtyTabs.size > 0 || Object.keys(pendingPhotos).length > 0 || Object.keys(pendingGallery).length > 0;
    if (needsWarn === hasUnsavedRef.current) return;
    hasUnsavedRef.current = needsWarn;
    if (needsWarn) {
      const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); };
      window.addEventListener('beforeunload', handler);
      return () => window.removeEventListener('beforeunload', handler);
    }
  }, [dirtyTabs, pendingPhotos, pendingGallery]);

  const handleSave = async () => {
    if (!content) return;
    setSaving(true); setDeploying(false); setSaveMsg(null);
    try {
      const updated = JSON.parse(JSON.stringify(content)) as SiteContent;
      const files: Array<{ path: string; content: string }> = [];

      // Prepare cover photo + floor plan uploads
      for (const [id, file] of Object.entries(pendingPhotos)) {
        const base64 = await readFileAsBase64(file);
        const fname = sanitiseFilename(file.name);
        const imagePath = `images/${fname}`;
        files.push({ path: `public/images/${fname}`, content: base64 });
        if (id.startsWith('fp-after-')) {
          const pid = id.slice('fp-after-'.length);
          updated.buildingProjects = updated.buildingProjects.map(p => p.id === pid ? { ...p, floorPlanAfter: imagePath } : p);
        } else if (id.startsWith('fp-before-')) {
          const pid = id.slice('fp-before-'.length);
          updated.buildingProjects = updated.buildingProjects.map(p => p.id === pid ? { ...p, floorPlanBefore: imagePath } : p);
        } else if (id.startsWith('rev-')) {
          updated.plumbing.reviews = updated.plumbing.reviews.map(r => r.id === id ? { ...r, photo: imagePath } : r);
          updated.electrical.reviews = updated.electrical.reviews.map(r => r.id === id ? { ...r, photo: imagePath } : r);
        } else {
          updated.team = updated.team.map(m => m.id === id ? { ...m, photo: imagePath } : m);
          updated.buildingProjects = updated.buildingProjects.map(p => p.id === id ? { ...p, image: imagePath } : p);
        }
      }

      // Prepare gallery photo uploads
      for (const [key, file] of Object.entries(pendingGallery)) {
        const base64 = await readFileAsBase64(file);
        const fname = sanitiseFilename(file.name);
        files.push({ path: `public/images/${fname}`, content: base64 });
        if (key.includes('-beforegal-')) {
          const projectId = key.split('-beforegal-')[0];
          updated.buildingProjects = updated.buildingProjects.map(p =>
            p.id === projectId ? { ...p, beforePhotos: [...(p.beforePhotos || []), `images/${fname}`] } : p
          );
        } else {
          const projectId = key.split('-gallery-')[0];
          updated.buildingProjects = updated.buildingProjects.map(p =>
            p.id === projectId ? { ...p, photos: [...(p.photos || []), `images/${fname}`] } : p
          );
        }
      }

      // Add content.json as the last file
      files.push({ path: CONTENT_PATH, content: JSON.stringify(updated, null, 2) });

      // Compute safe-to-delete paths: only delete if no longer referenced in updated content
      const allRefs = new Set<string>();
      for (const p of updated.buildingProjects) {
        if (p.image) allRefs.add('public/' + p.image);
        for (const ph of (p.photos || [])) allRefs.add('public/' + ph);
        for (const ph of (p.beforePhotos || [])) allRefs.add('public/' + ph);
        if (p.floorPlanAfter) allRefs.add('public/' + p.floorPlanAfter);
        if (p.floorPlanBefore) allRefs.add('public/' + p.floorPlanBefore);
      }
      for (const m of updated.team) { if (m.photo) allRefs.add('public/' + m.photo); }
      for (const r of updated.plumbing.reviews) { if (r.photo) allRefs.add('public/' + r.photo); }
      for (const r of updated.electrical.reviews) { if (r.photo) allRefs.add('public/' + r.photo); }
      const safeDeletes = [...pendingDeletes].filter(dp => !allRefs.has(dp));

      // Single atomic commit with deletions
      const commitSha = await batchCommit(token, files, 'Admin: update site content', { deletePaths: safeDeletes, expectedBaseSha: headShaRef.current });
      headShaRef.current = commitSha; // Update immediately — commit is on GitHub regardless of deploy outcome
      setPendingDeletes(new Set());
      setSaving(false);

      // Wait for deploy to complete, reporting progress
      setDeploying(true);
      const result = await waitForDeploy(token, commitSha, phase => setDeployPhase(phase));
      setDeploying(false);
      setDeployPhase(null);

      if (result === 'success') {
        setContent(updated);
        snapshotRef.current = JSON.stringify(updated);
        sessionStorage.setItem('urbanpro_snapshot', snapshotRef.current);
        setPendingPhotos({}); setPhotoPreviews({}); setPendingGallery({});
        bustContentCache();
        setSaveMsg({ type: 'success', text: '✓ Saved and deployed successfully.' });
      } else if (result === 'failure') {
        setSaveMsg({ type: 'error', text: '✗ Deploy failed. Changes committed but site not updated. Please contact Daniel Chen for technical support.' });
      } else {
        // timeout — assume success but warn
        setContent(updated);
        snapshotRef.current = JSON.stringify(updated);
        sessionStorage.setItem('urbanpro_snapshot', snapshotRef.current);
        setPendingPhotos({}); setPhotoPreviews({}); setPendingGallery({});
        bustContentCache();
        setSaveMsg({ type: 'success', text: '✓ Changes saved. Site will update shortly.' });
      }
    } catch (e: any) {
      if (e.message?.startsWith('CONCURRENT_EDIT:')) {
        // Reset saving state before reload so UI stays responsive
        setSaving(false); setDeploying(false); setDeployPhase(null);
        await loadContent(token);
        setPendingPhotos({}); setPhotoPreviews({}); setPendingGallery({});
        setPendingDeletes(new Set());
        setSaveMsg({ type: 'error', text: 'Someone else made changes while you were editing. Content has been reloaded with the latest version — your unsaved edits were discarded. Please re-apply your changes.' });
      } else {
        setSaveMsg({ type: 'error', text: 'Save failed: ' + e.message + '. Please contact Daniel Chen for technical support if this persists.' });
      }
    } finally {
      setSaving(false);
      setDeploying(false);
      setDeployPhase(null);
      setTimeout(() => setSaveMsg(null), 15000);
    }
  };

  if (!authed) return <LoginScreen onLogin={handleLogin} />;
  const hasPending = Object.keys(pendingPhotos).length + Object.keys(pendingGallery).length;
  const hasAnyChanges = dirtyTabs.size > 0;
  const isSaving = saving || deploying;
  const saveLabel = saving ? 'Saving...' : deploying ? 'Deploying...' : 'Save All Changes';

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
          <button onClick={handleSave} disabled={isSaving || !content || (!hasAnyChanges && !deploying)}
            style={{ ...S.btnPrimary, opacity: (isSaving || (!hasAnyChanges && !deploying)) ? 0.45 : 1, cursor: (!hasAnyChanges && !deploying) ? 'not-allowed' : 'pointer' }}>
            <Save size={16} />{saveLabel}
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

      {/* Deploy progress bar */}
      {deploying && (
        <div style={{ padding: '1rem 1.5rem', backgroundColor: '#0f1a2e', borderBottom: '1px solid #1e3a5f' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '0.6rem', flexWrap: 'wrap' }}>
            {[
              { label: 'Committed', done: deployPhase !== 'failed', failed: false },
              { label: 'Building & Testing', done: deployPhase === 'done', active: deployPhase === 'queued' || deployPhase === 'building', failed: deployPhase === 'failed' },
              { label: 'Deploying to Site', done: deployPhase === 'done', active: deployPhase === 'building', failed: deployPhase === 'failed' },
            ].map((step) => (
              <div key={step.label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: step.failed ? '#f87171' : step.done ? '#4ade80' : step.active ? '#60a5fa' : '#475569', fontWeight: 600 }}>
                <span>{step.failed ? '✗' : step.done ? '✓' : step.active ? '◐' : '○'}</span>
                <span>{step.label}</span>
              </div>
            ))}
          </div>
          <div style={{ maxWidth: '500px', margin: '0 auto', height: '4px', backgroundColor: '#1e293b', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: '2px',
              backgroundColor: deployPhase === 'failed' ? '#ef4444' : '#3b82f6',
              width: deployPhase === 'failed' ? '100%' : deployPhase === 'done' ? '100%' : deployPhase === 'building' ? '60%' : '20%',
              transition: 'width 0.5s ease, background-color 0.3s ease',
            }} />
          </div>
          <p style={{ textAlign: 'center', margin: '0.5rem 0 0', fontSize: '0.72rem', color: '#475569' }}>
            This usually takes 1–2 minutes. Please don't close this page.
          </p>
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
          {activeTab === 'plumbing' && <PlumbingEditor content={content} onChange={setContent} onPhotoQueued={queuePhoto} photoPreviews={photoPreviews} onClearPending={clearPendingPhoto} />}
          {activeTab === 'electrical' && <ElectricalEditor content={content} onChange={setContent} onPhotoQueued={queuePhoto} photoPreviews={photoPreviews} onClearPending={clearPendingPhoto} />}
          {activeTab === 'about' && <AboutEditor content={content} onChange={setContent} onPhotoQueued={queuePhoto} photoPreviews={photoPreviews} />}
          {activeTab === 'building' && (<>
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
              onClearPending={clearPendingPhoto}
            />
            <BuildingContactEditor content={content} onChange={setContent} />
          </>)}
        </div>
      )}
    </div>
  );
}

