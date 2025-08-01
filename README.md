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
Para activar el inicio de sesión con Google debes generar un `Client ID` en
[Google Cloud Console](https://console.cloud.google.com/) y sustituir el valor
de `googleClientId` en `index.html`.

### Backend opcional

Si quieres almacenar los cuentos en el servidor en lugar de usar
`localStorage`, puedes ejecutar el pequeño backend incluido. No requiere
dependencias externas.

```bash
node server.js
```

El servidor servirá la página web y expondrá dos rutas:

- `GET /api/stories?user=<email>`: devuelve los cuentos guardados para ese
  usuario.
- `POST /api/stories`: guarda un cuento. El cuerpo debe contener `{ user,
  story }`.

Los datos se guardan en el archivo `stories.json`.

## Contribuir

¡Las contribuciones son bienvenidas! Por favor crea un issue antes de enviar un pull request.
