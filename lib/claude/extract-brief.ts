/**
 * Extract a structured brief from the concierge response.
 * The concierge embeds a JSON brief in an HTML comment when it has
 * gathered enough qualification information.
 */

export interface ConciergeBrief {
  name: string | null;
  interests: string[];
  journey_type_pref: string;
  travel_dates: string | null;
  group_size: number | null;
  group_composition: string | null;
  budget_signal: string;
  regions_mentioned: string[];
  intent_score: number;
  ai_brief: string;
}

const BRIEF_PATTERN =
  /<!--BRIEF_JSON\s*([\s\S]*?)\s*BRIEF_JSON-->/;

export function extractBrief(
  responseText: string
): ConciergeBrief | null {
  const match = responseText.match(BRIEF_PATTERN);
  if (!match) return null;

  try {
    const parsed = JSON.parse(match[1]);
    return {
      name: parsed.name ?? null,
      interests: parsed.interests ?? [],
      journey_type_pref: parsed.journey_type_pref ?? "mixed",
      travel_dates: parsed.travel_dates ?? null,
      group_size: parsed.group_size ?? null,
      group_composition: parsed.group_composition ?? null,
      budget_signal: parsed.budget_signal ?? "none",
      regions_mentioned: parsed.regions_mentioned ?? [],
      intent_score: parsed.intent_score ?? 5,
      ai_brief: parsed.ai_brief ?? "",
    };
  } catch {
    return null;
  }
}

/**
 * Strip the hidden brief from the response text before sending to the client.
 */
export function stripBrief(responseText: string): string {
  return responseText.replace(BRIEF_PATTERN, "").trim();
}
