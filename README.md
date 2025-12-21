# Regalo de Aniversario Interactivo ❤️

Esta es una aplicación web interactiva diseñada como un regalo romántico. Consiste en una serie de minijuegos y acertijos que tu pareja debe resolver para desbloquear el regalo final.

## 🚀 Cómo empezar

1.  **Instalar dependencias:**
    ```bash
    npm install
    ```

2.  **Ejecutar en modo desarrollo:**
    ```bash
    npm run dev
    ```

## 🛠️ Personalización

Para que el regalo sea verdaderamente especial, debes editar el código con tus propios recuerdos, fotos y mensajes. Aquí te indico qué archivos modificar:

### 1. Mensaje de Bienvenida
*   **Archivo:** `src/components/WelcomeScreen.jsx`
*   **Editar:** Cambia el texto dentro de `<h1>` y `<p>` para poner tu propio mensaje de bienvenida.

### 2. Nivel 1: Escape Room (El Comienzo)
*   **Archivo:** `src/components/levels/Level1Escape.jsx`
*   **Editar:** Puedes cambiar los objetos donde se busca la llave y los mensajes que aparecen. Por defecto, la llave está en la `plant` (planta).

### 3. Nivel 2: Memoria
*   **Archivo:** `src/components/levels/Level2Memory.jsx`
*   **Editar:** Puedes cambiar los iconos importados de `lucide-react` si prefieres otros símbolos.

### 4. Nivel 3: Línea de Tiempo
*   **Archivo:** `src/components/levels/Level3Timeline.jsx`
*   **Editar:** Modifica `initialEvents` con tus propios hitos de relación. Asegúrate de actualizar `correctOrder` con los IDs en el orden correcto.

### 5. Nivel 4: Puzzle de Imagen
*   **Archivo:** `src/components/levels/Level4Puzzle.jsx`
*   **Editar:** Cambia la constante `IMAGE_URL` por la URL de una foto vuestra. Puedes subir la foto a un servicio como Imgur o ponerla en la carpeta `public` y usar una ruta relativa (ej. `/mifoto.jpg`).

### 6. Nivel 5: Mensaje Cifrado
*   **Archivo:** `src/components/levels/Level5Cipher.jsx`
*   **Editar:**
    *   `SECRET_ANSWER`: La respuesta que ella debe escribir.
    *   `ENCRYPTED_MSG`: El mensaje cifrado que ella ve.
    *   (Tip: Usa un cifrado César simple, desplazando cada letra 1 posición, A->B, etc.)

### 7. Nivel 6: Escape Room
*   **Archivo:** `src/components/levels/Level6Escape.jsx`
*   **Editar:**
    *   `FINAL_CODE`: El código numérico para salir.
    *   `clues`: Las pistas y sus textos.
    *   Puedes cambiar la imagen de fondo en `Level6Escape.css`.

### 8. Pantalla Final (El Regalo)
*   **Archivo:** `src/components/FinalScreen.jsx`
*   **Editar:**
    *   Cambia el mensaje de felicitación.
    *   Cambia el contenido del regalo en `<div className="gift-content">`.

## 🌍 Despliegue (Cómo enviárselo)

La forma más fácil y gratuita es usar **Vercel** o **Netlify**.

### Opción 1: Vercel (Recomendado)
1.  Sube este código a un repositorio de GitHub.
2.  Ve a [vercel.com](https://vercel.com) y regístrate.
3.  Haz clic en "Add New Project" e importa tu repositorio.
4.  Vercel detectará que es un proyecto Vite/React. Haz clic en "Deploy".
5.  ¡Listo! Te dará una URL (ej. `mi-regalo.vercel.app`) para que se la envíes a ella.

### Opción 2: Netlify Drop (Sin GitHub)
1.  Ejecuta `npm run build` en tu terminal. Esto creará una carpeta `dist`.
2.  Ve a [app.netlify.com/drop](https://app.netlify.com/drop).
3.  Arrastra la carpeta `dist` a la página.
4.  Se subirá automáticamente y te dará un enlace.

¡Mucha suerte y feliz aniversario! 🥂
