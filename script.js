/* =========================
   1. DARK MODE (TEMA)
========================== */
const themeToggleBtn = document.getElementById("theme-toggle");
const currentTheme = localStorage.getItem("theme");

if (currentTheme) {
    document.body.setAttribute("data-theme", currentTheme);
}
if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
        let theme = document.body.getAttribute("data-theme");
        if (theme === "dark") {
            document.body.setAttribute("data-theme", "light");
            localStorage.setItem("theme", "light");
        } else {
            document.body.setAttribute("data-theme", "dark");
            localStorage.setItem("theme", "dark");
        }
    });
}

/* =========================
   TRADUÇÃO (PT / EN)
========================== */
const translations = {
    pt: {
        "header-subtitle": "tudo o que você procura, em um só lugar",
        "contact-title": "Contato",
        "contact-subtitle": "Para trabalhos ou parcerias, envie uma mensagem direta:",
        "contact-btn": "Enviar Mensagem"
    },
    en: {
        "header-subtitle": "everything you're looking for, in one place",
        "contact-title": "Contact",
        "contact-subtitle": "For work or partnerships, send a direct message:",
        "contact-btn": "Send Message"
    }
};

const langToggleBtn = document.getElementById("lang-toggle");
const langText = document.getElementById("lang-text");
let currentLang = localStorage.getItem("lang") || "pt";

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem("lang", lang);
    langText.textContent = lang === "pt" ? "🇺🇸 EN" : "🇧🇷 PT";
    document.documentElement.setAttribute("lang", lang === "pt" ? "pt-BR" : "en");

    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });
}

setLanguage(currentLang);

if (langToggleBtn) {
    langToggleBtn.addEventListener("click", () => {
        setLanguage(currentLang === "pt" ? "en" : "pt");
    });
}

/* =========================
   2. PLAYER TOCA-DISCOS (HORIZONTAL COM TIMELINE)
========================== */
const openPlayerBtn = document.getElementById("open-player-btn");
const turntableCard = document.getElementById("turntable-card");
const closePlayerBtn = document.getElementById("close-player-btn");
const playBtn = document.getElementById("play-pause-btn");
const audio = document.getElementById("bg-music");
const turntable = document.querySelector(".turntable");
const volumeSlider = document.getElementById("volume-slider");
const progressBar = document.getElementById("progress-bar");
const currentTimeEl = document.getElementById("current-time");
const totalDurationEl = document.getElementById("total-duration");

// Formata segundos em minutos:segundos (ex: 2:15)
function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

if (openPlayerBtn && turntableCard && closePlayerBtn) {
    openPlayerBtn.addEventListener("click", () => {
        openPlayerBtn.classList.add("hidden");
        turntableCard.classList.remove("hidden");
        turntableCard.classList.remove("shake-open");
        void turntableCard.offsetWidth; // Reseta a animação mola
        turntableCard.classList.add("shake-open");
    });

    closePlayerBtn.addEventListener("click", () => {
        turntableCard.classList.add("hidden");
        turntableCard.classList.remove("shake-open");
        openPlayerBtn.classList.remove("hidden");
        
        if (audio && !audio.paused) {
            audio.pause();
            turntable.classList.remove("playing");
            playBtn.innerHTML = "▶";
        }
    });
}

if (playBtn && audio && turntable) {
    playBtn.addEventListener("click", () => {
        if (audio.paused) {
            audio.play().catch(e => console.warn("Erro ao reproduzir:", e));
            turntable.classList.add("playing");
            playBtn.innerHTML = "❚❚"; 
        } else {
            audio.pause();
            turntable.classList.remove("playing");
            playBtn.innerHTML = "▶";
        }
    });

    // Atualiza a barra de tempo conforme a música toca
    audio.addEventListener("timeupdate", () => {
        if (audio.duration) {
            const progressPercent = (audio.currentTime / audio.duration) * 100;
            progressBar.value = progressPercent;
            currentTimeEl.textContent = formatTime(audio.currentTime);
        }
    });

    // Define a duração total quando o áudio carrega
    audio.addEventListener("loadedmetadata", () => {
        totalDurationEl.textContent = formatTime(audio.duration);
    });

    // Permite arrastar/clicar na barra para avançar ou retroceder a música
    progressBar.addEventListener("input", (e) => {
        const seekTime = (e.target.value / 100) * audio.duration;
        audio.currentTime = seekTime;
    });

    if (volumeSlider) {
        audio.volume = volumeSlider.value;
        volumeSlider.addEventListener("input", (event) => {
            audio.volume = event.target.value;
        });
    }
}

/* =========================
   3. FORMULÁRIO DE CONTATO (API)
========================== */
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

if (contactForm) {
    contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        
        const submitBtn = document.getElementById("submit-btn");
        submitBtn.textContent = "Enviando...";
        submitBtn.disabled = true;

        const formData = new FormData(contactForm);

        try {
            const response = await fetch("https://formspree.io/f/COLOQUE_SEU_ID_AQUI", {
                method: "POST",
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                formStatus.textContent = "Mensagem enviada com sucesso! 💜";
                formStatus.style.color = "green";
                contactForm.reset();
            } else {
                formStatus.textContent = "Oops! Ocorreu um erro ao enviar.";
                formStatus.style.color = "red";
            }
        } catch (error) {
            formStatus.textContent = "Erro de conexão. Tente novamente.";
            formStatus.style.color = "red";
        }

        submitBtn.textContent = "Enviar Mensagem";
        submitBtn.disabled = false;
    });
}

/* =========================
   4. SCROLL REVEAL (ANIMAÇÃO DE ENTRADA)
========================== */
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("reveal-show");
            observer.unobserve(entry.target); 
        }
    });
}, { threshold: 0.1 });

const hiddenElements = document.querySelectorAll(".reveal-hidden");
hiddenElements.forEach((el) => observer.observe(el));

/* =========================
   5. VERIFICAÇÃO DE IDADE E MOUSE GLOW
========================== */
function hasAgeVerification() {
    try { return sessionStorage.getItem("ageVerified") === "true"; } catch (e) { return false; }
}
function saveAgeVerification() {
    try { sessionStorage.setItem("ageVerified", "true"); } catch (e) { }
}
function is18OrOlder(dateString) {
    if (!dateString) return false;
    const birthDate = new Date(`${dateString}T00:00:00`);
    const today = new Date();
    if (Number.isNaN(birthDate.getTime()) || birthDate > today) return false;
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) age--;
    return age >= 18;
}

const ageModal = document.getElementById("age-modal");
const ageForm = document.getElementById("age-form");
const birthDate = document.getElementById("birth-date");
const ageError = document.getElementById("age-error");
const ageCancel = document.getElementById("age-cancel");
const ageRestrictedLinks = document.querySelectorAll(".age-restricted");
let selectedLink = null;

if (ageModal && ageForm && birthDate && ageError && ageCancel) {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    birthDate.max = `${year}-${month}-${day}`;

    ageRestrictedLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            if (hasAgeVerification()) {
                window.open(link.href, "_blank");
                return;
            }
            selectedLink = link;
            birthDate.value = "";
            ageError.textContent = "";
            ageModal.showModal();
        });
    });
    ageCancel.addEventListener("click", () => { ageModal.close(); selectedLink = null; });
    ageForm.addEventListener("submit", (event) => {
        event.preventDefault();
        if (is18OrOlder(birthDate.value)) {
            saveAgeVerification();
            ageError.textContent = "";
            ageModal.close();
            if (selectedLink) window.open(selectedLink.href, "_blank");
            selectedLink = null;
        } else {
            ageError.textContent = "Você precisa ter 18 anos ou mais para acessar este conteúdo.";
        }
    });
}

const mouseGlow = document.createElement("div");
mouseGlow.className = "mouse-glow";
document.body.appendChild(mouseGlow);
document.addEventListener("mousemove", (event) => {
    mouseGlow.style.left = `${event.clientX}px`;
    mouseGlow.style.top = `${event.clientY}px`;
});

/* Lógica do Modal de PIX Rápido */
const openPixBtn = document.getElementById("open-pix-btn");
const pixModal = document.getElementById("pix-modal");
const pixClose = document.getElementById("pix-close");
const copyPixBtn = document.getElementById("copy-pix-btn");
const pixKeyInput = document.getElementById("pix-key-input");
const pixCopyStatus = document.getElementById("pix-copy-status");

if (openPixBtn && pixModal && pixClose) {
    openPixBtn.addEventListener("click", () => {
        pixCopyStatus.textContent = "";
        pixModal.showModal();
    });
    pixClose.addEventListener("click", () => {
        pixModal.close();
    });
}

if (copyPixBtn && pixKeyInput) {
    copyPixBtn.addEventListener("click", () => {
        pixKeyInput.select();
        pixKeyInput.setSelectionRange(0, 99999);
        navigator.clipboard.writeText(pixKeyInput.value).then(() => {
            pixCopyStatus.textContent = "Chave copiada com sucesso! ✓";
            setTimeout(() => { pixCopyStatus.textContent = ""; }, 3000);
        });
    });
}

/* =========================
   VERIFICAÇÃO AUTOMÁTICA DE LIVE (TWITCH)
========================== */
async function checkTwitchLive() {
    const twitchBadge = document.querySelector(".twitch-badge");
    const twitchStatusText = document.querySelector(".twitch-status");
    
    if (!twitchBadge || !twitchStatusText) return;

    try {
        // Consulta uma API pública gratuita que verifica o tempo de live do canal
        const response = await fetch("https://decapi.me/twitch/uptime/yumefemboy");
        const data = await response.text();

        // Se a resposta NÃO contiver "offline" ou "not live", significa que o canal está transmitindo!
        if (data && !data.includes("offline") && !data.includes("not live")) {
            twitchStatusText.textContent = "🔴 AO VIVO AGORA!";
            twitchBadge.classList.add("online");
        } else {
            twitchStatusText.textContent = "Twitch (Offline)";
            twitchBadge.classList.remove("online");
        }
    } catch (error) {
        console.warn("Não foi possível verificar o status da Twitch:", error);
    }
}

// Executa assim que a página abre
checkTwitchLive();

// Opcional: Re-checa a cada 2 minutos (120000 ms) para atualizar sozinho se você abrir live
setInterval(checkTwitchLive, 120000);

/* =========================
   VERIFICAÇÃO AUTOMÁTICA DE LIVE (TIKTOK)
========================== */
async function checkTikTokLive() {
    const tiktokBadge = document.querySelector(".tiktok-badge");
    const tiktokStatusText = document.querySelector(".tiktok-status");
    
    if (!tiktokBadge || !tiktokStatusText) return;

    try {
        // O TikTok bloqueia requisições diretas do navegador por segurança (CORS).
        // Deixamos a estrutura pronta igual à da Twitch. 
        // Dica: Se quiser testar o selo aceso, basta alterar a variável 'isOnline' para true.
        const isOnline = false; 

        if (isOnline) {
            tiktokStatusText.textContent = "🔴 AO VIVO AGORA!";
            tiktokBadge.classList.add("online");
        } else {
            tiktokStatusText.textContent = "TikTok (Offline)";
            tiktokBadge.classList.remove("online");
        }
    } catch (error) {
        console.warn("Não foi possível verificar o status do TikTok:", error);
    }
}

// Executa a verificação do TikTok
checkTikTokLive();
