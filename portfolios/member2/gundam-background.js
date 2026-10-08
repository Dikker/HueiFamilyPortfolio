console.log(">>> GUNDAM BACKGROUND SCRIPT LOADED <<<");

const canvas = document.getElementById('gundam-bg-canvas');
const ctx = canvas.getContext('2d');

let time = 0;
let stars = [];
let beams = [];

// Resize canvas to fill screen
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    generateStars();
}
window.addEventListener('resize', resizeCanvas);

// --- 8-BIT SPRITE MAPS ---
// RX-78-2 Gundam: W=White, B=Blue, R=Red, Y=Yellow, K=Black
const gundamSprite = [
    "______YY______",
    "_____YYYY_____",
    "____WWWWWW____",
    "___WWWWWWWW___",
    "___WWKKKKWW___",
    "___WWWWWWWW___",
    "____BBBBBB____",
    "___BWWWWWWB___",
    "__BBWWWWWWBB__",
    "__BWWWWWWWWB__",
    "___RRRRRRRR___",
    "___RRRRRRRR___",
    "___WW____WW___",
    "___WW____WW___",
    "___WW____WW___",
    "___WW____WW___",
    "__BBB____BBB__",
    "__BBB____BBB__",
    "_WWWW____WWWW_",
    "_WWWW____WWWW_"
];

// Zaku II: G=Green, K=Black, P=Pink, Y=Yellow
const zakuSprite = [
    "_____KK_____",
    "____KKKK____",
    "___GGGGGG___",
    "___GKKKKG___",
    "___GGGGGG___",
    "____PPPP____",
    "___GGGGGG___",
    "__GGGGGGGG__",
    "__GGGGGGGG__",
    "___GGGGGG___",
    "___GG__GG___",
    "___GG__GG___",
    "___GG__GG___",
    "__KKK__KKK__",
    "__KKK__KKK__"
];

// Color Palettes
const gundamColors = { 'W': '#FFFFFF', 'B': '#0000FF', 'R': '#FF0000', 'Y': '#FFFF00', 'K': '#000000' };
const zakuColors = { 'G': '#2E8B57', 'K': '#000000', 'P': '#FF69B4', 'Y': '#FFFF00' };

// --- CHARACTER STATE ---
const scale = 7; // Made them bigger (was 5)

// Start them already on screen so you can see them immediately
const gundam = { x: 50, y: 0, speed: 2.0, dir: 1 };
const zaku = { x: canvas.width - 150, y: 0, speed: 1.5, dir: -1 };

// --- BACKGROUND GENERATION ---
function generateStars() {
    stars = [];
    for (let i = 0; i < 150; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 1,
            twinkle: Math.random() * Math.PI * 2
        });
    }
}

// --- DRAWING FUNCTIONS ---
function drawSpaceBackground() {
    // Space Gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#0a0a2a');
    gradient.addColorStop(1, '#1a1a3a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Stars
    stars.forEach(star => {
        const alpha = 0.5 + Math.sin(time * 0.05 + star.twinkle) * 0.5;
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fillRect(star.x, star.y, star.size, star.size);
    });

    // Space Colony (Side 7)
    ctx.fillStyle = '#4a4a5a';
    ctx.fillRect(canvas.width * 0.75, canvas.height * 0.2, 150, canvas.height * 0.6);
    
    // Colony windows
    ctx.fillStyle = '#ffb347';
    for (let i = 0; i < 10; i++) {
        ctx.fillRect(canvas.width * 0.75 + 20, canvas.height * 0.2 + 30 + (i * 40), 110, 15);
    }

    // Colony shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(canvas.width * 0.75 + 100, canvas.height * 0.2, 50, canvas.height * 0.6);
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

// --- LASER BEAM EFFECTS ---
function spawnBeam() {
    // Increased chance from 0.02 to 0.05 for more action
    if (Math.random() < 0.05) { 
        const isGundamBeam = Math.random() > 0.5;
        beams.push({
            x: isGundamBeam ? gundam.x + 100 : zaku.x + 50,
            y: isGundamBeam ? gundam.y + 80 : zaku.y + 60,
            width: isGundamBeam ? 4 : 3,
            height: 0,
            color: isGundamBeam ? '#FFFF00' : '#FF0000',
            speed: isGundamBeam ? 15 : -15,
            life: 60
        });
    }
}

function drawBeams() {
    beams.forEach((beam, index) => {
        ctx.fillStyle = beam.color;
        ctx.fillRect(beam.x, beam.y - beam.height / 2, beam.width, beam.height);
        
        beam.height += 10;
        beam.x += beam.speed;
        beam.life--;

        if (beam.life <= 0) {
            beams.splice(index, 1);
        }
    });
}

// --- ANIMATION LOOP ---
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    time++;

    drawSpaceBackground();

    // Dynamic Y positions for floating mechs
    const gundamY = canvas.height * 0.4 + Math.sin(time * 0.02) * 20;
    const zakuY = canvas.height * 0.3 + Math.cos(time * 0.02) * 20;
    
    gundam.y = gundamY;
    zaku.y = zakuY;

    // Move Gundam
    gundam.x += gundam.speed * gundam.dir;
    if (gundam.x > canvas.width + 200) {
        gundam.x = -200;
        gundam.dir = 1;
    }

    // Move Zaku
    zaku.x += zaku.speed * zaku.dir;
    if (zaku.x < -200) {
        zaku.x = canvas.width + 200;
        zaku.dir = -1;
    }

    // Spawn and draw beams
    spawnBeam();
    drawBeams();

    // Draw the mechs
    drawSprite(gundamSprite, gundam.x, gundam.y, gundamColors, gundam.dir, 0);
    drawSprite(zakuSprite, zaku.x, zaku.y, zakuColors, zaku.dir, 0);

    requestAnimationFrame(animate);
}

// Initialize and Start
resizeCanvas();
animate();