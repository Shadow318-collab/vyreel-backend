const loadNiche = require("./loadNiche");

function compilePrompt(userPrompt, nicheName) {
  const niche = loadNiche(nicheName);

  return `
Generate a viral long-form video.

Topic: ${userPrompt}

Niche: ${niche.niche}
Hook Style: ${niche.hook_style}
Opening Pattern: ${niche.opening_pattern}
Emotional Pacing: ${niche.pacing.join(" -> ")}
Retention Triggers: ${niche.retention_triggers.join(", ")}
Voice Style: ${niche.voice}
Visual Style: ${niche.visual_style}
Music Style: ${niche.music_style}
CTA: ${niche.cta}

Optimize for:
- retention
- emotional engagement
- bingeability
- completion rate
`;
}

module.exports = compilePrompt;￼Enter
