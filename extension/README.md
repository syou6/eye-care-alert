# EYE CARE — Chrome MV3 extension

Minimal browser-toolbar version of the EYE CARE 20-20-20 timer.

## Local install

1. Open `chrome://extensions` (or `edge://extensions`)
2. Enable Developer mode
3. Click "Load unpacked"
4. Select this `extension/` directory

## Files

- `manifest.json` — MV3 manifest (alarms, notifications, storage)
- `background.js` — service worker driving `chrome.alarms`
- `popup.html` + `popup.js` — toolbar popup
- `icons/` — 16/48/128 PNG icons (add before submitting to Chrome Web Store)

## Chrome Web Store submission

Requires:
- Developer account ($5 one-time)
- All three icon PNGs (16, 48, 128)
- 440×280 promotional tile
- Optional 1280×800 screenshots
- Privacy policy URL (link to https://eyecare.love/privacy)

## Architecture notes

The web app and the extension share the same 20-20-20 cadence and the same
brand. They do not share state — by design — to avoid the cross-context
permissions extension installations would require. Anyone wanting full
cross-device sync should use the web PWA.
