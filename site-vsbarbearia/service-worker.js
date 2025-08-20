// Define o nome e a versão do cache
const CACHE_NAME = 'vs-barbearia-cache-v2'; // Mude a versão se atualizar os arquivos

// Lista de arquivos essenciais para o app funcionar offline
const urlsToCache = [
  '/', // A página principal (index.html)
  '/index.html',
  '/site.webmanifest',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&display=swap',
  // Adicione aqui os caminhos para seus ícones e imagens principais
  '/android-chrome-192x192.png',
  '/android-chrome-512x512.png',
  '/apple-touch-icon.png',
  '/favicon-32x32.png',
  '/favicon-16x16.png',
  'https://i.postimg.cc/5yBSjg1F/Bigode-3.png', // Logo
  'https://files.catbox.moe/fzxnia.mp4' // Vídeo de fundo
];

// Evento 'install': é disparado quando o Service Worker é instalado
self.addEventListener('install', event => {
  console.log('Service Worker: Instalando...');
  // Espera até que o cache seja aberto e todos os arquivos sejam adicionados
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Cache aberto, adicionando arquivos essenciais.');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Service Worker: Todos os arquivos foram cacheados com sucesso.');
        // Força o novo Service Worker a se tornar ativo imediatamente
        return self.skipWaiting();
      })
  );
});

// Evento 'activate': é disparado quando o Service Worker é ativado
self.addEventListener('activate', event => {
    console.log('Service Worker: Ativando...');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log('Service Worker: Limpando cache antigo:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => {
            console.log('Service Worker: Ativado e pronto para controlar a página.');
            // Assume o controle da página imediatamente
            return self.clients.claim();
        })
    );
});


// Evento 'fetch': é disparado para cada requisição de rede da página
self.addEventListener('fetch', event => {
  // Responde à requisição
  event.respondWith(
    // Tenta encontrar a requisição no cache primeiro
    caches.match(event.request)
      .then(response => {
        // Se a resposta for encontrada no cache, a retorna
        if (response) {
          // console.log('Service Worker: Servindo do cache:', event.request.url);
          return response;
        }
        
        // Se não encontrar no cache, busca na rede
        // console.log('Service Worker: Buscando na rede:', event.request.url);
        return fetch(event.request);
      }
    )
  );
});
