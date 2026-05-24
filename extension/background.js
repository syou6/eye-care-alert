// EYE CARE — Chrome MV3 background service worker.
// Drives the timer via chrome.alarms so it persists across browser sessions.

const WORK_MIN = 20;
const BREAK_SEC = 20;

chrome.runtime.onInstalled.addListener(() => {
  // No alarms by default — popup decides.
});

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg?.type === 'START') {
    chrome.alarms.create('eyecare-work', { delayInMinutes: WORK_MIN });
    chrome.storage.local.set({ state: 'work', startedAt: Date.now() });
    sendResponse({ ok: true });
    return true;
  }
  if (msg?.type === 'STOP') {
    chrome.alarms.clearAll();
    chrome.storage.local.set({ state: 'idle' });
    sendResponse({ ok: true });
    return true;
  }
  if (msg?.type === 'SKIP_BREAK') {
    chrome.alarms.clearAll();
    chrome.alarms.create('eyecare-work', { delayInMinutes: WORK_MIN });
    chrome.storage.local.set({ state: 'work', startedAt: Date.now() });
    sendResponse({ ok: true });
    return true;
  }
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'eyecare-work') {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon-128.png',
      title: 'Time for a break',
      message: 'Look at something 20 ft away for 20 seconds.',
      priority: 2,
    });
    chrome.alarms.create('eyecare-break', { delayInMinutes: BREAK_SEC / 60 });
    chrome.storage.local.set({ state: 'break' });
    // Bump session count
    const data = await chrome.storage.local.get('sessionsCompleted');
    const next = (data.sessionsCompleted ?? 0) + 1;
    chrome.storage.local.set({ sessionsCompleted: next });
  } else if (alarm.name === 'eyecare-break') {
    chrome.alarms.create('eyecare-work', { delayInMinutes: WORK_MIN });
    chrome.storage.local.set({ state: 'work', startedAt: Date.now() });
  }
});
