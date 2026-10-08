console.log(">>> MEGA MAN BACKGROUND SCRIPT LOADED <<<");

const canvas = document.getElementById('megaman-bg-canvas');
const ctx = canvas.getContext('2d');

let time = 0;
let stars = [];
let platforms = [];
let mettaurs = [];
let bullets = [];

// Resize canvas to fill screen
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    generateStars();
    generatePlatforms();
}
window.addEventListener('resize', resizeCanvas);

// --- 8-BIT SPRITE MAPS ---
// Mega Man: B=Blue, L=Light Blue (face), K=Black, W=White (eyes)
const megamanSprite = [
    "____BBBB____",
    "___BBBBBB___",
    "___BLLLB____",
    "___BLWLB____",
    "___BLLLB____",
    "____BLB_____",
    "___BBBBB____",
    "__BBBBBBB___",
    "_BBBBBBBBB__",
    "_BBLBBBLBB__",
    "_BBBBBBBBB__",
    "__BBB_BBB___",
    "__BBB_BBB___",
    "_BBBB_BBBB__",
    "_BBBB_BBBB__",
    "_BBB___BBB__"
];

// Mettaur: Y=Yellow (helmet), B=Black, W=White (eyes)
const mettaurSprite = [
    "____YYYY____",
    "___YYYYYY___",
    "__YYYYYYYY__",
    "__YBBBBBBY__",
    "__YBWWBWWBY_",
    "__YBBBBBBY__",
    "__YYYYYYYY__",
    "___YYYYYY___",
    "____B__B____",
    "___BB__BB___"
];

// Bullet: W=White, Y=Yellow
const bulletSprite = [
    "WYW",
    "WYW"
];

// Color Palettes
const megaColors = { 'B': '#1E90FF', 'L': '#FFDAB9', 'K': '#000000', 'W': '#FFFFFF' };
const mettaurColors = { 'Y': '#FFD700', 'B': '#000000', 'W': '#FFFFFF' };
const bulletColors = { 'W': '#FFFFFF', 'Y': '#FFFF00' };

// --- CHARACTER STATE ---
const scale = 5;
const mega = { x: 100, speed: 2.5 };

// --- BACKGROUND GENERATION ---
function generateStars() {
    stars = [];
    for (let i = 0; i < 80; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * (canvas.height * 0.7),
            size: Math.random() * 2 + 1
        });
    }
}

function generatePlatforms() {
    platforms = [];
    // Floating platforms like Mega Man stages
    for (let i = 0; i < 10; i++) {
        platforms.push({
            x: i * 200,
            y: canvas.height * 0.5 + Math.random() * 200,
            width: 100,
            height: 20
        });
    }
}

function spawnMettaur() {
    if (Math.random() < 0.005 && mettaurs.length < 5) {
        mettaurs.push({
            x: canvas.width + 50,
            y: canvas.height - 150,
            speed: 1,
            shootingTimer: 60 + Math.random() * 120
        });
    }
}

// --- DRAWING FUNCTIONS ---
function drawBackground() {
    // Deep Blue Gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#000044');
    gradient.addColorStop(1, '#0000AA');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Stars
    ctx.fillStyle = '#FFFFFF';
    stars.forEach(star => {
        ctx.fillRect(star.x, star.y, star.size, star.size);
    });

    // Distant Fortress (Dr. Wily's Castle silhouette)
    ctx.fillStyle = '#1a0033';
    const fortressX = canvas.width * 0.75;
    const fortressY = canvas.height * 0.3;
    ctx.fillRect(fortressX, fortressY, 200, canvas.height * 0.4);
    ctx.fillRect(fortressX + 50, fortressY - 50, 100, 50);
    ctx.fillRect(fortressX + 80, fortressY - 90, 40, 40);
    
    // Fortress windows
    ctx.fillStyle = '#FF0000';
    for (let i = 0; i < 5; i++) {
        ctx.fillRect(fortressX + 20 + (i * 35), fortressY + 50, 15, 25);
    }
    for (let i = 0; i < 5; i++) {
        ctx.fillRect(fortressX + 20 + (i * 35), fortressY + 120, 15, 25);
    }

    // Ground (Classic Mega Man stage floor)
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, canvas.height - 100, canvas.width, 100);

    // Ground Tile Pattern
    ctx.strokeStyle = '#1E90FF';
    ctx.lineWidth = 3;
    for (let i = 0; i < canvas.width; i += 50) {
        ctx.strokeRect(i, canvas.height - 100, 50, 50);
    }
}

function drawPlatforms() {
    platforms.forEach(p => {
        // Platform blocks
        ctx.fillStyle = '#1E90FF';
        ctx.fillRect(p.x, p.y, p.width, p.height);
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.strokeRect(p.x, p.y, p.width, p.height);

        // Move platforms
        p.x -= 1;
        if (p.x < -150) {
            p.x = canvas.width + 50;
        }
    });
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
    drawPlatforms();

    // Spawn Mettaurs
    spawnMettaur();

    // Mega Man Walk Cycle (bobbing effect)
    const megaBob = Math.sin(time * 0.2) * 3;
    const megaY = canvas.height - 100 - (16 * scale) + megaBob;

    // Move Mega Man
    mega.x += mega.speed;
    if (mega.x > canvas.width + 100) {
        mega.x = -100;
    }

    // Draw Mega Man
    drawSprite(megamanSprite, mega.x, megaY, megaColors, 1, 0);

    // Handle Mettaurs
    mettaurs.forEach((mettaur, index) => {
        const metaBob = Math.sin(time * 0.1) * 2;
        drawSprite(mettaurSprite, mettaur.x, mettaur.y + metaBob, mettaurColors, -1, 0);

        // Move Mettaur
        mettaur.x -= mettaur.speed;

        // Shoot bullets
        mettaur.shootingTimer--;
        if (mettaur.shootingTimer <= 0) {
            bullets.push({
                x: mettaur.x,
                y: mettaur.y + 30,
                speed: 6,
                life: 120
            });
            mettaur.shootingTimer = 100 + Math.random() * 100;
        }

        if (mettaur.x < -100) {
            mettaurs.splice(index, 1);
        }
    });

    // Handle Bullets
    bullets.forEach((bullet, index) => {
        drawSprite(bulletSprite, bullet.x, bullet.y, bulletColors, -1, 0);
        bullet.x -= bullet.speed;
        bullet.life--;

        if (bullet.x < -20 || bullet.life <= 0) {
            bullets.splice(index, 1);
        }
    });

    requestAnimationFrame(animate);
}

// Initialize and Start
resizeCanvas();
animate();