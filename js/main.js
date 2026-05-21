/* ==========================================================================
   Renova Energy LDA - Main Scripts (Premium Version - PT)
   ========================================================================== */

/* --- Blog Content (Português) --- */
const blogContent = {
    '1': {
        category: 'Dicas Solares',
        title: '3 Mitos Frequentes sobre Painéis Solares Nampula',
        image: 'url(\'imagens/image-16.jpg\')',
        text: `
            <p><strong>Mito 1: Painéis solares não funcionam no inverno.</strong> Na verdade, eles dependem da luz, não do calor. Moçambique tem radiação solar excelente o ano todo.</p>
            <p><strong>Mito 2: A manutenção é caríssima.</strong> Falso. A manutenção básica consiste em limpeza e inspeção visual, com custo muito reduzido comparado à economia gerada.</p>
            <p><strong>Mito 3: Preciso de baterias para tudo.</strong> Em sistemas On-Grid, você pode usar a rede da EDM como "bateria virtual", reduzindo drasticamente o investimento inicial.</p>
        `
    },
    '2': {
        category: 'Mercado Financeiro',
        title: 'Impacto Econômico: Retorno de Investimento Rápido',
        image: 'url(\'imagens/image-19.jpg\')',
        text: `
            <p>Investir em energia renovável na Renova Energy garante um ROI entre 2 a 5 anos. Com a subida das tarifas elétricas, produzir a sua própria energia é o melhor ativo financeiro sustentável.</p>
            <p>Nossos projetos Turnkey incluem tudo: do licenciamento à instalação, maximizando cada metical investido.</p>
        `
    },
    '3': {
        category: 'Tecnologia',
        title: 'A Revolução Sustentável na Indústria Off-Grid',
        image: 'url(\'imagens/image-26.jpg\')',
        text: `
            <p>A indústria mineira e agrícola em Moçambique está a mudar para o Off-Grid. Usamos inversores de alta frequência e baterias de lítio LiFePO4 para garantir energia 24/7 em locais remotos.</p>
            <p>A Renova Energy lidera a implementação destas soluções robustas com monitorização remota via Wi-Fi/4G.</p>
        `
    }
};

document.addEventListener('DOMContentLoaded', () => {

    // 1. Initialize Theme from localStorage
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const header = document.getElementById('header');
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme === 'dark') {
        body.classList.add('dark-theme');
        if (header) header.classList.add('dark-theme');
        if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-theme');
            if (header) header.classList.toggle('dark-theme');
            
            let theme = 'light';
            if (body.classList.contains('dark-theme')) {
                theme = 'dark';
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            } else {
                theme = 'light';
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            }
            localStorage.setItem('theme', theme);
        });
    }

    // --- Language Initialization ---
    initLanguage();

    // --- Cookie Consent Logic ---
    const cookieConsent = localStorage.getItem('cookieConsent');
    const cookieBanner = document.getElementById('cookie-banner');
    if (!cookieConsent && cookieBanner) {
        // Delay before showing banner
        setTimeout(() => {
            cookieBanner.classList.add('show');
        }, 3000);
    }

    /* --- Header Scroll Effect --- */
    window.addEventListener('scroll', () => {
        if (!header) return;
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    /* --- Mobile Menu Toggle --- */
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mainNav = document.getElementById('main-nav');
    
    if (mobileBtn && mainNav) {
        mobileBtn.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            const icon = mobileBtn.querySelector('i');
            if (mainNav.classList.contains('active')) {
                icon.classList.replace('fa-bars', 'fa-times');
                body.style.overflow = 'hidden';
            } else {
                icon.classList.replace('fa-times', 'fa-bars');
                body.style.overflow = '';
            }
        });
    }

    // 4. Initialize Hero Slider
    initHeroSlider();

    // 4.1 Initialize Typewriter Effect
    initTypewriter();

    // 4.2 Initialize Gallery Lightbox (Bug fix: was never called)
    initLightbox();

    // 4.3 Initialize Stats Counter
    initStatsCounter();

    // 5. Manual trigger for reveal animations on first load
    setTimeout(() => {
        const activeSection = document.querySelector('.spa-section.active');
        if (activeSection) {
            const animatedElements = activeSection.querySelectorAll('.reveal-up, .reveal-opacity, .reveal-right');
            animatedElements.forEach(el => {
                el.style.animation = 'none';
                el.offsetHeight; 
                el.style.animation = '';
            });
        }
    }, 1500);

});

// Prevent initStatsCounter from being called twice via second DOMContentLoaded
let statsInitialized = false;

/* --- Hero Slider Logic --- */
function initHeroSlider() {
    const slides = document.querySelectorAll('.slider-item');
    if (slides.length === 0) return;

    let currentSlide = 0;
    const slideInterval = 6000; // 6 seconds

    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }

    setInterval(nextSlide, slideInterval);
}




// 5. Loading Screen Fade Out (Robust implementation)
function removeLoader() {
    const loader = document.getElementById('loading-screen');
    setTimeout(() => {
        if (loader) {
            loader.classList.add('fade-out');
            document.body.classList.remove('loading');
            
            // Trigger das animações globais e números na página inicial
            showSection('home', null, true);
        }
    }, 2400); // 2.4s delay for premium Netflix cinematic intro
}

if (document.readyState === 'complete') {
    removeLoader();
} else {
    window.addEventListener('load', removeLoader);
}

/* ==========================================================================
   SPA Navigation & Interactive Functions
   ========================================================================== */
function showSection(sectionId, event, noScrollToTop = false) {
    if (event) event.preventDefault();
    
    document.querySelectorAll('.spa-section').forEach(sec => sec.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));

    const targetSection = document.getElementById(sectionId);
    if (targetSection) targetSection.classList.add('active');

    const links = document.querySelectorAll(`.nav-link[href="#${sectionId}"]`);
    links.forEach(link => link.classList.add('active'));

    if (!noScrollToTop) {
        window.scrollTo({ top: 0, behavior: 'auto' });
    }

    // 5. Close mobile menu if it is open
    const mainNav = document.getElementById('main-nav');
    if (mainNav && mainNav.classList.contains('active')) {
        mainNav.classList.remove('active');
        document.body.style.overflow = ''; // Unlock scroll
        const icon = document.querySelector('#mobile-menu-btn i');
        if (icon) icon.classList.replace('fa-times', 'fa-bars');
    }

    // 6. Toggle Mobile Sticky CTA visibility (MOBILE ONLY)
    const stickyCta = document.querySelector('.mobile-sticky-cta');
    if (stickyCta) {
        if (window.innerWidth <= 768 && sectionId !== 'agendamento' && sectionId !== 'home') {
            stickyCta.style.display = 'block';
        } else {
            stickyCta.style.display = 'none';
        }
    }

    // 7. Re-trigger counters and animations globally when any section opens
    if (targetSection) {
        const items = targetSection.querySelectorAll('.stat-item');
        if (items.length > 0) {
            items.forEach((item, idx) => {
                item.style.animation = 'none';
                item.offsetHeight; /* trigger reflow */
                item.style.animation = '';
                
                const num = item.querySelector('.stat-number');
                if (num) {
                    num.innerText = '0';
                    const target = +num.getAttribute('data-target');
                    const duration = 2000;
                    const startTime = performance.now();
                    
                    function update(currentTime) {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const currentCount = Math.floor(progress * target);
                        
                        // O sufixo é controlado pelo HTML (<span class="stat-suffix">), logo gerimos apenas o número
                        num.innerText = currentCount;
                        
                        if (progress < 1) {
                            requestAnimationFrame(update);
                        } else {
                            num.innerText = target;
                        }
                    }
                    requestAnimationFrame(update);
                }
            });
        }
    }

    // 8. Reinforce Reveal Animations
    if (targetSection) {
        const animatedElements = targetSection.querySelectorAll('.reveal-up, .reveal-opacity');
        animatedElements.forEach(el => {
            el.style.animation = 'none';
            el.offsetHeight; /* trigger reflow */
            el.style.animation = '';
        });
    }
}

let submitMethod = 'whatsapp';
function setSubmitMethod(method) { submitMethod = method; }

function handleFormSubmit(event) {
    event.preventDefault(); // Process data locally for both methods
    const form = event.target;
    
    const nome = document.getElementById('nome').value;
    const telefone = document.getElementById('telefone').value;
    const provincia = document.getElementById('localizacao').value;
    const cidade = document.getElementById('cidade').value;
    const servico = document.getElementById('servico').value;
    const dataInput = document.getElementById('data');
    const data = dataInput.value.trim();
    const hora = document.getElementById('hora').value;

    // --- DATA VALIDATION ---
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!dateRegex.test(data)) {
        showToast("Por favor, introduza uma data válida no formato DD/MM/AAAA.");
        dataInput.focus();
        return;
    }

    const partes = data.split('/');
    const diaVal = parseInt(partes[0], 10);
    const mesVal = parseInt(partes[1], 10);
    const anoVal = parseInt(partes[2], 10);

    if (diaVal < 1 || diaVal > 31 || mesVal < 1 || mesVal > 12 || anoVal < 2026) {
        showToast("Data inválida. Verifique o dia, mês e ano.");
        dataInput.focus();
        return;
    }
    // -----------------------

    if (submitMethod === 'whatsapp') {
        const message = `*NOVO AGENDAMENTO SITE*%0A%0A*Nome:* ${nome}%0A*Telefone:* ${telefone}%0A*Localização:* ${provincia} (${cidade})%0A*Serviço:* ${servico}%0A*Data:* ${data}%0A*Hora:* ${hora}`;
        window.open(`https://wa.me/258841151961?text=${message}`, '_blank').focus();
        showToast("Redirecionando para o WhatsApp...");
        form.reset();
    } else {
        // --- TRADITIONAL MAILTO METHOD ---
        const subject = encodeURIComponent("Solicitação de Orçamento - Renova Energy");
        const body = encodeURIComponent(`Olá Renova Energy,\n\nGostaria de solicitar um agendamento:\n\nNome: ${nome}\nTelefone: ${telefone}\nLocalização: ${provincia} (${cidade})\nServiço: ${servico}\nData: ${data}\nHora: ${hora}\n\nEnvio feito via Website.`);
        
        window.location.href = `mailto:renovaenergylda@gmail.com?subject=${subject}&body=${body}`;
        
        showToast("Abrindo o seu gestor de e-mail...");
        // Delay reset slightly to let the browser start the protocol handler
        setTimeout(() => form.reset(), 1000);
    }
}

function showToast(text) {
    const toast = document.querySelector('.toast');
    if (toast) {
        toast.querySelector('span').innerText = text;
        toast.classList.add('active');
        setTimeout(() => toast.classList.remove('active'), 5000);
    }
}

function abrirModalBlog(id) {
    const modal = document.getElementById('blog-modal');
    const item = blogContent[id];
    if (modal && item) {
        document.getElementById('modal-img').style.backgroundImage = item.image;
        document.getElementById('modal-category').innerText = item.category;
        document.getElementById('modal-title').innerText = item.title;
        document.getElementById('modal-text').innerHTML = item.text;
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function fecharModalBlog() {
    const modal = document.getElementById('blog-modal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

/* ==========================================================================
   Advanced Features (FAQ & Accordion)
   ========================================================================== */

/* ==========================================================================
   Gallery Lightbox Logic
   ========================================================================== */
function initLightbox() {
    const galleryItems = document.querySelectorAll('.g-item');
    const modal = document.getElementById('lightbox-modal');
    const modalImg = document.getElementById('lightbox-img');

    galleryItems.forEach(item => {
        const img = item.querySelector('.g-img');
        item.style.cursor = 'zoom-in';
        item.addEventListener('click', () => {
            modalImg.src = img.src;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
}

function closeLightbox() {
    const modal = document.getElementById('lightbox-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/* --- Typewriter Effect (Digitalização) --- */
function initTypewriter() {
    const textElement = document.querySelector('.typing-text');
    if (!textElement) return;

    const words = ["ECONOMIA", "EFICIÊNCIA", "AUTONOMIA", "SUSTENTABILIDADE"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 150;

    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            textElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 75;
        } else {
            textElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 150;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typeSpeed = 2000; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }

    type();
}

/* --- Accordion Toggle (Interatividade) --- */
function toggleAccordion(header) {
    const item = header.parentElement;
    const isActive = item.classList.contains('active');

    if (isActive) {
        item.classList.remove('active');
    } else {
        item.classList.add('active');
    }
}

/* --- Animated Stats Counter --- */
function initStatsCounter() {
    const counters = document.querySelectorAll('.stat-number');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                counters.forEach(counter => {
                    const target = +counter.getAttribute('data-target');
                    const duration = 2000;
                    const start = 0;
                    const startTime = performance.now();

                    function animate(currentTime) {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3);
                        counter.textContent = Math.floor(eased * target);
                        if (progress < 1) {
                            requestAnimationFrame(animate);
                        } else {
                            counter.textContent = target;
                        }
                    }
                    requestAnimationFrame(animate);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsBar = document.querySelector('.home-stats-bar');
    if (statsBar) observer.observe(statsBar);
}

// initStatsCounter is called from the main DOMContentLoaded block above.

/* --- Expandable Service Cards --- */
function toggleServiceCard(headEl) {
    const card = headEl.parentElement;
    const body = card.querySelector('.service-body');
    const isExpanded = card.classList.contains('expanded');
    
    // Close all other expanded cards (Accordion style UX)
    document.querySelectorAll('.expandable-service-card.expanded').forEach(otherCard => {
        if (otherCard !== card) {
            otherCard.classList.remove('expanded');
            const otherBody = otherCard.querySelector('.service-body');
            if (otherBody) otherBody.style.maxHeight = null;
        }
    });

    // Toggle current card
    if (isExpanded) {
        card.classList.remove('expanded');
        body.style.maxHeight = null;
    } else {
        card.classList.add('expanded');
        body.style.maxHeight = body.scrollHeight + "px";
    }
}

/* --- Navigate to Specific Service --- */
function goToService(serviceId, event) {
    if (event) event.preventDefault();
    
    // Show the services section, but prevent the default scroll-to-top
    showSection('servicos', null, true);
    
    // Short wait for section transition, then scroll directly to the service card
    setTimeout(() => {
        const target = document.getElementById(serviceId);
        if (target) {
            // Scroll to the card
            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Add highlight animation
            target.classList.add('service-highlight');
            
            // Auto open the card so the user can read it perfectly
            const headEl = target.querySelector('.service-head');
            if (headEl && !target.classList.contains('expanded')) {
                toggleServiceCard(headEl);
            }
            
            // Remove highlight after animation
            setTimeout(() => {
                target.classList.remove('service-highlight');
            }, 2500);
        }
    }, 100);
}

// --- MÁSCARA DE DATA (Dia/Mês/Ano) ---
document.addEventListener('DOMContentLoaded', () => {
    const dataInput = document.getElementById('data');
    if (dataInput) {
        dataInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, ""); // Remove não-dígitos
            if (value.length > 8) value = value.slice(0, 8);
            
            // Insere as barras
            if (value.length > 4) {
                value = value.replace(/^(\d{2})(\d{2})(\d{0,4})/, "$1/$2/$3");
            } else if (value.length > 2) {
                value = value.replace(/^(\d{2})(\d{0,2})/, "$1/$2");
            }
            
            e.target.value = value;
        });
    }
});

/* --- Cookie Consent Function --- */
function acceptCookies() {
    localStorage.setItem('cookieConsent', 'true');
    const cookieBanner = document.getElementById('cookie-banner');
    if (cookieBanner) {
        cookieBanner.classList.remove('show');
    }
}

/* --- Multilingual System --- */
function initLanguage() {
    let lang = localStorage.getItem('lang');
    if (!lang) lang = 'pt'; // Default is PT
    setLanguage(lang);
}

function setLanguage(lang) {
    if (typeof translations === 'undefined') return;
    
    const dic = translations[lang];
    if (!dic) return;
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dic[key]) {
            // Se for placeholder
            if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
                el.setAttribute('placeholder', dic[key]);
            } else {
                el.innerHTML = dic[key];
            }
        }
    });

    localStorage.setItem('lang', lang);

    // Update active state of language buttons
    const langBtns = document.querySelectorAll('.lang-btn');
    langBtns.forEach(btn => {
        if (btn.dataset.lang === lang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

