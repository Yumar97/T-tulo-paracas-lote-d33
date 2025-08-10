// Carrusel de imágenes
const images = document.querySelectorAll('.carousel-image');
const carouselImages = document.querySelector('.carousel-images');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const indicators = document.querySelector('.carousel-indicators');
let currentIndex = 0;
let interval;

function showImage(index) {
    carouselImages.style.transform = `translateX(-${index * 100}%)`;
    document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}
function createIndicators() {
    indicators.innerHTML = '';
    images.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => {
            currentIndex = i;
            showImage(currentIndex);
        });
        indicators.appendChild(dot);
    });
}
function nextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    showImage(currentIndex);
}
function prevImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showImage(currentIndex);
}
function startCarousel() {
    interval = setInterval(nextImage, 5000);
}
function stopCarousel() {
    clearInterval(interval);
}
if (images.length > 0) {
    createIndicators();
    showImage(currentIndex);
    startCarousel();
    carouselImages.addEventListener('mouseenter', stopCarousel);
    carouselImages.addEventListener('mouseleave', startCarousel);
    prevBtn.addEventListener('click', prevImage);
    nextBtn.addEventListener('click', nextImage);
}
// Navegación suave con offset para header fijo
const navLinks = document.querySelectorAll('nav a');
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const header = document.querySelector('header');
            const headerHeight = header ? header.offsetHeight : 0;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});
// Animación fade-in en secciones
function fadeInOnView(selector) {
    const elements = document.querySelectorAll(selector);
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'none';
            }
        });
    }, { threshold: 0.2 });
    elements.forEach(el => {
        el.style.opacity = 0;
        el.style.transform = 'translateY(30px)';
        observer.observe(el);
    });
}
fadeInOnView('.details-desc');
fadeInOnView('.benefit-card');
// Formulario de contacto
const form = document.getElementById('contactForm');
if (form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        let valid = true;
        // Validación nombre
        const nombre = form.nombre.value.trim();
        if (nombre.length < 2) {
            document.getElementById('error-nombre').textContent = 'El nombre debe tener al menos 2 caracteres.';
            valid = false;
        } else {
            document.getElementById('error-nombre').textContent = '';
        }
        // Validación correo
        const correo = form.correo.value.trim();
        const correoRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
        if (!correoRegex.test(correo)) {
            document.getElementById('error-correo').textContent = 'Ingresa un correo electrónico válido.';
            valid = false;
        } else {
            document.getElementById('error-correo').textContent = '';
        }
        // Validación mensaje
        const mensaje = form.mensaje.value.trim();
        if (mensaje.length < 10) {
            document.getElementById('error-mensaje').textContent = 'El mensaje debe tener al menos 10 caracteres.';
            valid = false;
        } else {
            document.getElementById('error-mensaje').textContent = '';
        }
        if (valid) {
            // Simulación de envío (puedes conectar con Formspree, etc.)
            form.reset();
            document.getElementById('contact-success').style.display = 'block';
            setTimeout(() => {
                document.getElementById('contact-success').style.display = 'none';
            }, 4000);
        }
    });
}

// Lightbox para imágenes (lupa y ampliación en overlay)
(function() {
    const galleryFigures = document.querySelectorAll('.lote-atractivos figure');
    const galleryImages = document.querySelectorAll('.lote-atractivos img');
    if (!galleryImages.length) return;

    // Crear overlay
    const overlay = document.createElement('div');
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-hidden', 'true');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);display:none;align-items:center;justify-content:center;z-index:1000;';

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    closeBtn.setAttribute('aria-label', 'Cerrar');
    closeBtn.style.cssText = 'position:absolute;top:16px;right:16px;background:rgba(0,0,0,0.6);color:#fff;border:none;border-radius:999px;width:40px;height:40px;font-size:1.2rem;cursor:pointer;';

    const bigImg = document.createElement('img');
    bigImg.alt = 'Imagen ampliada';
    bigImg.style.cssText = 'max-width:92vw;max-height:92vh;border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,0.4);';

    overlay.appendChild(closeBtn);
    overlay.appendChild(bigImg);
    document.body.appendChild(overlay);

    function openLightbox(src, alt) {
        bigImg.src = src;
        bigImg.alt = alt || 'Imagen ampliada';
        overlay.style.display = 'flex';
        overlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }
    function closeLightbox() {
        overlay.style.display = 'none';
        overlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        bigImg.src = '';
    }

    // Agregar icono de lupa y cursor de zoom
    galleryFigures.forEach(fig => {
        fig.style.position = 'relative';
        const icon = document.createElement('span');
        icon.textContent = '🔍';
        icon.setAttribute('aria-hidden', 'true');
        icon.style.cssText = 'position:absolute;right:10px;bottom:10px;background:rgba(0,0,0,0.55);color:#fff;border-radius:999px;padding:6px 8px;line-height:1;font-size:0.9rem;pointer-events:none;';
        fig.appendChild(icon);
    });
    galleryImages.forEach(img => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', () => openLightbox(img.src, img.alt));
    });

    // Cerrar al hacer clic fuera de la imagen, botón o tecla ESC
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeLightbox(); });
    closeBtn.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && overlay.style.display === 'flex') closeLightbox(); });
})();
