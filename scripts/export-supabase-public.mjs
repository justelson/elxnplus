import fs from 'node:fs/promises';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

const projectRef = 'wstrciyuxorgdvsjcxxa';
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || `https://${projectRef}.supabase.co`;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const outDir = process.env.EXPORT_DIR || 'data/supabase-export';

if (!supabaseKey) {
  console.error('Missing SUPABASE_ANON_KEY or VITE_SUPABASE_PUBLISHABLE_KEY.');
  console.error('Usage: SUPABASE_ANON_KEY="..." node scripts/export-supabase-public.mjs');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

await fs.mkdir(path.join(outDir, 'assets'), { recursive: true });

const { data: media, error } = await supabase
  .from('media')
  .select('*')
  .order('created_at', { ascending: false });

if (error) {
  console.error(`Failed to read media: ${error.message}`);
  process.exit(1);
}

const manifest = [];

const downloadFile = async (url, fallbackName) => {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    const ext = path.extname(parsed.pathname) || '';
    const safeName = fallbackName.replace(/[^a-z0-9._-]+/gi, '-').replace(/^-+|-+$/g, '');
    const fileName = `${safeName}${ext && !safeName.endsWith(ext) ? ext : ''}`;
    const relativePath = path.join('assets', fileName);
    const outputPath = path.join(outDir, relativePath);

    const response = await fetch(url);
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);

    const bytes = Buffer.from(await response.arrayBuffer());
    await fs.writeFile(outputPath, bytes);
    return { path: relativePath.split(path.sep).join('/'), bytes: bytes.length, sourceUrl: url };
  } catch (err) {
    return { error: err instanceof Error ? err.message : String(err), sourceUrl: url };
  }
};

for (const item of media ?? []) {
  const file = await downloadFile(item.file_url, `${item.id}-file`);
  const thumbnail = await downloadFile(item.thumbnail_url, `${item.id}-thumbnail`);

  manifest.push({
    ...item,
    exported_file: file,
    exported_thumbnail: thumbnail,
  });

  console.log(`exported ${item.id} ${item.type} ${item.title}`);
}

await fs.writeFile(path.join(outDir, 'media.json'), JSON.stringify(manifest, null, 2));
await fs.writeFile(path.join(outDir, 'summary.json'), JSON.stringify({
  source: supabaseUrl,
  rows: manifest.length,
  byType: manifest.reduce((acc, item) => {
    acc[item.type] = (acc[item.type] || 0) + 1;
    return acc;
  }, {}),
  exportedAt: new Date().toISOString(),
}, null, 2));

console.log(`Done. Wrote ${manifest.length} rows to ${outDir}`);
