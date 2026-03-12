import { promises as fs } from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const USERS_PATH = path.join(process.cwd(), 'lib', 'data', 'users.json');
const JWT_SECRET = process.env.JWT_SECRET || 'ssm-humane-society-secret-key-2026';

export async function getUsers() {
  try {
    const data = await fs.readFile(USERS_PATH, 'utf8');
    return JSON.parse(data);
  } catch { return []; }
}

export async function saveUsers(users) {
  await fs.writeFile(USERS_PATH, JSON.stringify(users, null, 2));
}

export async function createUser(email, password, name, role = 'adopter') {
  const users = await getUsers();
  if (users.find(u => u.email === email)) return { error: 'Email already exists' };
  const hash = await bcrypt.hash(password, 10);
  const user = { id: Date.now().toString(), email, password: hash, name, role, createdAt: new Date().toISOString(), favorites: [] };
  users.push(user);
  await saveUsers(users);
  return { user: { id: user.id, email, name, role } };
}

export async function authenticateUser(email, password) {
  const users = await getUsers();
  const user = users.find(u => u.email === email);
  if (!user) return { error: 'Invalid credentials' };
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return { error: 'Invalid credentials' };
  return { user: { id: user.id, email: user.email, name: user.name, role: user.role } };
}

export function createToken(user) {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token) {
  try { return jwt.verify(token, JWT_SECRET); }
  catch { return null; }
}
