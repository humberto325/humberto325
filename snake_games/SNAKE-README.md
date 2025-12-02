# 🐍 Snake Game

Un juego clásico de la serpiente modernizado con diseño profesional, animaciones suaves y controles responsive.

![Snake Game](https://img.shields.io/badge/Game-Snake-brightgreen?style=for-the-badge)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## 🎮 Características

- ✨ **Diseño Moderno**: Interfaz con glassmorphism y gradientes vibrantes
- 🎯 **Sistema de Puntuación**: Gana puntos comiendo manzanas
- 📈 **Niveles Progresivos**: El juego se acelera cada 5 manzanas
- 🏆 **Récord Personal**: Guarda tu mejor puntuación en localStorage
- 📱 **Responsive**: Controles táctiles para móviles
- 🎨 **Animaciones Suaves**: Efectos visuales y transiciones fluidas
- ⌨️ **Múltiples Controles**: Flechas del teclado, WASD, o controles táctiles

## 🚀 Cómo Jugar

1. Abre `snake-game.html` en tu navegador
2. Presiona "Comenzar Juego" o la barra espaciadora
3. Usa las flechas del teclado (↑ ↓ ← →) o WASD para mover la serpiente
4. Come las manzanas rojas 🍎 para ganar puntos
5. Evita chocar con las paredes o tu propio cuerpo
6. ¡Intenta superar tu récord!

## 🎯 Controles

### Teclado (Desktop)
- **↑ / W**: Mover arriba
- **↓ / S**: Mover abajo
- **← / A**: Mover izquierda
- **→ / D**: Mover derecha
- **Espacio / P**: Pausar/Reanudar
- **Enter**: Comenzar juego

### Táctil (Mobile)
- Usa los botones direccionales en pantalla

## 📊 Sistema de Puntuación

- 🍎 Cada manzana = **10 puntos**
- 📈 Cada 5 manzanas (50 puntos) = **Sube de nivel**
- ⚡ Cada nivel aumenta la velocidad del juego
- 🏆 Tu récord se guarda automáticamente

## 🛠️ Tecnologías Utilizadas

- **HTML5 Canvas**: Para renderizar el juego
- **CSS3**: Diseño moderno con glassmorphism y animaciones
- **JavaScript Vanilla**: Lógica del juego sin dependencias
- **localStorage**: Persistencia del récord personal

## 📁 Estructura de Archivos

```
snake-game/
├── snake-game.html    # Página principal del juego
├── snake-style.css    # Estilos modernos y responsive
├── snake-game.js      # Lógica del juego
└── README.md          # Documentación
```

## 🎨 Características Técnicas

### Diseño
- Gradientes vibrantes (púrpura a rosa)
- Glassmorphism con backdrop-filter
- Animaciones CSS suaves
- Diseño 100% responsive

### Gameplay
- Sistema de cola para prevenir bugs de doble-tap
- Detección de colisiones precisa
- Generación aleatoria de comida (sin spawn en la serpiente)
- Ojos animados en la cabeza de la serpiente
- Efectos de sombra y brillo en elementos

### Optimización
- Velocidad adaptativa por nivel
- Renderizado eficiente con Canvas
- Sin dependencias externas
- Código limpio y comentado

## 🌟 Capturas de Pantalla

### Pantalla de Inicio
- Instrucciones claras
- Diseño atractivo
- Botón de inicio destacado

### Gameplay
- Serpiente con ojos animados
- Manzanas con efecto de brillo
- Grid sutil de fondo
- Información en tiempo real (puntuación, nivel, récord)

### Game Over
- Mensaje de fin de juego
- Puntuación final
- Indicador de nuevo récord
- Botón para reiniciar

## 🚀 Deploy

Este juego es 100% frontend y puede ser desplegado en:

- **GitHub Pages**: Gratis y fácil
- **Netlify**: Deploy automático
- **Vercel**: Hosting rápido
- Cualquier servidor web estático

### Deploy en GitHub Pages

1. Sube los archivos a tu repositorio
2. Ve a Settings → Pages
3. Selecciona la rama main
4. ¡Listo! Tu juego estará en `https://tu-usuario.github.io/repo-name/snake-game.html`

## 💡 Mejoras Futuras

- [ ] Efectos de sonido
- [ ] Múltiples temas de color
- [ ] Power-ups especiales
- [ ] Modo multijugador
- [ ] Tabla de clasificación global
- [ ] Diferentes modos de juego (sin paredes, obstáculos, etc.)

## 📝 Licencia

Este proyecto es de código abierto y está disponible para uso personal y educativo.

## 👨‍💻 Autor

Creado como proyecto de portafolio para demostrar habilidades en:
- Desarrollo de juegos con Canvas
- JavaScript vanilla avanzado
- Diseño UI/UX moderno
- Programación orientada a eventos
- Manejo de estado y localStorage

---

**¡Diviértete jugando y que consigas el récord más alto! 🏆🐍**
