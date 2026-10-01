export class Student {
    #portfolioUrl;

    constructor(id, name, yearCourse, role, avatarImg, portfolioUrl, projects = [], stats = {}) {
        this.id = id;
        this.name = name;
        this.yearCourse = yearCourse;
        this.role = role;
        this.avatarImg = avatarImg;
        this.#portfolioUrl = portfolioUrl;
        this.projects = projects;
        this.stats = stats;
    }

    getPortfolioUrl() {
        return this.#portfolioUrl;
    }

    // Base navigation method (navigates in the same tab)
    openPortfolio() {
        window.location.href = this.#portfolioUrl;
    }

    renderStats() {
        return Object.entries(this.stats).map(([statName, val]) => `
            <div class="stat-row">
                <span>${statName.toUpperCase()}</span>
                <div class="bar-container">
                    <div class="bar-fill" style="width: ${val}%;"></div>
                </div>
            </div>
        `).join('');
    }
}