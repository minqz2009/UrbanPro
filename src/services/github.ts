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

export async function verifyToken(token: string): Promise<boolean | 'readonly'> {
  const res = await fetch(`${API}/repos/${REPO_OWNER}/${REPO_NAME}`, {
    headers: headers(token),
  });
  if (!res.ok) return false;
  const data = await res.json();
  if (data.permissions && !data.permissions.push) return 'readonly';
  return true;
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

// getHeadSha returns the current HEAD commit SHA for the branch.
export async function getHeadSha(token: string): Promise<string> {
  const res = await fetch(`${API}/repos/${REPO_OWNER}/${REPO_NAME}/git/ref/heads/${BRANCH}`, {
    headers: headers(token),
  });
  if (!res.ok) throw new Error(`Failed to get HEAD: ${res.status}`);
  const data = await res.json();
  return data.object.sha;
}

// batchCommit atomically commits multiple files in a single git commit using the Git Data API.
// Each file entry: { path: string; content: string } — content is raw base64 for images, UTF-8 text for JSON.
// If expectedBaseSha is provided, the commit is rejected if HEAD has moved since load (concurrent edit safety).
export async function batchCommit(
  token: string,
  files: Array<{ path: string; content: string }>,
  message: string,
  options?: { deletePaths?: string[]; expectedBaseSha?: string }
): Promise<string> {
  const h = headers(token);
  const deletePaths = options?.deletePaths;

  // 1. Get current HEAD ref
  const refRes = await fetch(`${API}/repos/${REPO_OWNER}/${REPO_NAME}/git/ref/heads/${BRANCH}`, { headers: h });
  if (!refRes.ok) {
    const err = await refRes.json().catch(() => ({}));
    throw new Error(err.message || `Failed to get ref: ${refRes.status}`);
  }
  const refData = await refRes.json();
  const baseCommitSha: string = refData.object.sha;

  // Concurrency check: if expectedBaseSha provided and HEAD moved, reject
  if (options?.expectedBaseSha && options.expectedBaseSha !== baseCommitSha) {
    throw new Error('CONCURRENT_EDIT: Someone else has made changes since you loaded this page. Please refresh and try again.');
  }

  // 2. Get the commit to find tree SHA
  const commitRes = await fetch(`${API}/repos/${REPO_OWNER}/${REPO_NAME}/git/commits/${baseCommitSha}`, { headers: h });
  if (!commitRes.ok) {
    const err = await commitRes.json().catch(() => ({}));
    throw new Error(err.message || `Failed to get commit: ${commitRes.status}`);
  }
  const commitData = await commitRes.json();
  const baseTreeSha: string = commitData.tree.sha;

  // 3. Create blobs for each new/modified file
  const treeEntries: Array<{ path: string; mode: string; type: string; sha: string | null }> = [];
  for (const file of files) {
    const isImage = file.path.startsWith('public/images/');
    const blobBody: Record<string, string> = { content: file.content };
    if (isImage) blobBody.encoding = 'base64';

    const blobRes = await fetch(`${API}/repos/${REPO_OWNER}/${REPO_NAME}/git/blobs`, {
      method: 'POST',
      headers: h,
      body: JSON.stringify(blobBody),
    });
    if (!blobRes.ok) {
      const err = await blobRes.json().catch(() => ({}));
      throw new Error(err.message || `Failed to create blob for ${file.path}: ${blobRes.status}`);
    }
    const blobData = await blobRes.json();
    treeEntries.push({ path: file.path, mode: '100644', type: 'blob', sha: blobData.sha });
  }

  // 3b. Mark deleted files for removal from tree
  const deleteSet = new Set(deletePaths || []);
  if (deleteSet.size > 0) {
    for (const dp of deleteSet) {
      treeEntries.push({ path: dp, mode: '100644', type: 'blob', sha: null });
    }
  }

  // 4. Create new tree (if deletions needed, get recursive tree first to filter)
  let newTreeSha: string;
  if (deleteSet.size > 0) {
    // Need the full tree to properly remove entries
    const fullTreeRes = await fetch(`${API}/repos/${REPO_OWNER}/${REPO_NAME}/git/trees/${baseTreeSha}?recursive=1`, { headers: h });
    if (!fullTreeRes.ok) {
      const err = await fullTreeRes.json().catch(() => ({}));
      throw new Error(err.message || `Failed to get full tree: ${fullTreeRes.status}`);
    }
    const fullTreeData = await fullTreeRes.json();
    // Filter out deleted paths, keep all other entries
    const keepEntries: Array<{ path: string; mode: string; type: string; sha: string }> = [];
    for (const entry of fullTreeData.tree) {
      if (entry.type === 'tree') continue; // skip sub-directories
      if (deleteSet.has(entry.path)) continue; // skip deleted files
      keepEntries.push({ path: entry.path, mode: entry.mode, type: 'blob', sha: entry.sha });
    }
    // Add new/modified entries (override existing with same path)
    for (const e of treeEntries) {
      if (e.sha !== null) {
        // Remove existing entry at same path if present
        const existIdx = keepEntries.findIndex(k => k.path === e.path);
        if (existIdx >= 0) keepEntries.splice(existIdx, 1);
        keepEntries.push({ path: e.path, mode: e.mode, type: e.type, sha: e.sha });
      }
    }
    const treeRes = await fetch(`${API}/repos/${REPO_OWNER}/${REPO_NAME}/git/trees`, {
      method: 'POST',
      headers: h,
      body: JSON.stringify({ tree: keepEntries }),
    });
    if (!treeRes.ok) {
      const err = await treeRes.json().catch(() => ({}));
      throw new Error(err.message || `Failed to create tree: ${treeRes.status}`);
    }
    const treeData = await treeRes.json();
    newTreeSha = treeData.sha;
  } else {
    const treeRes = await fetch(`${API}/repos/${REPO_OWNER}/${REPO_NAME}/git/trees`, {
      method: 'POST',
      headers: h,
      body: JSON.stringify({ base_tree: baseTreeSha, tree: treeEntries }),
    });
    if (!treeRes.ok) {
      const err = await treeRes.json().catch(() => ({}));
      throw new Error(err.message || `Failed to create tree: ${treeRes.status}`);
    }
    const treeData = await treeRes.json();
    newTreeSha = treeData.sha;
  }

  // 5. Create commit
  const newCommitRes = await fetch(`${API}/repos/${REPO_OWNER}/${REPO_NAME}/git/commits`, {
    method: 'POST',
    headers: h,
    body: JSON.stringify({ message, tree: newTreeSha, parents: [baseCommitSha] }),
  });
  if (!newCommitRes.ok) {
    const err = await newCommitRes.json().catch(() => ({}));
    throw new Error(err.message || `Failed to create commit: ${newCommitRes.status}`);
  }
  const newCommitData = await newCommitRes.json();
  const newCommitSha: string = newCommitData.sha;

  // 6. Update ref
  const updateRefRes = await fetch(`${API}/repos/${REPO_OWNER}/${REPO_NAME}/git/refs/heads/${BRANCH}`, {
    method: 'PATCH',
    headers: h,
    body: JSON.stringify({ sha: newCommitSha, force: false }),
  });
  if (!updateRefRes.ok) {
    const err = await updateRefRes.json().catch(() => ({}));
    throw new Error(err.message || `Failed to update ref: ${updateRefRes.status}`);
  }
  return newCommitSha;
}

export type DeployPhase = 'queued' | 'building' | 'done' | 'failed';

// waitForDeploy polls the GitHub Actions API for the workflow run triggered by commitSha.
// Calls onProgress with the current phase as it transitions.
// Returns 'success' if the deploy completed, 'failure' if it failed, 'timeout' if it didn't
// finish within 5 minutes.
export async function waitForDeploy(
  token: string,
  commitSha: string,
  onProgress?: (phase: DeployPhase) => void
): Promise<'success' | 'failure' | 'timeout'> {
  const h = headers(token);
  let lastPhase: DeployPhase = 'queued';
  onProgress?.(lastPhase);

  for (let i = 0; i < 60; i++) {
    await new Promise(r => setTimeout(r, 5000));
    try {
      const res = await fetch(
        `${API}/repos/${REPO_OWNER}/${REPO_NAME}/actions/runs?branch=${BRANCH}&event=push&per_page=5`,
        { headers: h }
      );
      if (!res.ok) continue;
      const data = await res.json();
      const run = data.workflow_runs?.find((r: any) => r.head_sha === commitSha);
      if (!run) continue;

      // Determine phase — use string to avoid over-narrowing
      const phase: string = run.status === 'completed' ? 'done' : 'building';
      if (phase !== lastPhase) {
        lastPhase = phase as DeployPhase;
        onProgress?.(phase as DeployPhase);
      }

      if (run.status === 'completed') {
        if (run.conclusion !== 'success') {
          if (lastPhase !== 'failed') { lastPhase = 'failed'; onProgress?.('failed'); }
          return 'failure';
        }
        if (lastPhase !== 'done') { lastPhase = 'done'; onProgress?.('done'); }
        return 'success';
      }
    } catch {
      // Network error — keep polling
    }
  }
  return 'timeout';
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
