"""Export untouched native captures at responsive sizes; frame masking lives in CSS/SVG."""
from pathlib import Path
import hashlib
import json
from PIL import Image

root = Path(__file__).resolve().parents[1]
assets = root / 'assets/product'
prior_path = assets / 'manifest.json'
prior = json.loads(prior_path.read_text()) if prior_path.exists() else {}
prior_by_id = {entry['id']: entry for entry in prior.get('assets', [])}
manifest = {
    'captured_at': '2026-11-03',
    'app_source': 'Current workspace JavaScript bundled for iOS production; native base build 100',
    'illustrative': True,
    'people': ['Harper Chen (fictional coach)', 'Buckeye Movement Lab (fictional employer)'],
    'status_bar': {'time': '9:41', 'appearance': 'light', 'wifi': 'active, full strength', 'battery': '100%, discharging where shown', 'method': 'Native simctl status-bar override; no screen content retouched'},
    'frames': {'iphone': '/Users/makistudio/Downloads/ios devices/iPhone 18 Pro.png', 'duo': '/Users/makistudio/Downloads/ios devices/iPhone Duo/Inner - Landscape.png'},
    'composition': 'Native screens and supplied WebP frames layered in CSS. SVG mask removes the Duo frame interior, including its baked status display. Screens retain one native status display.',
    'assets': []
}
manifest['app_source'] = prior.get('app_source', manifest['app_source'])
if 'demo_changes' in prior: manifest['demo_changes'] = prior['demo_changes']
if 'motion_preview' in prior: manifest['motion_preview'] = prior['motion_preview']
roles = {'coach-job':['coach'], 'coach-profile':['coach','client'], 'client-profile':['client'], 'client-discover-duo':['client'], 'coach-chat-duo':['coach'], 'client-chat-duo':['client'], 'coach-activity':['coach'], 'client-pipeline-duo':['client']}
for name, audiences in roles.items():
    source = assets / 'captures' / (name + '.png')
    if not source.exists():
        print('Pending capture:', name)
        continue
    image = Image.open(source).convert('RGB')
    is_duo = 'duo' in name
    sizes = [600,1200,2000] if is_duo else [600,1200]
    exports = []
    for width in sizes:
        height = round(image.height * width / image.width)
        output = assets / f'{name}-{width}.webp'
        image.resize((width,height), Image.Resampling.LANCZOS).save(output, quality=88, method=6)
        exports.append(output.name)
    image.save(assets / f'{name}-full.webp', quality=92, method=6)
    manifest['assets'].append({'id': name, 'audiences': audiences, 'device': 'iPhone Duo, open' if is_duo else 'iPhone 18 Pro', 'source_capture': str(source.relative_to(root)), 'sha256': hashlib.sha256(source.read_bytes()).hexdigest(), 'native_size': [image.width,image.height], 'exports': exports + [f'{name}-full.webp'], 'status_bar_verified': prior_by_id.get(name, {}).get('status_bar_verified', False) if prior_by_id.get(name, {}).get('sha256') == hashlib.sha256(source.read_bytes()).hexdigest() else False})
    if prior_by_id.get(name, {}).get('sha256') == manifest['assets'][-1]['sha256']:
        for key in ('verified_at', 'capture_source_note', 'screen'):
            if key in prior_by_id[name]: manifest['assets'][-1][key] = prior_by_id[name][key]
(assets/'manifest.json').write_text(json.dumps(manifest, indent=2)+'\n')
print('Exported',len(manifest['assets']),'native captures. Mark status verified after visual QA.')
