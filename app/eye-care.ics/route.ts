// /eye-care.ics — downloadable iCalendar with hourly 20-second eye breaks
// across the standard workday. Drop into Google Calendar, Apple Calendar,
// Outlook. Recurring weekday event, repeats every 20 minutes, 09:00 - 18:00.

import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

function escapeICS(s: string) {
  return s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

export function GET() {
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
  const dtstart = '20260101T090000'; // floating local time
  const events: string[] = [];

  // 27 events per day: every 20 minutes from 09:00 to 17:40 = 27 slots.
  for (let i = 0; i < 27; i++) {
    const minutes = 9 * 60 + i * 20;
    const hh = String(Math.floor(minutes / 60)).padStart(2, '0');
    const mm = String(minutes % 60).padStart(2, '0');
    const endMinutes = minutes; // 20-second event, encode as 0-minute duration
    const eh = String(Math.floor(endMinutes / 60)).padStart(2, '0');
    const em = String(endMinutes % 60).padStart(2, '0');
    const uid = `eyecare-${hh}${mm}@eyecare.love`;

    events.push(
      [
        'BEGIN:VEVENT',
        `UID:${uid}`,
        `DTSTAMP:${stamp}`,
        `DTSTART:20260101T${hh}${mm}00`,
        `DTEND:20260101T${eh}${em}20`,
        'RRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR',
        `SUMMARY:${escapeICS('👁 Eye break (20-20-20)')}`,
        `DESCRIPTION:${escapeICS('Look at something 20 feet (6 m) away for 20 seconds. https://eyecare.love')}`,
        `URL:https://eyecare.love/en`,
        'CATEGORIES:Health,Eye care',
        'BEGIN:VALARM',
        'ACTION:DISPLAY',
        'DESCRIPTION:Eye break — look 20 ft away for 20 sec',
        'TRIGGER:PT0M',
        'END:VALARM',
        'END:VEVENT',
      ].join('\r\n'),
    );
  }

  const ics =
    [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//EYE CARE//Eye Care Breaks//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-CALNAME:EYE CARE — 20-20-20 breaks',
      'X-WR-CALDESC:Hourly 20-second eye breaks across the workday, weekdays only. From eyecare.love.',
      'X-WR-TIMEZONE:UTC',
      ...events,
      'END:VCALENDAR',
    ].join('\r\n') + '\r\n';

  return new NextResponse(ics, {
    status: 200,
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'attachment; filename="eye-care.ics"',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
