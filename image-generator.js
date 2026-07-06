// ============================================
// GENERADOR DE IMÁGENES CON HUGGING FACE
// ============================================
// 
// Este archivo reemplaza generateImage() para usar
// Hugging Face en lugar de Google Imagen API
// 
// ¡SIN COSTE! Tienes créditos gratis suficientes

/**
 * Generar imagen con Hugging Face + Caché inteligente
 * @param {string} prompt - Descripción de la imagen a generar
 * @returns {Promise<string>} - Data URL de la imagen (base64)
 */
async function generateImageWithHuggingFace(prompt) {
  // 1️⃣ VERIFICAR SI ESTÁ EN CACHÉ
  if (window.huggingFaceConfig.cacheEnabled) {
    const cachedImage = window.imageCache.get(prompt);
    if (cachedImage) {
      return cachedImage; // ♻️ Reutilizar imagen guardada
    }
  }

  // 2️⃣ VERIFICAR CONFIGURACIÓN
  const apiKey = window.huggingFaceConfig.apiKey;
  if (!apiKey || apiKey.includes('YOUR_TOKEN')) {
    throw new Error(
      '❌ Token de Hugging Face no configurado.\n\n' +
      '📋 INSTRUCCIONES:\n' +
      '1. Ve a https://huggingface.co/settings/tokens\n' +
      '2. Crea un nuevo token (hazlo PRIVADO)\n' +
      '3. Abre hugging-face-config.js\n' +
      '4. Reemplaza "hf_YOUR_TOKEN_HERE" con tu token\n' +
      '5. ¡Listo! Vuelve a intentar'
    );
  }

  // 3️⃣ PREPARAR PETICIÓN
  const modelUrl = window.huggingFaceConfig.modelUrl;
  const payload = {
    inputs: prompt,
    parameters: {
      negative_prompt: 'blurry, low quality, distorted',
    }
  };

  try {
    // 4️⃣ LLAMAR A HUGGING FACE API
    const response = await fetch(modelUrl, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      
      // Manejar errores específicos
      if (response.status === 429) {
        throw new Error(
          '⏳ Generador saturado. Espera 1 minuto e intenta de nuevo.\n' +
          'Consejo: Usa imágenes en caché para ahorrar generaciones.'
        );
      }
      
      if (response.status === 400) {
        throw new Error(
          `❌ Solicitud inválida: ${error.error || 'Prompt rechazado'}\n` +
          'Intenta con un prompt más específico.'
        );
      }

      throw new Error(`Error Hugging Face (${response.status}): ${error.error || 'Desconocido'}`);
    }

    // 5️⃣ PROCESAR RESPUESTA
    const blob = await response.blob();
    const imageDataUrl = await blobToDataUrl(blob);

    // 6️⃣ GUARDAR EN CACHÉ
    if (window.huggingFaceConfig.cacheEnabled) {
      window.imageCache.save(prompt, imageDataUrl);
    }

    return imageDataUrl;

  } catch (error) {
    console.error('❌ Error generando imagen:', error);
    throw error;
  }
}

/**
 * Convertir Blob a Data URL (base64)
 */
function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Generar prompt CONSISTENTE para la mascota
 * Asegura que la misma mascota siempre se vea igual
 */
function generateConsistentPetPrompt(characterDesc, characterName, style, visualModifier, context = '') {
  const petDescWithStyle = `${characterDesc}. Estilo: ${style}. ${visualModifier}.`;
  
  const basePrompt = `
    Personaje: ${characterName}
    Descripción: ${petDescWithStyle}
    ${context}
    
    Instrucciones:
    - Mantén al personaje consistente en apariencia
    - Utiliza colores vibrantes y alegres
    - Calidad de libro infantil ilustrado
    - Detalles claros y reconocibles
    - Expresión emocional clara
  `;

  return basePrompt.trim();
}

/**
 * Generar prompt para portada (primera imagen)
 */
function generateCoverPrompt(storyTitle, characterDesc, characterName, style) {
  return `
    Portada de libro infantil para: "${storyTitle}"
    
    Personaje principal: ${characterName}
    ${characterDesc}
    
    Estilo visual: ${style}
    
    Requisitos:
    - Diseño profesional de portada
    - Título prominente
    - Personaje centrado y destacado
    - Colores atractivos
    - Apto para niños
    - Calidad de portada profesional
  `.trim();
}

/**
 * Generar prompt para página interna (consistencia + contexto)
 */
function generatePagePrompt(characterDesc, characterName, paragraph, style, visualModifier, index, totalPages) {
  const contextHint = extractMainAction(paragraph);
  
  return `
    Página ${index + 1} de ${totalPages} de un cuento infantil
    
    Personaje: ${characterName} (${characterDesc})
    Acción en esta página: ${contextHint}
    Párrafo: "${paragraph}"
    
    Estilo: ${style}
    Perspectiva: ${visualModifier}
    
    Importante:
    - El personaje debe verse idéntico a las otras páginas
    - Mantén su misma apariencia física
    - Coherente con la narrativa
    - Calidad ilustración infantil
  `.trim();
}

/**
 * Extraer la acción principal del párrafo
 */
function extractMainAction(paragraph) {
  // Intentar extraer una frase corta del párrafo
  const sentences = paragraph.split('.');
  const mainSentence = sentences[0] || paragraph;
  return mainSentence.substring(0, 100).trim();
}

/**
 * Validar que el token esté configurado
 */
function validateHuggingFaceSetup() {
  const apiKey = window.huggingFaceConfig?.apiKey;
  
  if (!apiKey) {
    throw new Error('❌ Hugging Face no configurado');
  }
  
  if (apiKey.includes('YOUR_TOKEN') || apiKey.includes('REEMPLAZA')) {
    throw new Error(
      '⚠️ Token de Hugging Face no configurado.\n' +
      'Por favor, actualiza hugging-face-config.js con tu token.'
    );
  }
  
  return true;
}

/**
 * Mostrar estadísticas de caché
 */
function showCacheStats() {
  const stats = window.imageCache.getStats();
  console.log(`📊 Caché de imágenes:`);
  console.log(`   - Imágenes guardadas: ${stats.count}`);
  console.log(`   - Tamaño: ${stats.totalSize} MB`);
  console.log(`   - Ahorros: ${stats.count} generaciones no repetidas`);
}

/**
 * Limpiar caché manualmente
 */
function clearImageCache() {
  if (confirm('¿Borrar todas las imágenes en caché? Liberará espacio pero deberás regenerar imágenes.')) {
    window.imageCache.clear();
    console.log('✅ Caché limpiado');
  }
}

// Exportar para usar en index.html
window.imageGenerator = {
  generateImage: generateImageWithHuggingFace,
  generateConsistentPetPrompt,
  generateCoverPrompt,
  generatePagePrompt,
  validateSetup: validateHuggingFaceSetup,
  showCacheStats,
  clearCache: clearImageCache
};

console.log('✅ Image Generator cargado. Usa window.imageGenerator para acceder.');
