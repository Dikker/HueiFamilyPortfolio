console.log(">>> SONIC BACKGROUND SCRIPT LOADED <<<");

const canvas = document.getElementById('sonic-bg-canvas');
const ctx = canvas.getContext('2d');

let time = 0;
let rings = [];
let motobugs = [];

// Resize canvas to fill screen
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    generateRings();
}
window.addEventListener('resize', resizeCanvas);

// --- 8-BIT SPRITE MAPS ---
// Sonic: B=Blue, T=Tan/Peach, W=White, R=Red, K=Black
const sonicSprite = [
    "_____BBBBBB_____",
    "____BBBBBBBB____",
    "____BBTTTTBB____",
    "____BTWTTTBB____",
    "____BTTTTTBB____",
    "_____BBBBBB_____",
    "___BBBBBBBBBB___",
    "___BBBBBBBBBB___",
    "___BBBBBBBBBB___",
    "___RRRRRRRRRR___",
    "___RRRRRRRRRR___",
    "_____RR__RR_____",
    "_____RR__RR_____",
    "____RRR__RRR____"
];

// Ring: Y=Yellow/Gold, O=Orange (shadow)
const ringSprite = [
    "_YYYY_",
    "Y____Y",
    "Y____Y",
    "Y____Y",
    "Y____Y",
    "_YYYY_"
];

// Motobug: R=Red, B=Black, W=White (wheels)
const motobugSprite = [
    "___RRRR___",
    "__RRRRRR__",
    "_RRBBBBRR_",
    "_RBBWWBBR_",
    "__RRRRRR__",
    "___WWWW___"
];

// Color Palettes
const sonicColors = { 'B': '#1E90FF', 'T': '#FFDAB9', 'W': '#FFFFFF', 'R': '#FF0000', 'K': '#000000' };
const ringColors = { 'Y': '#FFD700', 'O': '#DAA520' };
const motobugColors = { 'R': '#FF0000', 'B': '#000000', 'W': '#FFFFFF' };

// --- CHARACTER STATE ---
const scale = 6; 
const sonic = { x: 100, speed: 3.0 };

// --- BACKGROUND GENERATION ---
function generateRings() {
    rings = [];
    for (let i = 0; i < 8; i++) {
        rings.push({
            x: 200 + (i * 300),
            y: canvas.height - 250 - Math.random() * 100,
            angle: 0
        });
    }
}

function spawnMotobug() {
    if (Math.random() < 0.005 && motobugs.length < 3) {
        motobugs.push({
            x: canvas.width + 50,
            y: canvas.height - 150,
            speed: 1.5
        });
    }
}

// --- DRAWING FUNCTIONS ---
function drawBackground() {
    // Sky Gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(0.7, '#B0E0E6');
    gradient.addColorStop(1, '#98FB98');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Sun
    ctx.fillStyle = '#FFFF00';
    ctx.beginPath();
    ctx.arc(canvas.width * 0.8, canvas.height * 0.2, 60, 0, Math.PI * 2);
    ctx.fill();

    // Clouds (Pixelated)
    ctx.fillStyle = '#FFFFFF';
    const cloudPositions = [
        { x: canvas.width * 0.1, y: canvas.height * 0.1 },
        { x: canvas.width * 0.4, y: canvas.height * 0.15 },
        { x: canvas.width * 0.7, y: canvas.height * 0.08 }
    ];
    cloudPositions.forEach(c => {
        ctx.fillRect(c.x, c.y, 100, 40);
        ctx.fillRect(c.x + 20, c.y - 20, 60, 40);
        ctx.fillRect(c.x + 60, c.y - 10, 60, 30);
    });

    // Green Hill Zone (Hills in background)
    ctx.fillStyle = '#228B22';
    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.arc(i * 300, canvas.height - 100, 150, Math.PI, 0);
        ctx.fill();
    }

    // Checkered Dirt Ground
    ctx.fillStyle = '#8B4513'; // Dirt base
    ctx.fillRect(0, canvas.height - 100, canvas.width, 100);
    
    // Checkered pattern
    ctx.fillStyle = '#A0522D'; // Lighter brown
    for (let i = 0; i < canvas.width; i += 40) {
        for (let j = 0; j < 100; j += 40) {
            if ((i / 40 + j / 40) % 2 === 0) {
                ctx.fillRect(i, canvas.height - 100 + j, 40, 40);
            }
        }
    }

    // Green Grass Top
    ctx.fillStyle = '#32CD32';
    ctx.fillRect(0, canvas.height - 100, canvas.width, 20);
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

    drawBackground();

    // Spawn Motobugs
    spawnMotobug();

    // Sonic Walk Cycle (bobbing effect)
    const sonicBob = Math.sin(time * 0.3) * 4;
    const sonicY = canvas.height - 100 - (14 * scale) + sonicBob;

    // Move Sonic
    sonic.x += sonic.speed;
    if (sonic.x > canvas.width + 100) {
        sonic.x = -100;
    }

    // Draw Sonic
    drawSprite(sonicSprite, sonic.x, sonicY, sonicColors, 1, 0);

    // Handle Rings
    rings.forEach(ring => {
        // Spin ring
        ring.angle += 0.1;
        const ringScale = Math.abs(Math.cos(ring.angle));
        
        ctx.save();
        ctx.translate(ring.x, ring.y);
        ctx.scale(ringScale, 1);
        drawSprite(ringSprite, -15, -18, ringColors, 1, 0);
        ctx.restore();

        // Move rings left (scrolling effect)
        ring.x -= 2;
        if (ring.x < -50) {
            ring.x = canvas.width + 50;
        }
    });

    // Handle Motobugs
    motobugs.forEach((motobug, index) => {
        const bugBob = Math.sin(time * 0.1) * 2;
        drawSprite(motobugSprite, motobug.x, motobug.y + bugBob, motobugColors, -1, 0);

        // Move Motobug
        motobug.x -= motobug.speed;

        if (motobug.x < -100) {
            motobugs.splice(index, 1);
        }
    });

    requestAnimationFrame(animate);
}

// Initialize and Start
resizeCanvas();
generateRings();
animate();