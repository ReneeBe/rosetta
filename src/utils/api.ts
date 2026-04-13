const ANTHROPIC_URL = import.meta.env.DEV
  ? "/api/anthropic/v1/messages"
  : "https://api.anthropic.com/v1/messages";

const MAGICLINK_URL = "https://magiclink.reneebe.workers.dev";

export interface TranslationLine {
  original: string;
  translated: string;
  explanation: string;
}

export interface TranslationResult {
  translatedCode: string;
  lines: TranslationLine[];
  summary: string;
  remaining: number | null;
}

export interface TranslateOptions {
  code: string;
  fromLang: string;
  toLang: string;
  signal?: AbortSignal;
}

const SYSTEM = `You are a code translation expert and teacher. When given code in one programming language, you translate it to another and explain every difference line by line.

You MUST respond with valid JSON only, no markdown fences, no explanation outside the JSON. Use this schema:

{
  "translatedCode": "the full translated code as a single string",
  "lines": [
    {
      "original": "a line or block from the original code",
      "translated": "the corresponding line or block in the target language",
      "explanation": "a concise explanation of what changed and why the target language does it differently"
    }
  ],
  "summary": "a 2-3 sentence overview of the key differences between these two languages as demonstrated by this translation"
}

Group related lines together when they map to a single concept (e.g. an import block, a function signature). Every line of the original code should appear in exactly one entry. The explanations should be educational, helping someone who knows the source language learn the target language.`;

export async function translateCode({
  code,
  fromLang,
  toLang,
  signal,
}: TranslateOptions): Promise<TranslationResult> {
  const request = {
    model: "claude-sonnet-4-6",
    max_tokens: 16384,
    system: SYSTEM,
    messages: [
      {
        role: "user",
        content: `Translate the following ${fromLang} code to ${toLang}. Explain every difference line by line.\n\n\`\`\`${fromLang.toLowerCase()}\n${code}\n\`\`\``,
      },
    ],
  };

  let content: string;
  let remaining: number | null = null;

  if (window.magiclink) {
    // MagicLink 2.0: always route through proxy, send token if available
    const token = localStorage.getItem("magiclink_token");
    const body: Record<string, unknown> = {
      projectId: "rosetta",
      provider: "claude",
      request,
    };
    if (token) body.token = token;

    const res = await fetch(`${MAGICLINK_URL}/api/proxy`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal,
    });
    const json = (await res.json()) as {
      result?: { content: { type: string; text: string }[] };
      usage?: { remaining: number };
      error?: string;
    };
    if (!res.ok) throw new Error(json.error || `HTTP ${res.status}`);
    content = json.result!.content[0].text;
    if (json.usage) remaining = json.usage.remaining;
  } else {
    // Fallback: direct API call (requires CORS proxy in dev)
    const res = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify(request),
      signal,
    });
    if (!res.ok) {
      const err = (await res.json().catch(() => ({}))) as {
        error?: { message?: string };
      };
      throw new Error(err?.error?.message ?? `HTTP ${res.status}`);
    }
    const data = (await res.json()) as { content: { text: string }[] };
    content = data.content[0].text;
  }

  const cleaned = content
    .trim()
    .replace(/^```(?:json)?\n?/, "")
    .replace(/\n?```$/, "")
    .trim();

  try {
    const parsed = JSON.parse(cleaned) as Omit<TranslationResult, "remaining">;
    return { ...parsed, remaining };
  } catch {
    // Try to extract JSON from the response if it's wrapped in other text
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]) as Omit<TranslationResult, "remaining">;
        return { ...parsed, remaining };
      } catch {
        // fall through
      }
    }
    console.error("Failed to parse response:", cleaned);
    throw new Error("Failed to parse translation response. Please try again.");
  }
}
