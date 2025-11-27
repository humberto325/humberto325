const menuToggle = document.getElementById('menu-toggle');
const slideMenu = document.getElementById('slide-menu');
const body = document.body;

// Menu Toggle
menuToggle.addEventListener('click', () => {
    slideMenu.classList.toggle('active');
    // Optional: Prevent scrolling when menu is open
    // body.style.overflow = slideMenu.classList.contains('active') ? 'hidden' : 'auto';
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!slideMenu.contains(e.target) && !menuToggle.contains(e.target) && slideMenu.classList.contains('active')) {
        slideMenu.classList.remove('active');
    }
});

// Language Toggle
const languageToggle = document.getElementById('language-toggle');
const textsToChange = document.querySelectorAll('[data-i18n]');

const translations = {
    es: {
        'nav.home': 'Inicio',
        'nav.about': 'Sobre mí',
        'nav.projects': 'Proyectos',
        'nav.contact': 'Contacto',
        'home.greeting': 'Hola, soy',
        'home.role': 'Desarrollador Web',
        'home.desc': 'Apasionado por crear experiencias web interactivas y funcionales.',
        'home.btn': 'Ver Proyectos',
        'about.role': 'Desarrollador Python y Frontend Junior',
        'about.title': 'SOBRE MÍ',
        'about.p1': '¡Hola! Soy Humberto Rivero, un estudiante de Ingeniería Informática motivado y dedicado de Paraguay.',
        'about.p2': 'Actualmente estudio Ingeniería Informática, donde he desarrollado un fuerte interés en la programación, el desarrollo web y la creación de soluciones funcionales que dan vida a las ideas a través de la tecnología.',
        'about.p3': 'Me enfoco particularmente en prácticas de código limpio, fundamentos de desarrollo web y proyectos interactivos que combinan simplicidad con funcionalidad real.',
        'about.p4': 'Ahora mismo, estoy mejorando mis habilidades en:',
        'about.li1': 'Python para lógica, resolución de problemas y ejercicios prácticos de codificación',
        'about.li2': 'HTML, CSS y JavaScript para construir páginas web estructuradas y responsivas',
        'about.li3': 'Git y GitHub para organización de proyectos y control de versiones',
        'about.li4': 'Cursor AI y Google Antigravity para mejorar mi flujo de trabajo y explorar nuevas herramientas',
        'about.li5': 'Crear proyectos personales y aprender nuevas tecnologías para hacer crecer mi portafolio',
        'about.p5': 'Tengo una gran pasión por comenzar mi viaje profesional en una empresa y desarrollar mis habilidades como futuro desarrollador de software.',
        'project.title1': 'Herramientas y proyectos',
        'project.desc1': 'Aquí puedes ver algunas herramientas que utilicé y proyectos personales desarrollados para mi aprendizaje',
        'project.title2': 'Aquí puedes ver mis proyectos más recientes',
        'project.card1.title': 'Sistema de Inventario',
        'project.card1.desc': 'Gestiona productos, precios, stock y ventas con una base de datos integrada.',
        'project.card2.title': 'Sistema de Login y Registro',
        'project.card2.desc': 'Un login simple con movimiento y registro.',
        'project.card3.title': 'Juego de la Serpiente',
        'project.card3.desc': 'Juego clásico de la serpiente con diseño moderno, puntuaciones y animaciones.',
        'project.card4.title': 'App del Clima',
        'project.card4.desc': 'Consulta el clima en tiempo real de cualquier ciudad del mundo.',
        'contact.title': 'Ponte en Contacto',
        'contact.btn': 'Enviar Mensaje'
    },
    en: {
        'nav.home': 'Home',
        'nav.about': 'About',
        'nav.projects': 'Projects',
        'nav.contact': 'Contact',
        'home.greeting': 'Hi, I am',
        'home.role': 'Web Developer',
        'home.desc': 'Passionate about creating interactive and functional web experiences.',
        'home.btn': 'View Projects',
        'about.role': 'Python Developer and frontend junior',
        'about.title': 'ABOUT ME',
        'about.p1': 'Hi! I\'m Humberto Rivero, a motivated and dedicated Computer Engineering student from Paraguay.',
        'about.p2': 'I’m currently studying Computer Engineering, where I’ve developed a strong interest in programming, web development, and creating functional solutions that bring ideas to life through technology.',
        'about.p3': 'I’m particularly focused on clean code practices, web development fundamentals, and interactive projects that blend simplicity with real functionality.',
        'about.p4': 'Right now, I’m improving my skills in:',
        'about.li1': 'Python for logic, problem-solving, and practical coding exercises',
        'about.li2': 'HTML, CSS, and JavaScript for building structured and responsive web pages',
        'about.li3': 'Git and GitHub for project organization and version control',
        'about.li4': 'Cursor AI and Google Antigravity to enhance my workflow and explore new tools',
        'about.li5': 'Creating personal projects and learning new technologies to grow my portfolio',
        'about.p5': 'I have a strong passion for starting my professional journey in a company and developing my skills as a future software developer.',
        'project.title1': 'Tools and Projects',
        'project.desc1': 'Here you can see some tools I used and personal projects developed for my learning',
        'project.title2': 'Here you can see my most recent projects',
        'project.card1.title': 'Inventory System',
        'project.card1.desc': 'Manages products, prices, stock, and sales with an integrated database.',
        'project.card2.title': 'Login and Register System',
        'project.card2.desc': 'A simple login with movement and registration.',
        'project.card3.title': 'Snake Game',
        'project.card3.desc': 'Classic snake game with modern design, scores, and animations.',
        'project.card4.title': 'Weather App',
        'project.card4.desc': 'Check real-time weather for any city in the world.',
        'contact.title': 'Get in Touch',
        'contact.btn': 'Send Message'
    }
};

let currentLang = 'es'; // Default language

if (languageToggle) {
    languageToggle.addEventListener('click', () => {
        currentLang = currentLang === 'es' ? 'en' : 'es';
        languageToggle.textContent = currentLang === 'es' ? 'ES' : 'EN';
        updateTexts();
    });
}

function updateTexts() {
    textsToChange.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[currentLang][key]) {
            element.textContent = translations[currentLang][key];
        }
    });
}

// Initialize texts
updateTexts();

// Active Link Highlighting
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.header-list a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(li => {
        li.classList.remove('active');
        if (li.getAttribute('href').includes(current)) {
            li.classList.add('active');
        }
    });
});
