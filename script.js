/* Verificação de idade */
function hasAgeVerification() {
    try {
        return sessionStorage.getItem("ageVerified") === "true";
    } catch (error) {
        return false;
    }
}

function saveAgeVerification() {
    try {
        sessionStorage.setItem("ageVerified", "true");
    } catch (error) {
        console.warn("Não foi possível salvar a verificação de idade.");
    }
}

function is18OrOlder(dateString) {
    if (!dateString) {
        return false;
    }

    const birthDate = new Date(`${dateString}T00:00:00`);
    const today = new Date();

    if (Number.isNaN(birthDate.getTime())) {
        return false;
    }

    if (birthDate > today) {
        return false;
    }

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age >= 18;
}

/* Elementos da verificação */
const ageModal = document.getElementById("age-modal");
const ageForm = document.getElementById("age-form");
const birthDate = document.getElementById("birth-date");
const ageError = document.getElementById("age-error");
const ageCancel = document.getElementById("age-cancel");
const ageRestrictedLinks = document.querySelectorAll(".age-restricted");
let selectedLink = null;

/* Configuração do Modal */
if (ageModal && ageForm && birthDate && ageError && ageCancel) {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    
    birthDate.max = `${year}-${month}-${day}`;

    /* Clique nos conteúdos +18 */
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

    /* Cancelar */
    ageCancel.addEventListener("click", () => {
        ageModal.close();
        selectedLink = null;
    });

    /* Confirmar idade */
    ageForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const isAdult = is18OrOlder(birthDate.value);

        if (isAdult) {
            saveAgeVerification();
            ageError.textContent = "";
            ageModal.close();

            if (selectedLink) {
                window.open(selectedLink.href, "_blank");
            }
            selectedLink = null;
        } else {
            ageError.textContent = "Você precisa ter 18 anos ou mais para acessar este conteúdo.";
        }
    });
}

/* Efeito de luz seguindo o mouse (Glow Fixado) */
const mouseGlow = document.createElement("div");
mouseGlow.className = "mouse-glow";
document.body.appendChild(mouseGlow);

document.addEventListener("mousemove", (event) => {
    mouseGlow.style.left = `${event.clientX}px`;
    mouseGlow.style.top = `${event.clientY}px`;
});

/* Efeito de luz (Hover) internamente nos cards */
const hoverCards = document.querySelectorAll(".link-card, .social-card");

hoverCards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
    });
});

/* Player de Música */
const playBtn = document.getElementById("play-pause-btn");
const audio = document.getElementById("bg-music");
const vinyl = document.getElementById("vinyl-record");

if (playBtn && audio && vinyl) {
    playBtn.addEventListener("click", () => {
        if (audio.paused) {
            audio.play().catch(e => console.warn("Erro ao reproduzir áudio:", e));
            vinyl.classList.add("playing");
            playBtn.innerHTML = "❚❚"; 
        } else {
            audio.pause();
            vinyl.classList.remove("playing");
            playBtn.innerHTML = "▶";
        }
    });
}

/* Saudação Dinâmica */
const saudacaoElement = document.getElementById("saudacao");

if (saudacaoElement) {
    const horaAtual = new Date().getHours();
    let textoSaudacao = "Olá!";

    if (horaAtual >= 5 && horaAtual < 12) {
        textoSaudacao = "Bom dia!";
    } else if (horaAtual >= 12 && horaAtual < 18) {
        textoSaudacao = "Boa tarde!";
    } else {
        textoSaudacao = "Boa noite!";
    }

    saudacaoElement.textContent = textoSaudacao;
}

/* Scroll Reveal com Intersection Observer */
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("reveal-show");
            // Parar de observar depois que aparecer a primeira vez
            observer.unobserve(entry.target); 
        }
    });
}, {
    threshold: 0.1 // O elemento aparece quando 10% dele estiver visível
});

const hiddenElements = document.querySelectorAll(".reveal-hidden");
hiddenElements.forEach((el) => observer.observe(el));

/* Controle de Volume */
const volumeSlider = document.getElementById("volume-slider");

if (volumeSlider && audio) {
    // Define o volume inicial da música igual ao do slider (50%)
    audio.volume = volumeSlider.value;
    
    // Escuta o evento 'input' (quando o usuário arrasta a barra)
    volumeSlider.addEventListener("input", (event) => {
        audio.volume = event.target.value;
    });
}