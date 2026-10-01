// Demonstrates Encapsulation using private fields (#)
export class Project {
    #demoUrl;

    constructor(title, description, techStack, demoUrl) {
        this.title = title;
        this.description = description;
        this.techStack = techStack;
        this.#demoUrl = demoUrl;
    }

    getDemoUrl() {
        return this.#demoUrl;
    }

    renderProjectBadge() {
        return `<span class="project-tag">${this.title} (${this.techStack})</span>`;
    }
}