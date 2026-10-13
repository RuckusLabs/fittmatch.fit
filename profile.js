const shareButton = document.getElementById('share-profile');
const shareStatus = document.getElementById('share-status');
let statusTimer;

function announce(message) {
  clearTimeout(statusTimer);
  shareStatus.textContent = message;
  shareStatus.hidden = false;
  statusTimer = setTimeout(() => { shareStatus.hidden = true; }, 4500);
}

shareButton.addEventListener('click', async () => {
  const url = window.location.href;
  try {
    if (navigator.share) {
      await navigator.share({
        title: document.querySelector('meta[property="og:title"]')?.content || document.title,
        text: document.querySelector('meta[property="og:description"]')?.content || 'Explore this profile on FittMatch.',
        url,
      });
    } else if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(url);
      announce('Example profile link copied');
    } else {
      announce('Copy this page’s address to share the example.');
    }
  } catch (error) {
    if (error.name !== 'AbortError') announce('Couldn’t share. Copy this page’s address instead.');
  }
});

const photoLinks = document.querySelectorAll('[data-photo-zoom]');
if (photoLinks.length) {
  const viewer = document.createElement('dialog');
  viewer.className = 'photo-viewer';
  viewer.setAttribute('aria-label', 'Enlarged profile photo');
  viewer.innerHTML = '<button type="button" class="photo-close" aria-label="Close photo">Close <span aria-hidden="true">×</span></button><figure><img alt=""><figcaption></figcaption></figure>';
  document.body.append(viewer);
  const image = viewer.querySelector('img');
  const caption = viewer.querySelector('figcaption');
  let opener;
  photoLinks.forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    opener = link;
    image.src = link.href;
    image.alt = link.querySelector('img').alt;
    caption.textContent = link.closest('figure').querySelector('figcaption')?.textContent || '';
    viewer.showModal();
    document.documentElement.classList.add('photo-viewer-open');
  }));
  viewer.querySelector('button').addEventListener('click', () => viewer.close());
  viewer.addEventListener('click', event => {
    if (event.target === viewer) viewer.close();
  });
  viewer.addEventListener('close', () => {
    document.documentElement.classList.remove('photo-viewer-open');
    image.removeAttribute('src');
    opener?.focus();
  });
}
