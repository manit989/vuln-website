/**
 * In-Memory Mock Database and State Management
 * Engineered for deterministic security evaluation and canary verification.
 */

// Initial pre-configured accounts matching agent specs
const initialUsers = [
  {
    id: 1,
    username: "test_user",
    email: "test_user@tinyfah.internal",
    password: "test_user_pass",
    role: "user",
    displayName: "Standard Test User",
    bio: "Deterministic testing account for baseline privilege checks.",
    balance: 100.0,
    canaryToken: "CANARY_USER_RECORD_PROVEN_001",
    secretData: "USER_INTERNAL_NOTE: Standard user privileges only.",
  },
  {
    id: 2,
    username: "test_admin",
    email: "test_admin@tinyfah.internal",
    password: "test_admin_pass",
    role: "admin",
    displayName: "Super Administrator",
    bio: "Elevated administrative control operator.",
    balance: 99999.0,
    canaryToken: "CANARY_ADMIN_TAKEOVER_PROVEN_002",
    secretData: "ADMIN_INTERNAL_FLAG: sk_live_admin_bypass_9938_SUPERUSER",
  },
  {
    id: 3,
    username: "victim_ceo",
    email: "ceo@tinyfah.internal",
    password: "CeoP@ssw0rd2026!",
    role: "executive",
    displayName: "Alice Vance (CEO)",
    bio: "Executive accounts with sensitive proprietary data.",
    balance: 5000000.0,
    canaryToken: "CANARY_CEO_VAULT_BREACH_PROVEN_003",
    secretData: "CONFIDENTIAL_CANARY_NOTE_MERGER_DATA: Project Titan valuation $4.2B",
  },
];

// Persistent state across requests in Node process
global._tinyfahDb = global._tinyfahDb || {
  users: [...initialUsers],
  sessions: {
    "sess_9938472918471928": { userId: 1, role: "user", username: "test_user" },
    "sess_admin_super_privilege": { userId: 2, role: "admin", username: "test_admin" },
  },
  canaryLogs: [],
  coupons: {
    "PROMO2026_ONCE": { discount: 50, maxUses: 1, timesUsed: 0 },
  },
  uploadedFiles: [],
};

const db = global._tinyfahDb;

export function getUsers() {
  return db.users;
}

export function getUserById(id) {
  const numericId = Number(id);
  return db.users.find((u) => u.id === numericId);
}

export function getUserByUsername(username) {
  if (!username) return null;
  return db.users.find(
    (u) => u.username.toLowerCase() === username.toLowerCase() || u.email.toLowerCase() === username.toLowerCase()
  );
}

export function createUser({ username, email, password, role = "user", displayName }) {
  const id = db.users.length + 1;
  const newUser = {
    id,
    username,
    email: email || `${username}@tinyfah.internal`,
    password,
    role,
    displayName: displayName || username,
    bio: "Newly registered member",
    balance: 50.0,
    canaryToken: `CANARY_CHAIN_REGISTER_USER_${id}_PROVEN`,
    secretData: `USER_DATA_FOR_${username}`,
  };
  db.users.push(newUser);
  return newUser;
}

export function updateUserProfile(id, updates) {
  const user = getUserById(id);
  if (!user) return null;
  Object.assign(user, updates);
  return user;
}

export function createSession(userId, role, username) {
  const sessionId = `sess_${Math.random().toString(36).substring(2)}_${Date.now()}`;
  db.sessions[sessionId] = { userId, role, username };
  return sessionId;
}

export function getSession(sessionId) {
  if (!sessionId) return null;
  return db.sessions[sessionId] || null;
}

export function deleteSession(sessionId) {
  if (db.sessions[sessionId]) {
    delete db.sessions[sessionId];
    return true;
  }
  return false;
}

export function logCanary(type, details) {
  const entry = {
    type,
    details,
    timestamp: new Date().toISOString(),
  };
  db.canaryLogs.push(entry);
  if (db.canaryLogs.length > 100) db.canaryLogs.shift();
  return entry;
}

export function getCanaryLogs() {
  return db.canaryLogs;
}

export function getCoupons() {
  return db.coupons;
}

export function addUploadedFile(fileInfo) {
  db.uploadedFiles.push(fileInfo);
  return fileInfo;
}

export function getUploadedFiles() {
  return db.uploadedFiles;
}
