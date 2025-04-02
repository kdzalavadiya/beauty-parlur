/**
 * Service Worker for AI Features
 * Handles offline functionality and caching for AI-related resources
 */

const CACHE_NAME = 'ai-features-cache-v1';
const STATIC_CACHE_NAME = 'static-cache-v1';
const DYNAMIC_CACHE_NAME = 'dynamic-cache-v1';

const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/css/ai-features.css',
    '/css/ai-enhancements.css',
    '/js/ai-features-loader.js',
    '/js/ai-enhancements.js',
    '/images/ai-avatar.jpg',
    '/images/ai-icons.svg'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        Promise.all([
            caches.open(STATIC_CACHE_NAME).then((cache) => {
                return cache.addAll(STATIC_ASSETS);
            }),
            caches.open(DYNAMIC_CACHE_NAME),
            caches.open(CACHE_NAME)
        ])
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (
                        cacheName !== STATIC_CACHE_NAME &&
                        cacheName !== DYNAMIC_CACHE_NAME &&
                        cacheName !== CACHE_NAME
                    ) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch event - handle requests
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    
    // Handle AI API requests
    if (url.pathname.startsWith('/api/ai/')) {
        event.respondWith(handleAIApiRequest(event.request));
        return;
    }
    
    // Handle static assets
    event.respondWith(handleStaticRequest(event.request));
});

// Handle AI API requests with caching
async function handleAIApiRequest(request) {
    const cache = await caches.open(CACHE_NAME);
    
    try {
        // Try network first
        const networkResponse = await fetch(request);
        const clonedResponse = networkResponse.clone();
        
        // Cache successful responses
        if (networkResponse.ok) {
            cache.put(request, clonedResponse);
        }
        
        return networkResponse;
    } catch (error) {
        // Fallback to cache if offline
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Return offline error response
        return new Response(
            JSON.stringify({
                error: 'You are offline. Please check your connection and try again.',
                timestamp: new Date().toISOString()
            }),
            {
                status: 503,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}

// Handle static asset requests
async function handleStaticRequest(request) {
    const staticCache = await caches.open(STATIC_CACHE_NAME);
    const dynamicCache = await caches.open(DYNAMIC_CACHE_NAME);
    
    // Try static cache first
    const staticResponse = await staticCache.match(request);
    if (staticResponse) {
        return staticResponse;
    }
    
    try {
        // Try network
        const networkResponse = await fetch(request);
        const clonedResponse = networkResponse.clone();
        
        // Cache successful responses in dynamic cache
        if (networkResponse.ok) {
            dynamicCache.put(request, clonedResponse);
        }
        
        return networkResponse;
    } catch (error) {
        // Try dynamic cache as fallback
        const dynamicResponse = await dynamicCache.match(request);
        if (dynamicResponse) {
            return dynamicResponse;
        }
        
        // Return offline error for HTML requests
        if (request.headers.get('accept').includes('text/html')) {
            return new Response(
                '<div class="offline-message">You are offline. Please check your connection and try again.</div>',
                {
                    status: 503,
                    headers: { 'Content-Type': 'text/html' }
                }
            );
        }
        
        throw error;
    }
}

// Handle background sync for failed requests
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-ai-requests') {
        event.waitUntil(syncFailedRequests());
    }
});

// Sync failed requests when back online
async function syncFailedRequests() {
    const cache = await caches.open(CACHE_NAME);
    const requests = await cache.keys();
    
    for (const request of requests) {
        if (request.method === 'POST') {
            try {
                const response = await fetch(request);
                if (response.ok) {
                    await cache.delete(request);
                }
            } catch (error) {
                console.error('Failed to sync request:', error);
            }
        }
    }
}

// Handle push notifications
self.addEventListener('push', (event) => {
    const options = {
        body: event.data.text(),
        icon: '/images/ai-avatar.jpg',
        badge: '/images/ai-badge.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'View Details',
                icon: '/images/ai-icons.svg#view'
            },
            {
                action: 'close',
                title: 'Close',
                icon: '/images/ai-icons.svg#close'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('AI Assistant Update', options)
    );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/#ai-consultant')
        );
    }
}); 