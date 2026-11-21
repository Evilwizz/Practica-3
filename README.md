# 🏎️ TURBO RACER 2D - PC3 DESARROLLO DE VIDEOJUEGOS

Juego de carreras arcade 2D desarrollado en **JavaScript con Phaser 2 CE** y **Web Audio API**, siguiendo los lineamientos de la Universidad Tecnológica del Perú (UTP).

---

## 📌 Requerimientos Implementados

1. **Score, Vidas y Puntos**:
   - Vidas iniciales: 3 vidas (representadas con corazones ❤️❤️❤️ y contador numérico en el HUD superior).
   - Recolección de combustible: Cada barril de gasolina suma **+1 Punto**.
   - Colisión con obstáculos: Resta 1 vida y activa efecto de explosión animada y parpadeo de invulnerabilidad.
2. **Sonido de Fondo y Colisión**:
   - Sonido de fondo (*BGM* arcade retro).
   - Efectos sonoros de colisión explosiva al impactar con carros enemigos.
   - Sonido de recolección de combustible (barriles).
   - Sonido de victoria y derrota.
   - Motor dual: Archivos de audio WAV + sintetizador Web Audio API nativo con botón de Mute (🔊/🔇).
3. **Dos Niveles con Complejidad Aumentada**:
   - **Nivel 1**: Pista a velocidad normal, enemigos estándar (`carroMalo.png`), barriles de gasolina. Al alcanzar **3 puntos** avanza automáticamente al Nivel 2.
   - **Nivel 2**: Velocidad del fondo incrementada (`tilePosition.y += 5.5`), nuevos carros deportivos enemigos más rápidos (`carroMalo1.png`), generación acelerada de obstáculos. Meta: alcanzar **6 puntos totales**.
4. **Portada Gameplay con Nombre y Apellido**:
   - Visualización y edición en vivo del **Nombre y Apellido del Estudiante / Piloto**.
   - Almacenamiento persistente en `localStorage`.
5. **Pantalla "GANASTE"**:
   - Se muestra al acumular los 6 puntos requeridos completando los 2 niveles, indicando las estadísticas finales y botón "JUGAR DE NUEVO".
6. **Pantalla "VUELVE A INTENTARLO"**:
   - Se muestra cuando las vidas llegan a 0, mostrando el puntaje obtenido, nivel alcanzado y botón "REINTENTAR".
7. **Controles**:
   - Teclado: Flechas `[←]` `[→]` o teclas `[A]` `[D]`.
   - Botones táctiles interactivos en pantalla para móviles o tablets (`IZQ` / `DER`).
   - Accesos directos de evaluación para cambiar de estado al instante con un solo clic.

---

## 🚀 Publicación en la Web

Este proyecto es 100% estático (HTML5/JS/CSS), por lo que puede desplegarse inmediatamente en:

- **GitHub Pages**: [https://evilwizz.github.io/Practica-3/](https://evilwizz.github.io/Practica-3/) (Activar en *Settings > Pages > Deploy from a branch: main*).
- **Repositorio**: [https://github.com/Evilwizz/Practica-3](https://github.com/Evilwizz/Practica-3)
- **Netlify**: Arrastra esta carpeta a [Netlify Drop](https://app.netlify.com/drop).
- **Vercel**: Importa el repositorio `Evilwizz/Practica-3` en Vercel con un solo clic.
- **Itch.io**: Comprime los archivos en un ZIP y súbelo seleccionando *"This file will be played in the browser"*.

---

## 📁 Estructura del Proyecto

```text
├── index.html          # Interfaz principal, HUD, controles y marco arcade
├── css/
│   └── style.css       # Estilos visuales arcade retro modernos
├── js/
│   ├── phaser.js       # Motor Phaser 2 CE
│   ├── sonidos.js      # Sistema de audio y sintetizador Web Audio API
│   ├── portada.js      # Menú principal y visualización de estudiante
│   ├── juego.js        # Estado Nivel 1 (Meta 3 puntos)
│   ├── nivel2.js       # Estado Nivel 2 (Mayor velocidad y nuevo enemigo)
│   ├── ganaste.js      # Pantalla GANASTE
│   ├── terminado.js    # Pantalla VUELVE A INTENTARLO
│   └── principal.js    # Inicializador y router de estados
├── img/                # Sprites de carros, fondo, gas y explosión
├── audio/              # Efectos de sonido y BGM en formato WAV
├── capturas/           # Pantallazos de los 5 estados del juego
└── demostracion_juego.gif # Animación demostrativa del juego
```
