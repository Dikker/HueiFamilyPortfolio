console.log(">>> PACMAN MAP SCRIPT LOADED <<<");

const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

// --- Maze Configuration ---
const map = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,2,1,1,1,2,1,2,1,1,1,2,1,1,1,2,1],
    [1,2,1,1,1,2,1,1,1,2,1,2,1,1,1,2,1,1,1,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,2,1,2,1,1,1,1,1,2,1,2,1,1,1,2,1],
    [1,2,1,1,1,2,1,2,1,1,1,1,1,2,1,2,1,1,1,2,1],
    [1,2,2,2,2,2,1,2,2,2,1,2,2,2,1,2,2,2,2,2,1],
    [1,1,1,1,1,2,1,1,1,0,1,0,1,1,1,2,1,1,1,1,1],
    [1,1,1,1,1,2,1,0,0,0,0,0,0,0,1,2,1,1,1,1,1],
    [1,1,1,1,1,2,1,0,1,1,1,1,1,0,1,2,1,1,1,1,1],
    [1,1,1,1,1,2,1,0,1,0,0,0,1,0,1,2,1,1,1,1,1],
    [1,1,1,1,1,2,1,0,1,0,0,0,1,0,1,2,1,1,1,1,1],
    [1,1,1,1,1,2,1,0,1,1,1,1,1,0,1,2,1,1,1,1,1],
    [1,2,2,2,2,2,2,0,0,0,0,0,0,0,2,2,2,2,2,2,1],
    [1,2,1,1,1,2,1,0,1,1,1,1,1,0,1,2,1,1,1,2,1],
    [1,2,1,1,1,2,1,0,0,0,0,0,0,0,1,2,1,1,1,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,2,1,1,1,2,1,2,1,1,1,2,1,1,1,2,1],
    [1,2,1,1,1,2,1,1,1,2,1,2,1,1,1,2,1,1,1,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

let tileSize = 20;
let offsetX = 0;
let offsetY = 0;

const pac = {
    x: 9, y: 17, 
    dir: 0, 
    speed: 0.08, 
    mouth: 0,
    mouthDir: 1,
    color: '#ffff00'
};

const ghosts = [
    { x: 9, y: 11, color: '#ff0000', dir: 0, speed: 0.06 },
    { x: 10, y: 11, color: '#ffb8ff', dir: 1, speed: 0.06 },
    { x: 9, y: 12, color: '#00ffff', dir: 2, speed: 0.06 },
    { x: 10, y: 12, color: '#ffb851', dir: 3, speed: 0.06 }
];

function isWall(gridX, gridY) {
    if (gridY < 0 || gridY >= map.length || gridX < 0 || gridX >= map[0].length) {
        return true;
    }
    return map[gridY][gridX] === 1;
}

function getValidDirections(x, y) {
    const dirs = [];
    if (!isWall(x + 1, y)) dirs.push(0);
    if (!isWall(x, y + 1)) dirs.push(1);
    if (!isWall(x - 1, y)) dirs.push(2);
    if (!isWall(x, y - 1)) dirs.push(3);
    return dirs;
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // This stretches the maze to fill the ENTIRE browser window
    tileSize = Math.max(canvas.width / map[0].length, canvas.height / map.length);
    
    // Center the map
    offsetX = (canvas.width - (map[0].length * tileSize)) / 2;
    offsetY = (canvas.height - (map.length * tileSize)) / 2;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let row = 0; row < map.length; row++) {
        for (let col = 0; col < map[row].length; col++) {
            const x = offsetX + col * tileSize;
            const y = offsetY + row * tileSize;
            
            if (map[row][col] === 1) {
                ctx.fillStyle = '#4444ff'; // Bright blue
                ctx.fillRect(x, y, tileSize, tileSize);
            } else if (map[row][col] === 2) {
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.arc(x + tileSize / 2, y + tileSize / 2, tileSize / 8, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    updatePacMan();
    drawPacMan();

    ghosts.forEach(ghost => {
        updateGhost(ghost);
        drawGhost(ghost);
    });

    requestAnimationFrame(animate);
}

function updatePacMan() {
    const moveX = pac.dir === 0 ? pac.speed : (pac.dir === 2 ? -pac.speed : 0);
    const moveY = pac.dir === 1 ? pac.speed : (pac.dir === 3 ? -pac.speed : 0);
    
    pac.x += moveX;
    pac.y += moveY;

    const gridX = Math.round(pac.x);
    const gridY = Math.round(pac.y);
    
    if (Math.abs(pac.x - gridX) < 0.1 && Math.abs(pac.y - gridY) < 0.1) {
        const nextX = gridX + (pac.dir === 0 ? 1 : (pac.dir === 2 ? -1 : 0));
        const nextY = gridY + (pac.dir === 1 ? 1 : (pac.dir === 3 ? -1 : 0));
        
        if (isWall(nextX, nextY)) {
            pac.x = gridX;
            pac.y = gridY;
            
            const validDirs = getValidDirections(gridX, gridY);
            if (validDirs.length > 0) {
                pac.dir = validDirs[Math.floor(Math.random() * validDirs.length)];
            }
        }
    }

    pac.mouth += 0.15 * pac.mouthDir;
    if (pac.mouth > 0.8 || pac.mouth < 0) pac.mouthDir *= -1;
}

function drawPacMan() {
    const px = offsetX + pac.x * tileSize + tileSize / 2;
    const py = offsetY + pac.y * tileSize + tileSize / 2;
    const radius = tileSize * 0.4;

    ctx.beginPath();
    ctx.moveTo(px, py);
    const startAngle = pac.dir === 0 ? pac.mouth : (pac.dir === 1 ? Math.PI/2 + pac.mouth : (pac.dir === 2 ? Math.PI + pac.mouth : -Math.PI/2 + pac.mouth));
    const endAngle = startAngle + (Math.PI * 2 - pac.mouth * 2);
    
    ctx.arc(px, py, radius, startAngle, endAngle);
    ctx.lineTo(px, py);
    ctx.fillStyle = pac.color;
    ctx.fill();
    ctx.closePath();
}

function updateGhost(ghost) {
    const moveX = ghost.dir === 0 ? ghost.speed : (ghost.dir === 2 ? -ghost.speed : 0);
    const moveY = ghost.dir === 1 ? ghost.speed : (ghost.dir === 3 ? -ghost.speed : 0);
    
    ghost.x += moveX;
    ghost.y += moveY;

    const gridX = Math.round(ghost.x);
    const gridY = Math.round(ghost.y);
    
    if (Math.abs(ghost.x - gridX) < 0.1 && Math.abs(ghost.y - gridY) < 0.1) {
        const nextX = gridX + (ghost.dir === 0 ? 1 : (ghost.dir === 2 ? -1 : 0));
        const nextY = gridY + (ghost.dir === 1 ? 1 : (ghost.dir === 3 ? -1 : 0));
        
        if (isWall(nextX, nextY)) {
            ghost.x = gridX;
            ghost.y = gridY;
            
            const validDirs = getValidDirections(gridX, gridY);
            const forwardDirs = validDirs.filter(d => d !== (ghost.dir + 2) % 4);
            
            if (forwardDirs.length > 0) {
                ghost.dir = forwardDirs[Math.floor(Math.random() * forwardDirs.length)];
            } else if (validDirs.length > 0) {
                ghost.dir = validDirs[Math.floor(Math.random() * validDirs.length)];
            }
        }
    }
}

function drawGhost(ghost) {
    const gx = offsetX + ghost.x * tileSize + tileSize / 2;
    const gy = offsetY + ghost.y * tileSize + tileSize / 2;
    const radius = tileSize * 0.4;

    ctx.beginPath();
    ctx.arc(gx, gy, radius, Math.PI, 0);
    ctx.lineTo(gx + radius, gy + radius);
    ctx.lineTo(gx - radius, gy + radius);
    ctx.closePath();
    ctx.fillStyle = ghost.color;
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(gx - radius/3, gy - radius/4, radius/4, 0, Math.PI * 2);
    ctx.arc(gx + radius/3, gy - radius/4, radius/4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#0000ff';
    ctx.beginPath();
    ctx.arc(gx - radius/3 + 2, gy - radius/4, radius/8, 0, Math.PI * 2);
    ctx.arc(gx + radius/3 + 2, gy - radius/4, radius/8, 0, Math.PI * 2);
    ctx.fill();
}

animate();