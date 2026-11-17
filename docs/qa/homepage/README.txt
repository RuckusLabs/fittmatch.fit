FittMatch homepage — local implementation, November 3, 2026

Preview
  From the fittmatch.fit folder: python3 -m http.server 4318 --bind 127.0.0.1
  Shared introduction: http://127.0.0.1:4318/
  Coach story: http://127.0.0.1:4318/?audience=coach
  Hiring story: http://127.0.0.1:4318/?audience=client

Editing
  Edit homepage-content.js, then run node scripts/build-homepage.cjs.
  index.html is generated with both full stories for the script-free fallback.
  homepage.css is separate from the existing shared-profile and legal-page styles.
  main.js manages selection, browser history, navigation and screenshot enlargement.
  The existing TestFlight destination and static hosting setup are preserved.

App visuals
  Eight native screenshots are retained in assets/product/captures.
  Supplied device frames are rendered as separate WebP assets with CSS positioning.
  The Duo bezel mask removes its baked interior and status display; native status remains.
  Every screenshot uses light appearance and 9:41, with standardized native indicators.
  No app interface content was painted or generated. Responsive exports only resize/encode.
  Asset sources, capture hashes, audience associations and status reviews are in assets/product/manifest.json.
  To export again, create a Python environment, install scripts/homepage-assets-requirements.txt,
  and run scripts/export-homepage-assets.py with that environment's Python.

Demo preparation
  Used the existing verified fictional Harper Chen and Buckeye Movement Lab fixtures.
  Updated their demo biographies and Buckeye job descriptions to replace testing jargon
  with clearly labeled illustrative copy. Used the native Like action to create Harper's
  application to Buckeye's Recovery & Mobility Coach role. No Pro entitlements or account
  permissions changed. No app source files were edited for this website implementation.
  The client conversation capture predates the bundle refresh/application; its native
  conversation layout was reviewed against the current source. Other final captures use
  the refreshed current-workspace JavaScript with native base build 100.

Capture limitation
  The client's applicant-detail request returned a loading error during capture.
  The hiring story therefore shows the working job overview with one coach in the pipeline.
  Detailed stage and notes capabilities were checked against the current app source.

Verification details
  See verification.json for browser observations and exact verification limits.
  Desktop and mobile images, complete page captures and the dialog preview are in this folder.
  Production publication was not performed.

Swipe-first revision
  Headlines and actions now emphasize browsing, swiping right and connecting.
  Each audience has three main steps, followed by two supporting product cards.
  A native coach swipe video is used in shared/coach heroes; controls support pause/play.
  It is trimmed and the actual gesture is slowed 6x for readability; native UI is unchanged.
  The native right swipe restored the fictional application to Applied.
  See swipe-revision.json and swipe-*-desktop/mobile.jpg for this revision.

Filter messaging revision — November 4, 2026
  Added native filter explanations to the Browse step for both audiences, hero copy,
  shared overview and audience FAQs. Hiring Browse now shows the existing real Duo
  filter/discovery screen. No new native screenshots or demo data changes.
  Verified against components/modals/FilterSheet.tsx and lib/constants.ts in the app.
  Coach pay control is a minimum hourly rate, not a two-ended pay range.
  Coach time choices are AM/PM; client choices are Mornings/Afternoons/Evenings.
  Both audiences also support days and city/radius search.
  Browser checked both audience filter guides and switching at 390px without overflow;
  desktop screenshots: filters-coach-desktop.jpg and filters-hiring-desktop.jpg.
  Build, syntax, existing share-link checks and diff whitespace checks passed.
  Local preview only; no production publication.
