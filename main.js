(function () {
  'use strict';
  if (!window.FittMatchContent) return;
  const body = document.body;
  const status = document.getElementById('audience-status');
  const menu = document.getElementById('mobile-nav');
  const menuButton = document.querySelector('.menu-button');
  const dialog = document.getElementById('screen-dialog');
  let lastZoomTrigger;
  function readAudience() {
    const role = new URL(location.href).searchParams.get('audience');
    return role === 'coach' || role === 'client' ? role : 'shared';
  }
  function setAudience(role, announce = false) {
    const x = scrollX, y = scrollY;
    body.dataset.audience = role;
    for (const kind of ['hero', 'faq', 'closing']) {
      document.querySelectorAll(`[data-${kind}]`).forEach(panel => { panel.hidden = panel.dataset[kind] !== role; });
    }
    document.querySelectorAll('button[data-select]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.select === role));
    });
    document.querySelectorAll('.audience-story').forEach(story => { story.hidden = story.dataset.story !== role; });
    document.querySelectorAll('[data-neutral]').forEach(section => { section.hidden = role !== 'shared'; });
    document.title = window.FittMatchContent[role].pageTitle;
    syncSwipePreviews();
    window.scrollTo({ left: x, top: y, behavior: 'instant' });
    if (announce) status.textContent = role === 'coach' ? 'Coach story selected.' : role === 'client' ? 'Hiring story selected.' : 'Both audience options available.';
  }
  document.querySelectorAll('[data-select]').forEach(control => {
    control.addEventListener('click', event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      const role = control.dataset.select;
      if (role === body.dataset.audience) return;
      const url = new URL(location.href);
      url.searchParams.set('audience', role);
      if (url.hash === '#coach-story' || url.hash === '#client-story') url.hash = '#how-it-works';
      history.pushState({ audience: role }, '', url);
      setAudience(role, true);
    });
  });
  window.addEventListener('popstate', () => setAudience(readAudience(), true));
  function closeMenu() {
    menu.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
  }
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menu.hidden = !open;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !menu.hidden) { closeMenu(); menuButton.focus(); }
  });
  document.querySelectorAll('[data-zoom]').forEach(button => {
    button.setAttribute('role', 'button');
    button.setAttribute('aria-haspopup', 'dialog');
    button.addEventListener('keydown', event => {
      if (event.key === ' ') { event.preventDefault(); button.click(); }
    });
    button.addEventListener('click', event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      const source = button.closest('figure').querySelector('.app-screen');
      const image = document.getElementById('enlarged-screen');
      image.src = `assets/product/${button.dataset.zoom}-full.webp`;
      image.alt = source.alt; image.width = source.width; image.height = source.height;
      document.getElementById('screen-dialog-caption').textContent = button.closest('figure').querySelector('figcaption').textContent + ' Illustrative walkthrough with fictional profiles.';
      lastZoomTrigger = button;
      if (typeof dialog.showModal === 'function') {
        dialog.showModal(); body.classList.add('dialog-open'); document.getElementById('close-screen').focus();
      } else { window.open(image.src, '_blank', 'noopener,noreferrer'); }
    });
  });
  document.getElementById('close-screen').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => {
    body.classList.remove('dialog-open');
    if (lastZoomTrigger) lastZoomTrigger.focus({ preventScroll: true });
  });
  const swipeVideos = [...document.querySelectorAll('[data-swipe-preview]')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let swipePausedByUser = false;
  function updatePreviewControl(video) {
    const button = document.querySelector(`[data-preview-for="${video.id}"]`);
    if (button) button.textContent = video.paused ? 'Play swipe preview' : 'Pause swipe preview';
  }
  function syncSwipePreviews() {
    swipeVideos.forEach(video => {
      const active = !video.closest('[data-hero]').hidden;
      const visible = video.dataset.previewVisible === 'true';
      const motionAllowed = !reducedMotion.matches || video.dataset.userStarted === 'true';
      if (active && visible && !document.hidden && !swipePausedByUser && motionAllowed) {
        video.play().catch(() => updatePreviewControl(video));
      } else video.pause();
      updatePreviewControl(video);
    });
  }
  swipeVideos.forEach(video => {
    const button = document.querySelector(`[data-preview-for="${video.id}"]`);
    video.controls = false;
    button.hidden = false;
    video.addEventListener('play', () => updatePreviewControl(video));
    video.addEventListener('pause', () => updatePreviewControl(video));
    button.addEventListener('click', () => {
      if (video.paused) {
        swipePausedByUser = false;
        video.dataset.userStarted = 'true';
        video.play().catch(() => updatePreviewControl(video));
      } else {
        swipePausedByUser = true;
        video.pause();
      }
    });
  });
  if ('IntersectionObserver' in window) {
    const previewObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => { entry.target.dataset.previewVisible = String(entry.isIntersecting); });
      syncSwipePreviews();
    }, { threshold: 0.1 });
    swipeVideos.forEach(video => previewObserver.observe(video));
  } else swipeVideos.forEach(video => { video.dataset.previewVisible = 'true'; });
  reducedMotion.addEventListener('change', () => {
    swipeVideos.forEach(video => { video.dataset.userStarted = 'false'; });
    syncSwipePreviews();
  });
  document.addEventListener('visibilitychange', syncSwipePreviews);

  // No website analytics provider is installed. Outbound clicks are not installations.
  setAudience(readAudience());
  body.dataset.enhanced = 'true';
})();
