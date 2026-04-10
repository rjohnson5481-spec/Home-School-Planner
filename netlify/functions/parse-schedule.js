// Netlify Function: parse-schedule
// Accepts POST { file: base64, mediaType } from the planner client.
// Proxies to the Anthropic API using the server-side API key.
// ANTHROPIC_API_KEY must be set in the Netlify dashboard — never in client code.

const Anthropic = require('@anthropic-ai/sdk');

const SYSTEM_PROMPT = `You are parsing a BJU Homeschool Hub "Print By Day" weekly schedule PDF.

Document structure:
- One page per school day
- Page header: day name and full date, e.g. "Monday Apr 27th, 2026"
- Subheader: student full name, e.g. "Orion Johnson"
- Table rows: Course name + Day number | Lesson title and materials
- Only days with actual lessons appear — pages with no lesson rows are absent

Return a single JSON object in exactly this format — no markdown fences, no explanation:
{
  "student": "FirstName",
  "weekId": "YYYY-MM-DD",
  "days": [
    {
      "dayIndex": 0,
      "lessons": [
        {
          "subject": "Subject Name",
          "lesson": "Day N — Lesson Title\\nKey materials"
        }
      ]
    }
  ]
}

Rules:
- student: first name only ("Orion Johnson" -> "Orion")
- weekId: the Monday of that week in YYYY-MM-DD format
- dayIndex: Mon=0, Tue=1, Wed=2, Thu=3, Fri=4
- Only include days that have lesson rows — omit days with no lessons entirely
- subject: strip edition and grade suffixes
    "Reading 3 (3rd ed.)" -> "Reading 3"
    "Math 5 5th Edition" -> "Math 5"
    "English 4 (4th ed.)" -> "English 4"
- lesson: "Day N — Title\\nMaterials" format
    Include key page/chapter/worktext references only
    Do not include student assignment instructions or parent notes
- Return ONLY valid JSON`;

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

  const { file, mediaType } = body;
  if (!file || !mediaType) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing required fields: file, mediaType' }) };
  }

  try {
    const client = new Anthropic({ apiKey });

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'document',
              source: { type: 'base64', media_type: mediaType, data: file },
            },
            {
              type: 'text',
              text: 'Parse this schedule PDF and return the JSON.',
            },
          ],
        },
      ],
    });

    const parsed = JSON.parse(response.content[0].text);
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed),
    };
  } catch (err) {
    const isJsonError = err instanceof SyntaxError;
    return {
      statusCode: isJsonError ? 422 : 500,
      body: JSON.stringify({
        error: isJsonError
          ? 'Model returned unparseable JSON — try a clearer document'
          : err.message,
      }),
    };
  }
};
