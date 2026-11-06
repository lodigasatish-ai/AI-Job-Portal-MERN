// CareerPilot AI backend: Express + JSON file database + JWT auth
const express = require('express'), fs = require('fs'), path = require('path');
const bcrypt = require('bcryptjs'), jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const PORT = process.env.PORT || 3000;
const DB = path.join(__dirname, 'data', 'db.json');

fs.mkdirSync(path.dirname(DB), { recursive: true });
let db = { users: [], cos: null };
try { db = JSON.parse(fs.readFileSync(DB, 'utf8')); } catch (e) {}
const save = () => { fs.writeFileSync(DB + '.tmp', JSON.stringify(db, null, 2)); fs.renameSync(DB + '.tmp', DB); };

// Seed demo admin
if (!db.users.find(u => u.role === 'admin')) {
  db.users.push({ email: 'admin@demo.com', name: 'Admin', pw: bcrypt.hashSync('admin123', 10), role: 'admin',
    college: 'Demo', degree: 'B.Tech', branch: 'CSE', year: '4', grad: '2026', joined: new Date().toISOString().slice(0, 10), data: null });
  save();
}

const pub = u => { const { pw, data, ...rest } = u; return rest; };
const sign = u => jwt.sign({ email: u.email }, SECRET, { expiresIn: '30d' });
const str = (x, n = 120) => String(x ?? '').trim().slice(0, n);

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use((req, res, next) => {            // CORS (lets index.html work even when opened from a file)
  res.set({ 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS' });
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});
const auth = (req, res, next) => {
  try {
    const { email } = jwt.verify((req.headers.authorization || '').replace('Bearer ', ''), SECRET);
    const u = db.users.find(x => x.email === email); if (!u) throw 0;
    req.user = u; next();
  } catch (e) { res.status(401).json({ error: 'Please log in again.' }); }
};
const adminOnly = (req, res, next) => req.user.role === 'admin' ? next() : res.status(403).json({ error: 'Admins only.' });

app.post('/api/register', (req, res) => {
  const b = req.body || {}, email = str(b.email).toLowerCase();
  if (str(b.name).length < 2 || !str(b.college)) return res.status(400).json({ error: 'Enter your name and college.' });
  if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ error: 'Enter a valid email.' });
  if (String(b.pw || '').length < 6) return res.status(400).json({ error: 'Password needs 6+ characters.' });
  if (db.users.find(u => u.email === email)) return res.status(409).json({ error: 'Email already registered.' });
  const u = { email, name: str(b.name), pw: bcrypt.hashSync(String(b.pw), 10), role: 'student', college: str(b.college),
    degree: str(b.degree, 40), branch: str(b.branch, 40), year: str(b.year, 4), grad: str(b.grad, 6),
    joined: new Date().toISOString().slice(0, 10), data: null };
  db.users.push(u); save();
  res.json({ token: sign(u), user: pub(u) });
});

app.post('/api/login', (req, res) => {
  const u = db.users.find(x => x.email === str(req.body?.email).toLowerCase());
  if (!u || !bcrypt.compareSync(String(req.body?.pw || ''), u.pw)) return res.status(401).json({ error: 'Invalid email or password.' });
  res.json({ token: sign(u), user: pub(u) });
});

app.get('/api/me', auth, (req, res) => res.json({ user: pub(req.user), data: req.user.data, cos: db.cos }));

app.put('/api/data', auth, (req, res) => {          // saves skills, roadmap progress, applications, etc.
  if (typeof req.body !== 'object' || Array.isArray(req.body)) return res.status(400).json({ error: 'Invalid data.' });
  req.user.data = req.body; save(); res.json({ ok: true });
});

app.put('/api/profile', auth, (req, res) => {
  const b = req.body || {};
  for (const k of ['name', 'college', 'degree', 'branch', 'year', 'grad']) if (b[k] !== undefined) req.user[k] = str(b[k], 80);
  save(); res.json({ user: pub(req.user) });
});

app.post('/api/password', auth, (req, res) => {
  if (!bcrypt.compareSync(String(req.body?.old || ''), req.user.pw)) return res.status(400).json({ error: 'Current password is wrong.' });
  if (String(req.body?.pw || '').length < 6) return res.status(400).json({ error: 'New password too short.' });
  req.user.pw = bcrypt.hashSync(String(req.body.pw), 10); save(); res.json({ ok: true });
});

app.put('/api/companies', auth, adminOnly, (req, res) => {
  if (!Array.isArray(req.body)) return res.status(400).json({ error: 'Invalid data.' });
  db.cos = req.body; save(); res.json({ ok: true });
});

app.get('/api/admin/students', auth, adminOnly, (req, res) =>
  res.json({ students: db.users.filter(u => u.role !== 'admin').map(pub) }));

app.delete('/api/admin/students/:email', auth, adminOnly, (req, res) => {
  db.users = db.users.filter(u => u.role === 'admin' || u.email !== req.params.email.toLowerCase());
  save(); res.json({ ok: true });
});

app.use(express.static(path.join(__dirname, '..', 'frontend')));   // serves the website too
app.listen(PORT, () => console.log(`CareerPilot AI running at http://localhost:${PORT}`));
