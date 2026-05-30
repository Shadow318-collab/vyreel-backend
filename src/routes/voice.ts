import { Router } from "express";
const router = Router();
const EL_KEY = process.env.ELEVENLABS_API_KEY;

router.post("/voice", async (req, res) => {
  const { text, voiceId } = req.body;
  if (!text || !voiceId) { res.status(400).json({ error: "Missing text or voiceId" }); return; }
  try {
    const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: { "xi-api-key": EL_KEY!, "Content-Type": "application/json", Accept: "audio/mpeg" },
      body: JSON.stringify({ text, model_id: "eleven_monolingual_v1", voice_settings: { stability: 0.5, similarity_boost: 0.75 } })
    });
    if (!r.ok) { res.status(r.status).json({ error: "ElevenLabs error" }); return; }
    const buf = await r.arrayBuffer();
    res.set("Content-Type", "audio/mpeg");
    res.send(Buffer.from(buf));
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});
export default router;
