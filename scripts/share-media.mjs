export function shareImageCandidates(record) {
  const d = record.data;
  const profile = record.type === 'job' ? d.client_profiles || {} : d;
  const gallery = Array.isArray(profile.photos) ? profile.photos.map(p => p?.url) : [];
  return [...new Set(record.type === 'coach' ? [d.photo_url, ...gallery] : [...gallery, profile.logo_url])].filter(v => typeof v === 'string' && v);
}

// Exact host allowlist: a public profile URL must not turn the image renderer into
// a proxy for arbitrary/private hosts. Redirects are rejected, not followed.
export function createShareMediaLoader({ sharp, allowedHosts, fetchImage = fetch }) {
  const hosts = new Set(allowedHosts);
  return async (record) => {
    for (const value of shareImageCandidates(record)) {
      try {
        const url = new URL(value);
        if (url.protocol !== 'https:' || url.username || url.password || url.port || !hosts.has(url.hostname)) continue;
        const response = await fetchImage(url, { redirect: 'error', signal: AbortSignal.timeout(8000) });
        if (!response.ok || !/^image\/(jpeg|png|webp)(;|$)/i.test(response.headers.get('content-type') || '')) continue;
        if (Number(response.headers.get('content-length')) > 8 * 1024 * 1024) continue;
        const chunks = []; let size = 0;
        for await (const chunk of response.body) {
          size += chunk.length;
          if (size > 8 * 1024 * 1024) { await response.body.cancel().catch(() => {}); throw new Error('Image too large'); }
          chunks.push(chunk);
        }
        const image = await sharp(Buffer.concat(chunks), { limitInputPixels: 40_000_000 }).rotate().resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true }).jpeg({ quality: 90 }).toBuffer();
        return { image, imageType: 'image/jpeg' };
      } catch { /* Try the next public photo, then fall back to initials. */ }
    }
    return {};
  };
}
