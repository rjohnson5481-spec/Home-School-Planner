// Netlify Function: te-extractor
// Accepts POST { file: base64, mediaType, lessons, fileName } from the TE Extractor client.
// Proxies to the Anthropic API using the server-side API key.
// Returns raw HTML with Content-Type: text/html — client calls response.text(), not response.json().
// ANTHROPIC_API_KEY must be set in the Netlify dashboard — never in client code.

const Anthropic = require('@anthropic-ai/sdk');

const SYSTEM_PROMPT = `You are a teacher question extraction assistant for Teacher Edition PDFs at Iron & Light Johnson Academy.

Given a Teacher Edition PDF and lesson numbers:

STEP 1 — Scan the PDF programmatically to find the page range for each requested lesson. Look for "LESSON [n]" printed at the top of TE pages. If given a calendar image instead, read Day numbers directly — Day number equals Lesson number.

STEP 2 — For each lesson extract:
QUESTIONS: Only lines ending in ? Copied exactly. No answers, directions, or commentary. Grouped by TE page with TE page number, student page number, and section heading noted.
VOCABULARY: Words listed under "New" or "Review" labels. Words only, no definitions. Note New vs Review.

STEP 3 — Return a complete, self-contained HTML file with:
- Lora font (Google Fonts)
- Logo img src="https://i.imgur.com/9JfGi6d.jpeg" 150px on cover, 32px in footer, onerror hide
- School name: Iron & Light Johnson Academy | Tagline: Faith · Knowledge · Strength
- Sticky print bar (hidden on print): school name left, Print button right
- Cover page: logo, school name, tagline, curriculum info, summary table (Lesson / Story / Student Pages / TE Pages / Questions / Vocabulary count). Page break after.
- Per lesson: dark green banner (#2d5a3d) with lesson number and story title, meta strip (#f3f8f5) with page info, vocabulary pills (New=filled #2d5a3d white text, Review=outlined #3d7a52 green text), questions grouped by TE page with green TE badge and outlined student page badge, numbered list with green counters
- Page break after each lesson
- Print CSS: @page { margin: 1.5cm 2cm; size: letter; } with print-color-adjust: exact

Return ONLY the complete HTML. No markdown fences. No explanation.`;

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'ANTHROPIC_API_KEY is not configured' }) };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Request body must be valid JSON' }) };
  }

  const { file, mediaType, lessons, fileName } = body;
  if (!file || !mediaType || !lessons) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing required fields: file, mediaType, lessons' }) };
  }

  try {
    const client = new Anthropic({ apiKey });

    const isPDF = mediaType === 'application/pdf';
    const sourceBlock = isPDF
      ? { type: 'document', source: { type: 'base64', media_type: mediaType, data: file } }
      : { type: 'image',    source: { type: 'base64', media_type: mediaType, data: file } };

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8192,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: [
            sourceBlock,
            { type: 'text', text: `Extract all teacher questions and vocabulary for lessons: ${lessons}\n\nFile: ${fileName || 'document'}` },
          ],
        },
      ],
    });

    const html = response.content[0]?.text || '';
    if (!html) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Model returned an empty response. Please try again.' }) };
    }

    // Strip any accidental markdown fences the model may have added
    const cleaned = html.replace(/^```(?:html)?\s*/i, '').replace(/\s*```\s*$/, '').trim();

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
      body: cleaned,
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
