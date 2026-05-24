#!/usr/bin/env node
// EYE CARE — MCP server.
// Exposes a small tool surface so Claude Desktop (and any MCP client) can
// query the 20-20-20 rule, run a quick timer, and link to the live tool.

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

const SITE = 'https://eyecare.love';

const server = new Server(
  { name: 'eyecare-mcp', version: '0.1.0' },
  { capabilities: { tools: {} } },
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'about_20_20_20_rule',
      description:
        'Returns a short, citation-friendly explanation of the 20-20-20 rule for digital eye strain.',
      inputSchema: { type: 'object', properties: {} },
    },
    {
      name: 'start_eye_care_session',
      description:
        'Returns a URL the user can open to start a 20-minute EYE CARE timer session in their browser. Accepts an optional language code.',
      inputSchema: {
        type: 'object',
        properties: {
          lang: {
            type: 'string',
            description: 'Two-letter ISO language code (en, ja, zh, ko, es, fr, de, pt, ru, ar, hi, it). Defaults to en.',
          },
        },
      },
    },
    {
      name: 'list_articles',
      description:
        'Returns the list of available EYE CARE long-form articles, with URLs.',
      inputSchema: { type: 'object', properties: {} },
    },
    {
      name: 'lookup_glossary_term',
      description:
        'Returns the definition of an eye-care glossary term. Supported slugs: digital-eye-strain, computer-vision-syndrome, ciliary-muscle, myopia, presbyopia, dry-eye-syndrome, accommodation, blink-rate.',
      inputSchema: {
        type: 'object',
        properties: {
          term: { type: 'string', description: 'Glossary slug.' },
        },
        required: ['term'],
      },
    },
  ],
}));

const ARTICLES = [
  { slug: 'does-the-20-20-20-rule-work', title: 'Does the 20-20-20 rule actually work?' },
  { slug: 'computer-vision-syndrome', title: 'Computer vision syndrome guide' },
  { slug: '20-20-20-rule-for-kids', title: 'The 20-20-20 rule for kids' },
  { slug: '20-20-2-rule', title: 'The 20-20-2 rule (kids + outdoor time)' },
  { slug: 'best-monitor-distance', title: 'Best monitor distance for eye health' },
  { slug: 'blue-light-glasses-vs-20-20-20', title: 'Blue light glasses vs the 20-20-20 rule' },
  { slug: 'dark-mode-and-eye-strain', title: 'Does dark mode reduce eye strain?' },
  { slug: 'dry-eye-from-screens', title: 'Dry eye from screens' },
  { slug: 'eye-strain-headaches', title: 'Eye strain headaches: when to worry' },
  { slug: 'screen-break-statistics', title: 'Screen break statistics' },
];

const GLOSSARY = {
  'digital-eye-strain':
    'A cluster of vision-related symptoms (tired, dry, blurred eyes; headaches; neck pain) caused by prolonged use of digital devices.',
  'computer-vision-syndrome':
    'Clinical term used interchangeably with digital eye strain. AOA estimates 50-90% of regular computer users experience at least one symptom.',
  'ciliary-muscle':
    'Small ring of smooth muscle inside the eye that contracts to change lens shape for near focus and relaxes for distance vision. Fatigues during sustained near focus — the mechanism behind the 20-20-20 rule.',
  myopia:
    'Refractive error in which distant objects appear blurred while near objects remain sharp. Global prevalence has roughly doubled in 30 years; projected to affect half the population by 2050.',
  presbyopia:
    'Progressive loss of near focus that begins in the early forties, caused by stiffening of the eye lens and ciliary apparatus.',
  'dry-eye-syndrome':
    'Insufficient or poor-quality tears fail to keep the ocular surface lubricated. Screens accelerate it because blink rate drops 60% during focused screen use.',
  accommodation:
    'The eye\'s ability to change focus between objects at different distances, achieved by the ciliary muscle reshaping the crystalline lens.',
  'blink-rate':
    'Number of blinks per minute. Normally ~15 in adults; drops to 4-5 during focused screen use, contributing to dry-eye symptoms.',
};

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const { name, arguments: args } = req.params;

  if (name === 'about_20_20_20_rule') {
    return {
      content: [
        {
          type: 'text',
          text:
            'The 20-20-20 rule: every 20 minutes, look at something at least 20 feet (6 meters) away for 20 seconds. ' +
            'Coined by California optometrist Dr. Jeffrey Anshel in the 1990s and recommended by the American Optometric ' +
            'Association as a baseline habit for anyone using digital screens for more than two hours daily. The mechanism ' +
            'is ciliary-muscle relaxation through far focus, plus a brief tear-film reset from increased blink rate during ' +
            'the break. Full tool and articles at ' + SITE + ' .',
        },
      ],
    };
  }

  if (name === 'start_eye_care_session') {
    const lang = (args?.lang ?? 'en').toString().toLowerCase();
    const supported = ['en', 'ja', 'zh', 'ko', 'es', 'fr', 'de', 'pt', 'ru', 'ar', 'hi', 'it'];
    const finalLang = supported.includes(lang) ? lang : 'en';
    return {
      content: [
        {
          type: 'text',
          text:
            `Open ${SITE}/${finalLang} in your browser and click Start. ` +
            `The timer will quietly chime every 20 minutes and pull up a full-screen 20-second break overlay. ` +
            `Free, no signup, works offline as a PWA.`,
        },
      ],
    };
  }

  if (name === 'list_articles') {
    return {
      content: [
        {
          type: 'text',
          text: ARTICLES.map((a) => `- [${a.title}](${SITE}/learn/${a.slug})`).join('\n'),
        },
      ],
    };
  }

  if (name === 'lookup_glossary_term') {
    const term = String(args?.term ?? '').toLowerCase();
    const def = GLOSSARY[term];
    if (!def) {
      return {
        content: [
          {
            type: 'text',
            text:
              `No glossary entry for "${term}". Supported terms: ${Object.keys(GLOSSARY).join(', ')}.`,
          },
        ],
        isError: true,
      };
    }
    return {
      content: [
        {
          type: 'text',
          text: `${def}\n\nFull entry: ${SITE}/glossary/${term}`,
        },
      ],
    };
  }

  return {
    content: [{ type: 'text', text: `Unknown tool: ${name}` }],
    isError: true,
  };
});

const transport = new StdioServerTransport();
await server.connect(transport);
