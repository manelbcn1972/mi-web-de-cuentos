<!-- SETUP.md - INSTRUCCIONES RÁPIDAS PARA ACTIVAR HUGGING FACE -->

# 🚀 SETUP: Generación de Imágenes GRATIS con Hugging Face

¡Excelente! Ya tienes todo el código. Solo necesitas 3 pasos para activar la generación de imágenes **SIN COSTE**.

## ✅ Paso 1: Obtener tu Token de Hugging Face (2 minutos)

1. **Ir a:** https://huggingface.co/settings/tokens
2. **Haz login** (crea cuenta si no tienes)
3. **Clic en "New token"**
4. **Configura:**
   - Nombre: `PetStories`
   - Tipo: `Read` (es suficiente)
   - **Marca: "PRIVATE"** ⚠️ (IMPORTANTE: que sea privado)
5. **Copia el token** (algo como `hf_xxxxxxxxxxxxxxxxxxxxx`)

## ✅ Paso 2: Configurar el Token en tu Web

### Opción A: Localmente (más fácil)
1. Abre `hugging-face-config.js`
2. Busca esta línea:
   ```javascript
   apiKey: 'hf_YOUR_TOKEN_HERE', // ← REEMPLAZA CON TU TOKEN
   ```
3. Reemplaza `hf_YOUR_TOKEN_HERE` con tu token real:
   ```javascript
   apiKey: 'hf_xxxxxxxxxxxxxxxxxxxxxxxxxx',
   ```
4. **Guarda el archivo**
5. ¡Listo! Ya funciona

### Opción B: Variable de Entorno (más segura para producción)
En tu servidor/Replit, configura una variable de entorno:
```bash
export HUGGING_FACE_TOKEN=hf_xxxxxxxxxxxxxxxxxxxxx
```

Luego en `hugging-face-config.js`:
```javascript
apiKey: process.env.HUGGING_FACE_TOKEN || 'hf_YOUR_TOKEN_HERE',
```

## ✅ Paso 3: Verificar que Funciona

### En el navegador:
```javascript
// Abre la consola (F12) y ejecuta:
window.imageGenerator.validateSetup()
```

Si ves ✅, ¡está configurado!

Si ves ❌, revisa tu token en `hugging-face-config.js`

## 📊 Cómo Funciona la Solución

```
Usuario crea cuento
        ↓
    ¿Imagen en caché?
    ├─→ SÍ: Devuelve al instante (gratis) ♻️
    └─→ NO: Genera con Hugging Face
            ↓
        API Hugging Face ✨
            ↓
        Guarda en caché 💾
            ↓
        Devuelve al usuario
```

### Beneficios:
- ✅ **GRATIS**: Hugging Face tiene créditos gratuitos
- ✅ **RÁPIDO**: Las imágenes se cachean (segunda vez = instantáneo)
- ✅ **CONSISTENCIA**: Mismos prompts = misma mascota
- ✅ **SIN LIMITES**: Tienes suficientes créditos para miles de imágenes

## 💰 Costos (O la falta de ellos)

| Servicio | Costo | Status |
|----------|-------|--------|
| Google Imagen | $2-10 USD por 100 imágenes | ❌ Eliminado |
| Hugging Face | **GRATIS** (créditos ilimitados) | ✅ Nuevo |
| Ahorro | **$$$$ al mes** | 🎉 |

## 📝 Línea de Tiempo de Generación

**Primera generación de cuento:**
```
Portada: 15 seg
Página 1: 15 seg
Página 2: 15 seg
... (8 páginas totales)
TOTAL: ~2 minutos
```

**Segunda vez (con caché):**
```
Todo: < 1 segundo ⚡
```

## 🔧 Configuración Avanzada

Si quieres ajustar la calidad o velocidad, edita `hugging-face-config.js`:

```javascript
imageQuality: {
  width: 768,      // Más alto = mejor calidad (pero más lento)
  height: 768,     // 512 = rápido, 768 = calidad, 1024 = lento
  steps: 30        // Más pasos = mejor (pero más lento)
}
```

**Recomendaciones:**
- 📱 Móvil: `512x512, steps: 20`
- 💻 Desktop: `768x768, steps: 30`
- 🖨️ Impresión: `1024x1024, steps: 50`

## 📊 Ver Estadísticas de Caché

En la consola del navegador:
```javascript
window.imageGenerator.showCacheStats()
```

Verás algo como:
```
📊 Caché de imágenes:
   - Imágenes guardadas: 24
   - Tamaño: 12.5 MB
   - Ahorros: 24 generaciones no repetidas
```

## 🗑️ Limpiar Caché

```javascript
window.imageGenerator.clearCache()
```

## ⚠��� Troubleshooting

### Error: "Token no configurado"
```
❌ Solución: Abre hugging-face-config.js y añade tu token
```

### Error: "429 - Rate Limited"
```
⏳ Significa: Demasiadas peticiones simultáneas
✅ Solución: Espera 1 minuto e intenta de nuevo
💡 Tip: Usa imágenes del caché para evitar esto
```

### Error: "Prompt rechazado"
```
❌ Significa: El prompt contiene palabras no permitidas
✅ Solución: Usa descripciones más simples y claras
```

### Las imágenes se ven mal
```
🎨 Solución: Aumenta steps en imageQuality (hasta 50)
⚙️ También: Sube width y height a 1024
```

## 🎓 Próximos Pasos

Una vez configurado:

1. ✅ Abre tu web
2. ✅ Crea un cuento de prueba
3. ✅ ¡Disfruta! 🎉

Las imágenes se generarán automáticamente con Hugging Face. La primera vez tardará un poco (generando), las siguientes serán instantáneas (caché).

## 💡 Pro Tips

1. **Prompts específicos**: Cuanto más específico sea tu prompt, mejor será la imagen
   ```
   ❌ Malo: "un perro"
   ✅ Bueno: "un perro golden retriever joven, pelaje dorado brillante, orejas largas"
   ```

2. **Reutilizar mascotas**: Si creas varios cuentos con la misma mascota, ¡el caché los hará gratis!

3. **Backup de prompts**: El archivo `hugging-face-config.js` guarda los prompts para consistencia

4. **Monitorea uso**: Usa `showCacheStats()` para ver cuántas imágenes has generado

---

## 📞 Soporte

Si algo no funciona:
1. Abre la consola (F12)
2. Copia los errores
3. Verifica que tu token esté correcto

**¡Listo! Ya tienes imágenes GRATIS y consistentes** 🎨✨
