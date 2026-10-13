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
*   **Archivo:** `src/components/WelcomeScreen.jsx` — título y texto de bienvenida.

### 2. Nivel 1: Parejas de recuerdos
*   **Archivo:** `src/components/levels/Level1Memory.jsx`
*   **Editar:** `SYMBOLS` con los iconos de `lucide-react` que os representen.

### 3. Nivel 2: La palabra secreta
*   **Archivo:** `src/components/levels/Level2Wordle.jsx`
*   **Editar:** `SOLUTION` (la palabra) y `HINTS` (pistas que aparecen tras X intentos).

### 4. Nivel 3: Atrapa mi corazón
*   **Archivo:** `src/components/levels/Level3Catch.jsx`
*   **Editar:** `GOAL`, `LIVES` y `BAD_CHANCE` para ajustar la dificultad.

### 5. Nivel 4: Puzzle deslizante
*   **Archivo:** `src/components/levels/Level4Sliding.jsx`
*   **Editar:** `IMAGE_URL` (foto en `public/`) e `IMAGE_RATIO` (ancho / alto de la foto).

### 6. Nivel 5: Rueda de cifrado
*   **Archivo:** `src/components/levels/Level5Decoder.jsx`
*   **Editar:** `SECRET_ANSWER` (la frase) y `SHIFT` (cuántas posiciones se desplaza). El mensaje cifrado se calcula solo.

### 7. Nivel 6: Encuentra las diferencias
*   **Archivo:** `src/components/levels/Level6Differences.jsx`
*   **Editar:** `ORIGINAL_IMG`, `MODIFIED_IMG` y `DIFFERENCES` (posición en % de cada cambio y su pista).

### 8. Pantalla Final (El Regalo)
*   **Archivo:** `src/components/FinalScreen.jsx` — mensaje final y datos de la entrada.

### Colores y tipografías
*   **Archivo:** `src/index.css` — todas las variables de diseño están en `:root`.

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
