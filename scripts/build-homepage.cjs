// Build readable HTML from the same audience configuration used by the browser.
const fs = require('node:fs');
const path = require('node:path');
const content = require('../homepage-content.js');
const root = path.resolve(__dirname, '..');
const hasSwipePreview = fs.existsSync(path.join(root, 'assets/product/swipe-right.mp4'));
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const arrow = '<span aria-hidden="true">↗</span>';
const beta = (label, placement, ghost = false) => `<a class="btn ${ghost ? 'btn-ghost' : 'btn-primary'}" href="${content.betaUrl}" target="_blank" rel="noopener noreferrer" data-beta="${placement}">${esc(label)} ${arrow}</a>`;
const choices = (compact = false) => `<div class="audience-choices ${compact ? 'compact' : ''}" role="group" aria-label="Choose your FittMatch story">${['coach','client'].map(role => `<button type="button" data-select="${role}" aria-pressed="false"><span class="choice-icon" aria-hidden="true">${role === 'coach' ? '<svg viewBox="0 0 24 24"><path d="M7 8v8M4 10v4M17 8v8M20 10v4M7 12h10"/></svg>' : '<svg viewBox="0 0 24 24"><rect x="4" y="7" width="16" height="13" rx="3"/><path d="M9 7V4h6v3M4 12h16M10 12v3h4v-3"/></svg>'}</span><span><strong>${esc(content[role].label)}</strong>${compact ? '' : `<small>${role === 'coach' ? 'Find your next fitness role' : 'Find your next great coach'}</small>`}</span><span class="choice-indicator" aria-hidden="true">↗</span></button>`).join('')}</div>`;
const assetDescriptions = {
  'coach-job': 'Recovery & Mobility Coach job at Buckeye Movement Lab, showing pay, schedule, and facility photos',
  'coach-profile': 'Harper Chen’s coach profile, showing mobility and recovery experience',
  'client-profile': 'Buckeye Movement Lab’s gym profile with photos of its training space',
  'client-discover-duo': 'Hiring discovery on unfolded iPhone Duo, with coach filters beside a coach profile',
  'coach-chat-duo': 'Harper’s conversation with Buckeye Movement Lab on unfolded iPhone Duo',
  'client-chat-duo': 'Buckeye Movement Lab’s conversation with Harper on unfolded iPhone Duo',
  'coach-activity': 'Buckeye’s Recovery & Mobility Coach opportunity showing Harper’s Applied status',
  'client-pipeline-duo': 'Buckeye’s job overview on iPhone Duo, showing one coach in the mobility role’s pipeline'
};
function device(asset, kind = 'iphone', priority = false, previewKey = null) {
  const duo = kind === 'duo';
  const w = duo ? 2853 : 1206, h = duo ? 2007 : 2622;
  const preview = hasSwipePreview && previewKey;
  const screen = preview
    ? `<video id="swipe-${previewKey}" class="app-screen native-swipe" data-swipe-preview controls muted loop playsinline preload="none" poster="assets/product/${asset}-1200.webp" width="${w}" height="${h}" aria-label="Native FittMatch swipe demonstration" aria-describedby="swipe-description-${previewKey}"><source src="assets/product/swipe-right.mp4" type="video/mp4" /><img src="assets/product/${asset}-1200.webp" alt="${esc(assetDescriptions[asset])}" /></video>`
    : `<img class="app-screen" src="assets/product/${asset}-1200.webp" srcset="assets/product/${asset}-600.webp 600w, assets/product/${asset}-1200.webp 1200w${duo ? `, assets/product/${asset}-2000.webp 2000w` : ''}" sizes="${duo ? '(max-width: 700px) 94vw, 780px' : '(max-width: 700px) 65vw, 330px'}" width="${w}" height="${h}" alt="${esc(assetDescriptions[asset])}" ${priority ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" />`;
  return `<div class="device ${kind}">${screen}<img class="device-frame" src="assets/product/frames/${kind}.webp" width="${duo ? 1600 : 900}" height="${duo ? 1162 : 1840}" alt="" aria-hidden="true" ${priority ? '' : 'loading="lazy"'} /></div>`;
}
const zoom = (asset, label) => `<a class="zoom-button" href="assets/product/${asset}-full.webp" data-zoom="${asset}" aria-label="Enlarge ${esc(label)}"><span aria-hidden="true">⤢</span> Explore this screen</a>`;
function hero(role) {
  const c = content[role] || content.shared;
  const neutral = role === 'shared';
  const previewKey = hasSwipePreview && role !== 'client' ? role : null;
  const previewControl = previewKey ? `<button type="button" class="swipe-preview-toggle" data-preview-for="swipe-${role}" aria-controls="swipe-${role}" hidden>Play swipe preview</button><p class="sr-only" id="swipe-description-${role}">A recording of the real app: the Buckeye Movement Lab job card moves right to submit interest. This uses a fictional demo opportunity.</p>` : '';
  const secondaryAction = previewControl || '<a class="text-link" href="#how-it-works">See how it works <span aria-hidden="true">↓</span></a>';
  return `<div class="hero-panel" data-hero="${role}" ${neutral ? '' : 'hidden'}><div class="hero-copy"><p class="kicker">${neutral ? 'Fitness recruiting, made personal' : esc(c.audience)}</p><h1>${esc(c.title)}</h1><p class="hero-description">${esc(c.description)}</p>${neutral ? choices() : `<div class="hero-actions">${beta(c.cta, 'hero')}${secondaryAction}</div><p class="microcopy">Join the iOS beta through TestFlight · ${role === 'coach' ? 'Free coach discovery & messaging' : 'Pro features require approved beta access'}</p>`}${neutral ? `<div class="hero-actions">${beta(c.cta, 'hero')}${secondaryAction}</div><p class="microcopy">For fitness professionals, gyms, studios & hiring teams</p>` : ''}</div><div class="hero-visual"><div class="visual-halo" aria-hidden="true"></div><div class="hero-duo">${device(neutral ? 'client-discover-duo' : c.heroDuo, 'duo', neutral)}<span class="device-name">iPhone Duo · Open</span></div><div class="hero-phone">${device(neutral ? 'coach-job' : c.heroPhone, 'iphone', neutral, previewKey)}<span class="device-name">iPhone 18 Pro</span></div><div class="visual-note"><span class="live-dot" aria-hidden="true"></span> ${neutral ? 'Real app screens. Swipe. Refine. Connect.' : esc(c.heroCaption)}</div></div></div>`;
}
function supporting(role) {
  const c = content[role];
  return `<section class="supporting container" aria-labelledby="${role}-support-title"><div class="support-heading"><p class="kicker">More when you need it</p><h2 id="${role}-support-title">${esc(c.supportTitle)}</h2><p>${esc(c.supportBody)}</p></div><div class="support-grid">${c.supporting.map(item => `<article class="support-card"><h3>${esc(item.title)}</h3><p>${esc(item.body)}</p><figure><div class="support-screen">${device(item.asset,item.device)}</div><figcaption>${esc(item.caption)}</figcaption>${zoom(item.asset,item.title)}</figure></article>`).join('')}</div></section>`;
}
const filterGuide = chapter => chapter.filters ? `<aside class="filter-guide" aria-label="${esc(chapter.filters.title)}"><p class="filter-guide-title">${esc(chapter.filters.title)}</p><dl>${chapter.filters.items.map(([label,description]) => `<div><dt>${esc(label)}</dt><dd>${esc(description)}</dd></div>`).join('')}</dl><p class="filter-guide-note">Adjust these filters in the app whenever you want to refine your search.</p></aside>` : '';
function story(role) {
  const c = content[role];
  return `<article class="audience-story" data-story="${role}" id="${role}-story" aria-labelledby="${role}-story-title"><section class="story-intro container"><p class="kicker">${esc(c.audience)}</p><h2 id="${role}-story-title">${esc(c.tension)}</h2><p>${esc(c.tensionBody)}</p><ol class="journey-outline" aria-label="How it works">${c.chapters.map((chapter,i)=>`<li><span>${i+1}</span>${esc(chapter.label)}</li>`).join('')}</ol><p class="walkthrough-note">${esc(c.introBody)} <strong>Illustrative walkthrough with fictional profiles.</strong></p></section>${c.chapters.map((chapter,i) => `<section class="chapter ${chapter.device === 'duo' ? 'chapter-wide' : ''} ${i%2 ? 'reverse' : ''}"><div class="container chapter-inner"><div class="chapter-copy"><p class="chapter-step"><span>${String(i+1).padStart(2,'0')}</span> ${esc(chapter.label)}</p><h2>${esc(chapter.title)}</h2><p class="chapter-body">${esc(chapter.body)}</p>${filterGuide(chapter)}<ul class="benefit-list">${chapter.points.map(p => `<li><span aria-hidden="true">✓</span>${esc(p)}</li>`).join('')}</ul><p class="chapter-detail">${esc(chapter.detail)}</p></div><figure class="chapter-visual"><div class="screen-stage">${device(chapter.asset,chapter.device)}</div><figcaption>${esc(chapter.caption)}</figcaption>${zoom(chapter.asset,chapter.label)}</figure></div></section>`).join('')}${supporting(role)}<section class="access-section container" aria-labelledby="${role}-access-title"><div><p class="kicker">The iOS beta</p><h2 id="${role}-access-title">${esc(c.accessTitle)}</h2></div><div><p>${esc(c.accessBody)}</p>${beta(c.cta,'access')}<p class="microcopy">Join the iOS beta through TestFlight.</p></div></section></article>`;
}
const faq = (role) => `<div data-faq="${role}" ${role !== 'shared' ? 'hidden' : ''}>${content[role].faqs.map(([q,a])=>`<details><summary>${esc(q)}<span aria-hidden="true">+</span></summary><p>${esc(a)}</p></details>`).join('')}</div>`;
const closing = role => `<div data-closing="${role}" ${role !== 'shared' ? 'hidden' : ''}><h2>${esc(content[role].closing)}</h2><p>${esc(content[role].closingBody)}</p>${beta(content[role].cta,'closing')}<small>Join the iOS beta through TestFlight. Account approval is separate from installation.</small></div>`;
const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(content.shared.pageTitle)}</title>
  <meta name="description" content="Browse fitness jobs and coaches. Swipe right to apply or show interest, then start a conversation. Try FittMatch’s iOS beta through TestFlight." />
  <meta name="theme-color" content="#FAFAF8" />
  <meta property="og:title" content="FittMatch — Swipe right. Find your fit." />
  <meta property="og:description" content="Browse fitness jobs and coaches, swipe right on a fit, and get the conversation started. Join the iOS beta." />
  <meta property="og:image" content="https://fittmatch.fit/assets/social/generic/fittmatch.jpg" />
  <meta property="og:url" content="https://fittmatch.fit/" />
  <meta property="og:type" content="website" />
  <link rel="canonical" href="https://fittmatch.fit/" />
  <link rel="icon" type="image/png" sizes="48x48" href="favicon.png" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700;800&family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="homepage.css" />
  <script src="homepage-content.js" defer></script>
  <script src="main.js" defer></script>
</head>
<body data-audience="shared">
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header"><nav class="container nav-inner" aria-label="Main"><a href="index.html" class="wordmark" aria-label="FittMatch home">Fitt<span>Match</span></a><div class="nav-switcher">${choices(true)}</div><div class="nav-links"><a href="#how-it-works">How it works</a><a href="#faq">FAQs</a>${beta('Join the beta','navigation')}</div><button type="button" class="menu-button" aria-label="Open navigation" aria-expanded="false" aria-controls="mobile-nav">☰</button></nav><div class="mobile-nav" id="mobile-nav" hidden><a href="#how-it-works">How it works</a><a href="#faq">FAQs</a>${beta('Join the iOS beta','mobile-navigation')}</div></header>
  <noscript><style>.audience-choices,.menu-button{display:none!important}.nav-links{display:flex!important;flex-wrap:wrap}.nav-links>a:not(.btn){display:inline}@media(max-width:800px){.nav-links{flex-basis:100%;order:4;justify-content:center;gap:18px}}.mobile-nav{display:none!important}</style><div class="noscript-note">Both stories are available on this page. <a href="#coach-story">Coach story</a> · <a href="#client-story">Hiring story</a></div></noscript>
  <main id="main">
    <section class="hero container" aria-label="Discover FittMatch">${hero('shared')}${hero('coach')}${hero('client')}</section>
    <div class="promise-strip"><div class="container"><span>Swipe right on a fit.</span><span>Refine with filters.</span><span>Start a conversation.</span></div></div>
    <div id="how-it-works" class="anchor-target"></div>
    <section class="shared-overview container" data-neutral><div class="overview-heading"><p class="kicker">Easy to get started</p><h2>Three steps to a new connection.</h2><p>Swipe right on a job or coach you like. Refine your search with filters, and connect through matches and message requests.</p></div><ol class="journey-outline" aria-label="How FittMatch works"><li><span>1</span>Swipe right</li><li><span>2</span>Filters</li><li><span>3</span>Connect</li></ol><div class="story-paths"><a class="story-path" href="?audience=coach#how-it-works" data-select="coach"><span class="path-label">For coaches</span><h3>See a job you like? Swipe right.</h3><p>Apply with a right swipe. Use location, pay, and schedule preferences to focus your search.</p><span class="text-link">See the coach steps <span aria-hidden="true">↗</span></span></a><a class="story-path" href="?audience=client#how-it-works" data-select="client"><span class="path-label">For hiring teams</span><h3>See your next coach? Swipe right.</h3><p>Show interest with a right swipe. Use location, time slots, and expertise filters to find a closer fit.</p><span class="text-link">See the hiring steps <span aria-hidden="true">↗</span></span></a></div><p class="walkthrough-note">Real FittMatch screens. Fictional coach Harper Chen and fictional employer Buckeye Movement Lab. An illustrative product walkthrough.</p></section>
    <div id="features" class="anchor-target"></div>
    ${story('coach')}${story('client')}
    <section class="beta-guide"><div class="container beta-guide-inner"><div><p class="kicker">A little context before you join</p><h2>Try the app.<br>Help shape what’s next.</h2><p>FittMatch is in beta. Explore the app, try the experience, and share your feedback as we build for the fitness community.</p></div><ol><li><span>1</span><div><h3>Install with TestFlight</h3><p>Open the beta invitation on your iPhone. Apple’s TestFlight app handles the installation.</p></div></li><li><span>2</span><div><h3>Choose your side</h3><p>Select Coach to explore work or Client to find coaches for your team. Preview the app before creating an account.</p></div></li><li><span>3</span><div><h3>Check your beta access</h3><p>Approved accounts receive seven days of complimentary Pro features. Approval is separate from installation. Purchases are disabled.</p></div></li></ol></div></section>
    <section class="faq-section container" id="faq"><div><p class="kicker">A few useful answers</p><h2>Before your first swipe.</h2><p>Questions about access? Reach us at <a href="mailto:support@fittmatch.fit">support@fittmatch.fit</a>.</p></div><div class="faq-list">${faq('shared')}${faq('coach')}${faq('client')}</div></section>
    <section class="closing" id="download"><div class="container">${closing('shared')}${closing('coach')}${closing('client')}<p class="closing-switch">See the other side of the story.</p>${choices(true)}</div></section>
  </main>
  <footer><div class="container footer-inner"><a class="wordmark" href="index.html" aria-label="FittMatch home">Fitt<span>Match</span></a><p>Fitness people. Better connected.</p><nav aria-label="Footer"><a href="#how-it-works">How it works</a><a href="#features">Features</a><a href="privacy.html">Privacy</a><a href="terms.html">Terms</a></nav><small>© 2026 FittMatch</small></div></footer>
  <p class="sr-only" id="audience-status" role="status" aria-live="polite" aria-atomic="true"></p>
  <dialog id="screen-dialog" aria-labelledby="screen-dialog-title"><div class="dialog-toolbar"><h2 id="screen-dialog-title">Inside FittMatch</h2><button type="button" id="close-screen" aria-label="Close enlarged screenshot">Close <span aria-hidden="true">×</span></button></div><p id="screen-dialog-caption"></p><div class="dialog-scroll"><img id="enlarged-screen" alt="" /></div></dialog>
</body>
</html>
`;
fs.writeFileSync(path.join(root,'index.html'),html);
console.log('Built homepage with shared introduction and complete coach/client HTML stories.');
