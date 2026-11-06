# CareerPilot AI — working local full-stack version

## Start the website (recommended)
1. Install Node.js LTS.
2. Open this project folder in VS Code.
3. Open a terminal in `backend`:
   ```bash
   npm install
   npm start
   ```
4. Open **http://localhost:3000** in Chrome. Do not open `index.html` by double-clicking it.

## If using VS Code Live Server
Start the backend first using the commands above. Then open `frontend/index.html` with Live Server. The frontend automatically sends API requests to `http://localhost:3000` when Live Server uses a different local port (such as 5500).

## Test accounts
- Admin: `admin@demo.com` / `admin123`
- Student: create a new account from the Register page.

## Authentication and storage
- Express API: `backend/server.js`
- Registration: `POST /api/register`
- Login: `POST /api/login`
- User records: `backend/data/db.json`
- Passwords are hashed with bcryptjs; sessions use JWT.

If a port is already in use, stop the other process using port 3000 or set a different `PORT` and update the frontend API configuration accordingly.
