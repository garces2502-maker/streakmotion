/**
 * STREAK • PRODUCTORA AUDIOVISUAL & ESTUDIO DE DISEÑO
 * Main Interactive Engine (2026)
 */

document.addEventListener('DOMContentLoaded', () => {
    initThemeController();
    initStickyHeader();
    initLightStreaksCanvas();
    initBookingCalendar();
    initBrandBriefingLab();
    initModalHandlers();
});

/* =========================================================
   0. THEME CONTROLLER (WHITE EDITORIAL / MIDNIGHT OBSIDIAN)
   ========================================================= */
function initThemeController() {
    // Default to 'light' mode as requested ("el fondo podria ser blanco y usar particulas azules")
    const savedTheme = localStorage.getItem('streak-theme') || 'light';
    applyTheme(savedTheme);
}

function applyTheme(theme) {
    const isLight = (theme === 'light');
    document.body.classList.toggle('streak-light-mode', isLight);
    localStorage.setItem('streak-theme', isLight ? 'light' : 'dark');

    const toggleText = document.getElementById('themeToggleText');
    const toggleIcon = document.getElementById('themeToggleIcon');
    const logoImg = document.getElementById('streakLogoImg');
    const heroLogoImg = document.getElementById('heroStreakLogo');
    const footerLogoImg = document.getElementById('streakFooterLogoImg');

    if (toggleText) {
        toggleText.textContent = isLight ? 'Modo Oscuro' : 'Blanco Editorial';
    }
    if (toggleIcon) {
        toggleIcon.className = isLight ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
    }
    if (logoImg) {
        logoImg.src = isLight ? 'assets/streak-logo.svg' : 'assets/streak-logo-white.svg';
    }
    if (heroLogoImg) {
        heroLogoImg.src = isLight ? 'assets/streak-logo.svg' : 'assets/streak-logo-white.svg';
    }
    if (footerLogoImg) {
        footerLogoImg.src = isLight ? 'assets/streak-logo.svg' : 'assets/streak-logo-white.svg';
    }
}

function toggleTheme() {
    const currentIsLight = document.body.classList.contains('streak-light-mode');
    const newTheme = currentIsLight ? 'dark' : 'light';
    applyTheme(newTheme);
    showToast(newTheme === 'light' ? 'Modo Blanco Editorial activado' : 'Modo Midnight activado', newTheme === 'light' ? 'fa-sun' : 'fa-moon');
}

/* =========================================================
   1. COSMIC & BRAND BLUE LIGHT STREAKS CANVAS (DYNAMIC & INTERACTIVE)
   ========================================================= */
function initLightStreaksCanvas() {
    const canvas = document.getElementById('streakCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    let mouseX = -9999;
    let mouseY = -9999;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
        mouseX = -9999;
        mouseY = -9999;
    });

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const streaks = [];
    const numStreaks = 55;

    for (let i = 0; i < numStreaks; i++) {
        streaks.push({
            x: Math.random() * width,
            y: Math.random() * height,
            len: 90 + Math.random() * 200,
            baseSpeed: 2 + Math.random() * 4.5,
            speed: 2 + Math.random() * 4.5,
            width: 1.2 + Math.random() * 2.8,
            colorType: Math.random(),
            alpha: 0.35 + Math.random() * 0.45,
            angle: -Math.PI / 4 + (Math.random() - 0.5) * 0.25
        });
    }

    // Floating blue ambient orbs (bokeh dust)
    const orbs = [];
    const numOrbs = 30;
    for (let i = 0; i < numOrbs; i++) {
        orbs.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: 2 + Math.random() * 4.5,
            speedX: (Math.random() - 0.5) * 0.8,
            speedY: -0.4 - Math.random() * 0.9,
            alpha: 0.2 + Math.random() * 0.4,
            osc: Math.random() * Math.PI * 2,
            oscSpeed: 0.02 + Math.random() * 0.03
        });
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        const isLightMode = document.body.classList.contains('streak-light-mode');

        // Draw ambient orbs
        orbs.forEach(orb => {
            orb.osc += orb.oscSpeed;
            orb.x += orb.speedX + Math.sin(orb.osc) * 0.5;
            orb.y += orb.speedY;

            // Mouse interaction on orbs
            const dx = orb.x - mouseX;
            const dy = orb.y - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 140) {
                const angle = Math.atan2(dy, dx);
                const force = (140 - dist) / 140;
                orb.x += Math.cos(angle) * force * 3;
                orb.y += Math.sin(angle) * force * 3;
            }

            if (orb.y < -20) {
                orb.y = height + 20;
                orb.x = Math.random() * width;
            }
            if (orb.x < -20) orb.x = width + 20;
            if (orb.x > width + 20) orb.x = -20;

            ctx.beginPath();
            const orbGrad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius * 2);
            if (isLightMode) {
                orbGrad.addColorStop(0, `rgba(0, 102, 255, ${orb.alpha * 1.3})`);
                orbGrad.addColorStop(1, 'rgba(0, 102, 255, 0)');
            } else {
                orbGrad.addColorStop(0, `rgba(0, 210, 255, ${orb.alpha})`);
                orbGrad.addColorStop(1, 'rgba(0, 102, 255, 0)');
            }
            ctx.fillStyle = orbGrad;
            ctx.arc(orb.x, orb.y, orb.radius * 2, 0, Math.PI * 2);
            ctx.fill();
        });

        // Draw streaks
        streaks.forEach(s => {
            // Mouse distance & reaction
            const dx = s.x - mouseX;
            const dy = s.y - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 180) {
                const boost = (180 - dist) / 180;
                s.speed = s.baseSpeed * (1 + boost * 1.8);
            } else {
                s.speed += (s.baseSpeed - s.speed) * 0.05;
            }

            ctx.beginPath();
            const cos = Math.cos(s.angle);
            const sin = Math.sin(s.angle);

            const grad = ctx.createLinearGradient(
                s.x, s.y,
                s.x - cos * s.len, s.y - sin * s.len
            );

            let baseColor;
            let alphaVal = s.alpha;

            if (isLightMode) {
                // Saturated, rich STREAK electric blues for white backdrop
                alphaVal = Math.min(0.9, s.alpha * 1.4);
                if (s.colorType > 0.6) {
                    baseColor = '0, 102, 255'; // #0066FF
                } else if (s.colorType > 0.3) {
                    baseColor = '0, 71, 255'; // #0047FF
                } else {
                    baseColor = '0, 180, 255'; // #00B4FF
                }
            } else {
                // Neon glow for dark backdrop
                baseColor = s.colorType > 0.4 ? '0, 102, 255' : '0, 210, 255';
            }

            grad.addColorStop(0, `rgba(${baseColor}, ${alphaVal})`);
            grad.addColorStop(1, `rgba(${baseColor}, 0)`);

            ctx.strokeStyle = grad;
            ctx.lineWidth = s.width;
            ctx.lineCap = 'round';

            ctx.moveTo(s.x, s.y);
            ctx.lineTo(s.x - cos * s.len, s.y - sin * s.len);
            ctx.stroke();

            // Advance
            s.x += cos * s.speed;
            s.y += sin * s.speed;

            // Loop around screen boundaries
            if (s.x > width + 220 || s.y > height + 220) {
                s.x = Math.random() * width - 200;
                s.y = -100;
            }
        });

        requestAnimationFrame(animate);
    }
    animate();
}

/* =========================================================
   2. DUAL PORTFOLIO FILTERING (AUDIOVISUAL + 3D DESIGN)
   ========================================================= */
function initPortfolioFilters() {
    const tabBtns = document.querySelectorAll('.portfolio-tabs .tab-btn');
    const cards = document.querySelectorAll('.portfolio-grid .project-card');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            cards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 20);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(15px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 250);
                }
            });
        });
    });
}

/* =========================================================
   3. CALENDARIO INTERACTIVO DE RESERVAS (BOOKING CALENDAR)
   ========================================================= */
let currentCalDate = new Date();
let selectedBookingDate = null;

const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

function initBookingCalendar() {
    renderCalendar();

    const prevBtn = document.getElementById('calPrevBtn');
    const nextBtn = document.getElementById('calNextBtn');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentCalDate.setMonth(currentCalDate.getMonth() - 1);
            renderCalendar();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentCalDate.setMonth(currentCalDate.getMonth() + 1);
            renderCalendar();
        });
    }

    // Booking form submit
    const bookingForm = document.getElementById('streakBookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleBookingSubmit();
        });
    }
}

function renderCalendar() {
    const monthTitle = document.getElementById('calMonthTitle');
    const grid = document.getElementById('calDaysGrid');
    if (!monthTitle || !grid) return;

    const year = currentCalDate.getFullYear();
    const month = currentCalDate.getMonth();

    monthTitle.textContent = `${monthNames[month]} ${year}`;
    grid.innerHTML = '';

    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sunday
    // Convert to Monday-start (0 = Monday, 6 = Sunday)
    const startOffset = (firstDayIndex === 0) ? 6 : firstDayIndex - 1;

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Empty cells for offset
    for (let i = 0; i < startOffset; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'cal-day-cell disabled';
        grid.appendChild(emptyCell);
    }

    const today = new Date();

    // Render month days
    for (let day = 1; day <= daysInMonth; day++) {
        const cell = document.createElement('div');
        cell.className = 'cal-day-cell';
        cell.textContent = day;

        const thisDate = new Date(year, month, day);

        // Simulation logic for booking status:
        // Weekends or past days or specific days marked booked
        if (thisDate < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
            cell.classList.add('booked');
        } else if (day === 8 || day === 14 || day === 22) {
            cell.classList.add('booked');
            cell.title = 'Fecha Reservada para Rodaje Oficial';
        } else if (day === 5 || day === 12 || day === 19 || day === 26) {
            cell.classList.add('fast-track');
            cell.title = 'Disponibilidad Inmediata / Fast-Track';
        }

        // Active selection
        if (selectedBookingDate && 
            selectedBookingDate.getDate() === day &&
            selectedBookingDate.getMonth() === month &&
            selectedBookingDate.getFullYear() === year) {
            cell.classList.add('selected');
        }

        cell.addEventListener('click', () => {
            if (cell.classList.contains('booked')) {
                showToast('Esta fecha se encuentra reservada para rodaje oficial.', 'fa-triangle-exclamation');
                return;
            }
            selectBookingDate(thisDate);
        });

        grid.appendChild(cell);
    }

    // Default select if not selected
    if (!selectedBookingDate) {
        // Find next available day
        for (let d = today.getDate() + 1; d <= daysInMonth; d++) {
            if (d !== 8 && d !== 14 && d !== 22) {
                selectBookingDate(new Date(year, month, d));
                break;
            }
        }
    }
}

function selectBookingDate(dateObj) {
    selectedBookingDate = dateObj;
    const formatted = `${dateObj.getDate()} de ${monthNames[dateObj.getMonth()]}, ${dateObj.getFullYear()}`;
    
    const bannerVal = document.getElementById('selectedDateText');
    if (bannerVal) {
        bannerVal.textContent = formatted;
    }

    const hiddenInput = document.getElementById('bookingSelectedDateInput');
    if (hiddenInput) {
        hiddenInput.value = formatted;
    }

    renderCalendar();
    showToast(`Fecha de rodaje seleccionada: ${formatted}`, 'fa-calendar-check');
}

function handleBookingSubmit() {
    const client = document.getElementById('bookingName').value;
    const email = document.getElementById('bookingEmail').value;
    const service = document.getElementById('bookingService').value;
    const shift = document.getElementById('bookingShift').value;
    const location = document.getElementById('bookingLocation').value;
    const date = selectedBookingDate ? 
        `${selectedBookingDate.getDate()} de ${monthNames[selectedBookingDate.getMonth()]}, ${selectedBookingDate.getFullYear()}` : 
        'Por coordinar';

    const ticketCode = 'STRK-ROD-' + Math.floor(1000 + Math.random() * 9000);

    const confirmationMsg = `🎬 SOLICITUD DE RODAJE STREAK [${ticketCode}]\nCliente: ${client}\nServicio: ${service}\nFecha: ${date}\nJornada: ${shift}\nLocación: ${location}\nEmail: ${email}`;

    // Dispatch background email
    sendBookingAutoEmail({
        code: ticketCode,
        client,
        email,
        service,
        date,
        shift,
        location
    });

    // Show feedback toast
    showToast(`¡Reserva registrada con éxito! Código: ${ticketCode}`, 'fa-circle-check');

    // Update form state with confirmation card
    const formCard = document.querySelector('.booking-form-card');
    if (formCard) {
        formCard.innerHTML = `
            <div style="text-align: center; padding: 1.5rem 0;">
                <div style="width: 64px; height: 64px; border-radius: 50%; background: rgba(0, 102, 255, 0.2); border: 2px solid var(--streak-blue); display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem; font-size: 1.75rem; color: var(--streak-cyan);">
                    <i class="fa-solid fa-check"></i>
                </div>
                <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--streak-cyan); font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase;">
                    RESERVA REGISTRADA CON ÉXITO
                </div>
                <h4 style="font-family: var(--font-headline); font-size: 1.6rem; color: #FFFFFF; margin: 0.5rem 0 1rem;">
                    Expediente de Rodaje ${ticketCode}
                </h4>
                <p style="font-size: 0.85rem; color: var(--text-silver); line-height: 1.6; margin-bottom: 1.5rem;">
                    Se ha reservado preliminarmente el <strong>${date}</strong> (${shift}) para <strong>${service}</strong> en ${location}. El equipo de producción de STREAK se pondrá en contacto en menos de 2 horas.
                </p>
                <div style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;">
                    <button onclick="copyToClipboard('${confirmationMsg.replace(/\n/g, '\\n')}'); showToast('Ficha de reserva copiada', 'fa-copy');" class="btn-streak-primary">
                        <i class="fa-solid fa-copy"></i> Copiar Ficha
                    </button>
                    <a href="https://wa.me/?text=${encodeURIComponent(confirmationMsg)}" target="_blank" class="btn-streak-ghost">
                        <i class="fa-brands fa-whatsapp" style="color: #25D366;"></i> Enviar por WhatsApp
                    </a>
                </div>
            </div>
        `;
    }
}

/* =========================================================
   4. BRAND & LOGO BRIEFING LAB & PDF ENGINE (2026)
   ========================================================= */

let currentBrief = {
    brandName: 'KHALI MUSIC',
    tagline: 'World Tour & Records',
    industry: 'Música Urbana / Trap / Reggaetón',
    deliverable: 'Nuevo Logotipo + Isotipo Principal',
    vibe: 'Futurista / Cyberpunk / Tech',
    color: 'Eléctrico STREAK (Azul Rey & Cyan Glow)',
    typography: 'Tipografía 3D Monumental',
    exclusions: '',
    applications: [
        'Pantallas Gigantes LED / Festivales',
        'Portadas Oficiales de Álbumes (Spotify / Apple)',
        'Ropa, Merch & Streetwear',
        'Redes Sociales & Avatares 4K'
    ],
    audience: 'Gen Z & Juventud Urbana Global',
    refsLink: 'https://pinterest.com/moodboard-khali',
    deadline: 'Estándar Curado (1 a 2 Semanas)',
    budget: '$1.000.000 - $2.500.000 CLP (Identidad + Render 3D Chrome)',
    contactName: 'Carlos Valenzuela (Manager)',
    contactEmail: 'manager@khalimusic.com',
    contactPhone: '+56 9 8765 4321',
    notes: 'Lanzamiento de álbum mundial en 2 meses. Necesitamos impacto monumental para pantallas de festival.',
    code: 'STRK-BRND-2026-9842',
    date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })
};

const CATEGORY_SCHEMAS = {
    matrimonio: {
        categoryKey: 'matrimonio',
        industryName: 'Matrimonios & Bodas Exclusivas',
        presetName: 'FRANCISCA & MATÍAS',
        tagline: 'Nuestra Boda • Santiago de Chile',
        step1DeliverableLabel: 'Tipo de Entregable de Boda a Marcar:',
        deliverables: [
            { value: 'Monograma & Logo Oficial de Boda (2D + 3D)', label: 'Monograma & Logo Boda (2D/3D)', icon: 'fa-gem' },
            { value: 'Invitaciones Digitales Interactivas & Web de Novios', label: 'Invitación Digital & Web Novios', icon: 'fa-envelope-open-text' },
            { value: 'Identidad Completa de Boda (Papelería, Minutas & Señalética)', label: 'Identidad Completa Boda + Minutas', icon: 'fa-book-bookmark' },
            { value: 'Monograma Lumínico 3D & Teaser Cinematográfico 4K', label: 'Monograma 3D + Teaser 4K', icon: 'fa-cube' }
        ],
        step2VibeLabel: 'Estilo & Atmósfera de la Boda a Marcar:',
        vibes: [
            { value: 'Romántico & Atemporal Clásico', label: 'Romántico & Atemporal', icon: 'fa-heart' },
            { value: 'Minimalista & Lujo Editorial High-End', label: 'Minimalista & Lujo Editorial', icon: 'fa-gem' },
            { value: 'Fiesta Exclusiva & Glamour Nocturno', label: 'Fiesta Exclusiva & Glamour', icon: 'fa-champagne-glasses' },
            { value: 'Boho Chic & Elegancia Botánica', label: 'Boho Chic & Botánico', icon: 'fa-leaf' },
            { value: 'Cinematográfico & Épico (Estilo Película)', label: 'Cinematográfico Épico', icon: 'fa-clapperboard' }
        ],
        step2ColorLabel: 'Paleta Cromática de la Boda a Marcar:',
        colors: [
            { value: 'Blanco Puro, Champagne & Oro Rosa', label: 'Blanco Puro, Champagne & Oro Rosa', colorHex: '#F5E6D3' },
            { value: 'Black-Tie (Negro Obsidiana, Blanco Puro & Plata)', label: 'Black-Tie (Negro, Blanco & Plata)', colorHex: '#E2E8F0' },
            { value: 'Verde Botánico, Olivo & Neutros Cálidos', label: 'Verde Olivo & Neutros', colorHex: '#A3B18A' },
            { value: 'Azul STREAK Real, Blanco & Acero Reflectivo', label: 'Azul STREAK, Blanco & Acero', colorHex: '#0066FF' },
            { value: 'Criterio Creativo Libre (STREAK Asesora)', label: 'Criterio Libre STREAK', icon: 'fa-wand-sparkles' }
        ],
        step2TypographyLabel: 'Estilo Tipográfico / Monograma a Marcar:',
        typographies: [
            { value: 'Monograma Clásico & Cursiva Caligráfica', label: 'Monograma Caligráfico Clásico', icon: 'fa-pen-fancy' },
            { value: 'Serif Editorial de Alta Costura / Vogue', label: 'Serif Editorial de Lujo', icon: 'fa-font' },
            { value: 'Monograma Moderno Minimalista Clean', label: 'Monograma Moderno Clean', icon: 'fa-lines-leaning' },
            { value: 'Monograma 3D Esculpido Liquid Chrome', label: 'Monograma 3D Chrome Glow', icon: 'fa-cube' }
        ],
        step2ExclusionsPlaceholder: 'Ej: Evitar tipografías difíciles de leer, no usar tonos chillones ni recargar de elementos infantiles...',
        step3Tag: 'PASO 03 // SOPORTES DE BODA & INVITADOS',
        step3Title: 'Soportes de Boda & Experiencia de Invitados',
        step3AppLabel: '¿Dónde se aplicará el diseño y qué soportes necesitas? (Multi-selección a marcar):',
        applications: [
            { value: 'Invitaciones Digitales & Web de Novios', label: 'Invitaciones Digitales & Web', icon: 'fa-envelope' },
            { value: 'Señalética, Menús & Seating Plan Impresos', label: 'Menús, Señalética & Seating Plan', icon: 'fa-scroll' },
            { value: 'Pantallas LED & Visuales en Fiesta de Matrimonio', label: 'Pantallas LED Fiesta Boda', icon: 'fa-tv' },
            { value: 'Monograma de Luz Gobo / Proyección Arquitectónica', label: 'Monograma de Luz (Gobo)', icon: 'fa-lightbulb' },
            { value: 'Recuerdos de Novios, Copas & Merch Exclusivo', label: 'Recuerdos & Merch de Pareja', icon: 'fa-gift' },
            { value: 'Teaser Cinematográfico & Reel 4K (Instagram/TikTok)', label: 'Teaser / Reel 4K Novios', icon: 'fa-video' }
        ],
        step3AudienceLabel: 'Magnitud de la Boda / Tipo de Celebración a Marcar:',
        audiences: [
            { value: 'Boda Íntima & Exclusiva (< 80 personas)', label: 'Boda Íntima (<80 pers)', icon: 'fa-user-group' },
            { value: 'Gran Celebración / Boda Masiva (+180 personas)', label: 'Gran Boda (+180 pers)', icon: 'fa-champagne-glasses' },
            { value: 'Gala Black-Tie de Noche & Fiesta Exclusiva', label: 'Gala Black-Tie de Noche', icon: 'fa-wand-magic' },
            { value: 'Destination Wedding / Boda de Destino / Viaje', label: 'Destination Wedding (Viaje)', icon: 'fa-plane' }
        ],
        refsLabel: 'Tablero de Pinterest / Instagram de Referencias de Boda:',
        refsPlaceholder: 'https://pinterest.com/tablero-boda... o Drive con fotos del vestido/locación',
        contactNameLabel: 'Nombres de los Novios / Wedding Planner:',
        contactNamePlaceholder: 'Francisca & Matías (o Carolina Morales - Wedding Planner)',
        notesLabel: 'Detalles de la Boda (Fecha, Locación, Ceremonia y Fiesta):',
        notesPlaceholder: 'Lugar de la ceremonia y fiesta (ej: Hacienda Chicureo, Viña del Mar), fecha estimada, hora y requerimientos de filmación multicámara 4K...',
        defaultPreset: {
            brandName: 'FRANCISCA & MATÍAS',
            tagline: 'Nuestra Boda • Santiago de Chile',
            industry: 'Matrimonios & Bodas Exclusivas',
            deliverable: 'Monograma & Logo Oficial de Boda (2D + 3D)',
            vibe: 'Minimalista & Lujo Editorial High-End',
            color: 'Blanco Puro, Champagne & Oro Rosa',
            typography: 'Monograma Clásico & Cursiva Caligráfica',
            exclusions: 'Evitar clichés rústicos o recargados. Buscamos diseño editorial y elegancia cinematográfica.',
            applications: [
                'Invitaciones Digitales & Web de Novios',
                'Señalética, Menús & Seating Plan Impresos',
                'Pantallas LED & Visuales en Fiesta de Matrimonio',
                'Teaser Cinematográfico & Reel 4K (Instagram/TikTok)'
            ],
            audience: 'Gran Celebración / Boda Masiva (+180 personas)',
            refsLink: 'https://pinterest.com/luxury-wedding-branding',
            deadline: 'Estándar Curado (1 a 2 Semanas)',
            budget: '$1.000.000 - $2.500.000 CLP (Identidad + Render 3D Chrome)',
            contactName: 'Francisca Ovalle (Novia)',
            contactEmail: 'francisca.ovalle@gmail.com',
            contactPhone: '+56 9 9123 4567',
            notes: 'Cobertura cinematográfica multicámara del matrimonio y monograma 3D para invitaciones digitales, señalética lumínica y pantallas.'
        }
    },

    evento: {
        categoryKey: 'evento',
        industryName: 'Eventos & Festival Masivo',
        presetName: 'HYPERFEST 2026',
        tagline: 'Electronic Music Festival • Arena Santiago',
        step1DeliverableLabel: 'Tipo de Entregable para el Evento a Marcar:',
        deliverables: [
            { value: 'Identidad Visual Integral del Festival / Evento', label: 'Identidad Completa Festival', icon: 'fa-ticket' },
            { value: 'Naming + Logotipo Oficial del Evento (2D + 3D)', label: 'Naming + Logo 2D/3D', icon: 'fa-signature' },
            { value: 'Sistema de Gráficas para Escenarios & Cartelera', label: 'Gráficas Escenarios & Lineup', icon: 'fa-tv' },
            { value: 'Branding 360° + Animaciones de Escenario 4K', label: 'Branding 360° + Animación 4K', icon: 'fa-cube' }
        ],
        step2VibeLabel: 'Atmósfera & Energía del Evento a Marcar:',
        vibes: [
            { value: 'Euforia / Festival Electrónico / Rave', label: 'Euforia / Festival / Rave', icon: 'fa-bolt' },
            { value: 'Vibrante & Colorido Pop Masivo', label: 'Colorido / Pop Masivo', icon: 'fa-wand-magic-sparkles' },
            { value: 'Underground Dark / Industrial / Techno', label: 'Underground / Dark Techno', icon: 'fa-skull' },
            { value: 'Futurista & High-Tech Holográfico', label: 'Futurista / High-Tech', icon: 'fa-microchip' },
            { value: 'Cinematográfico Épico / Experiencia Sensorial', label: 'Cinematográfico Épico', icon: 'fa-clapperboard' }
        ],
        step2ColorLabel: 'Paleta Cromática del Evento a Marcar:',
        colors: [
            { value: 'Neón Ultravioleta & Cyan Eléctrico STREAK', label: 'Neón Ultravioleta & Cyan', colorHex: '#00D2FF' },
            { value: 'Eléctrico STREAK (Azul Rey, Cobalto & Glow)', label: 'Eléctrico STREAK (Azul & Cyan)', colorHex: '#0066FF' },
            { value: 'Negro Obsidiana & Cromo Reflectivo', label: 'Negro Obsidiana & Cromo', colorHex: '#94A3B8' },
            { value: 'Monocromo High-Contrast (Negro & Blanco)', label: 'Monocromo (Negro & Blanco)', colorHex: '#FFFFFF' },
            { value: 'Criterio Creativo Libre (STREAK Decide)', label: 'Criterio Libre STREAK', icon: 'fa-wand-sparkles' }
        ],
        step2TypographyLabel: 'Estilo Tipográfico del Evento a Marcar:',
        typographies: [
            { value: 'Tipografía 3D Monumental para Escenarios', label: 'Tipografía 3D Monumental', icon: 'fa-cube' },
            { value: 'Letras Bold Heavy de Máximo Impacto', label: 'Letras Bold / Festival Heavy', icon: 'fa-font' },
            { value: 'Isotipo Emblemático / Símbolo de Festival', label: 'Símbolo Masivo / Isotipo', icon: 'fa-shapes' },
            { value: 'Wordmark Cyberpunk / Futurista', label: 'Wordmark Futurista', icon: 'fa-lines-leaning' }
        ],
        step2ExclusionsPlaceholder: 'Ej: Evitar logotipos que se pierdan a distancia o en pantallas LED de día, evitar elementos genéricos...',
        step3Tag: 'PASO 03 // SOPORTES DEL EVENTO & MAGNITUD',
        step3Title: 'Soportes del Festival, Escenarios & Asistencia',
        step3AppLabel: '¿Dónde vivirá el branding del evento? (Multi-selección a marcar):',
        applications: [
            { value: 'Pantallas Gigantes LED del Escenario Principal', label: 'Pantallas LED Escenario', icon: 'fa-tv' },
            { value: 'Pulseras, Credenciales VIP & Accesos', label: 'Pulseras & Credenciales VIP', icon: 'fa-ticket' },
            { value: 'Afiches, Vía Pública & Cartelería Urbana', label: 'Afiches & Cartelería Urbana', icon: 'fa-bullhorn' },
            { value: 'Campaña Digital, Web & Ticketing Oficial', label: 'Web & Ticketing Oficial', icon: 'fa-mobile-screen' },
            { value: 'Merchandising Oficial del Festival (Poleras, Gorros)', label: 'Merch Oficial Festival', icon: 'fa-shirt' },
            { value: 'Aftermovie & Cobertura Cinematográfica 4K', label: 'Aftermovie Oficial 4K', icon: 'fa-video' }
        ],
        step3AudienceLabel: 'Capacidad & Magnitud del Evento a Marcar:',
        audiences: [
            { value: 'Club / Evento Mediano (< 1.500 asistentes)', label: 'Club / Mediano (<1.500 pers)', icon: 'fa-headphones' },
            { value: 'Festival Masivo (+ 5.000 a 20.000 asistentes)', label: 'Festival Masivo (+5.000 pers)', icon: 'fa-users' },
            { value: 'Evento Corporativo VIP / Lanzamiento Exclusivo', label: 'Corporativo VIP / Privado', icon: 'fa-briefcase' },
            { value: 'Gira / Tour Multi-Ciudad', label: 'Tour / Gira Multi-Ciudad', icon: 'fa-plane' }
        ],
        refsLabel: 'Enlace a Referencias de Escenarios / Visuales / Lineup:',
        refsPlaceholder: 'https://drive.google.com/... o Pinterest con referencias de festivales',
        contactNameLabel: 'Nombre del Productor General / Productora del Evento:',
        contactNamePlaceholder: 'Rodrigo Silva (Productor General - Lotus / Bizarro)',
        notesLabel: 'Detalles del Evento (Fecha, Recinto, Lineup y Escenarios):',
        notesPlaceholder: 'Recinto (ej: Movistar Arena, Espacio Riesco), fecha del festival, DJs confirmados y requerimientos de pantallas 4K...',
        defaultPreset: {
            brandName: 'HYPERFEST 2026',
            tagline: 'Electronic Music Festival • Arena Santiago',
            industry: 'Eventos & Festival Masivo',
            deliverable: 'Identidad Visual Integral del Festival / Evento',
            vibe: 'Euforia / Festival Electrónico / Rave',
            color: 'Neón Ultravioleta & Cyan Eléctrico STREAK',
            typography: 'Tipografía 3D Monumental para Escenarios',
            exclusions: 'Evitar tipografías delgadas que no impacten en visuales gigantes. Máximo contraste lumínico.',
            applications: [
                'Pantallas Gigantes LED del Escenario Principal',
                'Pulseras, Credenciales VIP & Accesos',
                'Campaña Digital, Web & Ticketing Oficial',
                'Aftermovie & Cobertura Cinematográfica 4K'
            ],
            audience: 'Festival Masivo (+ 5.000 a 20.000 asistentes)',
            refsLink: 'https://pinterest.com/festival-visuals-hyperfest',
            deadline: 'Estándar Curado (1 a 2 Semanas)',
            budget: '+$5.000.000 CLP (Sistema Monumental 360°)',
            contactName: 'Rodrigo Silva (Productor)',
            contactEmail: 'produccion@hyperfest.cl',
            contactPhone: '+56 9 8877 6655',
            notes: 'Festival en Movistar Arena para 14.000 personas. Requerimos intro 3D y visuales reactivas para pantallas LED.'
        }
    },

    urbano: {
        categoryKey: 'urbano',
        industryName: 'Música Urbana / Trap / Reggaetón',
        presetName: 'KHALI MUSIC',
        tagline: 'World Tour & Records 2026',
        step1DeliverableLabel: 'Tipo de Entregable Solicitado a Marcar:',
        deliverables: [
            { value: 'Nuevo Logotipo + Isotipo Principal', label: 'Nuevo Logotipo + Isotipo', icon: 'fa-signature' },
            { value: 'Rediseño / Rebranding Completo', label: 'Rediseño / Rebranding', icon: 'fa-rotate' },
            { value: 'Sistema de Identidad + Manual de Marca (Brandbook)', label: 'Identidad + Brandbook', icon: 'fa-book-bookmark' },
            { value: 'Logotipo 3D Liquid Chrome (Modelado CGI)', label: 'Logo 3D Liquid Chrome', icon: 'fa-cube' }
        ],
        step2VibeLabel: 'Personalidad / Vibra de la Marca a Marcar:',
        vibes: [
            { value: 'Futurista / Cyberpunk / Tech', label: 'Futurista / Cyberpunk', icon: 'fa-microchip' },
            { value: 'Minimalista / High-End de Lujo', label: 'Minimalista / Lujo', icon: 'fa-gem' },
            { value: 'Brutalista / Y2K Liquid Chrome', label: 'Brutalista / Y2K Chrome', icon: 'fa-cubes-stacked' },
            { value: 'Streetwear / Underground / Dark', label: 'Streetwear / Underground', icon: 'fa-skull' },
            { value: 'Cinematográfico & Épico', label: 'Cinematográfico & Épico', icon: 'fa-clapperboard' }
        ],
        step2ColorLabel: 'Paleta Cromática Preferida a Marcar:',
        colors: [
            { value: 'Eléctrico STREAK (Azul Rey & Cyan Glow)', label: 'Eléctrico STREAK (Azul / Cyan)', colorHex: '#0066FF' },
            { value: 'Monocromático (Negro Obsidiana, Blanco Puro & Plata)', label: 'Monocromo (Negro & Blanco)', colorHex: '#E2E8F0' },
            { value: 'Cromo Líquido Reflectivo & Titanio', label: 'Cromo Líquido & Titanio', colorHex: '#94A3B8' },
            { value: 'Neón / Ultravioleta & Gradientes', label: 'Neón / Ultravioleta', colorHex: '#00D2FF' },
            { value: 'Criterio Creativo Libre (STREAK Decide)', label: 'Criterio Libre STREAK', icon: 'fa-wand-sparkles' }
        ],
        step2TypographyLabel: 'Estilo Tipográfico / Símbolo a Marcar:',
        typographies: [
            { value: 'Tipografía 3D Monumental', label: 'Tipografía 3D Monumental', icon: 'fa-cube' },
            { value: 'Monograma / Iniciales Emblemáticas', label: 'Monograma / Iniciales', icon: 'fa-font' },
            { value: 'Isotipo Geométrico / Símbolo Abstracto', label: 'Símbolo Abstracto', icon: 'fa-shapes' },
            { value: 'Wordmark Minimalista Sans-Serif', label: 'Wordmark Sans-Serif', icon: 'fa-lines-leaning' }
        ],
        step2ExclusionsPlaceholder: 'Ej: No usar notas musicales genéricas, no tipografías cursivas comunes, evitar tonos pasteles...',
        step3Tag: 'PASO 03 // SOPORTES & AUDIENCIA',
        step3Title: 'Aplicaciones Clave del Logo & Público',
        step3AppLabel: '¿Dónde vivirá principalmente el Logo? (Multi-selección a marcar):',
        applications: [
            { value: 'Pantallas Gigantes LED / Festivales', label: 'Pantallas LED Festivales', icon: 'fa-tv' },
            { value: 'Portadas Oficiales de Álbumes (Spotify / Apple)', label: 'Portadas de Álbum (Spotify)', icon: 'fa-compact-disc' },
            { value: 'Ropa, Merch & Streetwear', label: 'Merch & Streetwear', icon: 'fa-shirt' },
            { value: 'Redes Sociales & Avatares 4K', label: 'Redes Sociales & Avatares', icon: 'fa-mobile-screen' },
            { value: 'Merchandising & Packaging Físico', label: 'Packaging & Merch Físico', icon: 'fa-box-open' },
            { value: 'Intro Cinematográfica / Motion 3D', label: 'Intro Animada 3D', icon: 'fa-video' }
        ],
        step3AudienceLabel: 'Público Objetivo / Audiencia a Marcar:',
        audiences: [
            { value: 'Gen Z & Juventud Urbana Global', label: 'Gen Z & Audiencia Urbana', icon: 'fa-users' },
            { value: 'Fans de Música & Clubbers Internacionales', label: 'Fans de Música & Clubbers', icon: 'fa-headphones' },
            { value: 'Consumidores High-End & Moda Streetwear', label: 'Consumidores High-End', icon: 'fa-bag-shopping' },
            { value: 'Ejecutivos de Sellos & Marcas Globales', label: 'Sellos & Ejecutivos', icon: 'fa-briefcase' }
        ],
        refsLabel: 'Enlace a Referencias / Moodboard (Pinterest / Drive / Dropbox / Behance):',
        refsPlaceholder: 'https://pinterest.com/moodboard-khali... o enlace a Drive',
        contactNameLabel: 'Nombre del Responsable / Manager:',
        contactNamePlaceholder: 'Carlos Valenzuela (Manager de Artista)',
        notesLabel: 'Instrucciones Específicas para Producción:',
        notesPlaceholder: 'Lanzamiento de álbum en 2 meses. Requerimos logo 3D de alto impacto para pantallas de festival...',
        defaultPreset: {
            brandName: 'KHALI MUSIC',
            tagline: 'World Tour & Records',
            industry: 'Música Urbana / Trap / Reggaetón',
            deliverable: 'Nuevo Logotipo + Isotipo Principal',
            vibe: 'Futurista / Cyberpunk / Tech',
            color: 'Eléctrico STREAK (Azul Rey & Cyan Glow)',
            typography: 'Tipografía 3D Monumental',
            exclusions: 'Evitar clichés de micrófonos o notas musicales estándar. No tonos pasteles.',
            applications: [
                'Pantallas Gigantes LED / Festivales',
                'Portadas Oficiales de Álbumes (Spotify / Apple)',
                'Ropa, Merch & Streetwear',
                'Redes Sociales & Avatares 4K'
            ],
            audience: 'Gen Z & Juventud Urbana Global',
            refsLink: 'https://pinterest.com/moodboard-khali',
            deadline: 'Estándar Curado (1 a 2 Semanas)',
            budget: '$1.000.000 - $2.500.000 CLP (Identidad + Render 3D Chrome)',
            contactName: 'Carlos Valenzuela (Manager)',
            contactEmail: 'manager@khalimusic.com',
            contactPhone: '+56 9 8765 4321',
            notes: 'Lanzamiento de álbum mundial en 2 meses. Necesitamos impacto monumental para pantallas de festival.'
        }
    },

    streetwear: {
        categoryKey: 'streetwear',
        industryName: 'Moda & Streetwear',
        presetName: 'HYPERVOID APPAREL',
        tagline: 'Heavy Industrial Apparel',
        step1DeliverableLabel: 'Tipo de Entregable Textil a Marcar:',
        deliverables: [
            { value: 'Logotipo Principal + Isotipo para Prendas', label: 'Logo Principal + Isotipo Prenda', icon: 'fa-signature' },
            { value: 'Manual de Identidad Textil & Aplicaciones de Estampado', label: 'Manual Textil & Estampados', icon: 'fa-book-bookmark' },
            { value: 'Monograma Emblemático Bordable / Parches', label: 'Monograma Bordable / Parches', icon: 'fa-shirt' },
            { value: 'Modelado 3D Liquid Chrome para Campaña', label: 'Modelado 3D Liquid Chrome', icon: 'fa-cube' }
        ],
        step2VibeLabel: 'Estética & Universo de la Marca a Marcar:',
        vibes: [
            { value: 'Avant-Garde & High Fashion Contemporáneo', label: 'Avant-Garde / High Fashion', icon: 'fa-gem' },
            { value: 'Brutalista / Y2K Liquid Chrome & Distópico', label: 'Brutalista / Y2K Chrome', icon: 'fa-cubes-stacked' },
            { value: 'Minimalismo Industrial Técnico & Táctico', label: 'Industrial Técnico / Minimal', icon: 'fa-microchip' },
            { value: 'Streetwear Japonés / Dark / Oversize', label: 'Streetwear Japonés / Dark', icon: 'fa-skull' },
            { value: 'Retro Deportivo / Vintage 90s', label: 'Retro Deportivo 90s', icon: 'fa-trophy' }
        ],
        step2ColorLabel: 'Paleta Cromática Textil a Marcar:',
        colors: [
            { value: 'Monocromo High-Contrast (Negro Profundo & Off-White)', label: 'Negro Profundo & Off-White', colorHex: '#E2E8F0' },
            { value: 'Cromo Reflectivo Líquido & Titanio Metálico', label: 'Cromo Reflectivo & Titanio', colorHex: '#94A3B8' },
            { value: 'Eléctrico STREAK (Azul Cobalto & Cyan)', label: 'Eléctrico STREAK (Azul & Cyan)', colorHex: '#0066FF' },
            { value: 'Tonos Tierra, Grafito & Verde Militar', label: 'Tierra, Grafito & Oliva', colorHex: '#588157' },
            { value: 'Criterio Creativo Libre (STREAK Asesora)', label: 'Criterio Libre STREAK', icon: 'fa-wand-sparkles' }
        ],
        step2TypographyLabel: 'Estilo Tipográfico de la Marca a Marcar:',
        typographies: [
            { value: 'Wordmark Minimalista Sans-Serif Geométrico', label: 'Wordmark Sans-Serif Minimal', icon: 'fa-lines-leaning' },
            { value: 'Monograma Emblemático Bordable', label: 'Monograma Bordable', icon: 'fa-font' },
            { value: 'Tipografía Distorsionada / Grunge Experimental', label: 'Tipografía Grunge Experimental', icon: 'fa-cubes' },
            { value: 'Tipografía 3D Chrome Metálica', label: 'Tipografía 3D Chrome', icon: 'fa-cube' }
        ],
        step2ExclusionsPlaceholder: 'Ej: No tipografías estándar tipo Arial, no imitar marcas masivas como Supreme o Nike...',
        step3Tag: 'PASO 03 // SOPORTES TEXTILES & AUDIENCIA',
        step3Title: 'Soportes de la Prenda, Packaging & E-Commerce',
        step3AppLabel: '¿Dónde se aplicará el branding textil? (Multi-selección a marcar):',
        applications: [
            { value: 'Etiquetas de Cuello, Marquillas & Hangtags', label: 'Etiquetas & Hangtags Prendas', icon: 'fa-tag' },
            { value: 'Packaging, Cajas & Bolsas de Envío', label: 'Packaging & Bolsas de Envío', icon: 'fa-box-open' },
            { value: 'Tienda Online Oficial (Shopify) & Lookbook Digital', label: 'Tienda Online (Shopify) & Web', icon: 'fa-cart-shopping' },
            { value: 'Serigrafía / DTF de Alto Gramaje en Prendas', label: 'Estampados / Serigrafía Textil', icon: 'fa-shirt' },
            { value: 'Campañas Editoriales & Renders 3D en Redes', label: 'Lookbook & Renders 3D Redes', icon: 'fa-camera' },
            { value: 'Pop-Up Store, Percheros & Señalética de Tienda', label: 'Pop-Up Store & Rótulos', icon: 'fa-shop' }
        ],
        step3AudienceLabel: 'Público Objetivo de la Marca a Marcar:',
        audiences: [
            { value: 'Comunidad Streetwear, Sneakerheads & Skaters', label: 'Comunidad Streetwear & Skater', icon: 'fa-users' },
            { value: 'Consumidores de Moda High-End & Exclusiva', label: 'Consumidores High-End Moda', icon: 'fa-gem' },
            { value: 'Gen Z / Jóvenes Creativos & Músicos', label: 'Gen Z & Creadores Urbanos', icon: 'fa-bolt' },
            { value: 'Boutiques Internacionales & Revendedores', label: 'Boutiques & Revendedores VIP', icon: 'fa-bag-shopping' }
        ],
        refsLabel: 'Enlace a Moodboard Textil / Lookbook / Pinterest:',
        refsPlaceholder: 'https://pinterest.com/hypervoid-streetwear... o enlace a Drive',
        contactNameLabel: 'Nombre del Diseñador / Founder de la Marca:',
        contactNamePlaceholder: 'Martín Silva (Founder & Creative Director)',
        notesLabel: 'Detalles de la Colección (Prendas, Drop inicial, Fechas):',
        notesPlaceholder: 'Tipo de prendas (hoodies 500gsm, tees, chaquetas), fecha del primer drop y requerimientos 3D...',
        defaultPreset: {
            brandName: 'HYPERVOID',
            tagline: 'Heavy Industrial Apparel',
            industry: 'Moda & Streetwear',
            deliverable: 'Logotipo 3D Liquid Chrome (Modelado CGI)',
            vibe: 'Brutalista / Y2K Liquid Chrome',
            color: 'Cromo Líquido Reflectivo & Titanio',
            typography: 'Tipografía 3D Monumental',
            exclusions: 'No tipografías tradicionales sans-serif aburridas. Debe sentirse metal pesado y distorsión.',
            applications: [
                'Etiquetas de Cuello, Marquillas & Hangtags',
                'Packaging, Cajas & Bolsas de Envío',
                'Tienda Online Oficial (Shopify) & Lookbook Digital',
                'Campañas Editoriales & Renders 3D en Redes'
            ],
            audience: 'Consumidores High-End & Moda Streetwear',
            refsLink: 'https://pinterest.com/hypervoid-streetwear',
            deadline: 'Fast-Track Táctico (3 a 5 Días Laborales)',
            budget: '$1.000.000 - $2.500.000 CLP (Identidad + Render 3D Chrome)',
            contactName: 'Mateo Gómez (Founder)',
            contactEmail: 'mateo@hypervoid.co',
            contactPhone: '+54 9 11 4455-8899',
            notes: 'Campaña Drop cápsula de 500 chaquetas y hoodies bordados en cromo reflectivo.'
        }
    },

    label: {
        categoryKey: 'label',
        industryName: 'Sello Discográfico & Management',
        presetName: 'VORTEX DISCOS',
        tagline: 'Global Electronic Syndicate',
        step1DeliverableLabel: 'Tipo de Entregable para Sello a Marcar:',
        deliverables: [
            { value: 'Isotipo Emblemático de Sello Discográfico', label: 'Isotipo Oficial de Sello', icon: 'fa-compact-disc' },
            { value: 'Sistema de Identidad Corporativa & Brandbook', label: 'Identidad + Brandbook Completo', icon: 'fa-book-bookmark' },
            { value: 'Sellos de Agua & Identidad para Videoclips', label: 'Sellos de Agua para Videoclips', icon: 'fa-video' },
            { value: 'Logo 3D Animado para Apertura de Videos', label: 'Logo 3D Animado Apertura', icon: 'fa-cube' }
        ],
        step2VibeLabel: 'Personalidad Institucional del Sello a Marcar:',
        vibes: [
            { value: 'Institucional de Élite / Major Label', label: 'Élite Institucional / Major', icon: 'fa-building' },
            { value: 'Vanguardista & Disruptivo Independiente', label: 'Vanguardista / Indie Disruptivo', icon: 'fa-bolt' },
            { value: 'Minimalista & Editorial de Lujo', label: 'Minimalista / Lujo Editorial', icon: 'fa-gem' },
            { value: 'Futurista / Cyber Sound', label: 'Futurista / Cyber Sound', icon: 'fa-microchip' },
            { value: 'Cinematográfico & Épico', label: 'Cinematográfico Épico', icon: 'fa-clapperboard' }
        ],
        step2ColorLabel: 'Paleta Cromática del Sello a Marcar:',
        colors: [
            { value: 'Monocromo (Negro Obsidiana, Plata & Blanco Puro)', label: 'Monocromo (Negro & Plata)', colorHex: '#E2E8F0' },
            { value: 'Eléctrico STREAK (Azul Cobalto & Cyan)', label: 'Eléctrico STREAK (Azul & Cyan)', colorHex: '#0066FF' },
            { value: 'Dorado Champán & Carbón Mate', label: 'Dorado & Carbón Mate', colorHex: '#D4AF37' },
            { value: 'Titanio Cepillado & Grafito', label: 'Titanio & Grafito', colorHex: '#94A3B8' },
            { value: 'Criterio Creativo Libre (STREAK Decide)', label: 'Criterio Libre STREAK', icon: 'fa-wand-sparkles' }
        ],
        step2TypographyLabel: 'Estilo Tipográfico del Sello a Marcar:',
        typographies: [
            { value: 'Monograma Emblemático de Sello', label: 'Monograma Emblemático', icon: 'fa-font' },
            { value: 'Wordmark Tipográfico Institucional', label: 'Wordmark Institucional', icon: 'fa-lines-leaning' },
            { value: 'Isotipo Geométrico Abstracto', label: 'Isotipo Geométrico', icon: 'fa-shapes' },
            { value: 'Logotipo 3D Esculpido para Pantallas', label: 'Logotipo 3D Esculpido', icon: 'fa-cube' }
        ],
        step2ExclusionsPlaceholder: 'Ej: No parecer sello genérico de los 90, evitar notas musicales o discos de vinilo cliché...',
        step3Tag: 'PASO 03 // SOPORTES DE DISTRIBUCIÓN & INDUSTRIA',
        step3Title: 'Soportes de Distribución Musical & Contratos',
        step3AppLabel: '¿Dónde vivirá la firma del sello? (Multi-selección a marcar):',
        applications: [
            { value: 'Aperturas de Videoclips Oficiales (Opening Billboard)', label: 'Intro Videoclips (Opening)', icon: 'fa-video' },
            { value: 'Distribución Digital (Spotify, Apple Music, YouTube)', label: 'Distribuidoras (Spotify/Apple)', icon: 'fa-compact-disc' },
            { value: 'Contratos Legales, Papelería Ejecutiva & Dossiers', label: 'Contratos & Papelería Legal', icon: 'fa-file-signature' },
            { value: 'Dossiers de Artistas & Pitch a Plataformas', label: 'Pitch Decks a Plataformas', icon: 'fa-briefcase' },
            { value: 'Merchandising Corporativo & Placas de Oro/Platino', label: 'Placas de Reconocimiento & Merch', icon: 'fa-award' },
            { value: 'Sitio Web Oficial & Redes de Sello', label: 'Web Oficial & Redes Sociales', icon: 'fa-globe' }
        ],
        step3AudienceLabel: 'Audiencia Clave del Sello a Marcar:',
        audiences: [
            { value: 'Artistas, Productores & Managers Emergentes', label: 'Artistas & Productores', icon: 'fa-microphone' },
            { value: 'Ejecutivos de la Industria Musical & Distribuidores', label: 'Ejecutivos Musicales Globales', icon: 'fa-briefcase' },
            { value: 'Público General & Melómanos', label: 'Público Oyente & Fans', icon: 'fa-headphones' },
            { value: 'Marcas Comerciales para Patrocinios', label: 'Marcas & Patrocinadores', icon: 'fa-handshake' }
        ],
        refsLabel: 'Enlace a Referencias de Sellos / Dossier / Moodboard:',
        refsPlaceholder: 'https://behance.net/collection/high-end-labels',
        contactNameLabel: 'Nombre del Director / CEO del Sello:',
        contactNamePlaceholder: 'Andrea Rivas (Directora Ejecutiva)',
        notesLabel: 'Detalles de Lanzamiento del Sello / Artistas Fichados:',
        notesPlaceholder: 'Sello con 14 artistas firmados. Sistema versátil en vinilo físico y plataformas de streaming...',
        defaultPreset: {
            brandName: 'VORTEX DISCOS',
            tagline: 'Global Electronic Syndicate',
            industry: 'Sello Discográfico & Management',
            deliverable: 'Sistema de Identidad + Manual de Marca (Brandbook)',
            vibe: 'Minimalista / High-End de Lujo',
            color: 'Monocromático (Negro Obsidiana, Blanco Puro & Plata)',
            typography: 'Monograma / Iniciales Emblemáticas',
            exclusions: 'Evitar saturación excesiva, sobriedad y máxima elegancia para contratos y vinilos.',
            applications: [
                'Aperturas de Videoclips Oficiales (Opening Billboard)',
                'Distribución Digital (Spotify, Apple Music, YouTube)',
                'Contratos Legales, Papelería Ejecutiva & Dossiers',
                'Sitio Web Oficial & Redes de Sello'
            ],
            audience: 'Ejecutivos de Sellos & Marcas Globales',
            refsLink: 'https://behance.net/collection/high-end-labels',
            deadline: 'Estándar Curado (1 a 2 Semanas)',
            budget: '$2.500.000 - $5.000.000 CLP (Branding Completo + Manual)',
            contactName: 'Andrea Rivas (Directora Ejecutiva)',
            contactEmail: 'a.rivas@vortexdiscos.com',
            contactPhone: '+1 (305) 920-1144',
            notes: 'Sello con 14 artistas firmados. Sistema versátil en vinilo físico y plataformas de streaming.'
        }
    },

    productora: {
        categoryKey: 'productora',
        industryName: 'Productora Audiovisual & Cine',
        presetName: 'NEOMOTION CINE',
        tagline: 'High-Impact Cinema Studio',
        step1DeliverableLabel: 'Tipo de Entregable Cinematográfico a Marcar:',
        deliverables: [
            { value: 'Isotipo Emblemático de Productora Cinematográfica', label: 'Isotipo Cinematográfico 4K', icon: 'fa-film' },
            { value: 'Intro 3D CGI para Cabecera de Películas / Videoclips', label: 'Intro 3D Cabecera de Película', icon: 'fa-cube' },
            { value: 'Manual de Identidad para Créditos & Pantalla Ancha', label: 'Manual para Créditos & Cine', icon: 'fa-book-bookmark' },
            { value: 'Pitch Deck & Dossier de Producción Visual', label: 'Pitch Deck para Plataformas', icon: 'fa-file-powerpoint' }
        ],
        step2VibeLabel: 'Estilo Visual de la Productora a Marcar:',
        vibes: [
            { value: 'Cinematográfico & Épico de Gran Escala', label: 'Cinematográfico & Épico', icon: 'fa-clapperboard' },
            { value: 'High-End Minimalista Estudio Creativo', label: 'High-End Minimalista Estudio', icon: 'fa-gem' },
            { value: 'Sci-Fi / Futurista / CGI Avanzado', label: 'Sci-Fi / Futurista CGI', icon: 'fa-microchip' },
            { value: 'Vintage Anamórfico 35mm & Granulado Texturado', label: 'Vintage 35mm Anamórfico', icon: 'fa-camera-retro' },
            { value: 'Underground & Videoclip Experimental', label: 'Videoclip Experimental', icon: 'fa-bolt' }
        ],
        step2ColorLabel: 'Paleta Cromática de la Productora a Marcar:',
        colors: [
            { value: 'Negro Cine, Titanio & Plata Pulida', label: 'Negro Cine & Plata Titanio', colorHex: '#E2E8F0' },
            { value: 'Eléctrico STREAK (Azul Nocturno & Cyan Glow)', label: 'Eléctrico STREAK (Azul & Cyan)', colorHex: '#0066FF' },
            { value: 'Dorado Cinematográfico & Carbón Mate', label: 'Dorado Cine & Carbón Mate', colorHex: '#D4AF37' },
            { value: 'Monocromo Anamórfico (Negro Puro & Blanco)', label: 'Monocromo Anamórfico', colorHex: '#FFFFFF' },
            { value: 'Criterio Creativo Libre (STREAK Asesora)', label: 'Criterio Libre STREAK', icon: 'fa-wand-sparkles' }
        ],
        step2TypographyLabel: 'Estilo Tipográfico Cinematográfico a Marcar:',
        typographies: [
            { value: 'Wordmark Cinematográfico Titular de Pantalla', label: 'Wordmark Cinematográfico Titular', icon: 'fa-font' },
            { value: 'Isotipo Geométrico Abstracto', label: 'Isotipo Abstracto', icon: 'fa-shapes' },
            { value: 'Logotipo 3D para Opening Billboard', label: 'Logo 3D Opening Billboard', icon: 'fa-cube' },
            { value: 'Monograma Clásico de Casa Productora', label: 'Monograma Casa Productora', icon: 'fa-lines-leaning' }
        ],
        step2ExclusionsPlaceholder: 'Ej: Evitar iconos de cámaras o claquetas clichés de stock, no tipografías genéricas...',
        step3Tag: 'PASO 03 // SOPORTES CINEMATOGRÁFICOS & PANTALLAS',
        step3Title: 'Soportes de Pantalla, Pitch Decks & Créditos',
        step3AppLabel: '¿Dónde vivirá la marca de la productora? (Multi-selección a marcar):',
        applications: [
            { value: 'Opening Billboard / Intro 3D para Videoclips & Películas', label: 'Intro 3D / Opening Billboard', icon: 'fa-film' },
            { value: 'Pitch Decks & Dossiers para Plataformas (Netflix, etc.)', label: 'Pitch Decks a Plataformas', icon: 'fa-briefcase' },
            { value: 'Créditos Finales & Claquetas de Rodaje', label: 'Créditos Finales & Claquetas', icon: 'fa-clapperboard' },
            { value: 'Sitio Web / Showreel 4K & Redes Sociales', label: 'Showreel 4K & Web Portfolio', icon: 'fa-video' },
            { value: 'Papelería Legal, Contratos de Casting & Callsheets', label: 'Callsheets & Contratos Rodaje', icon: 'fa-file-lines' },
            { value: 'Merch de Crew & Estuches Pelican de Cámara', label: 'Merch de Crew & Rótulos Pelican', icon: 'fa-box' }
        ],
        step3AudienceLabel: 'Audiencia & Clientes de la Productora a Marcar:',
        audiences: [
            { value: 'Sellos Musicales & Artistas de Videoclips', label: 'Sellos & Artistas Musicales', icon: 'fa-microphone' },
            { value: 'Agencias de Publicidad & Marcas Comerciales', label: 'Agencias & Marcas Comerciales', icon: 'fa-building' },
            { value: 'Directores, Guionistas & Plataformas de Streaming', label: 'Streaming & Directores Cine', icon: 'fa-tv' },
            { value: 'Audiencia Cinéfila Global', label: 'Audiencia Cinéfila Global', icon: 'fa-users' }
        ],
        refsLabel: 'Enlace a Showreel / Referencias Visuales / Vimeo:',
        refsPlaceholder: 'https://vimeo.com/... o enlace a Drive con referencias de cámara',
        contactNameLabel: 'Nombre del Director / Productor Ejecutivo:',
        contactNamePlaceholder: 'Rodrigo Santoro (Productor General)',
        notesLabel: 'Detalles del Estudio / Proyectos en Desarrollo:',
        notesPlaceholder: 'Tipos de proyectos que produce la casa (cine, videoclips, comerciales), fecha del reel y requerimientos...',
        defaultPreset: {
            brandName: 'NEOMOTION CINE',
            tagline: 'High-Impact Cinema Studio',
            industry: 'Productora Audiovisual & Cine',
            deliverable: 'Nuevo Logotipo + Isotipo Principal',
            vibe: 'Cinematográfico & Épico',
            color: 'Eléctrico STREAK (Azul Rey & Cyan Glow)',
            typography: 'Isotipo Geométrico / Símbolo Abstracto',
            exclusions: 'Evitar cámaras o claquetas literales infantiles. Queremos un símbolo de energía pura.',
            applications: [
                'Opening Billboard / Intro 3D para Videoclips & Películas',
                'Pitch Decks & Dossiers para Plataformas (Netflix, etc.)',
                'Créditos Finales & Claquetas de Rodaje',
                'Sitio Web / Showreel 4K & Redes Sociales'
            ],
            audience: 'Sellos Musicales & Artistas de Videoclips',
            refsLink: 'https://dropbox.com/s/references-neomotion',
            deadline: 'Fast-Track Táctico (3 a 5 Días Laborales)',
            budget: '$2.500.000 - $5.000.000 CLP (Branding Completo + Manual)',
            contactName: 'Rodrigo Santoro (Productor General)',
            contactEmail: 'rodrigo@neomotion.film',
            contactPhone: '+34 611 22 33 44',
            notes: 'Requerimos animación 3D del logo en 4K Apple ProRes 4444 para cabecera de videoclips.'
        }
    }
};

const BRIEF_PRESETS = {
    urbano: CATEGORY_SCHEMAS.urbano.defaultPreset,
    matrimonio: CATEGORY_SCHEMAS.matrimonio.defaultPreset,
    evento: CATEGORY_SCHEMAS.evento.defaultPreset,
    streetwear: CATEGORY_SCHEMAS.streetwear.defaultPreset,
    label: CATEGORY_SCHEMAS.label.defaultPreset,
    productora: CATEGORY_SCHEMAS.productora.defaultPreset
};

// Dynamic Category Rendering Engine
function renderCategorySchema(categoryKey, applyPresetData = false) {
    const schema = CATEGORY_SCHEMAS[categoryKey] || CATEGORY_SCHEMAS.urbano;
    currentBrief.categoryKey = categoryKey;
    currentBrief.industry = schema.industryName;

    // 1. Update Paso 01 Deliverables
    const delivLabel = document.getElementById('deliverableTitleLabel');
    if (delivLabel && schema.step1DeliverableLabel) {
        delivLabel.textContent = schema.step1DeliverableLabel;
    }
    const delivContainer = document.getElementById('deliverableChips');
    if (delivContainer && schema.deliverables) {
        delivContainer.innerHTML = schema.deliverables.map((d, i) => `
            <div class="chip-option chip-deliverable ${i === 0 ? 'active' : ''}" data-value="${d.value}">
                <i class="fa-solid ${d.icon} chip-icon"></i>
                <span class="chip-label">${d.label}</span>
            </div>
        `).join('');
        if (applyPresetData || !currentBrief.deliverable) {
            currentBrief.deliverable = schema.deliverables[0].value;
        }
    }

    // 2. Update Paso 02 Artistic Direction
    const vibeLabel = document.getElementById('vibeTitleLabel');
    if (vibeLabel && schema.step2VibeLabel) vibeLabel.textContent = schema.step2VibeLabel;
    const vibeContainer = document.getElementById('vibeChips');
    if (vibeContainer && schema.vibes) {
        vibeContainer.innerHTML = schema.vibes.map((v, i) => `
            <div class="chip-option chip-vibe ${i === 0 ? 'active' : ''}" data-value="${v.value}">
                <i class="fa-solid ${v.icon} chip-icon"></i>
                <span class="chip-label">${v.label}</span>
            </div>
        `).join('');
        if (applyPresetData || !currentBrief.vibe) {
            currentBrief.vibe = schema.vibes[0].value;
        }
    }

    const colorLabel = document.getElementById('colorTitleLabel');
    if (colorLabel && schema.step2ColorLabel) colorLabel.textContent = schema.step2ColorLabel;
    const colorContainer = document.getElementById('colorChips');
    if (colorContainer && schema.colors) {
        colorContainer.innerHTML = schema.colors.map((c, i) => `
            <div class="chip-option chip-color ${i === 0 ? 'active' : ''}" data-value="${c.value}">
                ${c.colorHex ? `<i class="fa-solid fa-circle" style="color: ${c.colorHex};"></i>` : `<i class="fa-solid ${c.icon || 'fa-wand-sparkles'} chip-icon"></i>`}
                <span class="chip-label">${c.label}</span>
            </div>
        `).join('');
        if (applyPresetData || !currentBrief.color) {
            currentBrief.color = schema.colors[0].value;
        }
    }

    const typoLabel = document.getElementById('typographyTitleLabel');
    if (typoLabel && schema.step2TypographyLabel) typoLabel.textContent = schema.step2TypographyLabel;
    const typoContainer = document.getElementById('typographyChips');
    if (typoContainer && schema.typographies) {
        typoContainer.innerHTML = schema.typographies.map((t, i) => `
            <div class="chip-option chip-typography ${i === 0 ? 'active' : ''}" data-value="${t.value}">
                <i class="fa-solid ${t.icon} chip-icon"></i>
                <span class="chip-label">${t.label}</span>
            </div>
        `).join('');
        if (applyPresetData || !currentBrief.typography) {
            currentBrief.typography = schema.typographies[0].value;
        }
    }

    const exclusionsInput = document.getElementById('briefExclusions');
    if (exclusionsInput && schema.step2ExclusionsPlaceholder) {
        exclusionsInput.placeholder = schema.step2ExclusionsPlaceholder;
    }

    // 3. Update Paso 03 Soportes & Audiencia (Totally customized per category)
    const step3Tag = document.getElementById('step3Tag');
    if (step3Tag && schema.step3Tag) step3Tag.textContent = schema.step3Tag;

    const step3Title = document.getElementById('step3Title');
    if (step3Title && schema.step3Title) step3Title.textContent = schema.step3Title;

    const appLabel = document.getElementById('applicationTitleLabel');
    if (appLabel && schema.step3AppLabel) appLabel.textContent = schema.step3AppLabel;

    const appContainer = document.getElementById('applicationChips');
    if (appContainer && schema.applications) {
        const defaultApps = schema.defaultPreset?.applications || schema.applications.slice(0, 3).map(a => a.value);
        appContainer.innerHTML = schema.applications.map((a) => {
            const isAct = defaultApps.includes(a.value);
            return `
                <div class="chip-option chip-application ${isAct ? 'active' : ''}" data-value="${a.value}">
                    <i class="fa-solid ${a.icon} chip-icon"></i>
                    <span class="chip-label">${a.label}</span>
                </div>
            `;
        }).join('');
        if (applyPresetData || !currentBrief.applications || currentBrief.applications.length === 0) {
            currentBrief.applications = [...defaultApps];
        }
    }

    const audLabel = document.getElementById('audienceTitleLabel');
    if (audLabel && schema.step3AudienceLabel) audLabel.textContent = schema.step3AudienceLabel;

    const audContainer = document.getElementById('audienceChips');
    if (audContainer && schema.audiences) {
        audContainer.innerHTML = schema.audiences.map((au, i) => `
            <div class="chip-option chip-audience ${i === 0 ? 'active' : ''}" data-value="${au.value}">
                <i class="fa-solid ${au.icon} chip-icon"></i>
                <span class="chip-label">${au.label}</span>
            </div>
        `).join('');
        if (applyPresetData || !currentBrief.audience) {
            currentBrief.audience = schema.audiences[0].value;
        }
    }

    const refsLabel = document.getElementById('refsTitleLabel');
    if (refsLabel && schema.refsLabel) refsLabel.textContent = schema.refsLabel;
    const refsInput = document.getElementById('briefRefsLink');
    if (refsInput && schema.refsPlaceholder) refsInput.placeholder = schema.refsPlaceholder;

    // 4. Update Paso 04 Contact & Details
    const contactLabel = document.getElementById('contactNameTitleLabel');
    if (contactLabel && schema.contactNameLabel) {
        contactLabel.innerHTML = `${schema.contactNameLabel} <span style="color: var(--streak-cyan);">*</span>`;
    }
    const contactInput = document.getElementById('briefContactName');
    if (contactInput && schema.contactNamePlaceholder) {
        contactInput.placeholder = schema.contactNamePlaceholder;
    }

    const notesLabel = document.getElementById('notesTitleLabel');
    if (notesLabel && schema.notesLabel) notesLabel.textContent = schema.notesLabel;
    const notesInput = document.getElementById('briefNotes');
    if (notesInput && schema.notesPlaceholder) {
        notesInput.placeholder = schema.notesPlaceholder;
    }

    // 5. Update State & Input Values if requested
    if (applyPresetData && schema.defaultPreset) {
        Object.assign(currentBrief, schema.defaultPreset);
        syncInputsWithState();
    }

    // 6. Re-bind Event Handlers on Newly Rendered Dynamic Chips
    bindSingleChipGroup('#deliverableChips .chip-deliverable', 'deliverable');
    bindSingleChipGroup('#vibeChips .chip-vibe', 'vibe');
    bindSingleChipGroup('#colorChips .chip-color', 'color');
    bindSingleChipGroup('#typographyChips .chip-typography', 'typography');
    bindSingleChipGroup('#audienceChips .chip-audience', 'audience');

    // Multi-choice application chips
    const newAppChips = document.querySelectorAll('#applicationChips .chip-application');
    newAppChips.forEach(chip => {
        chip.addEventListener('click', () => {
            chip.classList.toggle('active');
            const val = chip.getAttribute('data-value');
            if (chip.classList.contains('active')) {
                if (!currentBrief.applications.includes(val)) currentBrief.applications.push(val);
            } else {
                currentBrief.applications = currentBrief.applications.filter(a => a !== val);
            }
            updateLiveSummary();
        });
    });

    // 7. Update Live Summary Dock and Badges
    updateLiveSummary();
}

function initBrandBriefingLab() {
    // Generate fresh tracking code
    currentBrief.code = 'STRK-BRND-2026-' + Math.floor(1000 + Math.random() * 9000);

    // Bind Industry Chips in Paso 01 to dynamically change category and options
    const indChips = document.querySelectorAll('#industryChips .chip-industry');
    indChips.forEach(chip => {
        chip.addEventListener('click', () => {
            indChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            const cat = chip.getAttribute('data-category') || 'urbano';
            const presetSelect = document.getElementById('briefPresetSelect');
            if (presetSelect) presetSelect.value = cat;
            renderCategorySchema(cat, true);
            showToast(`Categoría "${CATEGORY_SCHEMAS[cat]?.industryName || cat}" activada`, 'fa-wand-magic-sparkles');
        });
    });

    // Bind Deadline and Budget Chips in Paso 04
    bindSingleChipGroup('#deadlineChips .chip-deadline', 'deadline');
    bindSingleChipGroup('#budgetChips .chip-budget', 'budget');

    // Initialize with default category schema (Música Urbana)
    renderCategorySchema('urbano', false);

    // Sync input fields
    syncInputsWithState();
    updateLiveSummary();
}

function bindSingleChipGroup(selector, briefKey) {
    const chips = document.querySelectorAll(selector);
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            chips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            currentBrief[briefKey] = chip.getAttribute('data-value');
            updateLiveSummary();
        });
    });
}

function syncInputsWithState() {
    const brandInput = document.getElementById('briefBrandName');
    const taglineInput = document.getElementById('briefBrandTagline');
    const exclusionsInput = document.getElementById('briefExclusions');
    const refsInput = document.getElementById('briefRefsLink');
    const contactNameInput = document.getElementById('briefContactName');
    const contactEmailInput = document.getElementById('briefContactEmail');
    const contactPhoneInput = document.getElementById('briefContactPhone');
    const notesInput = document.getElementById('briefNotes');

    if (brandInput) brandInput.value = currentBrief.brandName;
    if (taglineInput) taglineInput.value = currentBrief.tagline;
    if (exclusionsInput) exclusionsInput.value = currentBrief.exclusions;
    if (refsInput) refsInput.value = currentBrief.refsLink;
    if (contactNameInput) contactNameInput.value = currentBrief.contactName;
    if (contactEmailInput) contactEmailInput.value = currentBrief.contactEmail;
    if (contactPhoneInput) contactPhoneInput.value = currentBrief.contactPhone;
    if (notesInput) notesInput.value = currentBrief.notes;
}

function updateLiveSummary() {
    // Read current form inputs
    const brandInput = document.getElementById('briefBrandName');
    const taglineInput = document.getElementById('briefBrandTagline');
    const exclusionsInput = document.getElementById('briefExclusions');
    const refsInput = document.getElementById('briefRefsLink');
    const contactNameInput = document.getElementById('briefContactName');
    const contactEmailInput = document.getElementById('briefContactEmail');
    const contactPhoneInput = document.getElementById('briefContactPhone');
    const notesInput = document.getElementById('briefNotes');

    if (brandInput && brandInput.value) currentBrief.brandName = brandInput.value.trim();
    if (taglineInput) currentBrief.tagline = taglineInput.value.trim();
    if (exclusionsInput) currentBrief.exclusions = exclusionsInput.value.trim();
    if (refsInput) currentBrief.refsLink = refsInput.value.trim();
    if (contactNameInput && contactNameInput.value) currentBrief.contactName = contactNameInput.value.trim();
    if (contactEmailInput && contactEmailInput.value) currentBrief.contactEmail = contactEmailInput.value.trim();
    if (contactPhoneInput && contactPhoneInput.value) currentBrief.contactPhone = contactPhoneInput.value.trim();
    if (notesInput) currentBrief.notes = notesInput.value.trim();

    // Update Dock elements
    const codeEl = document.getElementById('liveBriefCode');
    const titleEl = document.getElementById('liveBriefTitle');
    const taglineEl = document.getElementById('liveBriefTagline');
    const sectorEl = document.getElementById('liveBriefSector');
    const deliverableEl = document.getElementById('liveBriefDeliverable');
    const vibeEl = document.getElementById('liveBriefVibe');
    const deadlineEl = document.getElementById('liveBriefDeadline');
    const budgetEl = document.getElementById('liveBriefBudget');

    if (codeEl) codeEl.textContent = currentBrief.code;
    if (titleEl) titleEl.textContent = currentBrief.brandName || 'TU MARCA O ARTISTA';
    if (taglineEl) {
        taglineEl.textContent = currentBrief.tagline || 'Sin Tagline';
        taglineEl.style.display = currentBrief.tagline ? 'inline-block' : 'none';
    }
    if (sectorEl) sectorEl.textContent = currentBrief.industry;
    if (deliverableEl) deliverableEl.textContent = currentBrief.deliverable;
    if (vibeEl) vibeEl.textContent = currentBrief.vibe;
    if (deadlineEl) deadlineEl.textContent = currentBrief.deadline.split('(')[0].trim();
    if (budgetEl) budgetEl.textContent = currentBrief.budget.split('(')[0].trim();

    // Update Accordion Header Badges
    const b1 = document.getElementById('badgeStep1');
    const b2 = document.getElementById('badgeStep2');
    const b3 = document.getElementById('badgeStep3');
    const b4 = document.getElementById('badgeStep4');

    if (b1) {
        const brand = currentBrief.brandName || 'Tu Marca';
        const ind = (currentBrief.industry || '').split('/')[0].trim();
        b1.textContent = `${brand} • ${ind}`;
    }
    if (b2) {
        const vibe = (currentBrief.vibe || '').split('/')[0].trim();
        const col = (currentBrief.color || '').split('(')[0].trim();
        b2.textContent = `${vibe} • ${col}`;
    }
    if (b3) {
        const appCount = currentBrief.applications ? currentBrief.applications.length : 0;
        const aud = (currentBrief.audience || '').split('&')[0].trim();
        b3.textContent = `${appCount} Aplicaciones • ${aud}`;
    }
    if (b4) {
        const dline = (currentBrief.deadline || '').split('(')[0].trim();
        const bgt = (currentBrief.budget || '').split('(')[0].trim();
        b4.textContent = `${dline} • ${bgt}`;
    }
}

// Accordion Control Functions for Collapsible Brief Sections
function toggleAccordion(accordionId) {
    const item = document.getElementById(accordionId);
    if (!item) return;
    item.classList.toggle('open');
}

function toggleAllAccordions(expand) {
    const items = document.querySelectorAll('.brief-accordion-item');
    items.forEach(item => {
        if (expand) {
            item.classList.add('open');
        } else {
            item.classList.remove('open');
        }
    });
}

function applyBriefPreset(presetKey) {
    // Sync Dropdown selector
    const presetSelect = document.getElementById('briefPresetSelect');
    if (presetSelect && presetSelect.value !== presetKey) {
        presetSelect.value = presetKey;
    }

    if (presetKey === 'custom') {
        resetBriefForm();
        const acc1 = document.getElementById('briefAccordion1');
        if (acc1) acc1.classList.add('open');
        showToast('Formulario preparado para solicitud personalizada', 'fa-pen-to-square');
        return;
    }

    if (CATEGORY_SCHEMAS[presetKey]) {
        // Sync Industry Chip in Step 1
        const indChips = document.querySelectorAll('#industryChips .chip-industry');
        indChips.forEach(c => {
            if (c.getAttribute('data-category') === presetKey) {
                c.classList.add('active');
            } else {
                c.classList.remove('active');
            }
        });

        // Re-render whole schema & apply preset data
        renderCategorySchema(presetKey, true);

        // Ensure first step is visible to reveal marked options
        const acc1 = document.getElementById('briefAccordion1');
        if (acc1 && !acc1.classList.contains('open')) {
            acc1.classList.add('open');
        }

        const name = CATEGORY_SCHEMAS[presetKey].defaultPreset?.brandName || CATEGORY_SCHEMAS[presetKey].presetName;
        showToast(`Preset "${name}" (${CATEGORY_SCHEMAS[presetKey].industryName}) aplicado con éxito`, 'fa-wand-magic-sparkles');
    }
}

function resetBriefForm() {
    currentBrief.brandName = '';
    currentBrief.tagline = '';
    currentBrief.exclusions = '';
    currentBrief.refsLink = '';
    currentBrief.notes = '';
    currentBrief.applications = [];

    syncInputsWithState();

    const appChips = document.querySelectorAll('.chip-application');
    appChips.forEach(c => c.classList.remove('active'));

    const presetSelect = document.getElementById('briefPresetSelect');
    if (presetSelect) presetSelect.value = 'custom';

    updateLiveSummary();
    showToast('Formulario limpiado. Introduce los datos de tu marca.', 'fa-rotate-left');
}

function handleBriefSubmit(e) {
    e.preventDefault();

    updateLiveSummary();

    if (!currentBrief.brandName) {
        showToast('Por favor introduce el nombre de la marca', 'fa-circle-exclamation');
        return;
    }

    const submitBtn = document.getElementById('btnSubmitBrief');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Compilando PDF Ejecutivo...';
    }

    setTimeout(() => {
        // Persist brief to local history
        try {
            const history = JSON.parse(localStorage.getItem('streak_briefs_history') || '[]');
            history.unshift({
                timestamp: new Date().toISOString(),
                ...currentBrief
            });
            localStorage.setItem('streak_briefs_history', JSON.stringify(history.slice(0, 50)));
        } catch (e) {
            console.warn('Could not save brief to localStorage', e);
        }

        const fileName = generateBriefPdf(currentBrief);

        // Auto-deliver brief details to contact@streakmotion.com
        sendBriefAutoEmail(currentBrief);

        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fa-solid fa-file-pdf"></i> Generar Brief Oficial & Descargar PDF';
        }

        // Populate and open success modal
        const modalFileName = document.getElementById('modalPdfFileName');
        const modalTracking = document.getElementById('modalTrackingCode');
        const modalProject = document.getElementById('modalProjectName');
        const modalDeliv = document.getElementById('modalDeliverable');
        const modalDead = document.getElementById('modalDeadline');
        const modalContact = document.getElementById('modalContact');

        if (modalFileName) modalFileName.textContent = fileName || 'STREAK_BRIEF.pdf';
        if (modalTracking) modalTracking.textContent = currentBrief.code;
        if (modalProject) modalProject.textContent = currentBrief.brandName;
        if (modalDeliv) modalDeliv.textContent = currentBrief.deliverable;
        if (modalDead) modalDead.textContent = currentBrief.deadline.split('(')[0].trim();
        if (modalContact) modalContact.textContent = currentBrief.contactName;

        const modal = document.getElementById('streakBriefSuccessModal');
        if (modal) modal.classList.add('open');

        showToast('PDF compilado y descargado con éxito', 'fa-circle-check');
    }, 450);
}

function generateBriefPdf(b) {
    const { jsPDF } = window.jspdf || {};
    if (!jsPDF) {
        showToast("Error al inicializar motor PDF", "fa-triangle-exclamation");
        return null;
    }

    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    const primaryBlue = [0, 102, 255]; // #0066FF
    const darkNavy = [10, 15, 36];     // #0A0F24
    const textDark = [20, 24, 38];
    const textMuted = [100, 116, 139];
    const bgLight = [248, 250, 252];
    const borderCol = [226, 232, 240];

    // Top Header Banner
    doc.setFillColor(...darkNavy);
    doc.rect(0, 0, 210, 34, 'F');

    // Electric Blue Accent Line
    doc.setFillColor(...primaryBlue);
    doc.rect(0, 34, 210, 1.5, 'F');

    // Brand Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text("STREAK STUDIOS", 15, 14);

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 210, 255);
    doc.text("PRODUCCIÓN AUDIOVISUAL & ESTUDIO DE DISEÑO GRÁFICO", 15, 20);

    doc.setFontSize(7.5);
    doc.setTextColor(180, 200, 230);
    doc.text("Santiago • Miami • Madrid • contact@streakmotion.com • @studio_streak", 15, 26);

    // Document Meta (Top Right)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(255, 255, 255);
    doc.text("OFFICIAL CREATIVE BRIEF", 195, 13, { align: "right" });

    doc.setFontSize(7.5);
    doc.setTextColor(0, 210, 255);
    doc.text(`CÓDIGO: ${b.code}`, 195, 19, { align: "right" });

    doc.setFont("helvetica", "normal");
    doc.setTextColor(180, 200, 230);
    doc.text(`FECHA: ${b.date}`, 195, 25, { align: "right" });

    let y = 44;

    // Helper: Draw Section Title
    function drawSectionTitle(num, title) {
        doc.setFillColor(...primaryBlue);
        doc.roundedRect(15, y, 6, 6, 1, 1, 'F');
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.5);
        doc.setTextColor(255, 255, 255);
        doc.text(num, 18, y + 4.2, { align: "center" });

        doc.setFontSize(9.5);
        doc.setTextColor(...darkNavy);
        doc.text(title.toUpperCase(), 24, y + 4.6);

        y += 8;
    }

    // Helper: Draw Key/Value Row
    function drawRow(label, value, width = 180) {
        doc.setFillColor(...bgLight);
        doc.setDrawColor(...borderCol);
        doc.roundedRect(15, y, width, 8, 1, 1, 'FD');

        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.5);
        doc.setTextColor(...textMuted);
        doc.text(label.toUpperCase(), 18, y + 5.2);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(...textDark);
        doc.text(String(value || '-'), 75, y + 5.2);

        y += 9.5;
    }

    // Helper: Draw Multiline Box
    function drawMultilineBox(label, text, height = 13) {
        doc.setFillColor(...bgLight);
        doc.setDrawColor(...borderCol);
        doc.roundedRect(15, y, 180, height, 1, 1, 'FD');

        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.5);
        doc.setTextColor(...textMuted);
        doc.text(label.toUpperCase(), 18, y + 4.5);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(...textDark);
        const splitText = doc.splitTextToSize(String(text || '-'), 172);
        doc.text(splitText, 18, y + 8.5);

        y += height + 2;
    }

    // SECTION 1: Identidad & Fundamentos del Proyecto
    drawSectionTitle("01", "Identidad & Fundamentos del Proyecto");
    drawRow("Nombre Oficial:", b.brandName);
    if (b.tagline) drawRow("Slogan / Tagline:", b.tagline);
    drawRow("Sector / Industria:", b.industry);
    drawRow("Entregable Principal:", b.deliverable);
    y += 2;

    // SECTION 2: Dirección Artística & Look & Feel
    drawSectionTitle("02", "Dirección Artística & Look & Feel");
    drawRow("Personalidad / Vibra:", b.vibe);
    drawRow("Paleta Cromática:", b.color);
    drawRow("Estilo Tipográfico / Símbolo:", b.typography);
    if (b.exclusions) {
        drawMultilineBox("Elementos o Clichés a Evitar:", b.exclusions, 12);
    }
    y += 2;

    // SECTION 3: Soportes Clave & Audiencia
    drawSectionTitle("03", "Soportes Clave & Audiencia");
    const appsText = (b.applications && b.applications.length > 0) ? b.applications.join("  •  ") : "Todos los soportes digitales";
    drawMultilineBox("Aplicaciones del Logotipo:", appsText, 12);
    drawRow("Público Objetivo:", b.audience);
    if (b.refsLink) drawRow("Enlace de Referencias / Moodboard:", b.refsLink);
    y += 2;

    // SECTION 4: Producción & Datos de Contacto
    drawSectionTitle("04", "Producción, Presupuesto & Contacto");
    drawRow("Plazo de Entrega Deseado:", b.deadline);
    drawRow("Rango Presupuestario:", b.budget);
    drawRow("Responsable / Manager:", b.contactName);
    drawRow("Email Notificaciones:", b.contactEmail);
    drawRow("Teléfono / WhatsApp:", b.contactPhone);
    if (b.notes) {
        drawMultilineBox("Instrucciones Específicas:", b.notes, 12);
    }

    // SECTION 5: Official Production Approval Stamp
    y = Math.max(y + 2, 260);
    doc.setFillColor(...darkNavy);
    doc.roundedRect(15, y, 180, 24, 2, 2, 'F');

    // Cyan strip inside footer box
    doc.setFillColor(0, 210, 255);
    doc.rect(15, y, 3, 24, 'F');

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text("STREAK STUDIOS • CONTROL DE CALIDAD & PRODUCCIÓN", 22, y + 7);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(180, 200, 230);
    doc.text("Este documento certifica las especificaciones creativas y técnicas acordadas para dar inicio a la fase de", 22, y + 12);
    doc.text("bocetaje, modelado 3D Liquid Chrome o desarrollo de identidad. Envío oficial a contact@streakmotion.com.", 22, y + 16);

    // Approved Stamp
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(0, 230, 118);
    doc.text("[ ✓ ] STATUS: LISTO PARA PRODUCCIÓN", 190, y + 19, { align: "right" });

    // Clean safe filename
    const safeName = (b.brandName || 'PROYECTO').replace(/[^a-zA-Z0-9_-]/g, '_').toUpperCase();
    const fileName = `STREAK_BRIEF_${safeName}.pdf`;
    doc.save(fileName);
    return fileName;
}

function triggerEmailSend() {
    const b = currentBrief;
    const subject = encodeURIComponent(`[BRIEF BRANDING] ${b.brandName} - Solicitud de Producción STREAK`);
    const body = encodeURIComponent(
`SOLICITUD DE BRIEF BRANDING & LOGOTIPO // STREAK STUDIOS
Código de Seguimiento: ${b.code}
Fecha: ${b.date}

1. IDENTIDAD DEL PROYECTO:
- Nombre de la Marca / Artista: ${b.brandName}
- Slogan / Tagline: ${b.tagline || 'N/A'}
- Sector / Industria: ${b.industry}
- Entregable Solicitado: ${b.deliverable}

2. ESTILO VISUAL & LOOK AND FEEL:
- Personalidad / Vibra: ${b.vibe}
- Paleta Cromática: ${b.color}
- Estilo Tipográfico: ${b.typography}
- Elementos a Evitar: ${b.exclusions || 'Ninguno'}

3. APLICACIONES & AUDIENCIA:
- Dónde vivirá el logo: ${(b.applications && b.applications.length > 0) ? b.applications.join(', ') : 'Digital General'}
- Audiencia Objetivo: ${b.audience}
- Referencias / Moodboard: ${b.refsLink || 'N/A'}

4. TIEMPOS & CONTACTO:
- Plazo de Entrega: ${b.deadline}
- Rango Presupuestario: ${b.budget}
- Responsable: ${b.contactName}
- Email: ${b.contactEmail}
- Teléfono / WhatsApp: ${b.contactPhone}
- Notas de Producción: ${b.notes || 'Ninguna'}

Documento PDF oficial generado y descargado localmente listo para producción.`
    );
    window.location.href = `mailto:contact@streakmotion.com?subject=${subject}&body=${body}`;
    showToast('Cliente de correo abierto para enviar brief a contact@streakmotion.com', 'fa-envelope');
}

function triggerWhatsAppSend() {
    const b = currentBrief;
    const text = encodeURIComponent(
`🚀 *NUEVO BRIEF BRANDING & LOGO - STREAK STUDIOS*
*Código:* ${b.code}
*Marca:* ${b.brandName}
*Industria:* ${b.industry}
*Entregable:* ${b.deliverable}
*Vibra:* ${b.vibe}
*Plazo:* ${b.deadline}
*Presupuesto:* ${b.budget}
*Responsable:* ${b.contactName} (${b.contactPhone})
*Email:* ${b.contactEmail}

¡El archivo PDF oficial se ha compilado y descargado listo para revisión y producción!`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
}

function reDownloadPdf() {
    generateBriefPdf(currentBrief);
    showToast('Descargando archivo PDF nuevamente...', 'fa-file-pdf');
}

function closeBriefModal() {
    const modal = document.getElementById('streakBriefSuccessModal');
    if (modal) modal.classList.remove('open');
}

function handleBriefModalClick(e) {
    if (e.target && e.target.id === 'streakBriefSuccessModal') {
        closeBriefModal();
    }
}

/* =========================================================
   5. SHOWREEL & MODAL HANDLERS
   ========================================================= */
function initModalHandlers() {
    const modalBackdrop = document.getElementById('streakModal');
    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', (e) => {
            if (e.target === modalBackdrop) {
                closeVideoModal();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeVideoModal();
        }
    });
}

function openVideoModal(title, videoSrc) {
    const modal = document.getElementById('streakModal');
    const titleEl = document.getElementById('streakModalTitle');
    const container = document.getElementById('streakModalVideoContainer');

    if (!modal || !titleEl || !container) return;

    titleEl.textContent = title;

    if (videoSrc.includes('youtube.com') || videoSrc.includes('youtu.be')) {
        let embedUrl = videoSrc;
        if (videoSrc.includes('watch?v=')) {
            embedUrl = videoSrc.replace('watch?v=', 'embed/');
        }
        container.innerHTML = `<iframe src="${embedUrl}?autoplay=1&rel=0" allow="autoplay; encrypted-media; fullscreen" allowfullscreen></iframe>`;
    } else {
        container.innerHTML = `
            <video controls autoplay style="width: 100%; height: 100%; object-fit: contain;">
                <source src="${videoSrc}" type="video/mp4">
                Tu navegador no soporta el reproductor de video.
            </video>
        `;
    }

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeVideoModal() {
    const modal = document.getElementById('streakModal');
    const container = document.getElementById('streakModalVideoContainer');
    if (!modal) return;

    modal.classList.remove('open');
    if (container) container.innerHTML = '';
    document.body.style.overflow = '';
}

/* =========================================================
   6. MOBILE NAV DRAWER TOGGLE
   ========================================================= */
function toggleMobileMenu() {
    const drawer = document.getElementById('streakMobileDrawer');
    if (!drawer) return;
    drawer.classList.toggle('open');
}

function closeMobileMenu() {
    const drawer = document.getElementById('streakMobileDrawer');
    if (drawer) drawer.classList.remove('open');
}

/* =========================================================
   7. UTILITIES: TOAST & CLIPBOARD
   ========================================================= */
function showToast(msg, icon = 'fa-circle-check') {
    const toast = document.getElementById('streakToast');
    const msgEl = document.getElementById('streakToastMsg');
    const iconEl = document.getElementById('streakToastIcon');

    if (!toast || !msgEl) return;

    msgEl.textContent = msg;
    if (iconEl) {
        iconEl.className = `fa-solid ${icon} text-cyan text-lg`;
    }

    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3200);
}

function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text);
    } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
    }
}

/* =========================================================
   8. DYNAMIC STICKY HEADER CONTROLLER
   ========================================================= */
function initStickyHeader() {
    const header = document.querySelector('.streak-header');
    if (!header) return;

    let ticking = false;

    const onScroll = () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                if (window.scrollY > 35) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
                ticking = false;
            });
            ticking = true;
        }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

/* =========================================================
   9. AUTOMATIC EMAIL NOTIFICATION ENGINE (WEB3FORMS)
   ========================================================= */
let STREAK_WEB3FORMS_KEY = localStorage.getItem('streak_web3forms_key') || 'YOUR_ACCESS_KEY_HERE';

window.setWeb3FormsKey = function(key) {
    STREAK_WEB3FORMS_KEY = key;
    localStorage.setItem('streak_web3forms_key', key);
    showToast('Clave de envío configurada con éxito', 'fa-key');
};

async function sendBriefAutoEmail(b) {
    if (!STREAK_WEB3FORMS_KEY || STREAK_WEB3FORMS_KEY === 'YOUR_ACCESS_KEY_HERE') {
        console.info('Aviso: Web3Forms Access Key no configurada aún. El brief se guardó localmente y se generó el PDF.');
        return;
    }

    try {
        const payload = {
            access_key: STREAK_WEB3FORMS_KEY,
            subject: `⚡ [NUEVO BRIEF STREAK] #${b.code} - ${b.brandName}`,
            from_name: 'STREAK STUDIOS ENGINE',
            replyto: b.contactEmail || 'contact@streakmotion.com',
            '01_CODIGO_SOLICITUD': b.code,
            '02_MARCA_PROYECTO': b.brandName,
            '03_TAGLINE_SLOGAN': b.tagline || 'N/A',
            '04_SECTOR_INDUSTRIA': b.industry,
            '05_ENTREGABLE': b.deliverable,
            '06_ESTILO_VISUAL': b.vibe,
            '07_PALETA_COLOR': b.color,
            '08_TIPOGRAFIA': b.typography,
            '09_EXCLUSIONES': b.exclusions || 'Ninguno',
            '10_DONDE_VIVIRA': (b.applications && b.applications.length > 0) ? b.applications.join(', ') : 'Digital General',
            '11_AUDIENCIA': b.audience,
            '12_PRESUPUESTO': b.budget,
            '13_PLAZO_ENTREGA': b.deadline,
            '14_CONTACTO_CLIENTE': b.contactName,
            '15_EMAIL_CLIENTE': b.contactEmail,
            '16_TELEFONO_CLIENTE': b.contactPhone,
            '17_NOTAS_PRODUCCION': b.notes || 'Sin notas adicionales',
            '18_REFERENCIAS_MOODBOARD': b.refsLink || 'N/A',
            '19_FECHA_REGISTRO': b.date
        };

        const res = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (data.success) {
            console.log('✅ Brief auto-entregado a contact@streakmotion.com');
            showToast('Brief enviado automáticamente a contact@streakmotion.com', 'fa-paper-plane');
        }
    } catch (e) {
        console.warn('Error enviando brief automático:', e);
    }
}

async function sendBookingAutoEmail(data) {
    if (!STREAK_WEB3FORMS_KEY || STREAK_WEB3FORMS_KEY === 'YOUR_ACCESS_KEY_HERE') return;

    try {
        const payload = {
            access_key: STREAK_WEB3FORMS_KEY,
            subject: `🎬 [NUEVA RESERVA RODAJE] #${data.code} - ${data.client}`,
            from_name: 'STREAK BOOKING ENGINE',
            replyto: data.email || 'contact@streakmotion.com',
            '01_CODIGO_RESERVA': data.code,
            '02_CLIENTE_ARTISTA': data.client,
            '03_EMAIL_CLIENTE': data.email,
            '04_SERVICIO_SOLICITADO': data.service,
            '05_FECHA_RODAJE': data.date,
            '06_JORNADA_TURNO': data.shift,
            '07_LOCACION': data.location
        };

        await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });
    } catch (e) {
        console.warn('Error enviando reserva automática:', e);
    }
}




