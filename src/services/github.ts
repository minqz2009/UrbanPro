const REPO_OWNER = 'minqz2009';
const REPO_NAME = 'UrbanPro';
const BRANCH = 'main';
const API = 'https://api.github.com';

function headers(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
  };
}

export async function verifyToken(token: string): Promise<boolean> {
  const res = await fetch(`${API}/repos/${REPO_OWNER}/${REPO_NAME}`, {
    headers: headers(token),
  });
  return res.ok;
}

export async function getFile(token: string, path: string): Promise<{ content: string; sha: string }> {
  const res = await fetch(`${API}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}?ref=${BRANCH}`, {
    headers: headers(token),
  });
  if (!res.ok) throw new Error(`Could not read file: ${res.status}`);
  const data = await res.json();
  const content = decodeURIComponent(
    atob(data.content.replace(/\n/g, ''))
      .split('')
      .map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
      .join('')
  );
  return { content, sha: data.sha };
}

export async function saveFile(
  token: string,
  path: string,
  content: string,
  sha: string,
  message: string
): Promise<void> {
  const encoded = btoa(
    encodeURIComponent(content).replace(/%([0-9A-F]{2})/g, (_, p1) =>
      String.fromCharCode(parseInt(p1, 16))
    )
  );
  const res = await fetch(`${API}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`, {
    method: 'PUT',
    headers: headers(token),
    body: JSON.stringify({ message, content: encoded, sha, branch: BRANCH }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Save failed: ${res.status}`);
  }
}

export async function uploadImage(
  token: string,
  filename: string,
  base64Data: string
): Promise<string> {
  const path = `public/images/${filename}`;

  // Check if file already exists to get its SHA (required for update)
  let sha: string | undefined;
  try {
    const existing = await fetch(`${API}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}?ref=${BRANCH}`, {
      headers: headers(token),
    });
    if (existing.ok) {
      const data = await existing.json();
      sha = data.sha;
    }
  } catch {
    // File doesn't exist yet, that's fine
  }

  const body: Record<string, string> = {
    message: `Upload image: ${filename}`,
    content: base64Data,
    branch: BRANCH,
  };
  if (sha) body.sha = sha;

  const res = await fetch(`${API}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`, {
    method: 'PUT',
    headers: headers(token),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Image upload failed: ${res.status}`);
  }

  return `images/${filename}`;
}

export function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Strip the data URL prefix (e.g. "data:image/jpeg;base64,")
      resolve(result.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function sanitiseFilename(original: string): string {
  const ts = Date.now();
  const ext = original.split('.').pop()?.toLowerCase() || 'jpg';
  const base = original
    .replace(/\.[^.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 40);
  return `${base}-${ts}.${ext}`;
}
