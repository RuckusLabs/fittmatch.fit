import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { renderShareCard, escape } from './share-cards.mjs';
import { createShareMediaLoader } from './share-media.mjs';
const { default: sharp } = await import(process.env.SHARE_CARD_SHARP_MODULE || 'sharp');
const loadMedia = createShareMediaLoader({ sharp, allowedHosts: ['images.unsplash.com'] });
const photo = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=85';
const media = await loadMedia({type:'client',data:{photos:[{url:photo}]}});
if (!media.image) throw Error('Generic stock photo unavailable; keep the existing cards.');
const base = (await readFile('404.html','utf8')).replace(/<!-- generic-fallback-start -->[\s\S]*?<!-- generic-fallback-end -->/,'');
const templates = [
 {type:'coach',name:'Meet your next coach.',label:'Coach profile',subtitle:'Strength. Experience. A better fit.',description:'Explore coaching experience, specialties and qualifications. Open this shared coach profile in FittMatch.'},
 {type:'job',name:'Your next opportunity.',label:'Job opportunity',subtitle:'Find a role that fits your strengths.',description:'Discover coaching roles at gyms and studios. Open this shared job in FittMatch to explore the opportunity.'},
 {type:'client',name:'Meet your next team.',label:'Gym & studio profile',subtitle:'Great spaces. Stronger connections.',description:'Connect with gyms and studios building great coaching teams. Open this shared studio profile in FittMatch.'},
];
for (const d of templates) {
 const card = renderShareCard({...d,identifier:'generic',example:false,city:'',badges:['Open in FittMatch']},media);
 const imagePath=`/assets/social/generic/${d.type}.jpg`;
 await mkdir('assets/social/generic',{recursive:true});
 await writeFile('.'+imagePath,await sharp(Buffer.from(card.svg)).jpeg({quality:90}).toBuffer());
 const url=`https://fittmatch.fit/p/${d.type}/`;
 const metadata=`<meta property="og:type" content="website"><meta property="og:site_name" content="FittMatch"><meta property="og:title" content="${escape(d.name)}"><meta property="og:description" content="${escape(d.description)}"><meta property="og:image" content="https://fittmatch.fit${imagePath}"><meta property="og:image:type" content="image/jpeg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="${escape(d.label)} on FittMatch, with a sample training space"><meta property="og:url" content="${url}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escape(d.name)}"><meta name="twitter:description" content="${escape(d.description)}"><meta name="twitter:image" content="https://fittmatch.fit${imagePath}"><meta name="description" content="${escape(d.description)}">`;
 let html=base.replace('<title>Open FittMatch</title>',`<title>${escape(d.name)} · FittMatch</title>${metadata}`)
 .replace('Let’s get you back on track.',escape(d.name)).replace('This page isn’t available. Visit FittMatch to find coaches and opportunities.',escape(d.description))
 .replace('<main class="share-main">',`<main class="share-main"><img class="generic-share-image" src="${imagePath}" width="1200" height="630" alt="${escape(d.label)} on FittMatch, with a sample training space">`);
 await mkdir(`p/${d.type}`,{recursive:true});await writeFile(`p/${d.type}/index.html`,html);
}
console.log('Built three generic sharing pages and JPEG cards.');
// Old path-style links share one brand card because Pages has a single 404 document.
const fallback = renderShareCard({type:'client',identifier:'generic',example:false,name:'Find your fit.',label:'FittMatch',subtitle:'Coaches. Opportunities. Great teams.',city:'',badges:['Open in FittMatch']},media);
await writeFile('assets/social/generic/fittmatch.jpg',await sharp(Buffer.from(fallback.svg)).jpeg({quality:90}).toBuffer());
const fallbackMeta='<meta property="og:type" content="website"><meta property="og:site_name" content="FittMatch"><meta property="og:title" content="Find your fit on FittMatch"><meta property="og:description" content="Connect with coaches, discover opportunities, and meet gyms and studios. Open your shared link in FittMatch."><meta property="og:image" content="https://fittmatch.fit/assets/social/generic/fittmatch.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="https://fittmatch.fit/assets/social/generic/fittmatch.jpg">';
const cleanBase=base.replace(/<!-- generic-fallback-start -->[\s\S]*?<!-- generic-fallback-end -->/,'');
await writeFile('404.html',cleanBase.replace('</head>','<!-- generic-fallback-start -->'+fallbackMeta+'<!-- generic-fallback-end --></head>'));
const gallery=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Generic sharing cards · FittMatch</title><link rel="stylesheet" href="/styles.css"><style>main{max-width:960px;margin:auto;padding:40px 24px}article{margin:28px 0}img{width:100%;height:auto;border-radius:18px}h2{font-size:24px;margin-bottom:12px}</style></head><body><main><a href="/">FittMatch</a><h1>Generic sharing cards</h1><p>One photo-based template per type. No personal details are included.</p>${templates.map(d=>`<article><h2>${escape(d.label)}</h2><a href="/p/${d.type}/"><img src="/assets/social/generic/${d.type}.jpg" width="1200" height="630" alt="${escape(d.name)}"></a></article>`).join('')}</main></body></html>`;
await mkdir('examples/generic-sharing',{recursive:true});await writeFile('examples/generic-sharing/index.html',gallery);
