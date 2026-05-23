// /embed.js — JavaScript loader that turns any container marked with
// data-eyecare into an iframe pointing at /embed/<lang>.
//
// Usage on host site:
//   <div data-eyecare data-lang="en" data-height="320"></div>
//   <script src="https://eyecare.love/embed.js" async></script>

import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

const SCRIPT = `
(function () {
  if (window.__eyecareEmbedLoaded) return;
  window.__eyecareEmbedLoaded = true;
  var ORIGIN = 'https://eyecare.love';
  var DEFAULTS = { lang: 'en', height: 320 };

  function mount(el) {
    if (el.__mounted) return;
    el.__mounted = true;
    var lang = (el.getAttribute('data-lang') || DEFAULTS.lang).toLowerCase();
    var height = parseInt(el.getAttribute('data-height') || DEFAULTS.height, 10) || DEFAULTS.height;
    var iframe = document.createElement('iframe');
    iframe.src = ORIGIN + '/embed/' + encodeURIComponent(lang);
    iframe.title = 'EYE CARE — 20-20-20 timer';
    iframe.loading = 'lazy';
    iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
    iframe.style.cssText =
      'width:100%;border:1px solid rgba(0,0,0,0.08);border-radius:12px;height:' +
      height + 'px;background:transparent;display:block;';
    el.appendChild(iframe);
  }

  function init() {
    var nodes = document.querySelectorAll('[data-eyecare]:not([data-eyecare-mounted])');
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].setAttribute('data-eyecare-mounted', '1');
      mount(nodes[i]);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  // Re-scan on dynamic insertion.
  if (window.MutationObserver) {
    new MutationObserver(init).observe(document.body, { childList: true, subtree: true });
  }
})();
`;

export function GET() {
  return new NextResponse(SCRIPT, {
    status: 200,
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
