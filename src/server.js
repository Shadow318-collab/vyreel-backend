const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Vyreel backend is live");
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    app: "Vyreel"
  });
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`VYREEL API running on port ${PORT}`);
});  const { query, type = 'videos', source = 'pexels', perPage = 9 } = req.query;
  if (!query) return res.status(400).json({ error: 'Missing query' });
  try {
    if (source === 'pexels') {
      const url = type === 'videos'
        ? `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=landscape`
        : `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=landscape`;
      const r = await fetch(url, { headers: { Authorization: PEXELS_KEY } });
      const d = await r.json();
      const results = type === 'videos'
        ? (d.videos || []).map(v => ({ id: 'pex-' + v.id, type: 'video', thumb: v.image, src: (v.video_files?.[0])?.link || '', duration: v.duration, photographer: v.user?.name || '', source: 'Pexels' }))
        : (d.photos || []).map(p => ({ id: 'pex-' + p.id, type: 'photo', thumb: p.src?.medium || '', src: p.src?.large || '', photographer: p.photographer || '', source: 'Pexels' }));
      res.json({ results });
    } else {
      const url = type === 'videos'
        ? `https://pixabay.com/api/videos/?key=${PIXABAY_KEY}&q=${encodeURIComponent(query)}&per_page=${perPage}`
        : `https://pixabay.com/api/?key=${PIXABAY_KEY}&q=${encodeURIComponent(query)}&image_type=photo&per_page=${perPage}`;
      const r = await fetch(url);
      const d = await r.json();
      const results = type === 'videos'
        ? (d.hits || []).map(v => ({ id: 'pix-' + v.id, type: 'video', thumb: v.videos?.tiny?.thumbnail || '', src: v.videos?.small?.url || '', duration: v.duration, photographer: v.user || '', source: 'Pixabay' }))
        : (d.hits || []).map(p => ({ id: 'pix-' + p.id, type: 'photo', thumb: p.webformatURL || '', src: p.largeImageURL || '', photographer: p.user || '', source: 'Pixabay' }));
      res.json({ results });
    }
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Music
app.get('/api/music', async (req, res) => {
  const { query = '', mood = '' } = req.query;
  const q = [query, mood].filter(Boolean).join(' ');
  try {
    const r = await fetch(`https://pixabay.com/api/music/?key=${PIXABAY_KEY}&q=${encodeURIComponent(q)}&per_page=15`);
    const d = await r.json();
    res.json({ results: d.hits, total: d.totalHits });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Auth middleware
function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
  try {
    req.user = jwt.verify(auth.slice(7), JWT_SECRET);
    next();
  } catch { res.status(401).json({ error: 'Invalid token' }); }
}

// Register
app.post('/api/auth/register', async (req, res) => {
  const { email, password, plan = 'free' } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });
  try {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return res.status(400).json({ error: error.message });
    const userId = data.user?.id;
    await supabase.from('users').insert({ id: userId, email, plan, created_at: new Date().toISOString() });
    const token = jwt.sign({ userId, email, plan }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, plan, user: { id: userId, email, plan } });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return res.status(401).json({ error: 'Invalid credentials' });
    const { data: profile } = await supabase.from('users').select('plan').eq('id', data.user.id).single();
    const plan = profile?.plan || 'free';
    const token = jwt.sign({ userId: data.user.id, email, plan }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, plan, user: { id: data.user.id, email, plan } });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Get user
app.get('/api/user', requireAuth, async (req, res) => {
  const { data } = await supabase.from('users').select('*').eq('id', req.user.userId).single();
  res.json({ user: data });
});

// Save project
app.post('/api/projects/save', requireAuth, async (req, res) => {
  const { title, script, clips, storyboard, music } = req.body;
  if (!title || !script) return res.status(400).json({ error: 'Missing title or script' });
  try {
    const { data, error } = await supabase.from('projects').insert({ user_id: req.user.userId, title, script, clips: clips || [], storyboard: storyboard || [], music: music || null, created_at: new Date().toISOString() }).select().single();
    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json({ project: data });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Get projects
app.get('/api/projects', requireAuth, async (req, res) => {
  const { data, error } = await supabase.from('projects').select('*').eq('user_id', req.user.userId).order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ projects: data });
});

// Delete project
app.delete('/api/projects/:id', requireAuth, async (req, res) => {
  const { data } = await supabase.from('projects').select('user_id').eq('id', req.params.id).single();
  if (!data || data.user_id !== req.user.userId) return res.status(403).json({ error: 'Forbidden' });
  await supabase.from('projects').delete().eq('id', req.params.id);
  res.json({ message: 'Deleted' });
});

app.listen(PORT, () => console.log(`VYREEL API running on port ${PORT}`));￼Enter
