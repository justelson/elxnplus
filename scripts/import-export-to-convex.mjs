import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../convex/_generated/api.js';

const loadEnvFile = (file) => {
  if (!fsSync.existsSync(file)) return;
  for (const line of fsSync.readFileSync(file, 'utf8').split(/\r?\n/)) {
    if (!line || line.trim().startsWith('#')) continue;
    const i = line.indexOf('=');
    if (i === -1) continue;
    const key = line.slice(0, i);
    const value = line.slice(i + 1).replace(/^"|"$/g, '');
    process.env[key] ||= value;
  }
};

loadEnvFile('.env.local');
loadEnvFile('.env.migration');

const convexUrl = process.env.VITE_CONVEX_URL;
const secret = process.env.MIGRATION_SECRET;
const exportDir = process.env.EXPORT_DIR || 'data/supabase-export';

if (!convexUrl) throw new Error('Missing VITE_CONVEX_URL in .env.local');
if (!secret) throw new Error('Missing MIGRATION_SECRET in .env.migration or environment');

const client = new ConvexHttpClient(convexUrl);
const media = JSON.parse(await fs.readFile(path.join(exportDir, 'media.json'), 'utf8'));

const contentTypeFor = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.mp3') return 'audio/mpeg';
  if (ext === '.wav') return 'audio/wav';
  if (ext === '.png') return 'image/png';
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.pdf') return 'application/pdf';
  return 'application/octet-stream';
};

const uploadAsset = async (asset) => {
  if (!asset?.path || asset.error) return undefined;

  const absolutePath = path.join(exportDir, asset.path);
  const bytes = await fs.readFile(absolutePath);
  const uploadUrl = await client.mutation(api.media.generateUploadUrl, { secret });
  const response = await fetch(uploadUrl, {
    method: 'POST',
    headers: { 'Content-Type': contentTypeFor(absolutePath) },
    body: new Blob([bytes], { type: contentTypeFor(absolutePath) }),
  });

  if (!response.ok) {
    throw new Error(`Upload failed for ${asset.path}: ${response.status} ${response.statusText}`);
  }

  const { storageId } = await response.json();
  return storageId;
};

for (const item of media) {
  const storageId = await uploadAsset(item.exported_file);
  const thumbnailStorageId = await uploadAsset(item.exported_thumbnail);

  const importedId = await client.mutation(api.media.importMedia, {
    secret,
    legacyId: item.id,
    title: item.title,
    description: item.description ?? null,
    type: item.type,
    storageId,
    thumbnailStorageId,
    legacyFileUrl: item.file_url ?? null,
    legacyThumbnailUrl: item.thumbnail_url ?? null,
    content: item.content ?? null,
    file_size: item.file_size ?? null,
    duration: item.duration ?? null,
    download_count: item.download_count ?? 0,
    view_count: item.view_count ?? 0,
    is_published: item.is_published ?? true,
    created_at: item.created_at ?? new Date().toISOString(),
    updated_at: item.updated_at ?? item.created_at ?? new Date().toISOString(),
  });

  console.log(`imported ${item.id} -> ${importedId}`);
}

console.log(`Done. Imported ${media.length} media rows into Convex.`);
