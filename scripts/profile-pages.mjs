import { describeShareRecord, shareMetadata, escape } from './share-cards.mjs';
import { isWebProfileVisible } from './profile-visibility.mjs';
export { isWebProfileVisible } from './profile-visibility.mjs';

const strings = (value) => Array.isArray(value) ? value.filter((v) => typeof v === 'string' && v.trim()) : [];
const nonempty = (value) => typeof value === 'string' && value.trim();
export function mediaUrl(value, { local = false } = {}) {
  if (typeof value !== 'string') return null;
  if (local && value.startsWith('/assets/') && !value.includes('..')) return value;
  try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password ? url.href : null; } catch { return null; }
}
export function unavailablePage() {
  return '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Profile unavailable · FittMatch</title><link rel="stylesheet" href="/styles.css"></head><body><main class="container" style="padding-top:90px;max-width:650px"><h1>This profile isn’t available.</h1><p style="margin-top:24px"><a href="/">Go to FittMatch</a></p></main></body></html>';
}
const paragraph = (value) => nonempty(value) ? `<p class="profile-prose">${escape(value)}</p>` : '';
const section = (heading, body) => body ? `<section><h2>${escape(heading)}</h2>${body}</section>` : '';
const pills = (values) => strings(values).length ? `<div class="specialties">${strings(values).map((v) => `<span>${escape(v)}</span>`).join('')}</div>` : '';
const cities = (primary, extra) => [...new Set([primary, ...(Array.isArray(extra) ? extra.map((v) => typeof v === 'string' ? v : v?.city) : [])].filter(nonempty))].join(' · ');
const schedule = (value) => strings(value).join(' · ');
const time = (value) => {
  if (typeof value === 'string' && value.startsWith('[')) { try { value = JSON.parse(value); } catch { /* Use the supplied display text. */ } }
  return (Array.isArray(value) ? strings(value) : nonempty(value) ? [value] : []).map((v) => ({ AM: 'Mornings', PM: 'Afternoons & evenings' }[v] || v)).join(' · ');
};
function gallery(photos) {
  const items = Array.isArray(photos) ? photos.filter((p) => mediaUrl(p?.url)) : [];
  return items.length ? section('Photos', `<div class="web-gallery">${items.map((p) => `<figure><a href="${escape(mediaUrl(p.url))}" data-photo-zoom aria-label="${escape('Enlarge ' + (p.caption || 'profile photo'))}"><img src="${escape(mediaUrl(p.url))}" alt="${escape(p.caption || 'Profile photo')}" loading="lazy" width="900" height="650"></a>${p.caption ? `<figcaption>${escape(p.caption)}</figcaption>` : ''}</figure>`).join('')}</div>`) : '';
}
function video(url, poster, example) {
  const safe = mediaUrl(url); if (!safe) return '';
  return section('Intro video', `<video class="intro-video" controls playsinline preload="none" ${mediaUrl(poster) ? `poster="${escape(mediaUrl(poster))}"` : ''}><source src="${escape(safe)}"><p>Your browser cannot play this video. <a href="${escape(safe)}">Open the intro video</a>.</p></video>${example ? '<p class="sample-note">Sample playback footage for this fictional example.</p>' : ''}`);
}
function reviews(data) {
  const items = Array.isArray(data.reviews) ? data.reviews : [];
  const count = data.rating_count ?? items.length;
  if (!count && !items.length) return '';
  const star = (filled) => `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01Z" fill="${filled ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>`;
  const reviewItems = items.map((r) => {
    const rating = Math.max(0, Math.min(5, Number(r.rating) || 0));
    const date = r.created_at ? new Date(r.created_at) : null;
    const dateLabel = date && Number.isFinite(date.getTime()) ? new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(date) : '';
    return `<article class="web-review"><div class="review-stars" role="img" aria-label="${rating} out of 5 stars">${[1, 2, 3, 4, 5].map(n => star(n <= rating)).join('')}</div>${nonempty(r.body) ? `<p class="review-body">${escape(r.body)}</p>` : ''}<p class="review-by">${escape(r.reviewer_name || 'FittMatch member')}${dateLabel ? ` · <time datetime="${escape(date.toISOString())}">${escape(dateLabel)}</time>` : ''}</p></article>`;
  }).join('');
  return `<section class="web-reviews"><div class="review-heading"><h2>Reviews</h2><span class="review-summary" aria-label="${escape(data.rating_avg ?? 'Unrated')} out of 5, ${escape(count)} ${count === 1 ? 'review' : 'reviews'}">${star(true)}<span>${escape(data.rating_avg ?? '–')} · ${escape(count)}</span></span></div>${reviewItems}</section>`;
}
function jobs(data, example) {
  const items = Array.isArray(data.jobs) ? data.jobs.filter((j) => j.status === 'live') : [];
  return section('Open jobs', items.length ? items.map((job) => {
    try {
      const d = describeShareRecord({ type: 'job', identifier: job.id, example, data: { ...job, client_profiles: { company_name: data.company_name } } });
      return `<a class="web-job" href="${escape(new URL(d.url).pathname)}"><strong>${escape(job.title)}</strong><span>${escape([job.city, ...d.badges].filter(Boolean).join(' · '))}</span><span>View job ↗</span></a>`;
    } catch { return ''; }
  }).join('') : paragraph('No open jobs right now.'));
}

export function renderWebProfile(record, card) {
  if (!isWebProfileVisible(record)) return unavailablePage();
  const d = describeShareRecord(record), data = record.data, employer = data.client_profiles || {};
  const photo = mediaUrl(record.type === 'coach' ? data.photo_url : record.type === 'job' ? employer.logo_url : data.logo_url);
  const photoSet = record.type === 'job' ? employer.photos : data.photos;
  const initials = d.name.split(/\s+/).slice(0, 2).map((v) => Array.from(v)[0]).join('');
  const connect = `<h2>A good fit?</h2><p>Continue in FittMatch to connect with coaches, gyms, and studios.</p><a class="primary-link" href="${record.example ? 'fittmatch://' : `fittmatch://p/${d.type}/${d.identifier}`}">Open FittMatch ↗</a><div class="download-option"><span>Don’t have the app yet?</span><a href="https://testflight.apple.com/join/4PXhuby6" target="_blank" rel="noopener noreferrer">Join the iOS beta ↗</a></div>`;
  let details = gallery(photoSet);
  if (record.type === 'coach') {
    details += section('About', paragraph(data.bio)) + section('Experience', paragraph(data.experience_band))
      + section('Specialties', pills(data.specialties))
      + section('Certifications', strings(data.certs).length ? `<ul class="certifications">${strings(data.certs).map((cert) => `<li><span class="cert-icon" aria-hidden="true">✓</span><div><strong>${escape(cert)}</strong>${strings(data.verified_certs).includes(cert) ? '<p>Verified by FittMatch</p>' : ''}</div></li>`).join('')}</ul>` : '')
      + section('Other qualifications', pills(data.other_credentials))
      + section('Availability', paragraph(schedule(data.availability?.days)) + paragraph(time(data.availability?.times)))
      + video(data.video_url, data.photo_url, record.example) + reviews(data);
  } else if (record.type === 'client') {
    const site = mediaUrl(data.website?.includes('://') ? data.website : data.website ? `https://${data.website}` : null);
    details += section('About', paragraph(data.bio)) + section('Locations', paragraph(cities(data.profiles?.city, data.extra_cities)))
      + section('Team size', paragraph(data.team_size_band)) + jobs(data, record.example) + reviews(data)
      + section('Website', site ? `<a class="web-site" href="${escape(site)}" target="_blank" rel="noopener noreferrer">${escape(data.website)} ↗</a>` : '');
  } else {
    details += section('About the role', paragraph(data.description)) + section('Pay & employment', pills(d.badges))
      + section('Schedule', paragraph(schedule(data.days)) + paragraph(time(data.time_window)))
      + section('Locations', paragraph(cities(data.city, data.extra_cities)) + paragraph(data.location_text))
      + section('Required certifications', pills(data.required_certs)) + section('Perks', pills(data.perks))
      + section('About the employer', paragraph(employer.company_name) + paragraph(employer.company_type) + paragraph(employer.bio));
  }
  const structured = JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebPage', url: d.url, name: d.title, description: d.description }).replace(/</g, '\\u003c');
  return `<!doctype html><html lang="en" prefix="og: https://ogp.me/ns#"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${shareMetadata(d, card)}<script type="application/ld+json">${structured}</script><link rel="icon" href="/favicon.png"><link rel="stylesheet" href="/styles.css"><link rel="stylesheet" href="/profile.css"></head><body>
<a class="skip-link" href="#profile">Skip to profile</a><aside class="app-banner" aria-label="Open FittMatch"><div class="banner-inner"><img src="/assets/app-icon.png" width="44" height="44" alt=""><div class="banner-copy"><strong>Find your fit on FittMatch</strong><span>Connect with coaches, gyms &amp; studios.</span></div><a class="open-app" href="${record.example ? 'fittmatch://' : `fittmatch://p/${d.type}/${d.identifier}`}">Open app ↗</a></div></aside>
<header class="profile-nav"><a class="wordmark" href="/">Fitt<span>Match</span></a><div class="nav-actions">${record.example ? '<span class="example-label">Example profile</span>' : ''}<button id="share-profile" class="share-button" type="button">Share</button></div></header>
<main id="profile" class="profile-layout"><article class="profile-card"><div class="profile-cover" style="background:${{ coach: '#9b3825', job: '#254d40', client: '#333d59' }[d.type]}"><span class="cover-caption">${escape(d.label.toUpperCase())}</span></div><div class="profile-intro"><div class="portrait">${photo ? `<img src="${escape(photo)}" alt="${escape(d.name)}" width="92" height="92">` : escape(initials)}</div>${d.type === 'coach' ? '<span class="available"><span></span>Open to opportunities</span>' : ''}<h1>${escape(d.name)}</h1><p class="coach-title">${escape(d.subtitle)}</p><p class="location">${escape(cities(d.city, data.extra_cities))}</p></div><div class="profile-content">${details}<div class="mobile-connect">${connect}</div></div></article><aside class="connect-panel"><div class="connect-card"><span class="eyebrow">YOUR NEXT GREAT FIT</span>${connect}</div>${record.example ? '<p class="preview-note">Fictional example with sample media. The app button opens FittMatch’s home screen.</p>' : ''}</aside></main>
<footer class="profile-footer"><p>A little more human. A better fit.</p><div>${record.example ? '<a href="/examples/share-cards/">All examples</a>' : ''}<a href="/privacy.html">Privacy</a><a href="/terms.html">Terms</a></div></footer><p id="share-status" role="status" class="share-status" hidden></p><script src="/profile.js"></script></body></html>`;
}
