import { Project } from './classes/Project.js';
import { LeadStudent, DeveloperStudent, DesignerStudent } from './classes/StudentRoles.js';
import { CharacterSelectionManager } from './classes/CharacterSelectionManager.js';

// Sample Projects using Project Class
const defaultProjects = [
    new Project("Web App 1", "E-Commerce Platform", "HTML/CSS/JS", "#"),
    new Project("Web App 2", "Task Management System", "JS OOP", "#"),
    new Project("Web App 3", "Portfolio Engine", "Vanilla JS", "#")
];

// Instantiating Group Members with Subclasses
const member1 = new LeadStudent(
    1,
    "Conde, Pierre Sanjur R.",
    "BSIT - Web & Mobile",
    "./assets/images/mainmenu/conde.jpg",
    "./portfolios/member1/index.html",
    defaultProjects,
    { coding: 90, design: 80, logic: 88 }
);
member1.video = "./assets/video/mainmenu/conde.mp4";

const member2 = new DeveloperStudent(
    2,
    "Dizon, Evan Daniel S.",
    "BSIT - Web & Mobile",
    "./assets/images/mainmenu/dizon.jpg",
    "./portfolios/member2/index.html",
    defaultProjects,
    { coding: 85, design: 82, logic: 90 }
);
member2.video = "./assets/video/mainmenu/dizon.mp4";

const member3 = new DesignerStudent(
    3,
    "Oronico, Joshua Miguel L.",
    "BSIT - Web & Mobile",
    "./assets/images/mainmenu/oronico.jpg",
    "./portfolios/member3/index.html",
    defaultProjects,
    { coding: 78, design: 95, logic: 80 }
);
member3.video = "./assets/video/mainmenu/oronico.mp4";

const member4 = new DeveloperStudent(
    4,
    "Pascua, Benedict T.",
    "BSIT - Web & Mobile",
    "./assets/images/mainmenu/pascua.jpg",
    "./portfolios/member4/index.html",
    defaultProjects,
    { coding: 92, design: 85, logic: 94 }
);
member4.video = "./assets/video/mainmenu/pascua.mp4";

const member5 = new DeveloperStudent(
    5,
    "Penabella, Luis Martin T.",
    "BSIT - Web & Mobile",
    "./assets/images/mainmenu/penabella.jpg",
    "./portfolios/member5/index.html",
    defaultProjects,
    { coding: 85, design: 80, logic: 95 }
);
member5.video = "./assets/video/mainmenu/penabella.mp4";

// Grouping all members for the engine
const teamMembers = [member1, member2, member3, member4, member5];

// Initialize Character Selection Engine
document.addEventListener("DOMContentLoaded", () => {
    new CharacterSelectionManager(teamMembers);
});