const $time = document.getElementById('time');
const $state = document.getElementById('state');
const $start = document.getElementById('start');
const $stop = document.getElementById('stop');

function format(sec) {
  const m = Math.max(0, Math.floor(sec / 60));
  const s = Math.max(0, sec % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

async function refresh() {
  const data = await chrome.storage.local.get(['state', 'startedAt']);
  if (data.state === 'work' && data.startedAt) {
    const elapsedSec = Math.floor((Date.now() - data.startedAt) / 1000);
    const remaining = 20 * 60 - elapsedSec;
    $time.textContent = format(remaining);
    $state.textContent = 'tracking';
    $start.textContent = 'Restart';
    $start.classList.remove('primary');
  } else if (data.state === 'break') {
    $time.textContent = 'Break';
    $state.textContent = 'look 20 ft away';
    $start.textContent = 'Skip';
    $start.classList.remove('primary');
  } else {
    $time.textContent = '20:00';
    $state.textContent = 'a quiet timer for your eyes';
    $start.textContent = 'Start';
    $start.classList.add('primary');
  }
}

$start.addEventListener('click', async () => {
  const data = await chrome.storage.local.get('state');
  if (data.state === 'work') {
    chrome.runtime.sendMessage({ type: 'RESTART' });
  } else if (data.state === 'break') {
    chrome.runtime.sendMessage({ type: 'SKIP_BREAK' });
  } else {
    chrome.runtime.sendMessage({ type: 'START' });
  }
  setTimeout(refresh, 100);
});

$stop.addEventListener('click', async () => {
  chrome.runtime.sendMessage({ type: 'STOP' });
  setTimeout(refresh, 100);
});

setInterval(refresh, 1000);
refresh();
