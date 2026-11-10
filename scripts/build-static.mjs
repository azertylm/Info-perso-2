/**
 * build-static.mjs — version d'Info Perso sans serveur Node (dossier dist/).
 *
 *  1. Construit le client en mode statique (VITE_ALPHABETTE_STATIC=1, chemins relatifs).
 *  2. Démarre le vrai serveur quelques secondes et fige ses réponses publiques
 *     (flux d'actualités, statut IA, config) en fichiers JSON dans dist/api/.
 *  3. src/lib/staticApi.ts sert ensuite ces fichiers à la place du serveur ;
 *     l'IA passe par la clé de l'utilisateur (BYOK).
 *
 * Le hub alphabette.fr relance cette publication régulièrement : le flux
 * d'actualités est ainsi rafraîchi sans serveur permanent.
 *
 * Usage : bun run build:static
 */
import { execFileSync, spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const racine = process.cwd();
const dist = path.join(racine, 'dist');
const PORT = 3998;
const base = `http://127.0.0.1:${PORT}`;

const ROUTES = [
  ['/api/rss/live?refresh=true', 'api/rss/live.json', { success: true, count: 0, articles: [] }],
  ['/api/ai/status', 'api/ai/status.json', null],
  ['/api/alphabette/config', 'api/alphabette/config.json', null],
];

execFileSync('npx', ['vite', 'build', '--base=./'], {
  cwd: racine,
  stdio: 'inherit',
  env: { ...process.env, VITE_ALPHABETTE_STATIC: '1' },
});

const serveur = spawn('npx', ['tsx', 'server.ts'], {
  cwd: racine,
  env: { ...process.env, NODE_ENV: 'production', PORT: String(PORT) },
  stdio: 'ignore',
  detached: true,
});

async function attendre() {
  for (let i = 0; i < 120; i++) {
    try {
      if ((await fetch(`${base}/api/ai/status`, { signal: AbortSignal.timeout(2000) })).status < 500) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error('Le serveur Info Perso ne démarre pas.');
}

try {
  await attendre();
  for (const [route, fichier, repli] of ROUTES) {
    let corps = repli;
    try {
      const r = await fetch(base + route, { signal: AbortSignal.timeout(60000) });
      if (r.ok) corps = await r.json();
      else console.warn(`! ${route} → HTTP ${r.status}`);
    } catch (err) {
      console.warn(`! ${route} → ${err.message}`);
    }
    if (corps === null) continue;
    const cible = path.join(dist, fichier);
    await mkdir(path.dirname(cible), { recursive: true });
    await writeFile(cible, JSON.stringify(corps) + '\n');
    const n = Array.isArray(corps?.articles) ? ` (${corps.articles.length} articles)` : '';
    console.log(`figé  ${route} → ${fichier}${n}`);
  }
} finally {
  try { process.kill(-serveur.pid); } catch { serveur.kill(); }
}
