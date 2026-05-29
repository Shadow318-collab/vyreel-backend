import { Router } from "express";
import { supabase } from "../lib/supabase.js";
import { signToken, requireAuth } from "../lib/auth.js";
const router = Router();

router.post("/auth/register", async (req, res) => {
  const { email, password, plan = "free" } = req.body;
  if (!email || !password) { res.status(400).json({ error: "Missing email or password" }); return; }
  try {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) { res.status(400).json({ error: error.message }); return; }
    const userId = data.user?.id;
    if (!userId) { res.status(500).json({ error: "Failed to create user" }); return; }
    await supabase.from("users").insert({ id: userId, email, plan, created_at: new Date().toISOString() });
    const token = signToken({ userId, email, plan });
    res.status(201).json({ token, plan, user: { id: userId, email, plan } });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) { res.status(400).json({ error: "Missing email or password" }); return; }
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { res.status(401).json({ error: "Invalid credentials" }); return; }
    const { data: profile } = await supabase.from("users").select("plan").eq("id", data.user.id).single();
    const plan = profile?.plan ?? "free";
    const token = signToken({ userId: data.user.id, email, plan });
    res.json({ token, plan, user: { id: data.user.id, email, plan } });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.get("/user", requireAuth, async (req, res) => {
  const user = (req as any).user;
  const { data } = await supabase.from("users").select("*").eq("id", user.userId).single();
  res.json({ user: data });
});
export default router;
