# 🌊 Santuario Oceánico Místico

SPA (Single Page Application) que combina una experiencia **3D inmersiva** con un **chatbot inteligente** conectado a Google Gemini. Tema: santuario oceánico místico y romántico para un cumpleaños (Acuario), con tortugas y delfines en el ambiente.

## ✨ Características

- **Fondo 3D interactivo** (React Three Fiber + Drei): océano profundo (azul noche, violeta), partículas brillantes, luces tipo caustics y burbujas flotantes con imágenes.
- **Galería de burbujas**: esferas 3D transparentes que contienen fotos; flotan y rotan. Imágenes en `public/assets/fotos/` (placeholders incluidos; sustituye por tus fotos).
- **Tortugas y delfines** en la escena 3D como figuras animadas.
- **Título de bienvenida** con animación suave al cargar.
- **Chatbot con glassmorphism**: ventana flotante, estilo vidrio esmerilado, conectado a **Google Gemini 1.5 Pro**.
- **Espíritu del Océano**: system prompt configurable para un guía romántico y místico que celebra el cumpleaños.
- **Responsivo** para móvil y escritorio.

## 🚀 Instalación

```bash
npm install
```

## ⚙️ Configuración (Gemini)

1. Copia el archivo de ejemplo de variables de entorno:
   ```bash
   cp .env.local.example .env.local
   ```

2. Obtén una API Key en [Google AI Studio](https://aistudio.google.com/apikey).

3. Edita `.env.local` y define:
   ```env
   VITE_GEMINI_API_KEY=tu_api_key_aqui
   ```
   Opcional (para personalizar el system prompt):
   ```env
   VITE_TU_NOMBRE=Tu Nombre
   VITE_SU_NOMBRE=Ella
   ```

4. Arranca el proyecto:
   ```bash
   npm run dev
   ```

5. Abre `http://localhost:5173`.

## 📁 Estructura del proyecto

```
├── public/
│   └── assets/
│       └── fotos/          # Tus fotos para las burbujas (sustituye placeholders)
├── src/
│   ├── components/
│   │   ├── 3d/              # Escena 3D
│   │   │   ├── Scene3D.jsx
│   │   │   ├── OceanScene.jsx
│   │   │   ├── OceanParticles.jsx
│   │   │   ├── CausticsLight.jsx
│   │   │   ├── ImageBubbles.jsx
│   │   │   └── OceanCreatures.jsx  # Tortugas y delfines
│   │   └── ui/
│   │       ├── WelcomeTitle.jsx
│   │       └── Chatbot.jsx
│   ├── config/
│   │   ├── bubbleImages.js  # Lista de imágenes de burbujas
│   │   └── gemini.js        # System prompt del Espíritu del Océano
│   ├── hooks/
│   │   └── useGemini.js     # Integración con Gemini API
│   ├── assets/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.local.example
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## 📦 Tech stack

- **React 18** + **Vite**
- **Tailwind CSS**
- **Framer Motion** (UI)
- **@react-three/fiber** + **@react-three/drei** + **three** (3D)
- **@google/generative-ai** (Gemini 1.5 Pro)
- **Lucide React** (iconos)

## 🖼️ Fotos en las burbujas

- Coloca tus imágenes en `public/assets/fotos/` (p. ej. `1.jpg`, `2.jpg`).
- Edita `src/config/bubbleImages.js` y ajusta las rutas:
  ```js
  export const BUBBLE_IMAGES = [
    { src: '/assets/fotos/1.jpg', alt: 'Recuerdo 1' },
    { src: '/assets/fotos/2.jpg', alt: 'Recuerdo 2' },
    // ...
  ]
  ```
- Si una imagen no existe, se usará el placeholder incluido.

## 📝 Scripts

| Comando       | Descripción                    |
|---------------|--------------------------------|
| `npm run dev` | Servidor de desarrollo         |
| `npm run build` | Build de producción          |
| `npm run preview` | Vista previa del build     |
| `npm run lint` | Linter                       |

---

¡Disfruta del Santuario Oceánico Místico! 🌊✨
