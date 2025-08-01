# PetStories - Generador de Cuentos con IA

Una aplicación web que genera cuentos ilustrados personalizados para mascotas usando IA.

## Características

- 🐾 Genera cuentos personalizados para diferentes tipos de mascotas
- 🎨 Ilustraciones generadas automáticamente con IA
- 📖 Vista de flipbook interactiva
- 📱 Diseño responsive
- 💾 Descarga de PDFs
- 🖨️ Opción de impresión

## Cómo usar

1. Abre `index.html` en tu navegador
2. Completa el formulario con los datos de tu mascota
3. Haz clic en "¡Crear Mi Cuento!"
4. Disfruta del cuento generado

## Tecnologías utilizadas

- HTML5, CSS3, JavaScript
- Tailwind CSS
- jsPDF para generación de PDFs
- html2canvas para capturas
- Google Identity Services para inicio de sesión con Google

## Instalación

Solo necesitas abrir el archivo `index.html` en cualquier navegador moderno.
Para activar el inicio de sesión con Google debes generar tus propias claves y
proporcionarlas a la aplicación.

### Configuración de claves

1. Crea un archivo `config.js` en la raíz del proyecto con el siguiente
   contenido:

   ```javascript
   window.googleAiApiKey = 'TU_CLAVE_DE_GOOGLE_AI';
   window.googleClientId = 'TU_CLIENT_ID_DE_GOOGLE';
   ```

   Este archivo está listado en `.gitignore` para que tus claves privadas no se
   suban al repositorio.

2. También puedes generar `config.js` automáticamente a partir de variables de
   entorno antes de ejecutar el servidor:

   ```bash
   echo "window.googleAiApiKey='${GOOGLE_AI_API_KEY}'; window.googleClientId='${GOOGLE_CLIENT_ID}';" > config.js
   node server.js
   ```

Al abrir `index.html`, el archivo `config.js` se cargará de forma automática y
las claves estarán disponibles para la aplicación.

### Backend opcional

Si quieres almacenar los cuentos en el servidor en lugar de usar
`localStorage`, puedes ejecutar el pequeño backend incluido. No requiere
dependencias externas.

```bash
node server.js
```

El servidor servirá la página web y expondrá tres rutas:

- `GET /api/stories?user=<email>`: devuelve los cuentos guardados para ese
  usuario.
- `POST /api/stories`: guarda un cuento. El cuerpo debe contener `{ user,
  story }`.
- `DELETE /api/stories?user=<email>`: elimina todos los cuentos de ese
  usuario.

Los datos se guardan en el archivo `stories.json`.

## Contribuir

¡Las contribuciones son bienvenidas! Por favor crea un issue antes de enviar un pull request.
