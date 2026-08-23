/* ==========================================================================
   Renova Energy, Lda — Main
   ========================================================================== */

'use strict';

const PARTNER_COUNT = 45;
const SLIDE_INTERVAL = 6000;

/* Analytics. Ambos os campos vazios = nenhum pedido a terceiros sai do site.
   - cloudflareToken: Cloudflare > Analytics > Web Analytics. Nao usa cookies,
     nao precisa de consentimento e ja esta no mesmo painel do alojamento.
   - ga4Id: alternativa Google Analytics 4 ("G-XXXXXXXXXX"). Usa cookies, por
     isso so arranca depois de o visitante aceitar o aviso. */
const ANALYTICS = {
    cloudflareToken: '',
    ga4Id: ''
};

/* Secções antigas continuam a funcionar: houve links partilhados, o sitemap e
   a 404 apontavam para #galeria, #sobre, #numeros. Redirecionamos em vez de
   deixar cair num ecrã em branco. */
const SECTION_ALIASES = {
    sobre: 'empresa',
    blog: 'empresa',
    galeria: 'projetos',
    numeros: 'projetos',
    areas: 'projetos',
    parceiros: 'home',
    contacto: 'agendamento',
    inicio: 'home'
};

const VALID_SECTIONS = ['home', 'servicos', 'projetos', 'empresa', 'agendamento'];

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* --------------------------------------------------------------------------
   Conteúdo das notas técnicas
   -------------------------------------------------------------------------- */
const blogContent = {
    pt: {
        '1': {
            category: 'Solar',
            title: 'Três coisas que lhe disseram sobre painéis e não são verdade',
            image: "url('imagens/image-16.jpg')",
            text: `
                <p><strong>"Não funcionam no inverno."</strong> Os painéis vivem de luz, não de calor. Em Moçambique a radiação é boa o ano inteiro; o que muda entre julho e dezembro é a duração do dia, e isso já está no dimensionamento.</p>
                <p><strong>"A manutenção é cara."</strong> A manutenção corrente é lavar o vidro e inspecionar as ligações. Custa uma fração do que o sistema poupa. O que fica caro é não fazer nada durante cinco anos.</p>
                <p><strong>"Preciso de baterias para tudo."</strong> Num sistema On-Grid, a rede da EDM funciona como reserva. Se o objetivo for baixar a fatura e não houver cortes frequentes, as baterias são dinheiro parado.</p>
            `
        },
        '2': {
            category: 'Contas',
            title: 'Ao fim de quanto tempo é que o sistema se paga',
            image: "url('imagens/image-19.jpg')",
            text: `
                <p>Para uma instalação residencial ou comercial dimensionada com base no consumo real, o retorno costuma cair entre os dois e os cinco anos. A diferença dentro desse intervalo depende quase toda de uma coisa: quanto do consumo acontece de dia.</p>
                <p>Quem trabalha das 08:00 às 18:00 — lojas, oficinas, escritórios, bombas de rega — aproveita quase toda a produção no momento em que ela existe e chega ao fim do intervalo mais cedo. Uma casa onde o consumo é sobretudo à noite precisa de armazenamento, e o armazenamento empurra o retorno para a frente.</p>
                <p>Por isso pedimos as faturas antes de dar um número. Um retorno prometido sem olhar para o consumo é um número inventado.</p>
            `
        },
        '3': {
            category: 'Off-Grid',
            title: 'Energia onde a rede não chega',
            image: "url('imagens/image-26.jpg')",
            text: `
                <p>Sem EDM não há rede de segurança: se o dimensionamento falhar, a luz apaga-se. É essa a diferença toda entre um sistema off-grid e um sistema ligado à rede.</p>
                <p>Na prática significa contar com os dias de céu fechado, com o arranque dos motores e com o consumo que ninguém declarou na primeira conversa. Trabalhamos com inversores de alta frequência e baterias LiFePO4, que aguentam ciclos diários durante anos, e deixamos margem no banco de baterias em vez de a cortar para baixar o orçamento.</p>
                <p>Nas machambas e nas unidades mais afastadas instalamos monitorização por Wi-Fi ou 4G — para vermos o problema antes de o cliente ficar sem água.</p>
            `
        }
    },
    en: {
        '1': {
            category: 'Solar',
            title: 'Three things you were told about panels that are not true',
            image: "url('imagens/image-16.jpg')",
            text: `
                <p><strong>"They do not work in winter."</strong> Panels run on light, not heat. Mozambique has good radiation all year; what changes between July and December is day length, and that is already in the sizing.</p>
                <p><strong>"Maintenance is expensive."</strong> Routine maintenance is washing the glass and inspecting the connections. It costs a fraction of what the system saves. What gets expensive is doing nothing for five years.</p>
                <p><strong>"I need batteries for everything."</strong> On an on-grid system the EDM network acts as the reserve. If the goal is a lower bill and cuts are not frequent, batteries are money standing still.</p>
            `
        },
        '2': {
            category: 'Numbers',
            title: 'How long before the system pays for itself',
            image: "url('imagens/image-19.jpg')",
            text: `
                <p>For a residential or commercial installation sized on real consumption, payback usually lands between two and five years. Where you fall inside that range depends almost entirely on one thing: how much of your consumption happens during daylight.</p>
                <p>Anyone working 08:00 to 18:00 — shops, workshops, offices, irrigation pumps — uses nearly all the output at the moment it exists, and reaches payback sooner. A house that consumes mostly at night needs storage, and storage pushes payback further out.</p>
                <p>That is why we ask for the bills before quoting a figure. A payback promised without looking at consumption is an invented number.</p>
            `
        },
        '3': {
            category: 'Off-grid',
            title: 'Power where the grid does not reach',
            image: "url('imagens/image-26.jpg')",
            text: `
                <p>With no EDM there is no safety net: if the sizing is wrong, the lights go out. That is the whole difference between an off-grid system and a grid-tied one.</p>
                <p>In practice that means allowing for overcast days, for motor starting currents, and for the load nobody mentioned in the first conversation. We use high-frequency inverters and LiFePO4 batteries, which take daily cycling for years, and we leave headroom in the battery bank instead of trimming it to lower the quote.</p>
                <p>On farms and remote sites we install Wi-Fi or 4G monitoring — so we see the problem before the client runs out of water.</p>
            `
        }
    }
};

/* ==========================================================================
   Arranque
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initLanguage();
    initMobileMenu();
    initHeaderScroll();
    aplicarTotalInstalacoes();
    initPartners();
    initHeroSlider();
    initReveals();
    initStatsObserver();
    initLightbox();
    initInteractiveMap();
    initDateMask();
    initModalDismissal();
    initCookieBanner();
    initDelegation();
    initAnalytics();
    resetDefaultDate();

    // O browser tenta repor o scroll da visita anterior, o que numa SPA de
    // secções deixa o visitante a meio de um bloco que nem estava aberto.
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

    // A rota só pode ser aplicada depois de as secções existirem no DOM.
    applyRoute(location.hash, { scroll: true });
    window.addEventListener('hashchange', () => applyRoute(location.hash, { scroll: false }));
});

window.addEventListener('load', removeLoader);
// Rede de segurança: se um recurso ficar pendurado, o ecrã de arranque sai à mesma.
setTimeout(removeLoader, 4000);

let loaderRemoved = false;
function removeLoader() {
    if (loaderRemoved) return;
    loaderRemoved = true;
    const loader = document.getElementById('loading-screen');
    if (loader) loader.classList.add('fade-out');
    document.body.classList.remove('loading');

    // O Chrome repõe o scroll depois do 'load', ignorando o scrollRestoration
    // pedido em DOMContentLoaded. Só aqui é que o pedido pega de facto.
    window.scrollTo(0, 0);
    revealVisible();
}

/* ==========================================================================
   Tema
   ========================================================================== */
function initTheme() {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (saved === 'dark' || (!saved && prefersDark)) document.body.classList.add('dark-theme');

    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;
    toggle.addEventListener('click', () => {
        const dark = document.body.classList.toggle('dark-theme');
        localStorage.setItem('theme', dark ? 'dark' : 'light');
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute('content', dark ? '#00101f' : '#001b48');
    });
}

/* ==========================================================================
   Cabeçalho e menu
   ========================================================================== */
function initHeaderScroll() {
    const header = document.getElementById('header');
    if (!header) return;
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

function initMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const nav = document.getElementById('main-nav');
    if (!btn || !nav) return;

    btn.addEventListener('click', () => setMenu(!nav.classList.contains('active')));
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.classList.contains('active')) setMenu(false);
    });
}

function setMenu(open) {
    const btn = document.getElementById('mobile-menu-btn');
    const nav = document.getElementById('main-nav');
    if (!btn || !nav) return;
    nav.classList.toggle('active', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    document.body.style.overflow = open ? 'hidden' : '';
}

/* ==========================================================================
   Navegação entre secções
   ========================================================================== */
function applyRoute(hash, opts = {}) {
    const id = (hash || '').replace('#', '');
    const target = SECTION_ALIASES[id] || id;
    showSection(VALID_SECTIONS.includes(target) ? target : 'home', null, !opts.scroll);
}

function showSection(sectionId, event, noScrollToTop = false) {
    if (event) event.preventDefault();

    const resolved = SECTION_ALIASES[sectionId] || sectionId;
    const target = document.getElementById(resolved);
    if (!target) return;

    document.querySelectorAll('.spa-section').forEach(s => s.classList.remove('active'));
    target.classList.add('active');

    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    document.querySelectorAll(`.nav-link[href="#${resolved}"]`).forEach(l => l.classList.add('active'));

    document.body.classList.toggle('home-active', resolved === 'home');

    if (history.replaceState) history.replaceState(null, '', '#' + resolved);

    setMenu(false);
    if (!noScrollToTop) window.scrollTo({ top: 0, behavior: 'auto' });

    // Contadores e revelações da secção que acabou de entrar em cena.
    resetCounters(target);
    revealVisible();
    updateStickyCta(resolved);
    if (resolved === 'agendamento') loadMap();
}

/* O mapa do Google só é pedido quando alguém abre o Contacto: poupa o pedido a
   terceiros na primeira visita e tira ~1 s do carregamento inicial. */
function loadMap() {
    const frame = document.getElementById('google-map');
    if (!frame || frame.src) return;
    frame.src = frame.getAttribute('data-src');
}

function updateStickyCta(sectionId) {
    const cta = document.querySelector('.mobile-sticky-cta');
    if (!cta) return;
    const show = window.innerWidth <= 768 && sectionId !== 'agendamento' && sectionId !== 'home';
    cta.style.display = show ? 'block' : 'none';
}

function goToService(serviceId, event) {
    if (event) event.preventDefault();
    showSection('servicos', null, true);

    // Espera um frame para a secção existir no layout antes de medir a posição.
    requestAnimationFrame(() => {
        const card = document.getElementById(serviceId);
        if (!card) return;
        card.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'center' });
        if (!card.classList.contains('expanded')) {
            toggleServiceCard(card.querySelector('.service-head'));
        }
        card.classList.add('service-highlight');
        setTimeout(() => card.classList.remove('service-highlight'), 2000);
    });
}

/* ==========================================================================
   Hero
   ========================================================================== */
function initHeroSlider() {
    const slides = Array.from(document.querySelectorAll('.slider-item'));
    const ticks = document.getElementById('hero-ticks');
    const capN = document.getElementById('hero-shot-n');
    const capT = document.getElementById('hero-shot-cap');
    if (slides.length === 0) return;

    if (ticks) {
        ticks.innerHTML = slides
            .map((_, i) => `<span class="hero-tick${i === 0 ? ' on' : ''}"></span>`)
            .join('');
    }

    let current = 0;
    const paint = () => {
        slides.forEach((s, i) => s.classList.toggle('active', i === current));
        if (ticks) {
            Array.from(ticks.children).forEach((t, i) => t.classList.toggle('on', i === current));
        }
        if (capN) capN.textContent = `${String(current + 1).padStart(2, '0')}/${String(slides.length).padStart(2, '0')}`;
        if (capT) {
            const key = 'shot_' + (current + 1);
            capT.setAttribute('data-i18n', key);
            capT.innerHTML = t(key, capT.innerHTML);
        }
    };

    paint();
    setInterval(() => { current = (current + 1) % slides.length; paint(); }, SLIDE_INTERVAL);
}

/* ==========================================================================
   Marcas — a pasta tem 45 ficheiros numerados; gerar evita 90 linhas de HTML
   ========================================================================== */
function initPartners() {
    const track = document.getElementById('partners-track');
    if (!track) return;

    const cards = [];
    for (let i = 0; i < PARTNER_COUNT; i++) {
        const base = `imagens/parceiros/IMG-20260701-WA${String(i).padStart(4, '0')}`;
        cards.push(
            `<div class="partner-logo-card"><picture>` +
            `<source srcset="${base}.webp" type="image/webp">` +
            `<img src="${base}.jpg" alt="" class="partner-logo-img" loading="lazy" decoding="async" width="420" height="420">` +
            `</picture></div>`
        );
    }
    // Duplicado: a animação desloca -50%, logo a segunda metade entra sem salto.
    track.innerHTML = cards.join('') + cards.join('');
}

/* ==========================================================================
   Revelações
   ========================================================================== */
let revealObserver = null;

function initReveals() {
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
        document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('is-in'));
        return;
    }
    revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-in');
            revealObserver.unobserve(entry.target);
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));
}

// Ao trocar de secção há elementos já dentro do ecrã que o observer não volta a
// visitar — este empurrão resolve isso sem duplicar observers.
function revealVisible() {
    if (!revealObserver) return;
    document.querySelectorAll('.spa-section.active [data-reveal]:not(.is-in)').forEach(el => {
        revealObserver.unobserve(el);
        revealObserver.observe(el);
    });
}

/* ==========================================================================
   Contadores
   ========================================================================== */
function countUp(el) {
    const target = Number(el.getAttribute('data-target')) || 0;
    if (prefersReducedMotion) { el.textContent = String(target); return; }

    const duration = 1600;
    const start = performance.now();
    const step = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = String(Math.floor(eased * target));
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = String(target);
    };
    requestAnimationFrame(step);
}

function resetCounters(scope) {
    scope.querySelectorAll('.stat-number').forEach(n => { n.textContent = '0'; n.dataset.counted = ''; });
}

function initStatsObserver() {
    const groups = document.querySelectorAll('.spec');
    if (!groups.length) return;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
        document.querySelectorAll('.stat-number').forEach(countUp);
        return;
    }

    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.querySelectorAll('.stat-number').forEach(n => {
                if (n.dataset.counted === 'yes') return;
                n.dataset.counted = 'yes';
                countUp(n);
            });
        });
    }, { threshold: 0.35 });

    groups.forEach(g => obs.observe(g));
}

/* ==========================================================================
   Acordeão e cartões de serviço
   ========================================================================== */
function toggleAccordion(header) {
    const item = header.parentElement;
    const open = item.classList.toggle('active');
    header.setAttribute('aria-expanded', String(open));
}

function toggleServiceCard(headEl) {
    if (!headEl) return;
    const card = headEl.parentElement;
    const body = card.querySelector('.service-body');
    const isExpanded = card.classList.contains('expanded');

    document.querySelectorAll('.expandable-service-card.expanded').forEach(other => {
        if (other === card) return;
        other.classList.remove('expanded');
        const b = other.querySelector('.service-body');
        if (b) b.style.maxHeight = null;
    });

    if (isExpanded) {
        card.classList.remove('expanded');
        body.style.maxHeight = null;
    } else {
        card.classList.add('expanded');
        body.style.maxHeight = body.scrollHeight + 'px';
    }
}

/* ==========================================================================
   Galeria e modais
   ========================================================================== */
function initLightbox() {
    const modal = document.getElementById('lightbox-modal');
    const modalImg = document.getElementById('lightbox-img');
    if (!modal || !modalImg) return;

    document.querySelectorAll('.g-item').forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('.g-img');
            if (!img) return;
            modalImg.src = img.src;
            modalImg.alt = img.alt;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
}

function closeLightbox() {
    const modal = document.getElementById('lightbox-modal');
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = '';
}

function abrirModalBlog(id) {
    const modal = document.getElementById('blog-modal');
    const lang = localStorage.getItem('lang') || 'pt';
    const item = (blogContent[lang] || blogContent.pt)[String(id)];
    if (!modal || !item) return;

    document.getElementById('modal-img').style.backgroundImage = item.image;
    document.getElementById('modal-category').textContent = item.category;
    document.getElementById('modal-title').textContent = item.title;
    document.getElementById('modal-text').innerHTML = item.text;
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function fecharModalBlog() {
    const modal = document.getElementById('blog-modal');
    if (modal) modal.classList.remove('show');
    document.body.style.overflow = '';
}

function initModalDismissal() {
    // Clicar fora fecha; Esc fecha. Os dois modais partilham o mesmo gesto.
    const blog = document.getElementById('blog-modal');
    const light = document.getElementById('lightbox-modal');

    if (blog) blog.addEventListener('click', (e) => { if (e.target === blog) fecharModalBlog(); });
    if (light) light.addEventListener('click', (e) => { if (e.target === light) closeLightbox(); });

    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        fecharModalBlog();
        closeLightbox();
    });
}

/* ==========================================================================
   Formulário
   ========================================================================== */
let submitMethod = 'whatsapp';
function setSubmitMethod(method) { submitMethod = method; }

function handleFormSubmit(event) {
    event.preventDefault();
    const form = event.target;

    const nome = document.getElementById('nome').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const provincia = document.getElementById('localizacao').value;
    const cidade = document.getElementById('cidade').value.trim();
    const servico = document.getElementById('servico').value;
    const dataInput = document.getElementById('data');
    const data = dataInput.value.trim();
    const hora = document.getElementById('hora').value;

    if (!nome || !telefone || !provincia || !cidade || !servico || !hora) {
        showToast(t('toast_required', 'Faltam campos por preencher.'));
        return;
    }

    const parsed = parseDate(data);
    if (!parsed) {
        showToast(t('toast_invalid_format', 'Escreva a data no formato DD/MM/AAAA.'));
        dataInput.focus();
        return;
    }
    if (!parsed.valid) {
        showToast(t('toast_bad_date', 'Data inválida. Verifique o dia, o mês e o ano.'));
        dataInput.focus();
        return;
    }

    const linhas = [
        `Nome: ${nome}`,
        `Telefone: ${telefone}`,
        `Localização: ${provincia} (${cidade})`,
        `Serviço: ${servico}`,
        `Data: ${parsed.display}`,
        `Hora: ${hora}`
    ];

    if (submitMethod === 'whatsapp') {
        const msg = encodeURIComponent('*PEDIDO DE ORÇAMENTO — SITE*\n\n' + linhas.join('\n'));
        window.open(`https://wa.me/258841151961?text=${msg}`, '_blank', 'noopener');
        trackEvent('gerar_lead', { method: 'whatsapp', servico });
        showToast(t('toast_redirect_wa', 'A abrir o WhatsApp…'));
        form.reset();
        resetDefaultDate();
    } else {
        const subject = encodeURIComponent('Pedido de orçamento — Renova Energy');
        const body = encodeURIComponent('Olá Renova Energy,\n\nGostaria de pedir um orçamento:\n\n' + linhas.join('\n') + '\n\nEnviado pelo site.');
        window.location.href = `mailto:renovaenergylda@gmail.com?subject=${subject}&body=${body}`;
        trackEvent('gerar_lead', { method: 'email', servico });
        showToast(t('toast_redirect_mail', 'A abrir o seu gestor de e-mail…'));
        setTimeout(() => { form.reset(); resetDefaultDate(); }, 1000);
    }
}

/* Aceita o formato nativo do telemóvel (AAAA-MM-DD) e o da máscara (DD/MM/AAAA). */
function parseDate(value) {
    let d, m, y;
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        [y, m, d] = value.split('-').map(Number);
    } else if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
        [d, m, y] = value.split('/').map(Number);
    } else {
        return null;
    }

    // Round-trip pelo Date apanha 31/02 e afins, que a validação por intervalos deixava passar.
    const dt = new Date(y, m - 1, d);
    const valid = dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d && y >= new Date().getFullYear();

    return { valid, display: `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y}` };
}

function initDateMask() {
    const input = document.getElementById('data');
    if (!input) return;
    input.addEventListener('input', (e) => {
        if (e.target.type === 'date') return;
        let v = e.target.value.replace(/\D/g, '').slice(0, 8);
        if (v.length > 4) v = v.replace(/^(\d{2})(\d{2})(\d{0,4})/, '$1/$2/$3');
        else if (v.length > 2) v = v.replace(/^(\d{2})(\d{0,2})/, '$1/$2');
        e.target.value = v;
    });
}

function resetDefaultDate() {
    const input = document.getElementById('data');
    if (!input) return;

    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');

    if (isTouch) {
        input.type = 'date';
        input.value = `${yyyy}-${mm}-${dd}`;
    } else {
        input.type = 'text';
        input.value = `${dd}/${mm}/${yyyy}`;
    }
}

function showToast(text) {
    const toast = document.querySelector('.toast');
    if (!toast) return;
    toast.querySelector('span').textContent = text;
    toast.classList.add('active');
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => toast.classList.remove('active'), 4500);
}

/* ==========================================================================
   Cookies
   ========================================================================== */
function initCookieBanner() {
    if (localStorage.getItem('cookieConsent')) return;
    const banner = document.getElementById('cookie-banner');
    if (banner) setTimeout(() => banner.classList.add('show'), 2500);
}

function acceptCookies() {
    localStorage.setItem('cookieConsent', 'true');
    const banner = document.getElementById('cookie-banner');
    if (banner) banner.classList.remove('show');
    startGa4();
}

/* ==========================================================================
   Idiomas
   ========================================================================== */
function t(key, fallback) {
    const lang = localStorage.getItem('lang') || 'pt';
    const dic = (typeof translations !== 'undefined' && translations[lang]) || {};
    return dic[key] || fallback || key;
}

function initLanguage() {
    setLanguage(localStorage.getItem('lang') || 'pt');
}

function toggleLanguage() {
    setLanguage((localStorage.getItem('lang') || 'pt') === 'pt' ? 'en' : 'pt');
}

function setLanguage(lang) {
    if (typeof translations === 'undefined' || !translations[lang]) return;
    const dic = translations[lang];

    document.documentElement.lang = lang === 'pt' ? 'pt-PT' : 'en';
    localStorage.setItem('lang', lang);

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const v = dic[el.getAttribute('data-i18n')];
        if (v !== undefined) el.innerHTML = v;
    });
    // Placeholders têm chave própria: reutilizar data-i18n punha o texto dentro
    // do input em vez do atributo.
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
        const v = dic[el.getAttribute('data-i18n-ph')];
        if (v !== undefined) el.setAttribute('placeholder', v);
    });
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const v = dic[el.getAttribute('data-i18n-title')];
        if (v !== undefined) { el.setAttribute('title', v); el.setAttribute('aria-label', v); }
    });

    document.querySelectorAll('.lang-btn-label').forEach(el => { el.textContent = lang.toUpperCase(); });

    if (window.updateMapInfo) window.updateMapInfo(lang);
}

/* ==========================================================================
   Mapa de Moçambique
   ========================================================================== */
/* Total de instalações concluídas.
   Vive aqui e em mais lado nenhum. O site mostrava 45 no cabeçalho enquanto o
   mapa somava 140 por província, porque eram dois conjuntos de números escritos
   à mão sem ligação nenhuma entre si. Ao escrever este valor, ele aplica-se a
   todos os contadores marcados com data-stat="instalacoes"; o data-target no
   HTML fica só como recurso para quem tenha o JavaScript desligado. */
const TOTAL_INSTALACOES = 45;

function aplicarTotalInstalacoes() {
    document.querySelectorAll('[data-stat="instalacoes"]').forEach((el) => {
        el.setAttribute('data-target', String(TOTAL_INSTALACOES));
    });
}

const mapDetails = {
    pt: {
        'Cabo Delgado': { area: 'Habitação isolada', details: 'Sistemas solares isolados para habitação e manutenção de redes elétricas secundárias.' },
        'Niassa': { area: 'Rega agrícola', details: 'Rega agrícola com bombas fotovoltaicas para horticultura.' },
        'Nampula': { area: 'Sede e armazém', details: 'Sede e armazém. Equipa permanente, stock de material e linha técnica para contratos de manutenção.' },
        'Zambézia': { area: 'Comércio e serviços', details: 'Sistemas solares comerciais e instalação elétrica de edifícios de comércio.' },
        'Tete': { area: 'Armazenamento', details: 'Dimensionamento e fornecimento de bancos de baterias de lítio e inversores híbridos.' },
        'Manica': { area: 'Auditorias', details: 'Estudos de eficiência energética e auditorias a sistemas de bombagem solar.' },
        'Sofala': { area: 'Corredor da Beira', details: 'Instalação elétrica predial e sistemas solares de reserva no corredor da Beira.' },
        'Inhambane': { area: 'Turismo', details: 'Sistemas híbridos com monitorização remota para unidades de turismo.' },
        'Gaza': { area: 'Micro-redes', details: 'Micro-redes solares comunitárias e iluminação pública.' },
        'Maputo': { area: 'Escritório comercial', details: 'Escritório comercial. Estudos de viabilidade e retorno para centrais de maior potência.' }
    },
    en: {
        'Cabo Delgado': { area: 'Off-grid housing', details: 'Stand-alone residential solar systems and maintenance of secondary electrical networks.' },
        'Niassa': { area: 'Agricultural irrigation', details: 'Agricultural irrigation with photovoltaic pumps for horticulture.' },
        'Nampula': { area: 'Head office and warehouse', details: 'Head office and warehouse. Permanent team, material in stock and a technical line for maintenance contracts.' },
        'Zambézia': { area: 'Retail and services', details: 'Commercial solar systems and electrical installation of retail buildings.' },
        'Tete': { area: 'Energy storage', details: 'Sizing and supply of lithium battery banks and hybrid inverters.' },
        'Manica': { area: 'Audits', details: 'Energy efficiency studies and audits of solar pumping systems.' },
        'Sofala': { area: 'Beira corridor', details: 'Building electrical installation and backup solar systems along the Beira corridor.' },
        'Inhambane': { area: 'Tourism', details: 'Hybrid systems with remote monitoring for tourism operations.' },
        'Gaza': { area: 'Microgrids', details: 'Community solar microgrids and public lighting.' },
        'Maputo': { area: 'Commercial office', details: 'Commercial office. Feasibility and payback studies for higher-capacity plants.' }
    }
};

window.updateMapInfo = function (lang) {
    const active = document.querySelector('.map-province.active-province');
    if (!active) return;
    const name = active.getAttribute('data-name');
    const info = (mapDetails[lang] || mapDetails.pt)[name];
    const title = document.getElementById('map-info-title');
    const desc = document.getElementById('map-info-desc');
    if (!info || !title || !desc) return;
    title.innerHTML = `${name} &mdash; ${info.area}`;
    desc.textContent = info.details;
};

function initInteractiveMap() {
    const provinces = document.querySelectorAll('.map-province');
    const tooltip = document.getElementById('map-tooltip');
    const box = document.getElementById('map-info-box');
    if (!provinces.length) return;

    const select = (prov) => {
        provinces.forEach(p => p.classList.remove('active-province'));
        prov.classList.add('active-province');
        window.updateMapInfo(localStorage.getItem('lang') || 'pt');
        if (!box) return;
        box.style.opacity = '0';
        box.style.transform = 'translateY(8px)';
        requestAnimationFrame(() => {
            box.style.opacity = '1';
            box.style.transform = 'none';
        });
    };

    provinces.forEach(prov => {
        prov.addEventListener('mouseenter', () => {
            if (!tooltip) return;
            tooltip.textContent = prov.getAttribute('data-name');
            tooltip.style.opacity = '1';
        });
        prov.addEventListener('mousemove', (e) => {
            if (!tooltip) return;
            tooltip.style.left = (e.clientX + 14) + 'px';
            tooltip.style.top = (e.clientY + 14) + 'px';
        });
        prov.addEventListener('mouseleave', () => { if (tooltip) tooltip.style.opacity = '0'; });
        prov.addEventListener('click', () => select(prov));
        // O mapa é navegável por teclado: os paths têm tabindex no HTML.
        prov.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(prov); }
        });
    });

    window.updateMapInfo(localStorage.getItem('lang') || 'pt');
}

/* ==========================================================================
   Delegação de eventos
   Nada de handlers inline no HTML: é o que permite a política de segurança
   (_headers) proibir script inline sem partir metade do site.
   ========================================================================== */
function initDelegation() {
    document.addEventListener('click', (e) => {
        const el = e.target.closest('[data-nav], [data-service], [data-note], [data-close], [data-cookie-accept], [data-lang-toggle], [data-method], .accordion-header, .service-head');
        if (!el) return;

        if (el.hasAttribute('data-nav'))          return showSection(el.getAttribute('data-nav'), e);
        if (el.hasAttribute('data-service'))      return goToService(el.getAttribute('data-service'), e);
        if (el.hasAttribute('data-note'))         return abrirModalBlog(el.getAttribute('data-note'));
        if (el.hasAttribute('data-lang-toggle'))  return toggleLanguage();
        if (el.hasAttribute('data-cookie-accept'))return acceptCookies();
        if (el.hasAttribute('data-close'))        return el.getAttribute('data-close') === 'blog' ? fecharModalBlog() : closeLightbox();
        // Guardado antes do submit: o clique no botão chega sempre primeiro.
        if (el.hasAttribute('data-method'))       return setSubmitMethod(el.getAttribute('data-method'));
        if (el.classList.contains('accordion-header')) return toggleAccordion(el);
        if (el.classList.contains('service-head'))     return toggleServiceCard(el);
    });

    // Elementos que não são <button> mas têm papel de botão precisam do teclado.
    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        const head = e.target.closest && e.target.closest('.service-head');
        if (!head) return;
        e.preventDefault();
        toggleServiceCard(head);
    });

    const form = document.getElementById('agendamento-form');
    if (form) form.addEventListener('submit', handleFormSubmit);
}

/* ==========================================================================
   Analytics
   ========================================================================== */
function initAnalytics() {
    if (ANALYTICS.cloudflareToken) {
        // Sem cookies: pode arrancar de imediato.
        const b = document.createElement('script');
        b.defer = true;
        b.src = 'https://static.cloudflareinsights.com/beacon.min.js';
        b.setAttribute('data-cf-beacon', JSON.stringify({ token: ANALYTICS.cloudflareToken }));
        document.head.appendChild(b);
    }
    if (ANALYTICS.ga4Id && localStorage.getItem('cookieConsent') === 'true') startGa4();
}

function startGa4() {
    if (!ANALYTICS.ga4Id || window.__ga4Started) return;
    window.__ga4Started = true;

    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ANALYTICS.ga4Id;
    document.head.appendChild(s);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', ANALYTICS.ga4Id, { anonymize_ip: true });
}

/* Um pedido de orçamento é a única conversão que interessa medir aqui. */
function trackEvent(name, params) {
    if (typeof window.gtag === 'function') window.gtag('event', name, params || {});
}

window.addEventListener('resize', () => {
    // O acordeão de serviços guarda a altura em pixels; se a largura mudar, remede.
    const open = document.querySelector('.expandable-service-card.expanded .service-body');
    if (open) open.style.maxHeight = open.scrollHeight + 'px';
    const active = document.querySelector('.spa-section.active');
    if (active) updateStickyCta(active.id);
});
