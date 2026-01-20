# Task Manager Server (Express + Mongo)

## Quickstart
1. Copy `.env.example` to `.env` and fill values.
2. `cd server && npm install`
3. `npm run dev`

## Notes
- Refresh tokens are stored per-user for basic revocation.
- Access tokens are short-lived JWTs returned to client (sent in Authorization header).
- Refresh token is set as an httpOnly cookie.
- Ensure secure:true on cookies in production (requires HTTPS).
- Avoid sending PII to external AI models.
