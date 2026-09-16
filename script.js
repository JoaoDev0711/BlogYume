/* =========================
   1. VERIFICAÇÃO DE IDADE
========================== */
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
    if (!dateString) return false;
    
    const birthDate = new Date(`${dateString}T00:00:00`);
    const today = new Date();
    
    if (Number.isNaN(birthDate.getTime()) || birthDate > today) return false;
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
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

    ageCancel.addEventListener("click", () => {
        ageModal.close();
        selectedLink = null;
    });

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


/* =========================
   2. EFEITOS VISUAIS (MOUSE)
========================== */
const mouseGlow = document.createElement("div");
mouseGlow.className = "mouse-glow";
document.body.appendChild(mouseGlow);

document.addEventListener("mousemove", (event) => {
    mouseGlow.style.left = `${event.clientX}px`;
    mouseGlow.style.top = `${event.clientY}px`;
});

const hoverCards = document.querySelectorAll(".link-card, .social-card, .contact-section");
hoverCards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mouse-x", `${event.clientX - rect.left}px`);
        card.style.setProperty("--mouse-y", `${event.clientY - rect.top}px`);
    });
});


/* =========================
   3. DARK MODE (TEMA)
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
   4. PLAYER TOCA-DISCOS
========================== */
const playBtn = document.getElementById("play-pause-btn");
const audio = document.getElementById("bg-music");
const turntable = document.querySelector(".turntable");
const volumeSlider = document.getElementById("volume-slider");

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

    if (volumeSlider) {
        audio.volume = volumeSlider.value;
        volumeSlider.addEventListener("input", (event) => {
            audio.volume = event.target.value;
        });
    }
}


/* =========================
   5. FORMULÁRIO DE CONTATO (API)
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
            // Lembre-se de colocar o seu ID do Formspree aqui
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