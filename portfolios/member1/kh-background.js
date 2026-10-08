const canvas = document.getElementById('kh-bg-canvas');
const ctx = canvas.getContext('2d');

let time = 0;
let buildings = []; 

// Resize canvas to fill screen
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    generateBuildings(); 
}
window.addEventListener('resize', resizeCanvas);

// --- 8-BIT SPRITE MAPS ---
// S = Skin, H = Hair, C = Clothes, O = Outline/Details, X = Shoes
// Keyblade: S = Silver/Dark Blade, G = Gold Guard, B = Handle, K = Keychain

const soraSprite = [
    "___H__H_______________S_",
    "__HHHHHH______________S_",
    "_HHHHHHHH_____________S_",
    "_HHSSSSHH_____________S_",
    "_HSSSSSSH_____________S_",
    "_HSSSSSSH_____________S_",
    "_HHSSSSHH_____________S_",
    "__HHHHHH______________S_",
    "___CCCC_______________S_",
    "__CCCCCC______________S_",
    "_CCCCCCCC_____________S_",
    "_CCCCCCCC_____________G_",
    "_CCCCCCCC_____________G_",
    "__CCCCCC______________G_",
    "___C__C_______________B_",
    "___C__C_______________B_",
    "___X__X_______________B_",
    "__XX__XX______________K_"
];

const rikuSprite = [
    "__HH____HH______",
    "_HHHHHHHHHH_____",
    "_HHHHHHHHHH_____",
    "_HHSSSSSSHH_____",
    "_HSSSSSSSSH_____",
    "_HSSSSSSSSH_____",
    "_HHSSSSSSHH_____",
    "__HHHHHHHH______",
    "____CCCC________",
    "___CCCCCC_______",
    "__CCCCCCCC______",
    "__CCCCCCCC______",
    "__CCCCCCCC______",
    "___CCCCCC_______",
    "___C____C_______",
    "___C____C_______",
    "__XX____XX______"
];

const kairiSprite = [
    "___HH__HH_______",
    "__HHHHHHHH______",
    "_HHHHHHHHHH_____",
    "_HHSSSSSSHH_____",
    "_HSSSSSSSSH_____",
    "_HSSSSSSSSH_____",
    "_HHSSSSSSHH_____",
    "__HHHHHHHH______",
    "____CCCC________",
    "___CCCCCC_______",
    "__CCCCCCCC______",
    "__CCCCCCCC______",
    "___CCCCCC_______",
    "____CCCC________",
    "____C__C________",
    "____C__C________",
    "___XX__XX_______"
];

const mickeySprite = [
    "__HH____HH____________S_",
    "_HHHH__HHHH___________S_",
    "HHHHHHHHHHHH__________S_",
    "HHHSSSSSSHHH__________S_",
    "HHSSSSSSSSHH__________S_",
    "HHSSSSSSSSHH__________S_",
    "HHHSSSSSSHHH__________S_",
    "__HHHHHHHH____________S_",
    "____CCCC______________S_",
    "___CCCCCC_____________S_",
    "__CCCCCCCC____________G_",
    "__CCCCCCCC____________G_",
    "___CCCCCC_____________G_",
    "___C____C_____________B_",
    "___C____C_____________B_",
    "__XX____XX____________B_",
    "______________________K_"
];

const donaldSprite = [
    "____HHHH________",
    "___HHHHHH_______",
    "__HHSSSSHH______",
    "__HSSSSSSH______",
    "__HSSSSSSH______",
    "__HHSSSSHH______",
    "___HHHHHH_______",
    "____CCCC________",
    "___CCCCCC_______",
    "__CCCCCCCC______",
    "__CCCCCCCC______",
    "__CCCCCCCC______",
    "___CCCCCC_______",
    "___C____C_______",
    "___C____C_______",
    "__XX____XX______"
];

const goofySprite = [
    "___HHHHHH_______",
    "__HHHHHHHH______",
    "_HHSSSSSSHH_____",
    "_HHSSSSSSHH_____",
    "_HHSSSSSSHH_____",
    "_HHHHHHHHHH_____",
    "___HHHHHH_______",
    "____CCCC________",
    "___CCCCCC_______",
    "__CCCCCCCC______",
    "__CCCCCCCC______",
    "__CCCCCCCC______",
    "___CCCCCC_______",
    "___C____C_______",
    "___C____C_______",
    "__XX____XX______"
];

// Color Palettes (Adding Keyblade colors)
const soraColors = { 'H': '#8B4513', 'S': '#FFDAB9', 'C': '#FF0000', 'X': '#FFFF00', 'S': '#C0C0C0', 'G': '#FFD700', 'B': '#0000FF', 'K': '#FFFF00' };
// Note: 'S' is used for both Skin and Silver in the sprite map. Let's fix that conflict.
// New palette keys: 'H'=Hair, 'K'=Skin, 'C'=Clothes, 'X'=Shoes, 'B'=Blade, 'G'=Guard, 'D'=Handle, 'Y'=Keychain

// Let's refine the sprite map to avoid character conflicts.
// H = Hair, K = Skin, C = Clothes, X = Shoes, B = Blade, G = Guard, D = Handle, Y = Keychain

const soraSpriteFinal = [
    "___H__H_______________B_",
    "__HHHHHH______________B_",
    "_HHHHHHHH_____________B_",
    "_HHKKKKHH_____________B_",
    "_HKKKKKKH_____________B_",
    "_HKKKKKKH_____________B_",
    "_HHKKKKHH_____________B_",
    "__HHHHHH______________B_",
    "___CCCC_______________B_",
    "__CCCCCC______________B_",
    "_CCCCCCCC_____________B_",
    "_CCCCCCCC_____________G_",
    "_CCCCCCCC_____________G_",
    "__CCCCCC______________G_",
    "___C__C_______________D_",
    "___C__C_______________D_",
    "___X__X_______________D_",
    "__XX__XX______________Y_"
];

const mickeySpriteFinal = [
    "__HH____HH____________B_",
    "_HHHH__HHHH___________B_",
    "HHHHHHHHHHHH__________B_",
    "HHHKKKKKKHHH__________B_",
    "HHKKKKKKKKHH__________B_",
    "HHKKKKKKKKHH__________B_",
    "HHHKKKKKKHHH__________B_",
    "__HHHHHHHH____________B_",
    "____CCCC______________B_",
    "___CCCCCC_____________B_",
    "__CCCCCCCC____________G_",
    "__CCCCCCCC____________G_",
    "___CCCCCC_____________G_",
    "___C____C_____________D_",
    "___C____C_____________D_",
    "__XX____XX____________D_",
    "______________________Y_"
];

const rikuSpriteFinal = [
    "__HH____HH______",
    "_HHHHHHHHHH_____",
    "_HHHHHHHHHH_____",
    "_HHKKKKKKHH_____",
    "_HKKKKKKKKH_____",
    "_HKKKKKKKKH_____",
    "_HHKKKKKKHH_____",
    "__HHHHHHHH______",
    "____CCCC________",
    "___CCCCCC_______",
    "__CCCCCCCC______",
    "__CCCCCCCC______",
    "__CCCCCCCC______",
    "___CCCCCC_______",
    "___C____C_______",
    "___C____C_______",
    "__XX____XX______"
];

const kairiSpriteFinal = [
    "___HH__HH_______",
    "__HHHHHHHH______",
    "_HHHHHHHHHH_____",
    "_HHKKKKKKHH_____",
    "_HKKKKKKKKH_____",
    "_HKKKKKKKKH_____",
    "_HHKKKKKKHH_____",
    "__HHHHHHHH______",
    "____CCCC________",
    "___CCCCCC_______",
    "__CCCCCCCC______",
    "__CCCCCCCC______",
    "___CCCCCC_______",
    "____CCCC________",
    "____C__C________",
    "____C__C________",
    "___XX__XX_______"
];

const donaldSpriteFinal = [
    "____HHHH________",
    "___HHHHHH_______",
    "__HHKKKKHH______",
    "__HKKKKKKH______",
    "__HKKKKKKH______",
    "__HHKKKKHH______",
    "___HHHHHH_______",
    "____CCCC________",
    "___CCCCCC_______",
    "__CCCCCCCC______",
    "__CCCCCCCC______",
    "__CCCCCCCC______",
    "___CCCCCC_______",
    "___C____C_______",
    "___C____C_______",
    "__XX____XX______"
];

const goofySpriteFinal = [
    "___HHHHHH_______",
    "__HHHHHHHH______",
    "_HHKKKKKKHH_____",
    "_HHKKKKKKHH_____",
    "_HHKKKKKKHH_____",
    "_HHHHHHHHHH_____",
    "___HHHHHH_______",
    "____CCCC________",
    "___CCCCCC_______",
    "__CCCCCCCC______",
    "__CCCCCCCC______",
    "__CCCCCCCC______",
    "___CCCCCC_______",
    "___C____C_______",
    "___C____C_______",
    "__XX____XX______"
];

// Final Color Palettes
const soraColorsFinal = { 'H': '#8B4513', 'K': '#FFDAB9', 'C': '#FF0000', 'X': '#FFFF00', 'B': '#C0C0C0', 'G': '#FFD700', 'D': '#0000FF', 'Y': '#FFFF00' };
const rikuColorsFinal = { 'H': '#C0C0C0', 'K': '#FFDAB9', 'C': '#1A1A1A', 'X': '#333333' };
const kairiColorsFinal = { 'H': '#FF69B4', 'K': '#FFDAB9', 'C': '#FF1493', 'X': '#FFFFFF' };
const mickeyColorsFinal = { 'H': '#1A1A1A', 'K': '#FFDAB9', 'C': '#FF0000', 'X': '#FFFF00', 'B': '#333333', 'G': '#FFD700', 'D': '#FF0000', 'Y': '#FFFF00' };
const donaldColorsFinal = { 'H': '#4169E1', 'K': '#FFDAB9', 'C': '#4169E1', 'X': '#FFA500' };
const goofyColorsFinal = { 'H': '#228B22', 'K': '#FFDAB9', 'C': '#FFA500', 'X': '#8B4513' };

// --- CHARACTER STATE ---
const scale = 6; 

const characters = [
    { sprite: rikuSpriteFinal, colors: rikuColorsFinal, x: 50, speed: 1.2, dir: 1, yOffset: 20 },
    { sprite: kairiSpriteFinal, colors: kairiColorsFinal, x: 150, speed: 1.8, dir: 1, yOffset: 5 },
    { sprite: goofySpriteFinal, colors: goofyColorsFinal, x: 250, speed: 2.0, dir: 1, yOffset: 0 },
    { sprite: soraSpriteFinal, colors: soraColorsFinal, x: 350, speed: 2.2, dir: 1, yOffset: 0 },
    { sprite: donaldSpriteFinal, colors: donaldColorsFinal, x: 450, speed: 2.0, dir: 1, yOffset: 0 },
    { sprite: mickeySpriteFinal, colors: mickeyColorsFinal, x: 550, speed: 3.5, dir: 1, yOffset: 10 }
];

// --- BACKGROUND GENERATION ---
function generateBuildings() {
    buildings = [];
    for (let i = 0; i < 8; i++) {
        let bWidth = 80 + Math.random() * 40;
        let bHeight = 100 + Math.random() * 150;
        let bX = i * (canvas.width / 7); 
        
        let windows = [];
        for (let j = 0; j < 12; j++) {
            windows.push({
                x: 15 + (j % 3) * 25,
                y: 20 + Math.floor(j / 3) * 30,
                width: 10,
                height: 15,
                lit: Math.random() > 0.3
            });
        }
        buildings.push({ x: bX, width: bWidth, height: bHeight, windows: windows });
    }
}

// --- DRAWING FUNCTIONS ---
function drawTwilightTown() {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#1a0b2e');
    gradient.addColorStop(0.4, '#4a1942');
    gradient.addColorStop(0.7, '#c84b31');
    gradient.addColorStop(1, '#2c1b4d');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#ffb347';
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height * 0.6, 80, 0, Math.PI * 2);
    ctx.fill();

    const towerX = canvas.width * 0.8;
    const towerWidth = 100;
    const towerHeight = 350;
    ctx.fillStyle = '#1a0b2e';
    ctx.fillRect(towerX, canvas.height - towerHeight, towerWidth, towerHeight);
    
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(towerX + towerWidth / 2, canvas.height - towerHeight + 50, 25, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(towerX + towerWidth / 2, canvas.height - towerHeight + 50);
    ctx.lineTo(towerX + towerWidth / 2 + 15, canvas.height - towerHeight + 35);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(towerX + towerWidth / 2, canvas.height - towerHeight + 50);
    ctx.lineTo(towerX + towerWidth / 2, canvas.height - towerHeight + 25);
    ctx.stroke();

    buildings.forEach(b => {
        ctx.fillStyle = '#2c1b4d';
        ctx.fillRect(b.x, canvas.height - b.height - 50, b.width, b.height);
        
        b.windows.forEach(w => {
            ctx.fillStyle = w.lit ? '#ffb347' : '#1a0b2e';
            ctx.fillRect(b.x + w.x, canvas.height - b.height - 50 + w.y, w.width, w.height);
        });
    });

    ctx.fillStyle = '#0d061a';
    ctx.fillRect(0, canvas.height - 50, canvas.width, 50);
}

function drawSprite(sprite, x, y, colorMap, dir, bobOffset) {
    ctx.save();
    const spriteWidth = sprite[0].length * scale;

    if (dir === -1) {
        ctx.translate(x + spriteWidth, y + bobOffset);
        ctx.scale(-1, 1);
    } else {
        ctx.translate(x, y + bobOffset);
    }

    for (let row = 0; row < sprite.length; row++) {
        for (let col = 0; col < sprite[row].length; col++) {
            const char = sprite[row][col];
            if (char !== '_' && colorMap[char]) {
                ctx.fillStyle = colorMap[char];
                ctx.fillRect(col * scale, row * scale, scale, scale);
            }
        }
    }
    ctx.restore();
}

// --- ANIMATION LOOP ---
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    time++;

    drawTwilightTown();

    const groundY = canvas.height - 50;
    const maxSpriteHeight = 18 * scale; 

    characters.forEach(char => {
        char.x += char.speed * char.dir;

        if (char.x > canvas.width + 100) {
            char.dir = -1;
        } else if (char.x < -100) {
            char.dir = 1;
        }

        const actualY = groundY - maxSpriteHeight - char.yOffset;
        const bob = Math.sin(time * 0.15) * 2; 
        
        drawSprite(char.sprite, char.x, actualY, char.colors, char.dir, bob);
    });

    requestAnimationFrame(animate);
}

// Initialize and Start
resizeCanvas();
animate();