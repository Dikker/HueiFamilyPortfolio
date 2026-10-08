const canvas = document.getElementById('pokemon-bg-canvas');
const ctx = canvas.getContext('2d');

let time = 0;
let clouds = [];
let stars = [];

// Resize canvas to fill screen
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    generateStars();
    generateClouds();
}
window.addEventListener('resize', resizeCanvas);

// --- COLOR INTERPOLATION HELPER ---
function lerpColor(c1, c2, t) {
    const hex = (c) => c.replace('#', '');
    const r1 = parseInt(hex(c1).substring(0, 2), 16);
    const g1 = parseInt(hex(c1).substring(2, 4), 16);
    const b1 = parseInt(hex(c1).substring(4, 6), 16);
    
    const r2 = parseInt(hex(c2).substring(0, 2), 16);
    const g2 = parseInt(hex(c2).substring(2, 4), 16);
    const b2 = parseInt(hex(c2).substring(4, 6), 16);
    
    const r = Math.round(r1 + (r2 - r1) * t);
    const g = Math.round(g1 + (g2 - g1) * t);
    const b = Math.round(b1 + (b2 - b1) * t);
    
    return `rgb(${r}, ${g}, ${b})`;
}

// --- 8-BIT SPRITE MAPS ---
const ashSprite = [
    "____RRRRRR____", "___RRWWWWRR___", "___RRWWWWRR___", "____BBBBBB____",
    "____BSSSSB____", "____BSKSKSB___", "_____SSSS_____", "___JJJJJJJJ___",
    "__JJJJJJJJJJ__", "__JSSJJJJSSJ__", "__JSSJJJJSSJ__", "___JJJJJJJJ___",
    "____PPP_PPP___", "____PPP_PPP___", "___KKK___KKK__"
];

const pikachuSprite = [
    "__BB____BB_____", "_BYYB__BYYB____", "_BYYB__BYYB____", "__BYYYYYYB_BB__",
    "_BYYYYYYYYBBYB_", "_BYYYYYYYYBYYB_", "_BYBBYYBBYBYYB_", "_BYBBYYBBYBBBB_",
    "_BRRYYYYRRB____", "_BYBBBBBBYB____", "_BYYYYYYYYB____", "_BBYYYYYYBB____",
    "_BYYYYYYYYB____", "_BYYYYYYYYB____", "__BYYYYYYB_____", "__BB____BB_____"
];

const gengarSprite = [
    "__B__B__B__B__", "_BPBBPBBPBBPB_", "_BPPPPPPPPPPB_", "BPPBPPPPPPBPPB",
    "BPPPBPPPPBPPPB", "BPPRRPPPPRRPPB", "BPPRRPPPPRRPPB", "BPPPBPPPPBPPPB",
    "BPPPPPPPPPPPPB", "BPPPPPPPPPPPPB", "_BPPPPPPPPPPB_", "_BBPPPPPPPPBB_",
    "__BBBBBBBBBB__", "___BB____BB___", "__BB______BB__"
];

const crobatSprite = [
    "B___________B", "BB_________BB", "BPB_______BPB", "BPPB_____BPPB",
    "_BPPB___BPPB_", "_BBPPB_BPPBB_", "__BBPPPPBBB__", "___BPPPPPB___",
    "___BPWPWPB___", "___BPPPPPB___", "____BPPPB____", "____BBBBB____", "_____BBB_____"
];

// Arcanine (O=Orange, W=White, B=Black)
const arcanineSprite = [
    "____BBBBBB____",
    "__BBWWWWWWBB__",
    "_BWWOOOOOOWWB_",
    "_BWOBBBBBBOWB_",
    "_BWOOOOOOOOWB_",
    "_BWWOOOOOOWWB_",
    "__BBBBBBBBBB__",
    "___BOOOOOOB___",
    "__BOOOOOOOOB__",
    "__BOOOOOOOOB__",
    "___BBBBBBBB___",
    "___BB____BB___"
];

// Mewtwo (P=Purple, W=White, B=Black, G=Grey)
const mewtwoSprite = [
    "____BBBBBB____",
    "___BPPPPPPB___",
    "__BPPWWWWPPB__",
    "__BPPWWWWPPB__",
    "__BPPPPPPPPB__",
    "___BPPPPPPB___",
    "___BBPPPPBB___",
    "__BPPPPPPPPB__",
    "__BPPPPPPPPB__",
    "___BBPPPPBB___",
    "___BPPPPPPB___",
    "___BPPPPPPB___",
    "__BBPPPPBB____"
];

const snorlaxSprite = [
    "____BBBBBB____", "__BBTTTTTTBB__", "_BTTTTTTTTTTB_", "BTTTTTTTTTTTTB",
    "BTTCCCCCCCCTTB", "BTCCCCCCCCCCTB", "BTCCCCCCCCCCTB", "BTCCCCCCCCCCTB",
    "BTCCCCCCCCCCTB", "BTTCCCCCCCCTTB", "BTTTTTTTTTTTTB", "BTTTTTTTTTTTTB",
    "_BBTTTTTTTTBB_", "__BBBBBBBBBB__"
];

// Color Palettes
const ashColors = { 'R': '#E74C3C', 'W': '#FFFFFF', 'B': '#2C3E50', 'S': '#FAD7A1', 'J': '#3498DB', 'P': '#2C3E50', 'K': '#F1C40F' };
const pikachuColors = { 'Y': '#F1C40F', 'B': '#2C3E50', 'R': '#E74C3C' };
const gengarColors = { 'P': '#8E44AD', 'B': '#1A1A1A', 'R': '#E74C3C', 'W': '#FFFFFF' };
const crobatColors = { 'P': '#8E44AD', 'B': '#2E86C1' };
const arcanineColors = { 'O': '#E67E22', 'W': '#FFFFFF', 'B': '#1A1A1A' };
const mewtwoColors = { 'P': '#9B59B6', 'W': '#FFFFFF', 'B': '#1A1A1A', 'G': '#BDC3C7' };
const snorlaxColors = { 'T': '#16A085', 'C': '#FDFEFE', 'B': '#1A1A1A' };

// --- CHARACTER STATE ---
const scale = 5; 

const ash = { x: 100, speed: 2.0, dir: 1, yOffset: 0 };
const pikachu = { x: 220, speed: 2.0, dir: 1, yOffset: 30 };

// Background Pokémon (Y position will be set dynamically in the loop)
const bgPokemons = [
    { sprite: gengarSprite, colors: gengarColors, x: 100, speed: 0.5, dir: 1, bobOffset: 0, scale: 4, yPercent: 0.7 },
    { sprite: crobatSprite, colors: crobatColors, x: 400, speed: 0.8, dir: 1, bobOffset: 15, scale: 4, yPercent: 0.4 },
    { sprite: arcanineSprite, colors: arcanineColors, x: 700, speed: 0.4, dir: -1, bobOffset: 5, scale: 4, yPercent: 0.85 },
    { sprite: mewtwoSprite, colors: mewtwoColors, x: 1000, speed: 0.6, dir: 1, bobOffset: 20, scale: 4, yPercent: 0.5 },
    { sprite: snorlaxSprite, colors: snorlaxColors, x: 1300, speed: 0.2, dir: -1, bobOffset: 0, scale: 5, yPercent: 0.8 }
];

// --- BACKGROUND GENERATION ---
function generateStars() {
    stars = [];
    for (let i = 0; i < 100; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * (canvas.height * 0.6),
            size: Math.random() * 2 + 1,
            twinkle: Math.random() * Math.PI * 2
        });
    }
}

function generateClouds() {
    clouds = [];
    for (let i = 0; i < 5; i++) {
        clouds.push({
            x: Math.random() * canvas.width,
            y: Math.random() * (canvas.height * 0.4) + 20,
            speed: Math.random() * 0.2 + 0.1,
            size: Math.random() * 30 + 20
        });
    }
}

// --- DAY/NIGHT CYCLE LOGIC ---
const skyColors = [
    { top: '#4A90E2', bot: '#87CEEB' }, // Day
    { top: '#FF512F', bot: '#F09819' }, // Afternoon/Sunset
    { top: '#0B0C10', bot: '#1F2833' }, // Night
    { top: '#FFB75E', bot: '#ED8F03' }, // Morning/Sunrise
    { top: '#4A90E2', bot: '#87CEEB' }  // Wrap back to Day
];

function drawBackground() {
    const cycleLength = 2400;
    const phase = (time % cycleLength) / cycleLength; 
    
    const index = Math.floor(phase * 4);
    const t = (phase * 4) - index;
    
    const topColor = lerpColor(skyColors[index].top, skyColors[index + 1].top, t);
    const botColor = lerpColor(skyColors[index].bot, skyColors[index + 1].bot, t);

    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, topColor);
    gradient.addColorStop(1, botColor);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const sunAngle = (phase * Math.PI * 2) - Math.PI / 2; 
    const sunX = canvas.width / 2 + Math.cos(sunAngle) * (canvas.width * 0.5);
    const sunY = canvas.height * 0.8 + Math.sin(sunAngle) * (canvas.height * 0.5);

    if (sunY < canvas.height * 0.8) {
        ctx.fillStyle = '#F9E79F';
        ctx.beginPath();
        ctx.arc(sunX, sunY, 60, 0, Math.PI * 2);
        ctx.fill();
    }

    const moonAngle = sunAngle + Math.PI;
    const moonX = canvas.width / 2 + Math.cos(moonAngle) * (canvas.width * 0.5);
    const moonY = canvas.height * 0.8 + Math.sin(moonAngle) * (canvas.height * 0.5);

    if (moonY < canvas.height * 0.8) {
        ctx.fillStyle = '#F4F6F7';
        ctx.beginPath();
        ctx.arc(moonX, moonY, 50, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#D5D8DC';
        ctx.beginPath(); ctx.arc(moonX - 15, moonY - 10, 10, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(moonX + 12, moonY + 15, 8, 0, Math.PI * 2); ctx.fill();
    }

    const starOpacity = Math.max(0, Math.sin(phase * Math.PI * 2 - Math.PI)); 
    stars.forEach(star => {
        const twinkle = 0.5 + Math.sin(time * 0.05 + star.twinkle) * 0.5;
        ctx.fillStyle = `rgba(255, 255, 255, ${starOpacity * twinkle})`;
        ctx.fillRect(star.x, star.y, star.size, star.size);
    });

    const cloudColor = lerpColor('#FFFFFF', '#1A1A2A', starOpacity);
    ctx.fillStyle = cloudColor;
    clouds.forEach(c => {
        ctx.fillRect(c.x, c.y, c.size * 2, c.size * 0.6);
        ctx.fillRect(c.x + c.size * 0.5, c.y - c.size * 0.4, c.size, c.size * 0.6);
        ctx.fillRect(c.x + c.size * 1.2, c.y - c.size * 0.2, c.size * 0.8, c.size * 0.6);
        
        c.x -= c.speed;
        if (c.x < -c.size * 3) {
            c.x = canvas.width + c.size * 3;
        }
    });

    const groundColor = lerpColor('#7DCEA0', '#1B4F2E', starOpacity);
    const groundBorderColor = lerpColor('#229954', '#0D2B1A', starOpacity);
    const grassColor = lerpColor('#1E8449', '#0D2B1A', starOpacity);

    ctx.fillStyle = groundColor;
    ctx.fillRect(0, canvas.height - 100, canvas.width, 100);
    
    ctx.fillStyle = groundBorderColor;
    ctx.fillRect(0, canvas.height - 100, canvas.width, 10);
    
    ctx.fillStyle = grassColor;
    for (let i = 0; i < canvas.width; i += 40) {
        ctx.fillRect(i, canvas.height - 30, 10, 20);
        ctx.fillRect(i + 15, canvas.height - 40, 8, 30);
        ctx.fillRect(i + 30, canvas.height - 25, 12, 15);
    }
}

function drawSprite(sprite, x, y, colorMap, dir, bobOffset, customScale) {
    ctx.save();
    const s = customScale || scale;
    const spriteWidth = sprite[0].length * s;

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
                ctx.fillRect(col * s, row * s, s, s);
            }
        }
    }
    ctx.restore();
}

// --- ANIMATION LOOP ---
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    time++;

    drawBackground();

    const groundY = canvas.height - 100;

    // 1. Move Background Pokémon
    bgPokemons.forEach(p => {
        p.x += p.speed * p.dir;

        if (p.x > canvas.width + 150) p.dir = -1;
        if (p.x < -150) p.dir = 1;

        // Dynamically calculate Y based on screen height
        const actualY = (canvas.height * p.yPercent) - (p.sprite.length * p.scale);

        const bob = Math.sin(time * 0.05 + p.bobOffset) * 10;
        drawSprite(p.sprite, p.x, actualY, p.colors, p.dir, bob, p.scale);
    });

    // 2. Move Ash and Pikachu
    ash.x += ash.speed * ash.dir;
    pikachu.x = ash.x - 120;
    pikachu.dir = ash.dir;

    if (ash.x > canvas.width + 100) ash.dir = -1;
    if (ash.x < -100) ash.dir = 1;

    const ashHeight = 15 * scale;
    const pikachuHeight = 16 * scale;

    const ashBob = Math.sin(time * 0.15) * 2; 
    const pikachuBob = Math.abs(Math.sin(time * 0.2)) * 15; 

    drawSprite(ashSprite, ash.x, groundY - ashHeight, ashColors, ash.dir, ashBob);
    drawSprite(pikachuSprite, pikachu.x, groundY - pikachuHeight, pikachuColors, pikachu.dir, pikachuBob);

    requestAnimationFrame(animate);
}

// Initialize and Start
resizeCanvas();
generateStars();
generateClouds();
animate();