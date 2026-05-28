# VYREEL Backend API

AI Content Engine backend — 13 REST API routes.

## Deploy to Render (Free)

1. Push this repo to GitHub
2. Go to render.com → New Web Service
3. Connect this repo
4. Set environment variables (see below)
5. Deploy

## Environment Variables

| Variable | Value |
|----------|-------|
| PORT | 3000 |
| ANTHROPIC_API_KEY | Your Gemini API key |
| ELEVENLABS_API_KEY | Your ElevenLabs key |
| PEXELS_API_KEY | Your Pexels key |
| PIXABAY_API_KEY | Your Pixabay key |
| SUPABASE_URL | Your Supabase project URL |
| SUPABASE_ANON_KEY | Your Supabase anon key |
| JWT_SECRET | Any random secret string |
| STRIPE_SECRET_KEY | Your Stripe key (optional) |

## API Routes

- GET /api/health
- POST /api/script
- POST /api/voice
- GET /api/broll
- GET /api/music
- POST /api/auth/register
- POST /api/auth/login
- GET /api/user
- POST /api/projects/save
- GET /api/projects
- GET /api/projects/:id
- PUT /api/projects/:id
- DELETE /api/projects/:id
