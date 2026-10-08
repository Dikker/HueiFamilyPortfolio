import { Student } from './Student.js';

// Subclass 1: Lead Developer
export class LeadStudent extends Student {
    constructor(id, name, yearCourse, avatarImg, portfolioUrl, projects, stats) {
        super(id, name, yearCourse, "Lead Developer", avatarImg, portfolioUrl, projects, stats);
    }

    // Polymorphic Override: Mission Start Flashing
    openPortfolio() {
        document.body.classList.add("mission-start-overlay");
        setTimeout(() => {
            window.location.href = this.getPortfolioUrl();
            document.body.classList.remove("mission-start-overlay");
        }, 600);
    }

    renderStats() {
        const baseStats = super.renderStats();
        return baseStats + `<div class="stat-row" style="border-left-color: var(--neon-yellow)"><span>SPECIAL:</span> <span>System Architecture</span></div>`;
    }
}

// Subclass 2: Frontend Developer
export class DeveloperStudent extends Student {
    constructor(id, name, yearCourse, avatarImg, portfolioUrl, projects, stats) {
        super(id, name, yearCourse, "Frontend Developer", avatarImg, portfolioUrl, projects, stats);
    }

    // Polymorphic Override: Cyber Glitch & Screen Shake
    openPortfolio() {
        document.body.classList.add("cyber-glitch-transition");
        setTimeout(() => {
            window.location.href = this.getPortfolioUrl();
            document.body.classList.remove("cyber-glitch-transition");
        }, 500);
    }

    renderStats() {
        const baseStats = super.renderStats();
        return baseStats + `<div class="stat-row" style="border-left-color: var(--neon-green)"><span>SPECIAL:</span> <span>UI/UX & Logic</span></div>`;
    }
}

// Subclass 3: UI/UX Designer
export class DesignerStudent extends Student {
    constructor(id, name, yearCourse, avatarImg, portfolioUrl, projects, stats) {
        super(id, name, yearCourse, "UI/UX Designer", avatarImg, portfolioUrl, projects, stats);
    }

    // Polymorphic Override: CRT Warp & Zoom
    openPortfolio() {
        document.body.classList.add("design-warp-transition");
        setTimeout(() => {
            window.location.href = this.getPortfolioUrl();
            document.body.classList.remove("design-warp-transition");
        }, 450);
    }

    renderStats() {
        const baseStats = super.renderStats();
        return baseStats + `<div class="stat-row" style="border-left-color: var(--neon-red)"><span>SPECIAL:</span> <span>Visual Aesthetics</span></div>`;
    }
}