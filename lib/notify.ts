// lib/notify.ts
// Break notifications that work on every platform.
// Android Chrome throws on `new Notification(...)` — notifications there must
// go through ServiceWorkerRegistration.showNotification. Desktop works with
// either, so we try the SW path first and fall back to the constructor.

type BreakNotificationOptions = {
  title: string;
  body: string;
};

export async function showBreakNotification({ title, body }: BreakNotificationOptions): Promise<void> {
  if (typeof window === 'undefined' || !('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;

  const options: NotificationOptions = {
    body,
    tag: 'eye-care-break',
    icon: '/icon.svg',
  };

  try {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration?.showNotification) {
        await registration.showNotification(title, options);
        return;
      }
    }
  } catch {
    // fall through to the constructor path
  }

  try {
    new Notification(title, options);
  } catch {
    // Android without an active SW registration — nothing more we can do.
  }
}
