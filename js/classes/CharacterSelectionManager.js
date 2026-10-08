import { SoundController } from './SoundController.js';

export class CharacterSelectionManager {
    constructor(students) {
        this.students = students;
        this.selectedIndex = 0;
        this.sfx = new SoundController();
        
        this.gridContainer = document.getElementById("character-grid");
        this.nameElem = document.getElementById("selected-name");
        this.roleElem = document.getElementById("selected-role");
        this.statsElem = document.getElementById("selected-stats");
        this.selectBtn = document.getElementById("select-btn");

        this.init();
    }

    init() {
        this.renderCards();
        this.updateSelectionUI();
        this.bindEvents();
    }

    renderCards() {
        this.gridContainer.innerHTML = "";
        this.students.forEach((student, index) => {
            const card = document.createElement("div");
            card.className = `character-card ${index === this.selectedIndex ? 'active' : ''}`;
            card.dataset.index = index;

            card.innerHTML = `
                <div class="p1-badge">P1</div>
                <div class="avatar-frame">
                    <img src="${student.avatarImg}" alt="${student.name}" class="card-img" onerror="this.src='https://via.placeholder.com/150x200/111/fff?text=AVATAR'">
                    <video 
                        src="${student.video || ''}" 
                        class="card-video hidden" 
                        autoplay 
                        loop 
                        muted 
                        playsinline>
                    </video>
                </div>
                <div class="card-name">${student.name}</div>
            `;

            card.addEventListener("click", () => {
                if (this.selectedIndex !== index) {
                    this.selectedIndex = index;
                    this.sfx.playHoverSFX();
                    this.updateSelectionUI();
                } else {
                    this.confirmSelection();
                }
            });

            this.gridContainer.appendChild(card);
        });
    }

    updateSelectionUI() {
        const activeStudent = this.students[this.selectedIndex];

        // Toggle Video/Image for selected vs unselected cards
        const cards = this.gridContainer.querySelectorAll(".character-card");
        cards.forEach((card, idx) => {
            const img = card.querySelector(".card-img");
            const video = card.querySelector(".card-video");

            if (idx === this.selectedIndex) {
                // ACTIVE: Hide image, show and play video in full color
                card.classList.add("active");

                if (img) img.classList.add("hidden");

                if (video) {
                    video.classList.remove("hidden");
                    video.muted = true;      // Essential for browser autoplay
                    video.currentTime = 0;   // Play video action from start
                    video.play().catch(err => console.log("Autoplay waiting for user interaction:", err));
                }
            } else {
                // INACTIVE: Pause and hide video, show grayscale static image
                card.classList.remove("active");

                if (video) {
                    video.pause();
                    video.currentTime = 0;
                    video.classList.add("hidden");
                }

                if (img) img.classList.remove("hidden");
            }
        });

        // Update Panel Info using Polymorphic Student Methods
        if (this.nameElem) this.nameElem.textContent = activeStudent.name;
        if (this.roleElem) this.roleElem.textContent = activeStudent.role;
        if (this.statsElem) this.statsElem.innerHTML = activeStudent.renderStats();
    }

    bindEvents() {
        // Keyboard Navigation (Arrows / A / D / Enter)
        document.addEventListener("keydown", (e) => {
            if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
                this.navigate(1);
            } else if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
                this.navigate(-1);
            } else if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                this.confirmSelection();
            }
        });

        // Select Button
        if (this.selectBtn) {
            this.selectBtn.addEventListener("click", () => {
                this.confirmSelection();
            });
        }
    }

    navigate(direction) {
        this.selectedIndex = (this.selectedIndex + direction + this.students.length) % this.students.length;
        this.sfx.playHoverSFX();
        this.updateSelectionUI();
    }

    confirmSelection() {
        this.sfx.playSelectSFX();
        const selectedStudent = this.students[this.selectedIndex];
        selectedStudent.openPortfolio();
    }
}