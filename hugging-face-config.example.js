// ============================================
// CONFIGURACIÓN HUGGING FACE - SIN COSTE
// ============================================
// 
// Esta solución usa Hugging Face API que es GRATIS
// con suficientes créditos para generar miles de imágenes.
//
// INSTRUCCIONES:
// 1. Ve a https://huggingface.co/settings/tokens
// 2. Crea un nuevo token de acceso (hazlo PRIVADO)
// 3. Copia el token y pégalo abajo
// 4. ¡Listo! Ya puedes generar imágenes gratis

window.huggingFaceConfig = {
  // 🔑 TU TOKEN DE HUGGING FACE (obtenlo en https://huggingface.co/settings/tokens)
  apiKey: 'hf_YOUR_TOKEN_HERE', // ← REEMPLAZA CON TU TOKEN
  
  // URL del modelo de Stable Diffusion (Libre & Gratis)
  modelUrl: 'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-3.5-large',
  
  // Configuración de caché (guarda imágenes generadas para NO regenerarlas)
  cacheEnabled: true,
  cacheDuration: 7 * 24 * 60 * 60 * 1000, // 7 días
  
  // Configuración de calidad
  imageQuality: {
    width: 768,
    height: 768,
    steps: 30
  },
  
  // Idioma de prompts (para mejor consistencia)
  promptLanguage: 'es' // español
};

// ============================================
// SISTEMA DE CACHÉ LOCAL
// ============================================

class ImageCache {
  constructor() {
    this.storageKey = 'petstories_image_cache';
    this.cleanupExpired();
  }

  // Generar ID único para el prompt
  generateHashId(prompt) {
    let hash = 0;
    for (let i = 0; i < prompt.length; i++) {
      const char = prompt.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  // Guardar imagen en caché
  save(prompt, imageData) {
    try {
      const cache = JSON.parse(localStorage.getItem(this.storageKey)) || {};
      const id = this.generateHashId(prompt);
      cache[id] = {
        prompt: prompt,
        imageData: imageData,
        timestamp: Date.now()
      };
      localStorage.setItem(this.storageKey, JSON.stringify(cache));
      console.log('✅ Imagen guardada en caché');
    } catch (e) {
      console.warn('⚠️ No se pudo guardar en caché:', e);
    }
  }

  // Obtener imagen del caché
  get(prompt) {
    try {
      const cache = JSON.parse(localStorage.getItem(this.storageKey)) || {};
      const id = this.generateHashId(prompt);
      
      if (cache[id]) {
        const age = Date.now() - cache[id].timestamp;
        if (age < window.huggingFaceConfig.cacheDuration) {
          console.log('♻️ Imagen obtenida del caché (ahorrada generación)');
          return cache[id].imageData;
        } else {
          delete cache[id];
          localStorage.setItem(this.storageKey, JSON.stringify(cache));
        }
      }
    } catch (e) {
      console.warn('⚠️ Error al leer caché:', e);
    }
    return null;
  }

  // Limpiar imágenes expiradas
  cleanupExpired() {
    try {
      const cache = JSON.parse(localStorage.getItem(this.storageKey)) || {};
      const now = Date.now();
      let cleaned = false;

      for (const id in cache) {
        const age = now - cache[id].timestamp;
        if (age > window.huggingFaceConfig.cacheDuration) {
          delete cache[id];
          cleaned = true;
        }
      }

      if (cleaned) {
        localStorage.setItem(this.storageKey, JSON.stringify(cache));
      }
    } catch (e) {
      console.warn('⚠️ Error limpiando caché:', e);
    }
  }

  // Estadísticas del caché
  getStats() {
    try {
      const cache = JSON.parse(localStorage.getItem(this.storageKey)) || {};
      const count = Object.keys(cache).length;
      const totalSize = JSON.stringify(cache).length / (1024 * 1024); // MB
      return { count, totalSize: totalSize.toFixed(2) };
    } catch (e) {
      return { count: 0, totalSize: 0 };
    }
  }

  // Limpiar todo el caché
  clear() {
    try {
      localStorage.removeItem(this.storageKey);
      console.log('🗑️ Caché limpiado completamente');
    } catch (e) {
      console.warn('⚠️ Error limpiando caché:', e);
    }
  }
}

// Crear instancia global del caché
window.imageCache = new ImageCache();
