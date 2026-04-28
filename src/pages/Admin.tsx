import { useState, useRef, useEffect } from 'react';
import { Plus, Trash2, Upload, LogOut, Save, Eye, EyeOff, ChevronDown, ChevronUp, GripVertical } from 'lucide-react';
import {
  verifyToken,
  getFile,
  saveFile,
  uploadImage,
  readFileAsBase64,
  sanitiseFilename,
} from '../services/github';
import { bustContentCache } from '../hooks/useContent';
import type { SiteContent, TeamMember, BuildingProject } from '../hooks/useContent';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SESSION_KEY = 'urbanpro_admin_token';

function saveToken(t: string) { sessionStorage.setItem(SESSION_KEY, t); }
function loadToken() { return sessionStorage.getItem(SESSION_KEY) || ''; }
function clearToken() { sessionStorage.removeItem(SESSION_KEY); }

const CONTENT_PATH = 'public/data/content.json';
const CATEGORIES = ['New Builds', 'Renovations', 'Small Projects'] as const;

// ─── Shared styles ─────────────────────────────────────────────────────────────

const S = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#0b1220',
    color: '#e2e8f0',
    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  } as React.CSSProperties,
  input: {
    width: '100%',
    padding: '0.7rem 0.9rem',
    backgroundColor: '#1e293b',
    color: '#e2e8f0',
    border: '1px solid #334155',
    borderRadius: '6px',
    fontSize: '0.95rem',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
    fontFamily: 'inherit',
  } as React.CSSProperties,
  textarea: {
    width: '100%',
    padding: '0.7rem 0.9rem',
    backgroundColor: '#1e293b',
    color: '#e2e8f0',
    border: '1px solid #334155',
    borderRadius: '6px',
    fontSize: '0.95rem',
    outline: 'none',
    resize: 'vertical' as const,
    minHeight: '100px',
    boxSizing: 'border-box' as const,
    fontFamily: 'inherit',
    lineHeight: 1.6,
  } as React.CSSProperties,
  label: {
    display: 'block',
    fontSize: '0.78rem',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
    color: '#94a3b8',
    marginBottom: '0.4rem',
  } as React.CSSProperties,
  card: {
    backgroundColor: '#131f35',
    border: '1px solid #1e3a5f',
    borderRadius: '10px',
    padding: '1.5rem',
    marginBottom: '1.25rem',
  } as React.CSSProperties,
  btnPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 700,
    fontSize: '0.9rem',
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'background-color 0.2s',
  } as React.CSSProperties,
  btnDanger: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.4rem 0.75rem',
    backgroundColor: 'transparent',
    color: '#f87171',
    border: '1px solid #7f1d1d',
    borderRadius: '5px',
    fontWeight: 600,
    fontSize: '0.8rem',
    cursor: 'pointer',
    fontFamily: 'inherit',
  } as React.CSSProperties,
  btnGhost: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.6rem 1.2rem',
    backgroundColor: 'transparent',
    color: '#94a3b8',
    border: '1px solid #334155',
    borderRadius: '6px',
    fontWeight: 600,
    fontSize: '0.85rem',
    cursor: 'pointer',
    fontFamily: 'inherit',
  } as React.CSSProperties,
};

// ─── Photo Uploader ────────────────────────────────────────────────────────────

interface PhotoUploaderProps {
  currentSrc: string;
  previewDataUrl: string | null;
  onFileSelected: (file: File, preview: string) => void;
  label?: string;
}

function PhotoUploader({ currentSrc, previewDataUrl, onFileSelected, label = 'Photo' }: PhotoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = e => onFileSelected(file, e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const displayed = previewDataUrl || currentSrc;

  return (
    <div>
      <label style={S.label}>{label}</label>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => {
          e.preventDefault();
          const f = e.dataTransfer.files[0];
          if (f) handleFile(f);
        }}
        style={{
          width: '100px',
          height: '100px',
          borderRadius: '8px',
          overflow: 'hidden',
          border: '2px dashed #334155',
          cursor: 'pointer',
          position: 'relative',
          backgroundColor: '#1e293b',
          flexShrink: 0,
        }}
      >
        {displayed ? (
          <img src={displayed} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#475569', fontSize: '0.7rem', gap: '0.4rem' }}>
            <Upload size={20} />
            Upload
          </div>
        )}
        <div style={{
          position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: 0, transition: 'opacity 0.2s',
        }} className="photo-overlay">
          <Upload size={20} color="white" />
        </div>
      </div>
      {previewDataUrl && (
        <p style={{ fontSize: '0.72rem', color: '#22c55e', marginTop: '0.4rem' }}>New photo selected — will upload on save</p>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
      />
      <style>{`.photo-overlay:hover { opacity: 1 !important; }`}</style>
    </div>
  );
}

// ─── Team Editor ───────────────────────────────────────────────────────────────

interface TeamEditorProps {
  members: TeamMember[];
  onChange: (members: TeamMember[]) => void;
  pendingPhotos: Record<string, File>;
  onPhotoQueued: (id: string, file: File, preview: string) => void;
  photoPreviews: Record<string, string>;
}

function TeamEditor({ members, onChange, onPhotoQueued, photoPreviews }: TeamEditorProps) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const update = (id: string, field: keyof TeamMember, value: string) => {
    onChange(members.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const remove = (id: string) => {
    if (!confirm('Are you sure you want to remove this team member?')) return;
    onChange(members.filter(m => m.id !== id));
  };

  const add = () => {
    const id = `member-${Date.now()}`;
    onChange([...members, { id, name: 'New Team Member', role: 'Role', bio: '', photo: '', imgStyle: null }]);
  };

  return (
    <div>
      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
        Add, edit or remove people from the Meet the Team section. Click a card to expand it. Upload a new photo by clicking the photo box.
      </p>

      {members.map((m) => {
        const open = !collapsed[m.id];
        return (
          <div key={m.id} style={S.card}>
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}
              onClick={() => setCollapsed(c => ({ ...c, [m.id]: !c[m.id] }))}
            >
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #1e3a5f', flexShrink: 0, backgroundColor: '#1e293b' }}>
                {(photoPreviews[m.id] || m.photo) && (
                  <img src={photoPreviews[m.id] || m.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: 'white' }}>{m.name || 'Unnamed'}</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{m.role || 'No role set'}</div>
              </div>
              <GripVertical size={16} color="#475569" />
              {open ? <ChevronUp size={18} color="#475569" /> : <ChevronDown size={18} color="#475569" />}
            </div>

            {open && (
              <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
                  <PhotoUploader
                    currentSrc={m.photo}
                    previewDataUrl={photoPreviews[m.id] || null}
                    onFileSelected={(file, preview) => onPhotoQueued(m.id, file, preview)}
                  />
                  <div style={{ flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    <div>
                      <label style={S.label}>Full Name</label>
                      <input style={S.input} value={m.name} onChange={e => update(m.id, 'name', e.target.value)} placeholder="e.g. John Zhao" />
                    </div>
                    <div>
                      <label style={S.label}>Job Title</label>
                      <input style={S.input} value={m.role} onChange={e => update(m.id, 'role', e.target.value)} placeholder="e.g. Lead Plumber & Co-Founder" />
                    </div>
                  </div>
                </div>
                <div>
                  <label style={S.label}>Short Description (shown on the website)</label>
                  <textarea style={S.textarea} value={m.bio} onChange={e => update(m.id, 'bio', e.target.value)} rows={5} placeholder="Write a short bio..." />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button style={S.btnDanger} onClick={() => remove(m.id)}>
                    <Trash2 size={14} /> Remove this person
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      <button style={{ ...S.btnGhost, width: '100%', justifyContent: 'center', padding: '0.85rem' }} onClick={add}>
        <Plus size={16} /> Add a New Team Member
      </button>
    </div>
  );
}

// ─── Building Projects Editor ──────────────────────────────────────────────────

interface ProjectsEditorProps {
  projects: BuildingProject[];
  onChange: (projects: BuildingProject[]) => void;
  onPhotoQueued: (id: string, file: File, preview: string) => void;
  photoPreviews: Record<string, string>;
}

function ProjectsEditor({ projects, onChange, onPhotoQueued, photoPreviews }: ProjectsEditorProps) {
  const [activeCategory, setActiveCategory] = useState<string>(CATEGORIES[0]);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const update = (id: string, field: keyof BuildingProject, value: string) => {
    onChange(projects.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const remove = (id: string) => {
    if (!confirm('Are you sure you want to remove this project?')) return;
    onChange(projects.filter(p => p.id !== id));
  };

  const add = () => {
    const id = `project-${Date.now()}`;
    onChange([...projects, { id, title: 'New Project', location: '', description: '', image: '', category: activeCategory, pano: '' }]);
  };

  const visible = projects.filter(p => p.category === activeCategory);

  return (
    <div>
      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
        Manage the projects shown in the Building page gallery. Switch between categories using the tabs below.
      </p>

      {/* Category tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '0.5rem 1.1rem',
              borderRadius: '20px',
              border: 'none',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: 'pointer',
              fontFamily: 'inherit',
              backgroundColor: activeCategory === cat ? '#3b82f6' : '#1e293b',
              color: activeCategory === cat ? 'white' : '#94a3b8',
              transition: 'all 0.2s',
            }}
          >
            {cat} ({projects.filter(p => p.category === cat).length})
          </button>
        ))}
      </div>

      {visible.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#475569', border: '1px dashed #1e3a5f', borderRadius: '8px', marginBottom: '1rem' }}>
          No projects in this category yet. Add one below.
        </div>
      )}

      {visible.map((p) => {
        const open = !collapsed[p.id];
        return (
          <div key={p.id} style={S.card}>
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}
              onClick={() => setCollapsed(c => ({ ...c, [p.id]: !c[p.id] }))}
            >
              <div style={{ width: '52px', height: '40px', borderRadius: '4px', overflow: 'hidden', flexShrink: 0, backgroundColor: '#1e293b', border: '1px solid #1e3a5f' }}>
                {(photoPreviews[p.id] || p.image) && (
                  <img src={photoPreviews[p.id] || p.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: 'white' }}>{p.title || 'Untitled'}</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{p.location || 'No location set'}</div>
              </div>
              {open ? <ChevronUp size={18} color="#475569" /> : <ChevronDown size={18} color="#475569" />}
            </div>

            {open && (
              <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
                  <PhotoUploader
                    currentSrc={p.image}
                    previewDataUrl={photoPreviews[p.id] || null}
                    onFileSelected={(file, preview) => onPhotoQueued(p.id, file, preview)}
                    label="Project Photo"
                  />
                  <div style={{ flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    <div>
                      <label style={S.label}>Project Title</label>
                      <input style={S.input} value={p.title} onChange={e => update(p.id, 'title', e.target.value)} placeholder="e.g. The Glass House" />
                    </div>
                    <div>
                      <label style={S.label}>Location</label>
                      <input style={S.input} value={p.location} onChange={e => update(p.id, 'location', e.target.value)} placeholder="e.g. Vaucluse, NSW" />
                    </div>
                    <div>
                      <label style={S.label}>Category</label>
                      <select
                        style={{ ...S.input, cursor: 'pointer' }}
                        value={p.category}
                        onChange={e => update(p.id, 'category', e.target.value)}
                      >
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
                <div>
                  <label style={S.label}>Project Description</label>
                  <textarea style={S.textarea} value={p.description} onChange={e => update(p.id, 'description', e.target.value)} rows={3} placeholder="Describe the project..." />
                </div>
                <div>
                  <label style={S.label}>360° Tour Link (optional)</label>
                  <input
                    style={S.input}
                    value={p.pano}
                    onChange={e => update(p.id, 'pano', e.target.value)}
                    placeholder="https://..."
                  />
                  <p style={{ fontSize: '0.72rem', color: '#475569', marginTop: '0.3rem' }}>
                    Paste a link to a 360° panorama image (e.g. from pannellum.org). Leave blank if you don't have one.
                  </p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button style={S.btnDanger} onClick={() => remove(p.id)}>
                    <Trash2 size={14} /> Remove this project
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      <button style={{ ...S.btnGhost, width: '100%', justifyContent: 'center', padding: '0.85rem' }} onClick={add}>
        <Plus size={16} /> Add a New Project to "{activeCategory}"
      </button>
    </div>
  );
}

// ─── Login Screen ─────────────────────────────────────────────────────────────

interface LoginProps {
  onLogin: (token: string) => void;
}

function LoginScreen({ onLogin }: LoginProps) {
  const [token, setToken] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showHelp, setShowHelp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) return;
    setLoading(true);
    setError('');
    const ok = await verifyToken(token.trim());
    setLoading(false);
    if (ok) {
      saveToken(token.trim());
      onLogin(token.trim());
    } else {
      setError('That token didn\'t work. Please double-check it and try again.');
    }
  };

  return (
    <div style={{ ...S.page, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '480px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            <span style={{ color: '#60a5fa' }}>URBAN</span><span style={{ color: '#94a3b8' }}>PRO</span>
          </div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'white', margin: '0 0 0.5rem' }}>Admin Portal</h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Enter your GitHub access token to continue</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={S.label}>GitHub Access Token</label>
            <div style={{ position: 'relative' }}>
              <input
                type={show ? 'text' : 'password'}
                value={token}
                onChange={e => setToken(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                style={{ ...S.input, paddingRight: '3rem' }}
                autoComplete="off"
              />
              <button
                type="button"
                onClick={() => setShow(s => !s)}
                style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#475569', cursor: 'pointer', display: 'flex' }}
              >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div style={{ backgroundColor: '#450a0a', border: '1px solid #7f1d1d', borderRadius: '6px', padding: '0.75rem 1rem', color: '#fca5a5', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !token.trim()}
            style={{ ...S.btnPrimary, justifyContent: 'center', padding: '0.9rem', opacity: (!token.trim() || loading) ? 0.5 : 1 }}
          >
            {loading ? 'Checking...' : 'Sign In'}
          </button>
        </form>

        {/* Help section */}
        <div style={{ marginTop: '2rem', borderTop: '1px solid #1e293b', paddingTop: '1.5rem' }}>
          <button
            onClick={() => setShowHelp(h => !h)}
            style={{ ...S.btnGhost, width: '100%', justifyContent: 'center', fontSize: '0.82rem' }}
          >
            {showHelp ? '▲' : '▼'} How do I get a token?
          </button>

          {showHelp && (
            <div style={{ marginTop: '1rem', backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', padding: '1.25rem', fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.8 }}>
              <p style={{ fontWeight: 700, color: '#e2e8f0', marginBottom: '0.75rem' }}>Follow these steps (takes about 2 minutes):</p>
              <ol style={{ paddingLeft: '1.2rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li>Open <strong style={{ color: '#60a5fa' }}>github.com</strong> and sign in to your account</li>
                <li>Click your profile picture (top right) → <strong>Settings</strong></li>
                <li>Scroll down to <strong>Developer settings</strong> (bottom of left sidebar)</li>
                <li>Click <strong>Personal access tokens</strong> → <strong>Fine-grained tokens</strong></li>
                <li>Click <strong>Generate new token</strong></li>
                <li>Give it any name (e.g. "UrbanPro Admin")</li>
                <li>Under <strong>Expiration</strong>, choose how long you want it to work</li>
                <li>Under <strong>Repository access</strong>, select <strong>Only select repositories</strong> → choose <strong>UrbanPro</strong></li>
                <li>Under <strong>Permissions → Repository permissions</strong>, set <strong>Contents</strong> to <strong>Read and write</strong></li>
                <li>Click <strong>Generate token</strong> at the bottom</li>
                <li>Copy the token that appears and paste it above</li>
              </ol>
              <p style={{ marginTop: '0.75rem', color: '#475569', fontSize: '0.8rem' }}>
                Keep this token private — treat it like a password. It's only stored in your browser while this tab is open.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Admin Component ─────────────────────────────────────────────────────

export default function Admin() {
  const [token, setToken] = useState(loadToken);
  const [authed, setAuthed] = useState(!!loadToken());
  const [content, setContent] = useState<SiteContent | null>(null);
  const [contentSha, setContentSha] = useState('');
  const [activeTab, setActiveTab] = useState<'team' | 'projects'>('team');
  const [pendingPhotos, setPendingPhotos] = useState<Record<string, File>>({});
  const [photoPreviews, setPhotoPreviews] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loadError, setLoadError] = useState('');

  // On hard refresh, token is in sessionStorage but content was never loaded
  useEffect(() => {
    const saved = loadToken();
    if (saved && !content) loadContent(saved);
  }, []);

  const handleLogin = async (tok: string) => {
    setToken(tok);
    setAuthed(true);
    await loadContent(tok);
  };

  const loadContent = async (tok: string) => {
    setLoadError('');
    try {
      const { content: raw, sha } = await getFile(tok, CONTENT_PATH);
      setContent(JSON.parse(raw));
      setContentSha(sha);
    } catch (e: any) {
      setLoadError('Could not load site content: ' + e.message);
    }
  };

  const handleLogout = () => {
    clearToken();
    setToken('');
    setAuthed(false);
    setContent(null);
  };

  const queuePhoto = (id: string, file: File, preview: string) => {
    setPendingPhotos(p => ({ ...p, [id]: file }));
    setPhotoPreviews(p => ({ ...p, [id]: preview }));
  };

  const handleSave = async () => {
    if (!content) return;
    setSaving(true);
    setSaveMsg(null);

    try {
      const updatedContent = { ...content };

      // 1. Upload any pending photos
      for (const [id, file] of Object.entries(pendingPhotos)) {
        const base64 = await readFileAsBase64(file);
        const filename = sanitiseFilename(file.name);
        const imagePath = await uploadImage(token, filename, base64);

        // Update the path in content
        updatedContent.team = updatedContent.team.map(m =>
          m.id === id ? { ...m, photo: imagePath } : m
        );
        updatedContent.buildingProjects = updatedContent.buildingProjects.map(p =>
          p.id === id ? { ...p, image: imagePath } : p
        );
      }

      // 2. Save content.json
      await saveFile(
        token,
        CONTENT_PATH,
        JSON.stringify(updatedContent, null, 2),
        contentSha,
        'Admin: update site content'
      );

      setContent(updatedContent);
      setPendingPhotos({});
      setPhotoPreviews({});

      // Clear the in-memory cache so the Building/About pages refetch after deploy
      bustContentCache();

      // Refresh SHA for next save
      const { sha } = await getFile(token, CONTENT_PATH);
      setContentSha(sha);

      setSaveMsg({ type: 'success', text: '✓ Changes saved! Your website will update in 1–2 minutes.' });
    } catch (e: any) {
      setSaveMsg({ type: 'error', text: 'Something went wrong: ' + e.message });
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg(null), 10000);
    }
  };

  if (!authed) return <LoginScreen onLogin={handleLogin} />;

  const hasPending = Object.keys(pendingPhotos).length > 0;

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        backgroundColor: '#0b1220',
        borderBottom: '1px solid #1e293b',
        padding: '0.9rem 1.5rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
        flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>
            <span style={{ color: '#60a5fa' }}>URBAN</span><span style={{ color: '#94a3b8' }}>PRO</span>
            <span style={{ color: '#475569', fontWeight: 400, fontSize: '0.8rem', marginLeft: '0.75rem' }}>Admin</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {hasPending && (
            <span style={{ fontSize: '0.78rem', color: '#f59e0b', fontWeight: 600 }}>
              {Object.keys(pendingPhotos).length} photo{Object.keys(pendingPhotos).length > 1 ? 's' : ''} ready to upload
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving || !content}
            style={{ ...S.btnPrimary, opacity: saving ? 0.6 : 1 }}
          >
            <Save size={16} />
            {saving ? 'Saving...' : 'Save All Changes'}
          </button>
          <button onClick={handleLogout} style={S.btnGhost}>
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      </div>

      {/* Save message banner */}
      {saveMsg && (
        <div style={{
          padding: '0.85rem 1.5rem',
          backgroundColor: saveMsg.type === 'success' ? '#052e16' : '#450a0a',
          borderBottom: `1px solid ${saveMsg.type === 'success' ? '#15803d' : '#7f1d1d'}`,
          color: saveMsg.type === 'success' ? '#4ade80' : '#fca5a5',
          fontSize: '0.9rem',
          fontWeight: 600,
          textAlign: 'center',
        }}>
          {saveMsg.text}
        </div>
      )}

      {!content && !loadError && (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#475569' }}>Loading site content...</div>
      )}

      {loadError && (
        <div style={{ margin: '2rem', padding: '1.25rem', backgroundColor: '#450a0a', border: '1px solid #7f1d1d', borderRadius: '8px', color: '#fca5a5' }}>
          <strong>Could not load content.</strong> {loadError}
          <br /><br />
          <button onClick={() => loadContent(token)} style={S.btnGhost}>Try Again</button>
        </div>
      )}

      {content && (
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '2rem 1.25rem' }}>
          {/* Tab bar */}
          <div style={{ display: 'flex', gap: '0', marginBottom: '2rem', borderBottom: '1px solid #1e293b' }}>
            {([['team', '👥 Meet the Team'], ['projects', '🏗️ Building Projects']] as const).map(([tab, label]) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '0.85rem 1.5rem',
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === tab ? '2px solid #3b82f6' : '2px solid transparent',
                  color: activeTab === tab ? '#60a5fa' : '#64748b',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s',
                  marginBottom: '-1px',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Team tab */}
          {activeTab === 'team' && (
            <TeamEditor
              members={content.team}
              onChange={team => setContent(c => c ? { ...c, team } : c)}
              pendingPhotos={pendingPhotos}
              onPhotoQueued={queuePhoto}
              photoPreviews={photoPreviews}
            />
          )}

          {/* Projects tab */}
          {activeTab === 'projects' && (
            <ProjectsEditor
              projects={content.buildingProjects}
              onChange={buildingProjects => setContent(c => c ? { ...c, buildingProjects } : c)}
              onPhotoQueued={queuePhoto}
              photoPreviews={photoPreviews}
            />
          )}

          {/* Bottom save */}
          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #1e293b', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={handleSave}
              disabled={saving || !content}
              style={{ ...S.btnPrimary, opacity: saving ? 0.6 : 1, padding: '0.85rem 2.5rem' }}
            >
              <Save size={16} />
              {saving ? 'Saving...' : 'Save All Changes'}
            </button>
          </div>

          <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.78rem', color: '#334155', lineHeight: 1.6 }}>
            Changes are saved directly to GitHub and will appear on the website within 1–2 minutes.
            <br />Your session is private to this browser tab and will sign out when you close it.
          </p>
        </div>
      )}
    </div>
  );
}
