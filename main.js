const headerLinks = document.querySelectorAll(".header-list a");
headerLinks.forEach(link => {
  if (link.href === window.location.href) {
    link.classList.add("active");
  }
});

const scrollBtn = document.querySelector(".scroll-btn");
if (scrollBtn) {
  scrollBtn.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollBy({
      top: window.innerHeight,
      left: 0,
      behavior: "smooth"
    });
  });
}

const internalLinks = document.querySelectorAll('a[href^="#"]');
internalLinks.forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

const contactForm = document.querySelector(".contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Thank you! Your message has been sent."); 
    contactForm.reset();
  });
}

const socialIcons = document.querySelectorAll(".social-links-contact a");
socialIcons.forEach(icon => {
  icon.addEventListener("mouseover", () => {
    icon.style.transform = "translateY(-5px) scale(1.2)";
  });
  icon.addEventListener("mouseout", () => {
    icon.style.transform = "translateY(0) scale(1)";
  });
});


document.addEventListener("DOMContentLoaded", () => {

    const fadeElements = document.querySelectorAll(".fade-in-element");
    fadeElements.forEach((el, i) => {
        setTimeout(() => {
            el.classList.add("visible");
        }, i * 150); 
    });


    const links = document.querySelectorAll("a.fade-link[data-link]");
    links.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault(); 
            const href = link.getAttribute("href");
            document.body.classList.add("page-fade-out");
            setTimeout(() => {
                window.location.href = href;
            }, 600);
        });
    });
});



const menuToggle = document.getElementById('menu-toggle');
const slideMenu = document.getElementById('slide-menu');

if (menuToggle && slideMenu) {
    menuToggle.addEventListener('click', () => {
        slideMenu.classList.toggle('active');
    });

    // Close menu when a link is clicked
    const menuLinks = slideMenu.querySelectorAll('a');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            slideMenu.classList.remove('active');
        });
    });
}

// Language Toggle Logic
const translations = {
    es: {
        "nav.home": "inicio",
        "nav.about": "sobre mi",
        "nav.projects": "proyectos",
        "nav.contact": "Contacto",
        "home.title": "Hola soy Humberto 👋🏻",
        "home.subtitle": "Desarrollador Python y Front End",
        "home.desc": "Soy un desarrollador Python de Paraguay, apasionado por la programación y también disfruto creando proyectos Front-End.",
        "home.contactBtn": "Info de Contacto",
        "home.downloadBtn": "Descargar CV",
        "about.role": "Desarrollador Python y frontend junior",
        "about.title": "SOBRE MI",
        "about.p1": "¡Hola! Soy Humberto Rivero, un estudiante motivado y dedicado de Ingeniería Informática de Paraguay.",
        "about.p2": "Actualmente estudio Ingeniería Informática, donde he desarrollado un fuerte interés en la programación, el desarrollo web y la creación de soluciones funcionales que dan vida a las ideas a través de la tecnología.",
        "about.p3": "Me enfoco particularmente en prácticas de código limpio, fundamentos de desarrollo web y proyectos interactivos que combinan simplicidad con funcionalidad real.",
        "about.p4": "Ahora mismo, estoy mejorando mis habilidades en:",
        "about.li1": "Python para lógica, resolución de problemas y ejercicios prácticos de codificación",
        "about.li2": "HTML, CSS y JavaScript para construir páginas web estructuradas y responsivas",
        "about.li3": "Git y GitHub para organización de proyectos y control de versiones",
        "about.li4": "Cursor AI y Google Antigravity para mejorar mi flujo de trabajo y explorar nuevas herramientas",
        "about.li5": "Creando proyectos personales y aprendiendo nuevas tecnologías para hacer crecer mi portafolio",
        "about.p5": "Tengo una gran pasión por comenzar mi viaje profesional en una empresa y desarrollar mis habilidades como futuro desarrollador de software.",
        "contact.title": "Ponte en contacto",
        "contact.btn": "Enviar Mensaje",
        "project.title1": "Herramientas y proyectos",
        "project.desc1": "Aquí puedes ver algunas herramientas que utilicé y proyectos personales desarrollados para mi aprendizaje",
        "project.title2": "Aquí puedes ver mis proyectos más recientes",
        "project.card1.title": "Sistema de Inventario",
        "project.card1.desc": "Gestiona productos, precios, stock y ventas con una base de datos integrada.",
        "project.card2.title": "Sistema de Registro e Inicio de Sesión",
        "project.card2.desc": "Un login simple con movimiento y registro."
    },
    en: {
        "nav.home": "Home",
        "nav.about": "About Me",
        "nav.projects": "Projects",
        "nav.contact": "Contact",
        "home.title": "Hello I'm Humberto 👋🏻",
        "home.subtitle": "Python and Front End Developer",
        "home.desc": "I'm a Python developer from Paraguay, passionate about coding and also enjoy creating Front-End projects.",
        "home.contactBtn": "Contact Info",
        "home.downloadBtn": "Download CV",
        "about.role": "Python Developer and frontend junior",
        "about.title": "ABOUT ME",
        "about.p1": "Hi! I'm Humberto Rivero, a motivated and dedicated Computer Engineering student from Paraguay.",
        "about.p2": "I’m currently studying Computer Engineering, where I’ve developed a strong interest in programming, web development, and creating functional solutions that bring ideas to life through technology.",
        "about.p3": "I’m particularly focused on clean code practices, web development fundamentals, and interactive projects that blend simplicity with real functionality.",
        "about.p4": "Right now, I’m improving my skills in:",
        "about.li1": "Python for logic, problem-solving, and practical coding exercises",
        "about.li2": "HTML, CSS, and JavaScript for building structured and responsive web pages",
        "about.li3": "Git and GitHub for project organization and version control",
        "about.li4": "Cursor AI and Google Antigravity to enhance my workflow and explore new tools",
        "about.li5": "Creating personal projects and learning new technologies to grow my portfolio",
        "about.p5": "I have a strong passion for starting my professional journey in a company and developing my skills as a future software developer.",
        "contact.title": "Get in Touch",
        "contact.btn": "Send Message",
        "project.title1": "Tools and Projects",
        "project.desc1": "Here you can see some tools I used and personal projects developed for my learning",
        "project.title2": "Here you can see my most recent projects",
        "project.card1.title": "Inventory System",
        "project.card1.desc": "Manages products, prices, stock and sales with an integrated database.",
        "project.card2.title": "Login and Register system",
        "project.card2.desc": "A simple login with motion and registration."
    }
};

function updateLanguage(lang) {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            // Check if it's an input button or regular element
            if (el.tagName === 'INPUT' && el.type === 'submit') {
                el.value = translations[lang][key];
            } else {
                // Preserve icons if they exist (simple check)
                const icon = el.querySelector('i');
                if (icon) {
                     // If there is an icon, we assume the text is a text node alongside it
                     // This might be tricky, let's try to just update the text node
                     // For now, let's just replace innerHTML but keep the icon if we can reconstruct it
                     // Or simpler: just put the text and let the user put the icon in the HTML separately if needed.
                     // Actually, looking at the HTML, icons are usually separate or inside <a>.
                     // Let's just replace textContent for now, but be careful with children.
                     // Better strategy: Wrap text in a span or just replace the text node.
                     
                     // For this specific project, let's see.
                     // Buttons have icons: <a href="#" class="btn">Download CV <i class="fa-solid fa-download"></i></a>
                     // We should replace the text but keep the icon.
                     
                     const textNode = Array.from(el.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
                     if (textNode) {
                         textNode.textContent = translations[lang][key] + " ";
                     } else {
                         // If no text node found, maybe prepend?
                         el.innerHTML = translations[lang][key] + " " + icon.outerHTML;
                     }
                } else {
                    el.textContent = translations[lang][key];
                }
            }
        }
    });

    // Update button text
    const langBtn = document.getElementById('language-toggle');
    if (langBtn) {
        langBtn.textContent = lang === 'es' ? 'EN' : 'ES';
    }

    localStorage.setItem('preferredLanguage', lang);
}

document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('preferredLanguage') || 'es';
    updateLanguage(savedLang);

    const langBtn = document.getElementById('language-toggle');
    if (langBtn) {
        langBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const currentLang = localStorage.getItem('preferredLanguage') || 'es';
            const newLang = currentLang === 'es' ? 'en' : 'es';
            updateLanguage(newLang);
        });
    }
});



