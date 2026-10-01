import { Project } from './classes/Project.js';
import { LeadStudent, DeveloperStudent, DesignerStudent } from './classes/StudentRoles.js';
import { CharacterSelectionManager } from './classes/CharacterSelectionManager.js';

// Sample Projects using Project Class
const defaultProjects = [
    new Project("Web App 1", "E-Commerce Platform", "HTML/CSS/JS", "#"),
    new Project("Web App 2", "Task Management System", "JS OOP", "#"),
    new Project("Web App 3", "Portfolio Engine", "Vanilla JS", "#")
];

// Instantiating Group Members with Subclasses (Demonstrating Polymorphism & OOP)
const teamMembers = [
    new LeadStudent(
        1,
        "Conde, Pierre Sanjur R.",
        "BSIT - Web & Mobile",
        "assets/images/conde.jpg",
        "./portfolios/member1/index.html",
        defaultProjects,
        { coding: 90, design: 80, logic: 88 }
    ),
    new DeveloperStudent(
        2,
        "Dizon, Evan Daniel S.",
        "BSIT - Web & Mobile",
        "assets/images/dizon.jpg",
        "./portfolios/member2/index.html",
        defaultProjects,
        { coding: 85, design: 82, logic: 90 }
    ),
    new DesignerStudent(
        3,
        "Oronico, Joshua Miguel L.",
        "BSIT - Web & Mobile",
        "assets/images/oronico.jpg",
        "./portfolios/member3/index.html",
        defaultProjects,
        { coding: 78, design: 95, logic: 80 }
    ),
    new DeveloperStudent(
        4,
        "Pascua, Benedict T.",
        "BSIT - Web & Mobile",
        "assets/images/pascua.jpg",
        "./portfolios/member4/index.html",
        defaultProjects,
        { coding: 92, design: 85, logic: 94 }
    ),
    new DeveloperStudent(
        5,
        "Penabella, Luis Martin T.",
        "BSIT - Web & Mobile",
        "assets/images/penabella.jpg",
        "./portfolios/member5/index.html",
        defaultProjects,
        { coding: 88, design: 80, logic: 86 }
    )
];

// Initialize Character Selection Engine
document.addEventListener("DOMContentLoaded", () => {
    new CharacterSelectionManager(teamMembers);
});