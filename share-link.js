/* Public links contain no profile data. Use the native viewer for the requested entity. */
function sharedTarget(path, search = '') {
  const landing = /^\/p\/(coach|client|job)\/?$/.exec(path);
  const legacy = /^\/p\/(coach|client|job)\/([^/]+)\/?$/.exec(path);
  const type = landing?.[1] || legacy?.[1];
  const id = landing ? new URLSearchParams(search).get('id') : legacy?.[2];
  const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const slug = /^[a-z0-9]+(?:-[a-z0-9]+)*-[1-9][0-9]*$/;
  return type && id && id.length <= 80 && (uuid.test(id) || (type !== 'job' && slug.test(id))) ? { type, id } : null;
}
if (typeof module !== 'undefined') module.exports = { sharedTarget };
if (typeof document !== 'undefined') document.addEventListener('DOMContentLoaded', function () {
  const target = sharedTarget(window.location.pathname, window.location.search);
  const callback = window.location.pathname === '/callback';
  const title = document.getElementById('share-title');
  const detail = document.getElementById('share-detail');
  const open = document.getElementById('open-app');
  const recovery = document.getElementById('link-recovery');
  if (target) {
    title.textContent = target.type === 'job' ? 'Your next opportunity awaits.' : target.type === 'coach' ? 'Meet your next coach.' : 'Meet the team.';
    detail.textContent = 'Open this shared ' + (target.type === 'job' ? 'job' : 'profile') + ' in FittMatch. Joining our iPhone beta? Save this link, install through TestFlight, then tap the link again. Complimentary beta access requires account approval.';
    open.href = 'fittmatch:///p/' + target.type + '/' + target.id;
    open.hidden = false;
    recovery.hidden = false;
    const url = 'https://fittmatch.fit/p/' + target.type + '/?id=' + encodeURIComponent(target.id);
    const field = document.getElementById('saved-link');
    field.value = url;
    document.getElementById('copy-link').addEventListener('click', async function () {
      try { await navigator.clipboard.writeText(url); this.textContent = 'Link copied'; }
      catch (_) { field.focus(); field.select(); document.getElementById('copy-status').textContent = 'Select and copy the link above.'; }
    });
  } else if (callback) {
    title.textContent = 'Continue signing in.';
    detail.textContent = 'Open FittMatch to finish signing in. If you requested the link on another device, request a new sign-in link on your iPhone.';
    open.href = 'fittmatch://callback' + window.location.search + window.location.hash;
    open.hidden = false;
  }
});
