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
                    <img src="${student.avatarImg}" alt="${student.name}" onerror="this.src='https://via.placeholder.com/150x200/111/fff?text=AVATAR'">
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

        // Highlight Active Card
        const cards = this.gridContainer.querySelectorAll(".character-card");
        cards.forEach((card, idx) => {
            if (idx === this.selectedIndex) {
                card.classList.add("active");
            } else {
                card.classList.remove("active");
            }
        });

        // Update Panel Info using Polymorphic Student Methods
        this.nameElem.textContent = activeStudent.name;
        this.roleElem.textContent = activeStudent.role;
        this.statsElem.innerHTML = activeStudent.renderStats();
    }

    bindEvents() {
        // Keyboard Controls (Arrows / A / D / Enter)
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
        this.selectBtn.addEventListener("click", () => {
            this.confirmSelection();
        });
    }

    navigate(direction) {
        this.selectedIndex = (this.selectedIndex + direction + this.students.length) % this.students.length;
        this.sfx.playHoverSFX();
        this.updateSelectionUI();
    }

    confirmSelection() {
        this.sfx.playSelectSFX();
        const selectedStudent = this.students[this.selectedIndex];
        console.log(`${this.selectedIndex}`);
        
        // Execute Polymorphic Method
        selectedStudent.openPortfolio();
    }
}