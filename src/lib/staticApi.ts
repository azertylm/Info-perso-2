/**
 * staticApi.ts — permet à Info Perso de tourner SANS serveur Node
 * (hébergement statique : alphabette.fr/apps/infosperso/, OVH Perso).
 *
 * Importé en tout premier dans main.tsx. Il enveloppe window.fetch :
 *  1. Chemin de base : « /api/... » devient relatif au dossier où l'application
 *     est publiée (elle fonctionne donc à la racine d'un domaine comme dans un
 *     sous-dossier).
 *  2. Mode statique (build avec VITE_ALPHABETTE_STATIC=1) : les routes du
 *     serveur sont remplacées par
 *       - des fichiers JSON figés par la publication (flux d'actualités, config) ;
 *       - des appels directs au fournisseur d'IA avec la clé de l'utilisateur (BYOK) ;
 *       - une réponse JSON explicite pour ce qui exige réellement un serveur.
 *
 * Sans VITE_ALPHABETTE_STATIC, seul le point 1 s'applique : avec le serveur
 * Node (bun run dev / start), rien ne change.
 */

const STATIQUE = (import.meta as any).env?.VITE_ALPHABETTE_STATIC === '1';
const BASE = new URL('.', document.baseURI).pathname; // ex. « / » ou « /apps/infosperso/ »
const fetchNatif = window.fetch.bind(window);

const json = (corps: unknown, status = 200) =>
  new Response(JSON.stringify(corps), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

/** Routes GET servies par un fichier figé lors de la publication. */
const FIGEES: Record<string, string> = {
  '/api/rss/live': 'api/rss/live.json',
  '/api/ai/status': 'api/ai/status.json',
  '/api/alphabette/config': 'api/alphabette/config.json',
};

/** Fournisseurs compatibles « chat/completions » appelables depuis le navigateur. */
const FOURNISSEURS: Record<string, { url: string; modele: string }> = {
  mistral: { url: 'https://api.mistral.ai/v1/chat/completions', modele: 'mistral-large-latest' },
  hybrid_mistral: { url: 'https://api.mistral.ai/v1/chat/completions', modele: 'mistral-large-latest' },
  openai: { url: 'https://api.openai.com/v1/chat/completions', modele: 'gpt-4o-mini' },
  deepseek: { url: 'https://api.deepseek.com/chat/completions', modele: 'deepseek-chat' },
  grok: { url: 'https://api.x.ai/v1/chat/completions', modele: 'grok-2-latest' },
};

const SANS_CLE =
  "Cette version d'Info Perso fonctionne sans serveur : l'IA utilise votre propre clé API. " +
  'Ajoutez une clé (Mistral, Gemini, OpenAI, Anthropic, DeepSeek ou Grok) dans le Trousseau de clés API.';

type Message = { role: string; content: string };

/** Appelle directement le fournisseur avec la clé de l'utilisateur ; renvoie le texte. */
async function appelerFournisseur(provider: string, cle: string, messages: Message[], model?: string, maxTokens?: number): Promise<string> {
  if (provider === 'gemini') {
    const modele = model && /gemini/.test(model) ? model : 'gemini-3.5-flash-lite';
    const systeme = messages.filter((m) => m.role === 'system').map((m) => m.content).join('\n\n');
    const res = await fetchNatif(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(modele)}:generateContent?key=${encodeURIComponent(cle)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(systeme ? { systemInstruction: { parts: [{ text: systeme }] } } : {}),
          contents: messages
            .filter((m) => m.role !== 'system')
            .map((m) => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] })),
          ...(maxTokens ? { generationConfig: { maxOutputTokens: maxTokens } } : {}),
        }),
      },
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`);
    const data = await res.json();
    return (data.candidates?.[0]?.content?.parts || []).map((p: any) => p.text || '').join('');
  }

  if (provider === 'anthropic') {
    const systeme = messages.filter((m) => m.role === 'system').map((m) => m.content).join('\n\n');
    const res = await fetchNatif('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': cle,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: model || 'claude-3-5-sonnet-latest',
        max_tokens: maxTokens || 2048,
        ...(systeme ? { system: systeme } : {}),
        messages: messages.filter((m) => m.role !== 'system'),
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`);
    const data = await res.json();
    return (data.content || []).map((b: any) => b.text || '').join('');
  }

  const f = FOURNISSEURS[provider];
  if (!f) throw new Error(`Le fournisseur « ${provider} » n'est pas disponible sans serveur.`);
  const res = await fetchNatif(f.url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${cle}` },
    body: JSON.stringify({
      model: model || f.modele,
      messages,
      temperature: 0.7,
      ...(maxTokens ? { max_tokens: maxTokens } : {}),
    }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 300) || res.statusText}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

/** Remplace /api/chat/proxy et /api/chat/test-key. */
async function chatDirect(corps: any, testSeulement = false): Promise<Response> {
  const provider = String(corps?.provider || 'mistral');
  const cle = String(corps?.apiKey || '').trim();
  if (!cle) return json({ success: false, error: SANS_CLE, message: SANS_CLE }, 400);
  const messages: Message[] = testSeulement
    ? [{ role: 'user', content: 'Réponds uniquement : OK' }]
    : corps?.messages;
  if (!Array.isArray(messages)) return json({ error: "Paramètres 'provider' et 'messages' requis." }, 400);
  try {
    const content = await appelerFournisseur(provider, cle, messages, corps?.model, testSeulement ? 5 : undefined);
    return json({ success: true, valid: true, content, usage: { promptTokens: 0, completionTokens: 0 } });
  } catch (err: any) {
    return json({ success: false, valid: false, error: err?.message || "Erreur de connexion à l'API du fournisseur" }, 500);
  }
}

/** Remplace /api/ai/ask (moteur souverain) : Mistral avec la clé de l'utilisateur. */
async function askDirect(corps: any): Promise<Response> {
  const cle = String(corps?.apiKeyOverride || '').trim();
  if (!cle) return json({ error: SANS_CLE }, 400);
  const messages: Message[] =
    Array.isArray(corps?.messages) && corps.messages.length
      ? corps.messages
      : [
          ...(corps?.systemPrompt ? [{ role: 'system', content: String(corps.systemPrompt) }] : []),
          { role: 'user', content: String(corps?.prompt || '') },
        ];
  const debut = performance.now();
  try {
    const content = await appelerFournisseur('mistral', cle, messages, undefined, corps?.maxTokens);
    const latencyMs = Math.round(performance.now() - debut);
    return json({
      content,
      providerUsed: 'mistral_cloud',
      modelUsed: 'mistral-large-latest',
      latencyMs,
      isSovereign: true,
      sovereigntyTier: 'Cloud Européen (Mistral)',
      fallbackOccurred: false,
      executionChain: [{ target: 'mistral_cloud', status: 'success', latencyMs }],
    });
  } catch (err: any) {
    return json({ error: err?.message || 'Erreur Mistral' }, 500);
  }
}

/** Recherche locale dans le flux figé (remplace /api/rss/search). */
async function rechercheLocale(q: string): Promise<Response> {
  const res = await fetchNatif(BASE + FIGEES['/api/rss/live'], { cache: 'no-store' });
  if (!res.ok) return json({ success: false, count: 0, articles: [] });
  const data = await res.json();
  const mots = q.toLowerCase().split(/\s+/).filter(Boolean);
  const articles = (data.articles || []).filter((a: any) => {
    const texte = `${a.title || ''} ${a.summary || ''} ${a.source || ''}`.toLowerCase();
    return mots.every((m) => texte.includes(m));
  });
  return json({ success: true, count: articles.length, articles });
}

async function routeStatique(chemin: string, url: URL, init?: RequestInit): Promise<Response> {
  const methode = (init?.method || 'GET').toUpperCase();

  if (methode === 'GET' && FIGEES[chemin]) {
    return fetchNatif(BASE + FIGEES[chemin], { cache: 'no-store' });
  }
  if (methode === 'GET' && chemin === '/api/rss/search') {
    return rechercheLocale(url.searchParams.get('q') || '');
  }
  if (methode === 'GET' && chemin === '/api/image-proxy') {
    return fetchNatif(url.searchParams.get('url') || '');
  }
  if (methode === 'POST') {
    let corps: any = {};
    try {
      corps = JSON.parse(String(init?.body || '{}'));
    } catch {}
    if (chemin === '/api/chat/proxy' || chemin === '/api/chat/test-key') {
      return chatDirect(corps, chemin === '/api/chat/test-key');
    }
    if (chemin === '/api/ai/ask') return askDirect(corps);
  }
  return json(
    {
      success: false,
      error: 'Fonction indisponible dans la version hébergée sans serveur.',
      staticMode: true,
    },
    503,
  );
}

window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
  if (typeof input === 'string' && input.startsWith('/api/')) {
    const url = new URL(input, window.location.origin);
    if (STATIQUE) return routeStatique(url.pathname, url, init);
    if (BASE !== '/') return fetchNatif(BASE + input.slice(1), init);
  }
  return fetchNatif(input, init);
};

export const MODE_STATIQUE = STATIQUE;
