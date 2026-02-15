const CACHE_NAME = 'vj-atomic-v3';
const ASSETS = [
    '/',
    '/index.html',
    '/article.html',
    '/equipe.html',
    '/privacidade.html',
    '/termos.html',
    '/favicon.png',
    '/VJ_l.webp',
    '/VJ_D.webp',
    '/manifest.json',
    'https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js',
    'https://www.gstatic.com/firebasejs/9.22.0/firebase-database-compat.js'
];

// Instalação: Cache imediato
self.addEventListener('install', (e) => {
    self.skipWaiting();
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
});

// Ativação: Limpeza de caches antigos
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
            );
        })
    );
});

// Fetch Strategy: Stale-While-Revalidate
self.addEventListener('fetch', (e) => {
    // 1. Protocol Guard: Ignorar extensões, esquemas não-http e scripts sensíveis
    const url = new URL(e.request.url);
    if (!['http:', 'https:'].includes(url.protocol)) return;

    // 2. Bypass Terceiros Sensíveis (Cookiebot, AdSense, Analytics)
    if (url.hostname.includes('cookiebot') ||
        url.hostname.includes('firebaseio.com') ||
        url.hostname.includes('googlesyndication') ||
        url.hostname.includes('google-analytics')) return;

    e.respondWith(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.match(e.request).then((cachedResponse) => {
                const fetchedResponse = fetch(e.request).then((networkResponse) => {
                    // Solo cachear respostas válidas internas/seguras
                    if (networkResponse && networkResponse.status === 200) {
                        cache.put(e.request, networkResponse.clone()).catch(() => { });
                    }
                    return networkResponse;
                }).catch(() => {
                    // Silenciar erros de rede no console para manter o estado "Zero Error"
                    return cachedResponse || new Response('', { status: 408, statusText: 'Network Error' });
                });

                return cachedResponse || fetchedResponse;
            });
        }).catch(() => {
            return fetch(e.request);
        })
    );
});
