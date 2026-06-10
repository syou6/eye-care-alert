// EYE CARE — Chrome MV3 background service worker.
// Drives the timer via chrome.alarms so it persists across browser sessions.

const WORK_MIN = 20;
// chrome.alarms clamps delays under 30s in release builds, so the "20 second"
// break is scheduled as 0.5 min. The notification copy still says 20 seconds —
// the extra 10s of rest does no harm.
const BREAK_MIN = 0.5;

function startWork() {
  chrome.alarms.clearAll();
  chrome.alarms.create('eyecare-work', { delayInMinutes: WORK_MIN });
  chrome.storage.local.set({ state: 'work', startedAt: Date.now() });
}

chrome.runtime.onInstalled.addListener(() => {
  // No alarms by default — popup decides.
});

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg?.type === 'START' || msg?.type === 'RESTART' || msg?.type === 'SKIP_BREAK') {
    startWork();
    sendResponse({ ok: true });
    return true;
  }
  if (msg?.type === 'STOP') {
    chrome.alarms.clearAll();
    chrome.storage.local.set({ state: 'idle' });
    sendResponse({ ok: true });
    return true;
  }
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'eyecare-work') {
    chrome.notifications.create('eyecare-break-start', {
      type: 'basic',
      iconUrl: 'icons/icon-128.png',
      title: 'Time for a break',
      message: 'Look at something 20 ft (6 m) away for 20 seconds.',
      priority: 2,
    });
    chrome.alarms.create('eyecare-break', { delayInMinutes: BREAK_MIN });
    chrome.storage.local.set({ state: 'break' });
    const data = await chrome.storage.local.get('sessionsCompleted');
    chrome.storage.local.set({ sessionsCompleted: (data.sessionsCompleted ?? 0) + 1 });
  } else if (alarm.name === 'eyecare-break') {
    chrome.notifications.clear('eyecare-break-start');
    chrome.notifications.create('eyecare-break-end', {
      type: 'basic',
      iconUrl: 'icons/icon-128.png',
      title: 'Break over',
      message: 'Eyes rested. Next reminder in 20 minutes.',
      priority: 0,
    });
    startWork();
  }
});
