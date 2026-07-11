/* ==========================================================================
   Renova Energy LDA - Main Scripts (Premium Version - PT)
   ========================================================================== */

/* --- Blog Content (Multilingue) --- */
const blogContent = {
    pt: {
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
    },
    en: {
        '1': {
            category: 'Solar Tips',
            title: '3 Common Myths about Solar Panels in Nampula',
            image: 'url(\'imagens/image-16.jpg\')',
            text: `
                <p><strong>Myth 1: Solar panels do not work in winter.</strong> In fact, they rely on light, not heat. Mozambique has excellent solar radiation all year round.</p>
                <p><strong>Myth 2: Maintenance is extremely expensive.</strong> False. Basic maintenance consists of cleaning and visual inspection, with a very low cost compared to the savings generated.</p>
                <p><strong>Myth 3: I need batteries for everything.</strong> In On-Grid systems, you can use the EDM network as a "virtual battery", drastically reducing the initial investment.</p>
            `
        },
        '2': {
            category: 'Financial Market',
            title: 'Economic Impact: Quick Return on Investment',
            image: 'url(\'imagens/image-19.jpg\')',
            text: `
                <p>Investing in renewable energy with Renova Energy guarantees an ROI of 2 to 5 years. With rising electricity tariffs, producing your own energy is the best sustainable financial asset.</p>
                <p>Our Turnkey projects include everything: from licensing to installation, maximizing every metical invested.</p>
            `
        },
        '3': {
            category: 'Technology',
            title: 'The Sustainable Revolution in the Off-Grid Industry',
            image: 'url(\'imagens/image-26.jpg\')',
            text: `
                <p>The mining and agricultural industry in Mozambique is moving to Off-Grid. We use high-frequency inverters and LiFePO4 lithium batteries to guarantee 24/7 energy in remote locations.</p>
                <p>Renova Energy leads the implementation of these robust solutions with remote monitoring via Wi-Fi/4G.</p>
            `
        }
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

    // --- Date Initialization (Tomorrow's Date as Default) ---
    resetDefaultDate();

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

    // 4.4 Initialize Interactive Map
    initInteractiveMap();

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
    }, 1200); // 1.2s delay for corporate institutional loader
}

if (document.readyState === 'interactive' || document.readyState === 'complete') {
    removeLoader();
} else {
    document.addEventListener('DOMContentLoaded', removeLoader);
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

    // Marca a home como ativa: só aí o cabeçalho transparente mostra texto claro sobre a hero
    document.body.classList.toggle('home-active', sectionId === 'home');

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

    let displayDate = data;
    let diaVal, mesVal, anoVal;
    let isValid = false;

    // Check if YYYY-MM-DD format (mobile native picker)
    if (/^\d{4}-\d{2}-\d{2}$/.test(data)) {
        const partes = data.split('-');
        anoVal = parseInt(partes[0], 10);
        mesVal = parseInt(partes[1], 10);
        diaVal = parseInt(partes[2], 10);
        isValid = true;
        displayDate = `${String(diaVal).padStart(2, '0')}/${String(mesVal).padStart(2, '0')}/${anoVal}`;
    } 
    // Check if DD/MM/YYYY format (desktop text mask)
    else if (/^\d{2}\/\d{2}\/\d{4}$/.test(data)) {
        const partes = data.split('/');
        diaVal = parseInt(partes[0], 10);
        mesVal = parseInt(partes[1], 10);
        anoVal = parseInt(partes[2], 10);
        isValid = true;
    }

    const lang = localStorage.getItem('lang') || 'pt';

    // --- DATA VALIDATION ---
    if (!isValid) {
        const msg = (translations[lang] && translations[lang]['toast_invalid_format']) || "Por favor, introduza uma data válida no formato DD/MM/AAAA.";
        showToast(msg);
        dataInput.focus();
        return;
    }

    if (diaVal < 1 || diaVal > 31 || mesVal < 1 || mesVal > 12 || anoVal < 2026) {
        const msg = (translations[lang] && translations[lang]['toast_bad_date']) || "Data inválida. Verifique o dia, mês e ano.";
        showToast(msg);
        dataInput.focus();
        return;
    }
    // -----------------------

    if (submitMethod === 'whatsapp') {
        const message = `*NOVO AGENDAMENTO SITE*%0A%0A*Nome:* ${nome}%0A*Telefone:* ${telefone}%0A*Localização:* ${provincia} (${cidade})%0A*Serviço:* ${servico}%0A*Data:* ${displayDate}%0A*Hora:* ${hora}`;
        window.open(`https://wa.me/258841151961?text=${message}`, '_blank').focus();
        const msg = (translations[lang] && translations[lang]['toast_redirect_wa']) || "Redirecionando para o WhatsApp...";
        showToast(msg);
        form.reset();
        resetDefaultDate();
    } else {
        // --- TRADITIONAL MAILTO METHOD ---
        const subject = encodeURIComponent("Solicitação de Orçamento - Renova Energy");
        const body = encodeURIComponent(`Olá Renova Energy,\n\nGostaria de solicitar um agendamento:\n\nNome: ${nome}\nTelefone: ${telefone}\nLocalização: ${provincia} (${cidade})\nServiço: ${servico}\nData: ${displayDate}\nHora: ${hora}\n\nEnvio feito via Website.`);
        
        window.location.href = `mailto:renovaenergylda@gmail.com?subject=${subject}&body=${body}`;
        
        const msg = (translations[lang] && translations[lang]['toast_redirect_mail']) || "Abrindo o seu gestor de e-mail...";
        showToast(msg);
        // Delay reset slightly to let the browser start the protocol handler
        setTimeout(() => {
            form.reset();
            resetDefaultDate();
        }, 1000);
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
    const lang = localStorage.getItem('lang') || 'pt';
    const item = blogContent[lang] ? blogContent[lang][id] : null;
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

    let typewriterLang = localStorage.getItem('lang') || 'pt';
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 150;

    function type() {
        const lang = localStorage.getItem('lang') || 'pt';
        if (lang !== typewriterLang) {
            typewriterLang = lang;
            wordIndex = 0;
            charIndex = 0;
            isDeleting = false;
        }

        const wordsStr = (typeof translations !== 'undefined' && translations[lang] && translations[lang]['typewriter_words']) || "ECONOMIA,EFICIÊNCIA,AUTONOMIA,SUSTENTABILIDADE";
        const words = wordsStr.split(',');
        
        if (wordIndex >= words.length) {
            wordIndex = 0;
        }
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
            if (e.target.type === 'date') return;
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

function toggleLanguage() {
    const currentLang = localStorage.getItem('lang') || 'pt';
    const nextLang = currentLang === 'pt' ? 'en' : 'pt';
    setLanguage(nextLang);
}

function setLanguage(lang) {
    if (typeof translations === 'undefined') return;
    
    const dic = translations[lang];
    if (!dic) return;
    
    // Atualiza a linguagem no HTML para SEO e acessibilidade
    document.documentElement.lang = lang === 'pt' ? 'pt-PT' : 'en';
    
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

    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        if (dic[key]) {
            el.setAttribute('title', dic[key]);
        }
    });

    localStorage.setItem('lang', lang);

    // Atualiza o texto do botão único de idioma
    document.querySelectorAll('.lang-btn-label').forEach(el => {
        el.innerText = lang.toUpperCase();
    });

    // Mantém compatibilidade com botões normais se existirem
    const langBtns = document.querySelectorAll('.lang-btn');
    langBtns.forEach(btn => {
        if (btn.dataset.lang) {
            if (btn.dataset.lang === lang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        }
    });

    if (window.updateMapInfo) {
        window.updateMapInfo(lang);
    }
}

function resetDefaultDate() {
    const dataInput = document.getElementById('data');
    if (dataInput) {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || (window.innerWidth <= 768);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const yyyy = tomorrow.getFullYear();
        const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const dd = String(tomorrow.getDate()).padStart(2, '0');
        
        if (isMobile) {
            dataInput.type = 'date';
            dataInput.value = `${yyyy}-${mm}-${dd}`;
        } else {
            dataInput.type = 'text';
            dataInput.value = `${dd}/${mm}/${yyyy}`;
        }
    }
}

/* ==========================================================================
   Interactive SVG Mozambique Map
   ========================================================================== */
const mapDetailsPT = {
    'Cabo Delgado': { projects: '8 Projetos Concluídos', details: 'Sistemas solares residenciais isolados (Off-Grid) e manutenção de redes elétricas secundárias.' },
    'Niassa': { projects: '12 Projetos Concluídos', details: 'Projetos de regadio solar agrícola com bombas fotovoltaicas de alto rendimento para horticultura.' },
    'Nampula': { projects: '45 Projetos Concluídos', details: 'Sede central da Renova Energy. Matriz operacional com suporte técnico 24/7 e montagem em tempo recorde de no máximo 3 dias.' },
    'Zambézia': { projects: '15 Projetos Concluídos', details: 'Instalação de painéis solares comerciais e eletrificação estruturada de edifícios comerciais.' },
    'Tete': { projects: '7 Projetos Concluídos', details: 'Dimensionamento e fornecimento de bancos de baterias de lítio industriais e inversores híbridos.' },
    'Manica': { projects: '6 Projetos Concluídos', details: 'Consultoria em eficiência energética e auditorias técnicas para sistemas de bombagem solar.' },
    'Sofala': { projects: '11 Projetos Concluídos', details: 'Eletrificação predial e montagem de centrais solares de backup para empresas no corredor da Beira.' },
    'Inhambane': { projects: '9 Projetos Concluídos', details: 'Instalação de sistemas solares híbridos com monitorização remota Wi-Fi/4G para o setor de turismo.' },
    'Gaza': { projects: '5 Projetos Concluídos', details: 'Micro-redes solares comunitárias para fornecimento de energia limpa e iluminação pública sustentável.' },
    'Maputo': { projects: '22 Projetos Concluídos', details: 'Escritório comercial. Elaboração de estudos de viabilidade financeira e ROI de grandes centrais solares.' }
};

const mapDetailsEN = {
    'Cabo Delgado': { projects: '8 Projects Completed', details: 'Isolated residential solar systems (Off-Grid) and maintenance of secondary electrical grids.' },
    'Niassa': { projects: '12 Projects Completed', details: 'Solar agricultural irrigation projects with high-performance PV pumps for horticulture.' },
    'Nampula': { projects: '45 Projects Completed', details: 'Headquarters of Renova Energy. Operational hub with 24/7 technical support and record installation time (max 3 days).' },
    'Zambézia': { projects: '15 Projects Completed', details: 'Commercial solar panel installation and structured electrification of commercial buildings.' },
    'Tete': { projects: '7 Projects Completed', details: 'Dimensioning and supply of industrial lithium battery banks and hybrid inverters.' },
    'Manica': { projects: '6 Projects Completed', details: 'Energy efficiency consulting and technical audits for solar pumping systems.' },
    'Sofala': { projects: '11 Projects Completed', details: 'Building electrification and assembly of backup solar power stations for companies in the Beira corridor.' },
    'Inhambane': { projects: '9 Projects Completed', details: 'Installation of hybrid solar systems with Wi-Fi/4G remote monitoring for the tourism sector.' },
    'Gaza': { projects: '5 Projects Completed', details: 'Community solar microgrids for supplying clean energy and sustainable public street lighting.' },
    'Maputo': { projects: '22 Projects Completed', details: 'Commercial office. Preparation of financial viability and ROI studies for large solar power stations.' }
};

window.updateMapInfo = function(lang) {
    const activeProv = document.querySelector('.map-province.active-province');
    if (!activeProv) return;
    
    const name = activeProv.getAttribute('data-name');
    const detailsSource = lang === 'en' ? mapDetailsEN : mapDetailsPT;
    const info = detailsSource[name];
    
    const infoTitle = document.getElementById('map-info-title');
    const infoDesc = document.getElementById('map-info-desc');
    
    if (info && infoTitle && infoDesc) {
        infoTitle.innerHTML = `${name} &mdash; ${info.projects}`;
        infoDesc.innerHTML = info.details;
    }
};

function initInteractiveMap() {
    const provinces = document.querySelectorAll('.map-province');
    const tooltip = document.getElementById('map-tooltip');
    const infoBox = document.getElementById('map-info-box');

    if (provinces.length === 0) return;

    provinces.forEach(prov => {
        prov.addEventListener('mouseenter', (e) => {
            const name = prov.getAttribute('data-name');
            if (tooltip) {
                tooltip.textContent = name;
                tooltip.style.opacity = '1';
            }
        });

        prov.addEventListener('mousemove', (e) => {
            if (tooltip) {
                tooltip.style.left = (e.clientX + 15) + 'px';
                tooltip.style.top = (e.clientY + 15) + 'px';
                tooltip.style.position = 'fixed';
            }
        });

        prov.addEventListener('mouseleave', () => {
            if (tooltip) tooltip.style.opacity = '0';
        });

        prov.addEventListener('click', () => {
            provinces.forEach(p => p.classList.remove('active-province'));
            prov.classList.add('active-province');

            const lang = localStorage.getItem('lang') || 'pt';
            window.updateMapInfo(lang);
            
            if (infoBox) {
                infoBox.style.opacity = '0';
                infoBox.style.transform = 'translateY(10px)';
                setTimeout(() => {
                    infoBox.style.transition = 'all 0.3s ease';
                    infoBox.style.opacity = '1';
                    infoBox.style.transform = 'translateY(0)';
                }, 50);
            }
        });
    });

    const lang = localStorage.getItem('lang') || 'pt';
    window.updateMapInfo(lang);
}

