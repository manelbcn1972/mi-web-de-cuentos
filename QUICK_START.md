# ⚡ QUICK START (5 minutos)

## 🎯 Lo esencial, nada más

### 1️⃣ Obtén tu Token (2 min)
- Ir a: https://huggingface.co/settings/tokens
- Clic: "New token"
- Marca: "PRIVATE"
- Copia: `hf_xxxxxxxxxxxxxxxxxxxxxxxxxx`

### 2️⃣ Configura el Token (1 min)
Abre `hugging-face-config.js` y reemplaza:
```javascript
// ANTES:
apiKey: 'hf_YOUR_TOKEN_HERE',

// DESPUÉS:
apiKey: 'hf_xxxxxxxxxxxxxxxxxxxxxxxxxx',
```

### 3️⃣ Verifica (1 min)
Consola del navegador (F12):
```javascript
window.imageGenerator.validateSetup()
```
✅ Si ves un mensaje de éxito, ¡listo!

### 4️⃣ ¡Prueba! (1 min)
- Abre tu web
- Crea un cuento de prueba
- ¡Las imágenes se generan GRATIS! 🎉

---

## 📊 Resultado

| Antes | Ahora |
|-------|-------|
| $2-10 por 100 imágenes | **GRATIS** |
| Insostenible | **Funciona para siempre** |
| Dependencia de Google Imagen | **Hugging Face libre** |

---

## 🆘 Si algo falla

**Error: "Token no configurado"**
→ Abre `hugging-face-config.js` y añade tu token

**Error: "429 - Rate Limited"**
→ Espera 1 minuto e intenta de nuevo

**Las imágenes se ven raras**
→ Aumenta `steps: 30` a `steps: 50` en `hugging-face-config.js`

---

**¿Listo? ¡Adelante!** 🚀
