export class PortfolioUI {
    constructor(mainMenuPath = "../../index.html") {
        this.mainMenuPath = mainMenuPath;
        this.audioCtx = null;
        this.init();
    }

    init() {
        this.ensureCRTOverlay();
        this.bindExitButton();
        this.bindFormValidation();
        this.bindHoverSounds();
    }

    #initAudio() {
        if (!this.audioCtx) {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    playHoverSFX() {
        this.#initAudio();
        if (this.audioCtx.state === "suspended") this.audioCtx.resume();

        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = "square";
        osc.frequency.setValueAtTime(500, this.audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(900, this.audioCtx.currentTime + 0.05);

        gain.gain.setValueAtTime(0.05, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.05);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.05);
    }

    playExitSFX() {
        this.#initAudio();
        if (this.audioCtx.state === "suspended") this.audioCtx.resume();

        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(300, this.audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(60, this.audioCtx.currentTime + 0.4);

        gain.gain.setValueAtTime(0.2, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.4);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.4);
    }

    ensureCRTOverlay() {
        if (!document.querySelector(".crt-overlay")) {
            const overlay = document.createElement("div");
            overlay.className = "crt-overlay";
            document.body.appendChild(overlay);
        }
    }

    bindExitButton() {
        const exitBtns = document.querySelectorAll(".exit-game-btn");
        exitBtns.forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                this.playExitSFX();
                document.body.classList.add("arcade-exit-fade");
                setTimeout(() => {
                    window.location.href = this.mainMenuPath;
                }, 450);
            });
        });
    }

    bindHoverSounds() {
        const interactiveElems = document.querySelectorAll("button, a, .interactive-card, input, textarea");
        interactiveElems.forEach(elem => {
            elem.addEventListener("mouseenter", () => this.playHoverSFX());
        });
    }

    bindFormValidation() {
        const contactForm = document.getElementById("contact-form");
        if (!contactForm) return;

        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            let isValid = true;

            const nameInput = document.getElementById("contact-name");
            const emailInput = document.getElementById("contact-email");
            const messageInput = document.getElementById("contact-message");

            if (nameInput && nameInput.value.trim() === "") {
                this.setFieldError(nameInput, "Name is required.");
                isValid = false;
            } else if (nameInput) {
                this.clearFieldError(nameInput);
            }

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailInput && !emailPattern.test(emailInput.value.trim())) {
                this.setFieldError(emailInput, "Enter a valid email address.");
                isValid = false;
            } else if (emailInput) {
                this.clearFieldError(emailInput);
            }

            if (messageInput && messageInput.value.trim().length < 10) {
                this.setFieldError(messageInput, "Message must be at least 10 characters long.");
                isValid = false;
            } else if (messageInput) {
                this.clearFieldError(messageInput);
            }

            if (isValid) {
                alert("MISSION ACCOMPLISHED! Your message has been sent.");
                contactForm.reset();
            }
        });
    }

    setFieldError(inputElem, message) {
        const group = inputElem.closest(".form-group");
        if (group) {
            group.classList.add("invalid");
            const errorElem = group.querySelector(".error-message");
            if (errorElem) errorElem.textContent = message;
        }
    }

    clearFieldError(inputElem) {
        const group = inputElem.closest(".form-group");
        if (group) {
            group.classList.remove("invalid");
        }
    }
}