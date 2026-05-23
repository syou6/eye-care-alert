// Persona-specific landing pages — programmatic SEO surface.
// Each entry generates /for/<slug> with custom copy targeting one long-tail
// search cluster ("eye strain timer for developers", "20-20-20 for gamers" etc).

export type Persona = {
  slug: string;
  audience: string; // e.g. "developers" — used in title/copy
  audienceShort: string; // e.g. "devs"
  metaTitle: string;
  metaDescription: string;
  intro: string;
  whyHeadline: string;
  whyBullets: string[]; // 3 short bullets, "<noun phrase>" each
  howHeadline: string;
  howBody: string;
  pitfallsHeadline: string;
  pitfallsBody: string;
  faq: { q: string; a: string }[];
};

export const PERSONAS: Persona[] = [
  {
    slug: 'developers',
    audience: 'developers',
    audienceShort: 'devs',
    metaTitle: 'Eye-Strain Timer for Developers — 20-20-20 Rule Tool for Programmers',
    metaDescription:
      'Free 20-20-20 timer built for developers who spend 8–12 hours a day on a screen. Browser-based, no signup, no install. Works alongside Pomodoro.',
    intro:
      'If you write code for a living, your eyes do more work than almost any other profession. Tight monospace fonts, debugger inspection, focused concentration, and an unblinking stare at three monitors — the perfect storm for digital eye strain. EYE CARE is a free 20-20-20 timer that lives quietly in a browser tab and pulls you into a 20-second break every 20 minutes, no setup required.',
    whyHeadline: 'Why developers need this more than most',
    whyBullets: [
      'Sustained focus on small text at a fixed distance fatigues the ciliary muscle faster than reading prose at varied distances.',
      'Programming flow states routinely run 60–90 minutes without conscious breaks — the moment the build finishes you start the next task and forget about your eyes.',
      'Blink rate drops by ~60% during code review and debugging, drying out the tear film and producing the burning, gritty feeling many devs notice by 4 PM.',
    ],
    howHeadline: 'How to use it in a real dev workflow',
    howBody:
      'Open eyecare.love in a pinned browser tab — Cmd-9 in Chrome, Cmd-1 in Arc. The timer runs in the background and chimes softly when a break is due. During the 20-second break, the screen takes over with a guided breath cue; look away from your monitor at the furthest object in your peripheral vision (the corner of the room, out a window). Pair it with Pomodoro if you already use one — they layer cleanly. The 20-20-20 rule covers your eyes; Pomodoro covers your attention.',
    pitfallsHeadline: 'What the rule will not fix',
    pitfallsBody:
      'A 20-second glance away does not undo bad lighting, a glare-heavy monitor setup, or a desk that puts your screen 18 inches from your face. Treat the timer as one part of a broader visual-hygiene stack: warm screen temperature after sunset, ambient room light bright enough that the monitor is not the brightest object in the room, and an annual comprehensive eye exam. If you wear glasses with anti-reflective coatings, keep them clean.',
    faq: [
      {
        q: 'Does the 20-20-20 rule actually work for software engineers?',
        a: 'Yes, with caveats. Controlled studies show 20-second far-focus breaks measurably reduce subjective eye strain. The benefit comes from looking at something at least 20 feet away — glancing at the edge of your monitor does not trigger the ciliary-muscle relaxation. The EYE CARE timer overlays a full-screen break so you cannot cheat the protocol by reflex.',
      },
      {
        q: 'Can I use this alongside Pomodoro?',
        a: 'Yes. Pomodoro (25-min focus / 5-min break) and 20-20-20 (20-min focus / 20-sec eye break) layer cleanly. Use Pomodoro for attention management and 20-20-20 for eye care — they target different problems and the cadences do not conflict.',
      },
      {
        q: 'Will it interrupt me during deploys or paired-programming sessions?',
        a: 'You can press space to pause, or hit Reset. The timer is browser-local, no notifications outside the tab unless you explicitly grant permission during onboarding.',
      },
      {
        q: 'Is it open source?',
        a: 'Yes — the source for EYE CARE is on GitHub at github.com/syou6/eye-care-alert. Issues and PRs welcome, especially translations and persona pages for other professions.',
      },
    ],
  },
  {
    slug: 'designers',
    audience: 'designers',
    audienceShort: 'designers',
    metaTitle: 'Eye-Strain Timer for Designers — 20-20-20 Rule for Visual Work',
    metaDescription:
      'Free 20-20-20 timer for designers, illustrators, and creatives. Reduce eye fatigue from long Figma, Photoshop, and Procreate sessions.',
    intro:
      'Visual designers spend the day evaluating contrast, color, and pixel-level alignment — work that demands your eyes operate at peak accuracy continuously. Long Figma, Photoshop, or Procreate sessions hammer the ciliary muscle and quietly degrade your color perception over the course of an afternoon. EYE CARE is a free 20-20-20 timer that gives your eyes a 20-second reset every 20 minutes so the work you ship at 5 PM looks as sharp to you as the work you started at 9.',
    whyHeadline: 'Why designers feel eye fatigue first',
    whyBullets: [
      'Evaluating subtle color and contrast differences requires sustained near-focus, which fatigues the eye faster than reading or general computer use.',
      'Color perception drifts when the eyes are tired — a palette that looked balanced at 10 AM can read muddy at 3 PM without your noticing.',
      'High-resolution displays at close range mean every saccade is doing precision work; you are not just looking at a screen, you are inspecting it.',
    ],
    howHeadline: 'Working it into a design day',
    howBody:
      'Open EYE CARE in a pinned tab; the timer runs alongside whatever you have in Figma or Photoshop. When the 20-second break overlay appears, look away from your monitor at something across the room — a plant, a print on the wall, the view out a window. Resist the temptation to skip the break right before a deadline; that is exactly when your eyes need it most. Many designers report that a brief look away actually unlocks creative blocks too, because it interrupts the visual rumination loop.',
    pitfallsHeadline: 'What it does not solve',
    pitfallsBody:
      'A timer cannot fix a poorly calibrated monitor, ambient light bouncing off your screen, or a chair that puts you too close to the display. Calibrate your monitor monthly, position it about an arm\'s length away with the top of the screen at or just below eye level, and keep room lighting bright enough to reduce glare. The 20-20-20 rule is your final layer, not your first.',
    faq: [
      {
        q: 'Will the break overlay mess up my color sampling?',
        a: 'No — the break overlay is a separate UI layer in your browser. Your design tool keeps its color state intact. When the break ends, you are back in your work exactly where you left it.',
      },
      {
        q: 'Does looking at a phone count as a break?',
        a: 'No. The phone is at near-focus distance, so the ciliary muscle stays engaged. The 20-20-20 protocol requires looking at something at least 20 feet (6 m) away — across the room or out a window.',
      },
      {
        q: 'Can I customize the work interval to match my design sprints?',
        a: 'The default is the optometrist-recommended 20 minutes. Custom intervals are on the roadmap; for now, 20-min cycles work cleanly alongside any sprint or Pomodoro schedule.',
      },
      {
        q: 'Will it work for digital illustrators on iPad?',
        a: 'EYE CARE runs in Safari and Chrome on iPad. Installed as a PWA from the share menu, it can sit beside Procreate as a Slide Over window.',
      },
    ],
  },
  {
    slug: 'writers',
    audience: 'writers',
    audienceShort: 'writers',
    metaTitle: 'Eye-Strain Timer for Writers — 20-20-20 Rule for Long Writing Sessions',
    metaDescription:
      'Free 20-20-20 timer for writers, journalists, copywriters, and authors. Protect your eyes during long writing sessions and editing marathons.',
    intro:
      'Writing is one of the most cognitively absorbing screen activities — you can lose 90 minutes inside a paragraph without realizing your eyes have not blinked properly in 20 minutes. EYE CARE is a free, distraction-free 20-20-20 timer designed to live quietly in the background of a long writing session and pull you out for a 20-second visual reset every 20 minutes, then return you to the cursor exactly where you left it.',
    whyHeadline: 'Why writers are at higher risk than they think',
    whyBullets: [
      'Long-form writing produces some of the deepest sustained focus of any screen activity — the kind of focus where you forget your body exists.',
      'Word processors and writing apps default to bright white backgrounds, which fatigue the eyes faster than darker editor themes.',
      'Editing requires comparing two passages at high resolution, demanding rapid saccades between two near-focus targets — measurably more fatiguing than drafting.',
    ],
    howHeadline: 'How to use it without breaking flow',
    howBody:
      'Open EYE CARE in a pinned tab and forget about it; the soft chime is enough to break a deep flow state without jarring you. During the 20-second break, look up — literally — at the wall across the room, then out the nearest window. Use the 20 seconds for nothing. No phone, no email, no reading. The eyes recover, the back unhunches, the next sentence often clarifies itself by the time the timer ends.',
    pitfallsHeadline: 'What this rule will not fix',
    pitfallsBody:
      'The 20-20-20 rule helps with near-focus fatigue and the dry-eye component of long screen sessions. It does not address bad posture, RSI in your wrists, or the dehydration you accumulate when you forget to drink water for four hours. Pair the timer with a glass of water within reach and a habit of standing up every couple of hours.',
    faq: [
      {
        q: 'Will the break interrupt my flow?',
        a: 'The break overlay is brief — 20 seconds — and the audio cue is intentionally soft. Most writers find that a short visual break actually helps with stuck sentences; the time away from the page often resolves the very thing you were trying to force.',
      },
      {
        q: 'Can I use this with Scrivener / iA Writer / Ulysses / Obsidian?',
        a: 'Yes. EYE CARE runs in your browser independently of any writing app. The two never interact.',
      },
      {
        q: 'Does dark mode in my editor remove the need for breaks?',
        a: 'Dark mode reduces overall brightness exposure but does not change the near-focus problem at the heart of the 20-20-20 rule. Your ciliary muscle is fatiguing regardless of background color.',
      },
      {
        q: 'Is there a count of how many sessions I have done today?',
        a: 'Yes — the footer shows your session count for the day. Daily streaks are tracked in localStorage and shown when you hit milestones (7 days, 30 days, 100 days).',
      },
    ],
  },
  {
    slug: 'students',
    audience: 'students',
    audienceShort: 'students',
    metaTitle: 'Eye-Strain Timer for Students — Free 20-20-20 Tool for Studying',
    metaDescription:
      'Free 20-20-20 timer for high school and university students. Reduce eye fatigue during long study sessions, online classes, and exam prep.',
    intro:
      'Students today look at screens longer than any generation before them — and longer than is healthy for an eye still finishing its development. Online lectures, e-textbooks, group chats, and recreational screen time stack up to ten or more hours a day. EYE CARE is a free 20-20-20 timer that gently enforces the eye-care rule recommended by the American Optometric Association, so your eyes survive exam season as well as your grades do.',
    whyHeadline: 'Why students need the 20-20-20 rule more than adults',
    whyBullets: [
      'Eyes are still developing into the early twenties; prolonged near-focus during this window is one of the strongest known accelerators of myopia.',
      'Cramming sessions involve hours of unbroken close-up reading — the worst possible pattern for the ciliary muscle.',
      'Online classes mean even relaxation often happens on the same screen as study, with no natural reset between modes.',
    ],
    howHeadline: 'How to fit it into a study day',
    howBody:
      'Open EYE CARE in a tab next to your study materials; the timer runs alongside your work. When the break appears, look out the window or at the wall across the room — count three things you can see at distance. Stand up, stretch, drink water. Twenty seconds. Then back to work. If you study with a friend or a study group, sync your breaks; the social cue makes the habit stick. For exam-prep weeks specifically, the breaks measurably reduce end-of-day eye fatigue, which means clearer reading on the second pass through your notes.',
    pitfallsHeadline: 'What the rule will not solve',
    pitfallsBody:
      'The 20-20-20 timer does not replace adequate sleep, regular outdoor time (which has its own protective effect on developing eyes — see the 20-20-2 rule), or a yearly eye exam. If you are squinting at the whiteboard or moving your phone closer to your face, schedule an exam regardless of your timer habits. New myopia is most treatable when caught early.',
    faq: [
      {
        q: 'Will this help during online classes?',
        a: 'Yes. Open EYE CARE in a separate tab during class. The break overlay appears every 20 minutes; you can skip it during a live exam moment with the Esc key.',
      },
      {
        q: 'Is the 20-20-20 rule recommended by eye doctors?',
        a: 'Yes. The American Optometric Association and most pediatric ophthalmologists recommend it as a baseline habit for anyone using screens for more than two hours daily.',
      },
      {
        q: 'I am a kid — is this rule different for me?',
        a: 'The rule itself is the same, but children should also aim for 2+ hours of outdoor time daily — sunlight exposure protects against myopia progression. This is sometimes called the 20-20-2 rule.',
      },
      {
        q: 'Will it work on my Chromebook?',
        a: 'Yes — EYE CARE runs in any modern browser, including Chrome on Chromebook. No download or installation required.',
      },
    ],
  },
  {
    slug: 'gamers',
    audience: 'gamers',
    audienceShort: 'gamers',
    metaTitle: 'Eye-Strain Timer for Gamers — 20-20-20 Rule for Long Gaming Sessions',
    metaDescription:
      'Free 20-20-20 timer for gamers and esports players. Reduce eye fatigue, blue light strain, and headaches during long gaming sessions.',
    intro:
      'Gaming routinely involves four-, six-, or even ten-hour sessions in front of a high-refresh-rate monitor, with the kind of sustained focus and infrequent blinking that produces the worst end-of-session eye fatigue. EYE CARE is a free 20-20-20 timer that runs in a browser window alongside your game and gently breaks the focus loop every 20 minutes so you can play longer without the late-night burning eyes and tension headache.',
    whyHeadline: 'Why gamers are in the highest-risk group',
    whyBullets: [
      'Competitive play locks the eyes into sustained close-up focus on the screen center, with minimal saccades to relieve the ciliary muscle.',
      'Blink rate during intense gameplay drops to as low as 3–5 per minute (normal is 15), which dries the tear film and produces the gritty, burning feeling after a long session.',
      'High-refresh-rate monitors plus dark UIs create high contrast strain, and most gamers play with room lighting too dim relative to the screen.',
    ],
    howHeadline: 'How to use it without breaking your match',
    howBody:
      'Open EYE CARE in a browser window on your second monitor, or pin it to a corner with Picture-in-Picture. The audio cue is soft enough not to overlap voice comms. During the 20-second break, look across the room or out the window — and stand up to reset your shoulders and lower back at the same time. For ranked play, you can press Esc to skip the break, but try to take the next one. For long single-player marathons or streaming sessions, the breaks measurably reduce the end-of-night headache so many gamers attribute (incorrectly) to blue light.',
    pitfallsHeadline: 'What it does not fix',
    pitfallsBody:
      'A timer does not replace good monitor setup. Position your monitor at arm\'s length, the top of the screen at or just below eye level. Keep room lighting bright enough that the monitor is not the brightest object in the room. Warm color temperature in the evenings helps with sleep, even if its effect on eye strain itself is modest. If you wear glasses, a single pair of computer glasses with anti-reflective coating is usually a better investment than tinted "gaming glasses."',
    faq: [
      {
        q: 'Will this interfere with my game?',
        a: 'No. EYE CARE runs in a separate browser window; the break overlay only appears in that window. Your game keeps its full-screen focus and you choose when to glance over.',
      },
      {
        q: 'Are blue-light glasses or gaming glasses worth it?',
        a: 'The evidence for blue-light-blocking lenses preventing eye strain is weak. The evidence for taking regular breaks (the 20-20-20 rule) is strong. If you only do one thing, take the breaks.',
      },
      {
        q: 'Does it work with two monitors?',
        a: 'Yes — open EYE CARE on your secondary monitor. The break overlay applies to the browser window it lives in; your gaming monitor is unaffected.',
      },
      {
        q: 'Can I use it with OBS while streaming?',
        a: 'Yes. EYE CARE runs locally in your browser; it has no effect on OBS or your stream output unless you choose to capture the browser source.',
      },
    ],
  },
  {
    slug: 'traders',
    audience: 'day traders',
    audienceShort: 'traders',
    metaTitle: 'Eye-Strain Timer for Day Traders — 20-20-20 Rule for Market Hours',
    metaDescription:
      'Free 20-20-20 timer for day traders and finance professionals staring at multi-monitor setups. Reduce eye fatigue without missing market moves.',
    intro:
      'Day trading is a multi-monitor sport played at maximum cognitive load — six or seven hours of unbroken focus on charts, level-II quotes, news feeds, and execution windows. The combination of dense small text, rapid saccades between screens, and the inability to look away during the open is one of the worst possible workloads for the eye. EYE CARE is a free 20-20-20 timer that runs in a corner of one monitor and prompts a 20-second eye break during natural lulls, without making you miss a trade.',
    whyHeadline: 'Why traders feel it before other professions',
    whyBullets: [
      'Multi-monitor setups force the eye to constantly refocus across different physical distances and depths — measurably more fatiguing than a single-monitor workload.',
      'Stress reduces blink rate further; a tense trader can drop to 2–3 blinks per minute, drying out the tear film within an hour.',
      'Reading small candlestick wicks and Level II ticker tape is high-precision near-work, the same category of strain as proofreading or detailed accounting.',
    ],
    howHeadline: 'How to fit breaks around market hours',
    howBody:
      'Open EYE CARE in a small browser window on your main monitor or a side display. The soft audio cue is unobtrusive enough not to spook a position. During the 20-second break, look away from all monitors at the furthest object in your room — preferably out a window if you have one. Most traders find a slow Saturday is the best time to introduce the habit; once your eyes adjust to the rhythm, market days feel manageable. The 20-second cost is trivial compared to the cumulative end-of-session strain it prevents.',
    pitfallsHeadline: 'What it does not address',
    pitfallsBody:
      'The 20-20-20 rule does not fix the underlying ergonomic problems of a multi-monitor desk: monitors at different distances, glare from windows behind you, or chairs that put you too close to the screens. Position your primary monitor at arm\'s length, secondaries within 15° of the primary, and keep ambient light bright enough to reduce screen-to-room contrast. Get a comprehensive eye exam yearly — a small refractive change matters more at multi-monitor distances than in normal life.',
    faq: [
      {
        q: 'Will the break overlay block my chart view?',
        a: 'The break overlay only appears in the EYE CARE browser window — your trading platforms are unaffected. The audio cue is soft enough not to disrupt focus on the open.',
      },
      {
        q: 'Can I skip during market open or major news?',
        a: 'Yes. Press Esc to skip the current break; the next one will appear in 20 minutes. Try not to skip back-to-back — the cumulative eye load adds up quickly.',
      },
      {
        q: 'Does it have a Pomodoro mode for non-market hours?',
        a: 'EYE CARE is single-purpose by design: the 20-min / 20-sec / 20-feet cadence. Custom intervals are on the roadmap.',
      },
      {
        q: 'Will blue-light glasses help during long sessions?',
        a: 'The evidence for blue-light glasses preventing eye strain is weak. The strongest evidence is for regular far-focus breaks (this rule), warm monitor color temperature after sunset, and adequate room lighting.',
      },
    ],
  },
  {
    slug: 'doctors',
    audience: 'doctors',
    audienceShort: 'clinicians',
    metaTitle: 'Eye-Strain Timer for Doctors & Clinicians — 20-20-20 Rule for EHR Days',
    metaDescription:
      'Free 20-20-20 timer for clinicians, residents, and medical students charting in EHRs. Reduce eye fatigue and headaches from long documentation sessions.',
    intro:
      'A typical day in clinic or on the ward involves hours of EHR documentation, chart review, and dense imaging interpretation — far more screen time than most physicians realize until end-of-day eye strain becomes unmistakable. EYE CARE is a free 20-20-20 timer designed to run quietly during charting sessions and pull you into a brief eye reset between patients, without disrupting clinical workflow.',
    whyHeadline: 'Why clinicians underestimate their screen exposure',
    whyBullets: [
      'EHR documentation, chart review, and order entry add up to a much larger fraction of the workday than the patient-facing time most clinicians associate with their job.',
      'Imaging review (PACS, dermoscopy, fundoscopy displays) requires sustained high-precision near-focus — the highest-fatigue category of screen work.',
      'The constant context switching between screen, patient, and forms means the eyes never settle into a sustainable rhythm without external prompting.',
    ],
    howHeadline: 'How to integrate it into clinical workflow',
    howBody:
      'Open EYE CARE in a pinned browser tab next to your EHR. The break overlay appears every 20 minutes; you can pause with the space bar or skip with Esc when a patient walks in. During the 20-second break, look away from the monitor at the furthest point in the room. Many clinicians find the natural break between patients is the right cadence anyway; the timer turns it into a habit rather than an inconsistent thing you remember when your eyes already hurt.',
    pitfallsHeadline: 'What it cannot fix',
    pitfallsBody:
      'A timer cannot resolve the underlying ergonomics of most clinic workstations: monitors at the wrong height, glare from overhead fluorescents, or the dual-screen depth difference common in radiology reading rooms. If end-of-day eye fatigue is severe or accompanied by persistent blur, schedule a comprehensive eye exam — small uncorrected refractive errors that are tolerable in social life become disabling during a clinic day. Dry eye in physicians is also under-diagnosed; if drops help, mention it to your eye doctor.',
    faq: [
      {
        q: 'Will the break overlay interfere with EHR documentation?',
        a: 'No — the overlay is only visible in the EYE CARE browser tab. Your EHR session, charts, and timers are unaffected.',
      },
      {
        q: 'Is the 20-20-20 rule evidence-based?',
        a: 'The rule itself is a heuristic, not a randomized trial output. Controlled studies of micro-break protocols show measurable reductions in subjective eye strain, and the mechanism (ciliary muscle relaxation through far-focus) is well established.',
      },
      {
        q: 'Can I use this during overnight call shifts?',
        a: 'Yes. The timer is browser-local and works regardless of time of day. The break overlay is calm and short enough not to interfere with urgent work.',
      },
      {
        q: 'Does it work on hospital-managed devices?',
        a: 'Yes — EYE CARE runs in any modern browser, no install needed. Whitelist eyecare.love if your hospital uses strict filtering.',
      },
    ],
  },
  {
    slug: 'teachers',
    audience: 'teachers',
    audienceShort: 'teachers',
    metaTitle: 'Eye-Strain Timer for Teachers — 20-20-20 Rule for Online Teaching',
    metaDescription:
      'Free 20-20-20 timer for teachers, professors, and online instructors. Reduce eye fatigue from Zoom classes, lesson planning, and grading sessions.',
    intro:
      'Online teaching turned eye strain from a desk-job problem into an educator problem. Hours of Zoom or Google Meet, plus lesson planning, plus grading on the same screen — and the eye fatigue is real by the end of the school day. EYE CARE is a free 20-20-20 timer that runs in a browser tab during prep periods and grading sessions, giving your eyes the breaks they need without competing with student attention.',
    whyHeadline: 'Why teachers feel it during remote and hybrid teaching',
    whyBullets: [
      'Video calls demand sustained near-focus on a screen at fixed distance — a worse load on the ciliary muscle than in-person teaching, where the eyes naturally roam.',
      'Lesson planning and grading layer additional close-up screen work on top of contact hours; the daily screen exposure of an online teacher often exceeds that of a knowledge worker.',
      'Younger students model their habits on what they see; building the 20-20-20 rule into your teaching day quietly demonstrates good screen hygiene to your students.',
    ],
    howHeadline: 'How to use it during a school day',
    howBody:
      'Run EYE CARE during prep periods, grading sessions, and asynchronous teaching time. During live classes, you can either pause the timer or let it run silently — the audio cue is soft enough to ignore if you are mid-explanation. Some teachers actively share the 20-20-20 rule with their students and run breaks together; the social cue helps the habit stick for everyone. The timer is in 12 languages, including the ones most-spoken by ESL students, if you want to share the link with families.',
    pitfallsHeadline: 'What it cannot fix',
    pitfallsBody:
      'Eye strain in teachers is often compounded by glare from poorly positioned ring lights, low monitor resolution, or laptop-screen-at-laptop-distance setups. Invest in an external monitor at proper distance and a small camera-mounted softbox; the eye fatigue you save translates directly into how you feel at 5 PM.',
    faq: [
      {
        q: 'Will it work on a school-issued Chromebook?',
        a: 'Yes — EYE CARE runs in Chrome on Chromebook with no install required. Just open eyecare.love.',
      },
      {
        q: 'Can I share this with my students?',
        a: 'Yes. The tool is free and available in 12 languages. Many teachers send the link with a short note about why eye care matters during long screen days.',
      },
      {
        q: 'Will it disrupt a live Zoom or Meet session?',
        a: 'The break overlay only appears in the EYE CARE browser tab — your Zoom window is unaffected. You can also press Esc to skip a break during a class moment.',
      },
      {
        q: 'Is it appropriate to recommend to students for studying?',
        a: 'Yes. The American Optometric Association recommends the 20-20-20 rule for anyone using screens for more than two hours daily; a school-age child easily exceeds that.',
      },
    ],
  },
  {
    slug: 'editors',
    audience: 'video and photo editors',
    audienceShort: 'editors',
    metaTitle: 'Eye-Strain Timer for Video & Photo Editors — 20-20-20 for Color Work',
    metaDescription:
      'Free 20-20-20 timer for video editors, photo editors, and colorists. Protect color perception and prevent fatigue during long editing sessions.',
    intro:
      'Editing is one of the most eye-fatiguing computer activities humans have invented: high-resolution preview monitors, color-graded reference displays, frame-by-frame inspection, dual-screen scrubbing through long timelines. By hour four, your color perception is measurably worse than it was at hour one. EYE CARE is a free 20-20-20 timer designed to live in a corner of your editing workspace and give your eyes the brief resets needed to keep the work shipping as accurately at 5 PM as it did at 9 AM.',
    whyHeadline: 'Why editors fatigue faster than most',
    whyBullets: [
      'Sustained inspection of color and contrast wears down the ciliary muscle and color-detection cones faster than general computer work.',
      'Editing decisions made by a tired pair of eyes look obviously wrong the next morning — a measurable productivity hit, not just a comfort issue.',
      'High-brightness reference monitors at close range produce more accumulated retinal exposure than a normal office screen would in the same time.',
    ],
    howHeadline: 'How to use it during a cut or grade session',
    howBody:
      'Open EYE CARE in a small browser window on your secondary monitor or a corner of your primary. The soft chime is calibrated to be noticeable but not jarring. During the 20-second break, look away from all displays at the wall across the room or out a window. Twenty seconds is enough for the ciliary muscle to relax and color perception to begin recovering. For a long grading day, the cumulative benefit is meaningful — your end-of-day grades will match your morning ones more closely.',
    pitfallsHeadline: 'What it cannot address',
    pitfallsBody:
      'Editing-specific eye fatigue is often compounded by monitor calibration drift, room lighting that creates screen reflections, or poorly chosen reference monitors. Calibrate weekly, position your edit suite so no window is behind your monitor, and consider a bias light behind the display to reduce contrast strain. The 20-20-20 rule is the final layer of an otherwise correct setup, not a substitute for one.',
    faq: [
      {
        q: 'Will the break overlay affect my color reference?',
        a: 'No — the overlay appears only in the EYE CARE browser tab. Your editing application and reference displays are unaffected.',
      },
      {
        q: 'Can I use it with DaVinci Resolve, Premiere, Final Cut, or Photoshop?',
        a: 'Yes. EYE CARE runs in your browser, completely independent of any editing application.',
      },
      {
        q: 'Does it help with color perception fatigue specifically?',
        a: 'A 20-second far-focus break gives the ciliary muscle and the retinal cones a brief reset. Cumulative across an editing day, the result is measurably better color decision-making in the late afternoon than skipping breaks entirely.',
      },
      {
        q: 'Is it OK to run during a client review session?',
        a: 'You can pause the timer when clients are watching, or let it run silently — the chime is soft. The break overlay only affects the browser tab.',
      },
    ],
  },
  {
    slug: 'remote-workers',
    audience: 'remote workers',
    audienceShort: 'remote workers',
    metaTitle: 'Eye-Strain Timer for Remote Workers — 20-20-20 for WFH Days',
    metaDescription:
      'Free 20-20-20 timer for remote workers and the WFH crowd. Prevent end-of-day eye fatigue from back-to-back video calls and uninterrupted screen time.',
    intro:
      'Remote work removed the natural micro-breaks of office life — the walk to the printer, the trip to a colleague\'s desk, the coffee chat. The result is the longest continuous screen sessions most knowledge workers have ever experienced, and the eye strain to match. EYE CARE is a free 20-20-20 timer built to give your eyes the breaks that hybrid life took away, without competing with calendar invites or focus blocks.',
    whyHeadline: 'Why remote work made eye fatigue worse for everyone',
    whyBullets: [
      'Office life had built-in micro-breaks every hour or two — natural opportunities for the eyes to focus on something at room-scale distance.',
      'Video calls demand sustained close-up focus on a single fixed-distance screen, which fatigues the ciliary muscle more than in-person meetings did.',
      'The blurring of work and home means recreational screen time often happens on the same setup, with no real visual reset across the whole day.',
    ],
    howHeadline: 'How to use it during a remote workday',
    howBody:
      'Pin EYE CARE in a browser tab — it runs silently in the background and chimes when a break is due. During the 20-second break, look out a window or at the wall across the room — even if your room is small, the furthest available distance still helps. Stand up briefly; remote workers tend to sit longer than office workers, so layering a posture break onto the eye break is a free win. The timer is multilingual if you share a workspace with someone who would benefit too.',
    pitfallsHeadline: 'What it does not solve',
    pitfallsBody:
      'A remote-work eye strain solution starts with workstation ergonomics, not a timer. An external monitor at arm\'s length and proper height, a desk chair that holds you at the right depth from the screen, lighting bright enough to reduce screen-to-room contrast — these come first. The 20-20-20 rule is the cherry on top of a setup that already does the basics right.',
    faq: [
      {
        q: 'Will it survive a full day of Zoom and Slack?',
        a: 'Yes. EYE CARE runs in a browser tab independent of any other app. The chime is soft enough to ignore during a call if needed.',
      },
      {
        q: 'Can I use it on multiple devices?',
        a: 'Yes — open eyecare.love on any device. State is stored locally per device for now; cross-device sync is on the roadmap.',
      },
      {
        q: 'Does it integrate with Slack status or focus modes?',
        a: 'Not yet. Slack integration and macOS Focus Modes are on the roadmap.',
      },
      {
        q: 'How does it compare to apps like Stretchly or Time Out?',
        a: 'EYE CARE is browser-based and free with no install. Stretchly and Time Out are desktop apps with broader break categories. Many remote workers use both — EYE CARE for eye-specific breaks, a desktop app for full-body stretch reminders.',
      },
    ],
  },
  {
    slug: 'kids',
    audience: 'kids',
    audienceShort: 'kids',
    metaTitle: 'Eye-Strain Timer for Kids — Free 20-20-20 Rule Tool for Children',
    metaDescription:
      'Free 20-20-20 timer designed for children using tablets, Chromebooks, and laptops. Reduce eye fatigue and slow myopia progression.',
    intro:
      'Children today look at screens longer than any generation before them — and during the most vulnerable years for eye development. The 20-20-20 rule is one of the few interventions with both clinical recommendation and easy implementation, and EYE CARE makes it a one-tab habit for any kid with a tablet, Chromebook, or laptop. Free, no signup, no ads in the kid view, available in 12 languages.',
    whyHeadline: 'Why the 20-20-20 rule matters more for children',
    whyBullets: [
      'A child\'s eye is still elongating until around age 12 — prolonged near-focus during this window is one of the strongest known drivers of myopia (nearsightedness).',
      'Kids absorbed in a game or video can drop to 4–5 blinks per minute, drying out the tear film and producing the eye rubbing many parents notice after a long tablet session.',
      'Children rarely report eye discomfort directly — they get irritable, lose focus, or unconsciously move the screen closer to their face. A timer makes the break habit external and reliable.',
    ],
    howHeadline: 'How to set it up for a kid',
    howBody:
      'Open eyecare.love in a tab next to whatever your child is using — Google Classroom, a learning app, a game. The timer chimes every 20 minutes and the screen takes over for 20 seconds with a calming break overlay. Most kids enjoy the rhythm once they get used to it; the audible chime is the social cue that makes the habit stick. Pair it with the 20-20-2 rule — at least 2 hours of outdoor time daily — for the strongest available myopia-protective effect.',
    pitfallsHeadline: 'What it does not replace',
    pitfallsBody:
      'A timer does not replace a comprehensive pediatric eye exam, daily outdoor time, or healthy screen-time limits. If your child squints at the whiteboard at school, rubs their eyes constantly, or holds the iPad close to their face, schedule an exam regardless of how diligent the break habit is. Early intervention matters more than catching it in middle school.',
    faq: [
      {
        q: 'Is the 20-20-20 rule appropriate for young children?',
        a: 'Yes. The American Optometric Association recommends the 20-20-20 rule for children using screens for more than two hours daily, alongside the 20-20-2 rule (2 hours of outdoor time per day).',
      },
      {
        q: 'My child uses an iPad — does it work in Safari?',
        a: 'Yes. EYE CARE runs in Safari, Chrome, and Edge. Installed as a PWA from the share menu, it works as a Slide Over window alongside your child\'s app.',
      },
      {
        q: 'Will it actually slow myopia?',
        a: 'On its own, the 20-20-20 rule does not have strong evidence for slowing myopia progression. Outdoor time has the strongest evidence. The 20-20-20 rule helps with day-to-day eye fatigue and supports an overall healthy screen-time habit.',
      },
      {
        q: 'Can I disable the donation popups for my child?',
        a: 'The donation prompt only appears after 10 completed sessions and can be dismissed forever with one click. There are no other ads in the kid-facing flow.',
      },
    ],
  },
  {
    slug: 'seniors',
    audience: 'seniors',
    audienceShort: 'older adults',
    metaTitle: 'Eye-Strain Timer for Seniors — Free 20-20-20 Tool for Older Adults',
    metaDescription:
      'Free 20-20-20 timer for seniors and older adults using computers or tablets. Reduce eye fatigue and prevent end-of-day eye strain.',
    intro:
      'Eye comfort matters more as we age — the tear film thins, near-focus becomes harder, and the same hour of screen time produces more end-of-day fatigue than it did in your forties. EYE CARE is a free 20-20-20 timer with a calm, distraction-free interface designed to be easy to read and operate, with no signup, no ads in your face, and large, accessible controls.',
    whyHeadline: 'Why eye care matters more after 50',
    whyBullets: [
      'Tear production naturally decreases with age, making prolonged screen time more likely to produce the burning, gritty feeling of dry eye.',
      'Presbyopia and accommodation difficulties mean near-focus tasks take more effort — the ciliary muscle fatigues faster than it used to.',
      'Many older adults take medications (antihistamines, antidepressants, blood pressure drugs) that further reduce tear production, compounding the strain.',
    ],
    howHeadline: 'How to use it day to day',
    howBody:
      'Open eyecare.love in a tab whenever you are reading, writing email, or video-calling with family. Every 20 minutes, the screen will gently chime and show a 20-second break overlay; look across the room or out a window. Twenty seconds is enough to relax the focus muscle and let your eyes recover. The text size in the timer is intentionally large and high-contrast. You can also install the page to your iPad or phone home screen for one-tap access.',
    pitfallsHeadline: 'What the rule does not replace',
    pitfallsBody:
      'Regular comprehensive eye exams become more important after 50 — glaucoma, cataracts, and macular degeneration are all best caught early. The 20-20-20 rule helps with day-to-day comfort but is not a substitute for clinical care. If you experience sudden vision changes, persistent floaters, or eye pain, see an eye doctor promptly. Lubricating drops (preservative-free) can also help if dry eye is a daily issue.',
    faq: [
      {
        q: 'Does the rule work for older adults too?',
        a: 'Yes — and the benefit may be larger, because age-related tear-film thinning makes screen-induced dry eye more likely. The 20-second break gives the eye time to re-wet itself.',
      },
      {
        q: 'I wear bifocals — does that change anything?',
        a: 'No. The 20-20-20 rule applies regardless of corrective lenses. Looking across the room or out a window engages the distance portion of your lenses naturally.',
      },
      {
        q: 'Will it work on my iPad?',
        a: 'Yes. EYE CARE runs in Safari on iPad and can be installed to the home screen for one-tap access from the share menu.',
      },
      {
        q: 'The text is too small — can I make it bigger?',
        a: 'The timer scales with your browser zoom level. On most browsers, hold Ctrl/Cmd and press + to increase text size. Larger text and accessibility-focused themes are on the roadmap.',
      },
    ],
  },
];

export function getPersona(slug: string): Persona | undefined {
  return PERSONAS.find((p) => p.slug === slug);
}

export const PERSONA_SLUGS = PERSONAS.map((p) => p.slug);
