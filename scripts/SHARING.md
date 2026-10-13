# GitHub Pages sharing strategy

Production sharing uses three static landing pages: `/p/coach/?id=<identifier>`,
`/p/client/?id=<identifier>`, and `/p/job/?id=<uuid>`. Each includes its own initial
Open Graph/Twitter metadata and generic 1200×630 photo-based JPEG. Query parameters
preserve the target for the app; no per-profile pages, personal data, or live server
are required. Coach/client identifiers remain unique stored name-number slugs.

`share-link.js` validates the query and builds the existing `fittmatch:///p/type/id`
app destination. The app adds an index route for the new Universal Link format,
then uses its existing visibility-gated resolver. The AASA `/p/*` association is
unchanged. Admin links use the same format. These app/admin changes need release
alongside the site. Opt-outs expose no personal details in the generic OG card;
the app continues to enforce profile visibility.

Older path-style links continue through the 404 fallback and can open the app.
Their 404 HTML includes one generic FittMatch card; Pages cannot choose three
server-rendered cards by an arbitrary path. Some sharing services may reject or
cache 404 previews, so new links must use the 200-status landing pages.

Run `node scripts/build-generic-share-pages.mjs` with Sharp available (or
`SHARE_CARD_SHARP_MODULE`) to regenerate all generic pages/cards. Stock photography
is illustrative. `/examples/generic-sharing/` previews the cards and is noindex.
Run `node share-link.test.cjs` to verify routes, metadata and identifiers.

The earlier personalized examples and optional dynamic service remain below for
reference; they are not required for the generic GitHub Pages strategy.

# Profile and listing sharing cards

`share-cards.mjs` accepts a coach, job, or client public data record using the
mobile app's field names, together with its verified stored slug or listing UUID.
It creates an entity-specific description, a 1200 × 630 photo card, and static page
metadata. Studios use the existing `client` profile type.

- Coach: name, title or specialties, city, experience, certifications.
- Job: role title, employer, city, pay range, employment type.
- Studio: company name, facility type, city.

`renderShareCard` takes a preloaded photo image Buffer and its MIME type.
Coach cards use a full-image background, preferring the profile photo and then
gallery photos. Job and studio cards use studio gallery photos with a logo
fallback. Missing media uses a neutral background or initials. The descriptor selects
only presentation fields, excluding email and private account data.

`share-media.mjs` loads public photos only from approved HTTPS hosts, rejects
redirects, limits download size, and normalizes images before rendering.
The live service allows the configured Supabase host and `images.unsplash.com`;
add trusted media hosts with the comma-separated `WEB_PROFILE_MEDIA_HOSTS` setting.
Visibility is checked before any photo is fetched.

Images are namespaced by entity type and unique identifier, with a hash of the
rendered artwork in their filename. Changing visible content or an image creates
a new URL. The example builder refuses to overwrite an existing different image
and rejects duplicate targets before writing. It produces JPEGs for sharing.

Run `node scripts/check-share-cards.mjs` for uniqueness, content revision, static
metadata, asset, pay formatting, safe path, escaping, and private-field checks.
Run `node scripts/check-share-media.mjs` for photo selection, host restrictions,
image revision, and hidden-coach media checks.
To rebuild fictional examples, run `node scripts/build-share-examples.mjs` with
Sharp installed, or set `SHARE_CARD_SHARP_MODULE` to an existing Sharp module's
absolute entrypoint. No dependency needs to be added to the mobile app.

Examples are available at `/examples/share-cards/` and remain `noindex`.
`profile-pages.mjs` renders all public detail sections, image galleries, a native
intro video player, verified certification labels, other qualifications,
availability, public reviews, studio information and open jobs, and full listing
details. Empty sections are omitted. Example photos are stock images, and the
example intro uses clearly labeled sample footage rather than an actual coach.

`serve-web-profiles.mjs` supplies live `/p/coach/`, `/p/client/`, `/p/job/`, and
per-profile `og.jpg` endpoints. Set `WEB_PROFILE_SUPABASE_URL` and
`WEB_PROFILE_SUPABASE_ANON_KEY` to public project credentials, and run with Sharp
available (or `SHARE_CARD_SHARP_MODULE`). Never provide a service-role key.
It calls the new `get_public_web_profile` RPC for every page/card request and
does not cache profile HTML or images. A coach must explicitly have
`open_to_offers = true`; unchecked or missing values return a generic 404 without
the coach's name, metadata, or media. Legacy UUID URLs use the same check.
Examples regenerated with a hidden coach remove that coach from the gallery and
delete its generated example card assets.

Deploy both database migrations and the live service before exposing real profiles.
GitHub Pages cannot run this Node service; production needs a server host or
equivalent dynamic routing. The anonymous RPC returns only public presentation
fields and strips coordinates from extra cities. The migrations, live handler,
and renderer have been tested locally but are not deployed.
Only feed public, visible records resolved by their stored unique identifier into
the renderer. Generate metadata in the initial HTML response, and point each page
to its own generated JPEG; browser-side metadata changes are insufficient for
sharing crawlers. Production profile assets must go through the visibility-gated
image endpoint, not public static snapshots. A third-party service can retain a
thumbnail it fetched before opt-out; existing external cached copies cannot be
recalled by this service.
