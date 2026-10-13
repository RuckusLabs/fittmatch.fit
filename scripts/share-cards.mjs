import { createHash } from 'node:crypto';
import { isWebProfileVisible } from './profile-visibility.mjs';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*-[1-9][0-9]*$/;
const escape = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const text = (value, fallback = '') => typeof value === 'string' && value.trim() ? value.trim() : fallback;
const list = (value) => Array.isArray(value) ? value.filter((v) => typeof v === 'string' && v.trim()).slice(0, 3) : [];
const labels = { coach: 'Coach profile', job: 'Job opportunity', client: 'Gym & studio profile' };

// Accept only public presentation fields. Private account data never enters the card.
export function describeShareRecord({ type, identifier, data, example = false }) {
  if (!Object.hasOwn(labels, type) || typeof identifier !== 'string'
    || identifier.length > 80 || !(UUID.test(identifier) || (type !== 'job' && SLUG.test(identifier)))) {
    throw new Error('A valid profile slug or listing UUID is required.');
  }
  if (!data || typeof data !== 'object') throw new Error('Profile data is required.');
  if (!isWebProfileVisible({ type, data })) throw new Error('Profile unavailable.');
  let name, subtitle, city, badges;
  if (type === 'coach') {
    name = text(data.profiles?.full_name, 'Fitness coach');
    subtitle = text(data.title, list(data.specialties).join(' · ') || 'Fitness coach');
    city = text(data.profiles?.city);
    badges = [text(data.experience_band), list(data.certs).join(' · ')];
  } else if (type === 'job') {
    name = text(data.title, 'Fitness opportunity');
    subtitle = text(data.client_profiles?.company_name, 'Gym or studio');
    city = text(data.city, text(data.location_text));
    const low = Number(data.pay_min), high = Number(data.pay_max);
    const validLow = data.pay_min != null && Number.isFinite(low) && low >= 0;
    const validHigh = data.pay_max != null && Number.isFinite(high) && high >= 0;
    const money = (v) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(v);
    const range = validLow && validHigh && low !== high ? `${money(low)}–${money(high)}`
      : validLow ? `${money(low)}${validHigh ? '' : '+'}` : validHigh ? `Up to ${money(high)}` : '';
    const payLabel = { hourly: '/ hour', salary: '/ year' }[data.pay_type] || '';
    badges = [range ? `${range} ${payLabel}`.trim() : '', text(data.role_type)];
  } else {
    name = text(data.company_name, text(data.profiles?.full_name, 'Gym or studio'));
    subtitle = text(data.company_type, 'Gym & studio');
    city = text(data.profiles?.city);
    badges = [];
  }
  const descriptor = { type, identifier, example: !!example, label: labels[type], name, subtitle, city, badges: badges.filter(Boolean) };
  descriptor.title = `${name} · ${subtitle}`;
  descriptor.description = [city, ...descriptor.badges, example ? `Explore this example ${type === 'job' ? 'job' : 'profile'} on FittMatch.` : 'Discover your next fit on FittMatch.'].filter(Boolean).join(' · ');
  descriptor.url = `https://fittmatch.fit/${example ? 'examples' : 'p'}/${type}/${identifier}/`;
  return descriptor;
}

function lines(value, limit, count = 2) {
  const words = [...value.trim().split(/\s+/)].flatMap((word) => word.length > limit ? word.match(new RegExp(`.{1,${limit}}`, 'gu')) : [word]);
  const result = []; let current = '';
  for (const word of words) {
    if ((current + ' ' + word).trim().length > limit) { result.push(current); current = word; }
    else current = (current + ' ' + word).trim();
  }
  if (current) result.push(current);
  if (result.length > count) result[count - 1] = result[count - 1].slice(0, limit - 1).trimEnd() + '…';
  return result.slice(0, count);
}

// Photographs are preloaded and normalized by the media loader; no remote URL
// or filesystem path is interpreted by this renderer.
export function renderShareCard(descriptor, { image, imageType = 'image/jpeg', imageRevision = '' } = {}) {
  const d = descriptor;
  if (image && (!Buffer.isBuffer(image) || !['image/jpeg', 'image/png', 'image/webp'].includes(imageType))) throw new Error('Unsupported profile image.');
  const photo = image ? `data:${imageType};base64,${image.toString('base64')}` : null;
  const nameLines = lines(d.name, d.type === 'coach' ? 32 : 23);
  const subtitleLines = lines(d.subtitle, d.type === 'coach' ? 56 : 38);
  const label = escape(((d.example ? 'Example ' : '') + d.label).toUpperCase());
  const initials = d.name.split(/\s+/).slice(0,2).map(v => Array.from(v)[0]).join('').toUpperCase();
  let content;
  if (d.type === 'coach') {
    content = `${photo ? `<image href="${photo}" width="1200" height="630" preserveAspectRatio="xMidYMid slice"/>` : '<rect width="1200" height="630" fill="#352d29"/>'}<rect width="1200" height="630" fill="url(#shade)"/><text x="54" y="76" font-size="29" font-weight="bold" fill="white">FittMatch</text><text x="1146" y="72" text-anchor="end" font-size="13" letter-spacing="2" fill="white">${label}</text>${nameLines.map((line,i)=>`<text x="54" y="${405+i*59}" font-family="Georgia,serif" font-size="58" font-weight="bold" fill="white">${escape(line)}</text>`).join('')}${subtitleLines.map((line,i)=>`<text x="54" y="${405+(nameLines.length-1)*59+46+i*28}" font-size="25" fill="white">${escape(line)}</text>`).join('')}<text x="54" y="${Math.min(562,405+(nameLines.length-1)*59+46+(subtitleLines.length-1)*28+38)}" font-size="19" fill="#eeeeee">${escape(d.city)}</text><text x="54" y="602" font-size="15" fill="#eeeeee">${escape(d.badges.join(' · '))}</text>`;
  } else {
    const width = 468;
    content = `<rect width="1200" height="630" fill="#fafaf8"/>${photo ? `<image href="${photo}" x="732" width="${width}" height="630" preserveAspectRatio="xMidYMid slice"/>` : `<rect x="732" width="${width}" height="630" fill="#e6e2dc"/><text x="966" y="337" text-anchor="middle" font-family="Georgia,serif" font-size="80" fill="#9b3825">${escape(initials)}</text>`}<text x="54" y="78" font-size="29" font-weight="bold">Fitt<tspan fill="#c8472a">Match</tspan></text><text x="54" y="154" font-size="13" letter-spacing="2" fill="#9b3825">${label}</text>${nameLines.map((line,i)=>`<text x="54" y="${270+i*62}" font-family="Georgia,serif" font-size="56" font-weight="bold">${escape(line)}</text>`).join('')}${subtitleLines.map((line,i)=>`<text x="54" y="${270+(nameLines.length-1)*62+49+i*29}" font-size="23" fill="#3a3a3a">${escape(line)}</text>`).join('')}<text x="54" y="${270+(nameLines.length-1)*62+49+(subtitleLines.length-1)*29+42}" font-size="19" fill="#6e6b66">${escape(d.city)}</text><text x="54" y="527" font-size="21" font-weight="bold" fill="#254d40">${escape(d.badges.join(' · '))}</text><text x="54" y="591" font-size="15" fill="#7a7a7a">fittmatch.fit</text>`;
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><defs><linearGradient id="shade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".2"/><stop offset=".35" stop-color="#000" stop-opacity=".08"/><stop offset="1" stop-color="#000" stop-opacity=".94"/></linearGradient></defs><g font-family="Arial,sans-serif">${content}</g></svg>`;
  const hash = createHash('sha256').update(svg).update(imageRevision).digest('hex').slice(0,16);
  const imagePath = `/assets/social/${d.example ? 'examples/' : ''}${d.type}/${d.identifier}-${hash}.jpg`;
  return { svg, imagePath, imageUrl:`https://fittmatch.fit${imagePath}`, imageAlt:`${d.example ? 'Example ' : ''}${d.label}: ${d.name}, ${d.subtitle}${d.city ? ` in ${d.city}` : ''}${photo ? ', with profile photography' : ''}.` };
}

export function shareMetadata(d, card) {
  const meta = (key, value, property = true) => `<meta ${property ? 'property' : 'name'}="${key}" content="${escape(value)}">`;
  return `<title>${escape(d.title)} · FittMatch${d.example ? ' Example' : ''}</title>
${meta('description', d.description, false)}
${d.example ? meta('robots', 'noindex, follow', false) : ''}
<link rel="canonical" href="${escape(d.url)}">
${meta('og:type', 'website')}
${meta('og:site_name', 'FittMatch')}
${meta('og:locale', 'en_US')}
${meta('og:title', d.title)}
${meta('og:description', d.description)}
${meta('og:url', d.url)}
${meta('og:image', card.imageUrl)}
${meta('og:image:secure_url', card.imageUrl)}
${meta('og:image:type', 'image/jpeg')}
${meta('og:image:width', '1200')}
${meta('og:image:height', '630')}
${meta('og:image:alt', card.imageAlt)}
${meta('twitter:card', 'summary_large_image', false)}
${meta('twitter:title', d.title, false)}
${meta('twitter:description', d.description, false)}
${meta('twitter:image', card.imageUrl, false)}
${meta('twitter:image:alt', card.imageAlt, false)}`;
}

export { escape };
