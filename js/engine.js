export class Game {
    constructor() {
        this.board = document.getElementById('game-board');
        this.size = 8;
        this.tiles = [];
        this.score = 0;
        this.moves = 20;
        this.level = 1;
        this.tileTypes = 6;
        
        this.selectedTile = null;
        this.isProcessing = false;
        this.combo = 0;

        // Settings
        this.settings = { sound: true, shake: true, particles: true };

        // Sound
        this.audioCtx = null;

        // Effects
        this.particles = [];
        this.shakeTimer = 0;

        // Touch handling
        this.touchStart = null;
    }

    start() {
        if (!this.audioCtx) this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        this.score = 0;
        this.moves = 20 + (this.level * 2);
        this.updateUI();
        this.initBoard();
    }

    detectSpecialTiles(matchedIndices) {
        // Simplified detection: if matchedIndices > 3, turn one into a special tile
        // In a real game, we'd check for line length, but this is a good start
        if (matchedIndices.size === 4) {
            const idx = Array.from(matchedIndices)[0];
            this.tiles[idx].special = 'rocket';
        } else if (matchedIndices.size >= 5) {
            const idx = Array.from(matchedIndices)[0];
            this.tiles[idx].special = 'bomb';
        }
    }

    triggerSpecialEffect(idx, specialIndices) {
        const type = this.tiles[idx].special;
        const row = Math.floor(idx / this.size);
        const col = idx % this.size;

        if (type === 'rocket') {
            // Clear row
            for (let c = 0; c < this.size; c++) specialIndices.add(row * this.size + c);
        } else if (type === 'bomb') {
            // Clear 3x3
            for (let r = row - 1; r <= row + 1; r++) {
                for (let c = col - 1; c <= col + 1; c++) {
                    if (r >= 0 && r < this.size && c >= 0 && c < this.size) {
                        specialIndices.add(r * this.size + c);
                    }
                }
            }
        }
    }

    fillBoard() {
        this.board.innerHTML = '';
        this.tiles = [];
        for (let i = 0; i < this.size * this.size; i++) {
            const tile = this.createTile(i);
            this.tiles.push(tile);
            this.board.appendChild(tile.element);
        }
    }

    initBoard() {
        this.board.innerHTML = '';
        this.tiles = [];
        for (let i = 0; i < this.size * this.size; i++) {
            const tile = this.createTile(i);
            this.tiles.push(tile);
            this.board.appendChild(tile.element);
        }
        
        // Initial clear to ensure no matches at start
        this.checkMatches(true);
    }

    createTile(index) {
        const type = Math.floor(Math.random() * this.tileTypes) + 1;
        const element = document.createElement('div');
        element.className = `tile tile-${type}`;
        element.dataset.index = index;
        
        // Add event listeners
        element.addEventListener('click', () => this.handleTileClick(index));
        element.addEventListener('touchstart', (e) => this.handleTouchStart(e, index), { passive: true });
        element.addEventListener('touchend', (e) => this.handleTouchEnd(e, index), { passive: true });

        return { type, element, index };
    }

    handleTileClick(index) {
        if (this.isProcessing) return;

        if (!this.selectedTile) {
            this.selectedTile = this.tiles[index];
            this.selectedTile.element.classList.add('selected');
        } else {
            const first = this.selectedTile;
            const second = this.tiles[index];
            
            if (this.isAdjacent(first.index, second.index)) {
                if (this.settings.sound) this.playSound(440, 'triangle', 0.1); // Swap sound
                this.swapTiles(first, second);
            }
            
            first.element.classList.remove('selected');
            this.selectedTile = null;
        }
    }

    // Mobile Swipe Handling
    handleTouchStart(e, index) {
        if (this.isProcessing) return;
        this.touchStart = {
            x: e.changedTouches[0].clientX,
            y: e.changedTouches[0].clientY,
            index: index
        };
    }

    handleTouchEnd(e, index) {
        if (!this.touchStart || this.isProcessing) return;
        
        const touchEnd = {
            x: e.changedTouches[0].clientX,
            y: e.changedTouches[0].clientY
        };

        const dx = touchEnd.x - this.touchStart.x;
        const dy = touchEnd.y - this.touchStart.y;
        const absX = Math.abs(dx);
        const absY = Math.abs(dy);

        if (Math.max(absX, absY) < 30) return; // Minimum swipe distance

        let targetIndex = -1;
        if (absX > absY) {
            // Horizontal swipe
            targetIndex = dx > 0 ? index + 1 : index - 1;
            // Check row wrap
            if (Math.floor(targetIndex / this.size) !== Math.floor(index / this.size)) targetIndex = -1;
        } else {
            // Vertical swipe
            targetIndex = dy > 0 ? index + this.size : index - this.size;
        }

        if (targetIndex >= 0 && targetIndex < this.size * this.size) {
            this.playSound(440, 'triangle', 0.1);
            this.swapTiles(this.tiles[index], this.tiles[targetIndex]);
        }
        
        this.touchStart = null;
    }

    isAdjacent(idx1, idx2) {
        const r1 = Math.floor(idx1 / this.size);
        const c1 = idx1 % this.size;
        const r2 = Math.floor(idx2 / this.size);
        const c2 = idx2 % this.size;
        return (Math.abs(r1 - r2) + Math.abs(c1 - c2)) === 1;
    }

    async swapTiles(t1, t2) {
        if (this.isProcessing) return;
        this.isProcessing = true;
        
        // Visual swap
        t1.element.style.transform = `translate(${t2.element.offsetLeft - t1.element.offsetLeft}px, ${t2.element.offsetTop - t1.element.offsetTop}px)`;
        t2.element.style.transform = `translate(${t1.element.offsetLeft - t2.element.offsetLeft}px, ${t1.element.offsetTop - t2.element.offsetTop}px)`;

        await new Promise(r => setTimeout(r, 300));

        // Reset transforms and swap types
        t1.element.style.transform = '';
        t2.element.style.transform = '';
        
        const tempType = t1.type;
        t1.type = t2.type;
        t2.type = tempType;

        this.renderTile(t1);
        this.renderTile(t2);

        const hasMatches = await this.checkMatches();
        
        if (!hasMatches) {
            this.combo = 0;
            // Undo visual swap
            t1.element.style.transform = `translate(${t2.element.offsetLeft - t1.element.offsetLeft}px, ${t2.element.offsetTop - t1.element.offsetTop}px)`;
            t2.element.style.transform = `translate(${t1.element.offsetLeft - t2.element.offsetLeft}px, ${t1.element.offsetTop - t2.element.offsetTop}px)`;
            
            await new Promise(r => setTimeout(r, 200));
            
            t1.element.style.transform = '';
            t2.element.style.transform = '';
            
            const tempTypeBack = t1.type;
            t1.type = t2.type;
            t2.type = tempTypeBack;
            this.renderTile(t1);
            this.renderTile(t2);
        } else {
            this.moves--;
            this.updateUI();
            if (this.moves <= 0) {
                this.gameOver();
            }
        }
        
        this.isProcessing = false;
    }

    renderTile(tile) {
        tile.element.className = 'tile';
        if (tile.special) tile.element.classList.add(tile.special);
        
        const colors = {
            1: '#FF5F5F', // Red
            2: '#5FFF5F', // Green
            3: '#5F5FFF', // Blue
            4: '#FFFF5F', // Yellow
            5: '#FF5FFF', // Pink
            6: '#5FFFFF'  // Cyan
        };
        tile.element.style.backgroundColor = colors[tile.type] || 'transparent';
    }

    async checkMatches(silent = false) {
        let matchedIndices = new Set();

        // Horizontal
        for (let r = 0; r < this.size; r++) {
            let count = 1;
            for (let c = 1; c < this.size; c++) {
                const idx = r * this.size + c;
                const prevIdx = idx - 1;
                if (this.tiles[idx].type === this.tiles[prevIdx].type) {
                    count++;
                } else {
                    if (count >= 3) {
                        for (let i = 0; i < count; i++) matchedIndices.add(prevIdx - i);
                    }
                    count = 1;
                }
                if (c === this.size - 1 && count >= 3) {
                    for (let i = 0; i < count; i++) matchedIndices.add(idx - i);
                }
            }
        }

        // Vertical
        for (let c = 0; c < this.size; c++) {
            let count = 1;
            for (let r = 1; r < this.size; r++) {
                const idx = r * this.size + c;
                const prevIdx = (r - 1) * this.size + c;
                if (this.tiles[idx].type === this.tiles[prevIdx].type) {
                    count++;
                } else {
                    if (count >= 3) {
                        for (let i = 0; i < count; i++) matchedIndices.add(prevIdx - (i * this.size));
                    }
                    count = 1;
                }
                if (r === this.size - 1 && count >= 3) {
                    for (let i = 0; i < count; i++) matchedIndices.add(idx - (i * this.size));
                }
            }
        }

        if (matchedIndices.size > 0) {
            if (!silent) {
                this.combo++;
                
                // Identify Special Tiles
                this.detectSpecialTiles(matchedIndices);

                this.score += matchedIndices.size * 10 * this.combo;
                this.updateUI();
                if (this.combo >= 2) {
                    this.showMegaCaption();
                }
                await this.clearAndDrop(matchedIndices);
            } else {
                // For initial generation, just randomize matched tiles
                matchedIndices.forEach(idx => {
                    this.tiles[idx].type = Math.floor(Math.random() * this.tileTypes) + 1;
                    this.renderTile(this.tiles[idx]);
                });
                return this.checkMatches(true);
            }
            return true;
        }
        return false;
    }

    async clearAndDrop(indices) {
        const specialIndices = new Set();
        
        // Check for existing special tiles in the matched set
        indices.forEach(idx => {
            if (this.tiles[idx].special) {
                this.triggerSpecialEffect(idx, specialIndices);
            }
        });

        const allIndices = new Set([...indices, ...specialIndices]);

        // Trigger Screen Shake
        if (this.settings.shake) this.triggerShake();
        if (this.settings.sound) this.playSound(220, 'sine', 0.2); // Match sound

        // Simple "drop" logic
        allIndices.forEach(idx => {
            const tile = this.tiles[idx];
            if (this.settings.particles) this.createParticles(tile.element);
            tile.type = 0;
            tile.special = null;
            tile.element.classList.add('clearing');
        });

        await new Promise(r => setTimeout(r, 300));

        // Gravity
        for (let c = 0; c < this.size; c++) {
            let emptySpots = 0;
            for (let r = this.size - 1; r >= 0; r--) {
                const idx = r * this.size + c;
                if (this.tiles[idx].type === 0) {
                    emptySpots++;
                } else if (emptySpots > 0) {
                    const targetIdx = (r + emptySpots) * this.size + c;
                    this.tiles[targetIdx].type = this.tiles[idx].type;
                    this.tiles[idx].type = 0;
                }
            }
            // Spawn new
            for (let i = 0; i < emptySpots; i++) {
                this.tiles[i * this.size + c].type = Math.floor(Math.random() * this.tileTypes) + 1;
            }
        }

        this.tiles.forEach(t => {
            t.element.classList.remove('clearing');
            this.renderTile(t);
        });

        // Chain reaction
        await this.checkMatches();
    }

    showMegaCaption() {
        const container = document.getElementById('caption-container');
        const captions = ['STAY BASED', 'BASE-D!', 'MEGA COMBO!', 'ON CHAIN!', 'L2 SPEED!', 'BASED AF'];
        const text = captions[Math.floor(Math.random() * captions.length)];
        
        const el = document.createElement('div');
        el.className = 'mega-caption';
        el.textContent = text;
        container.appendChild(el);
        
        if (this.settings.sound) this.playSound(660, 'square', 0.3);
        
        setTimeout(() => el.remove(), 800);
    }

    createParticles(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 8; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            const color = window.getComputedStyle(element).backgroundColor;
            p.style.backgroundColor = color;
            p.style.left = `${centerX}px`;
            p.style.top = `${centerY}px`;
            
            const angle = Math.random() * Math.PI * 2;
            const velocity = 2 + Math.random() * 5;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;

            document.body.appendChild(p);

            let opacity = 1;
            let x = centerX;
            let y = centerY;

            const animate = () => {
                x += vx;
                y += vy;
                opacity -= 0.05;
                p.style.left = `${x}px`;
                p.style.top = `${y}px`;
                p.style.opacity = opacity;

                if (opacity > 0) {
                    requestAnimationFrame(animate);
                } else {
                    p.remove();
                }
            };
            requestAnimationFrame(animate);
        }
    }

    triggerShake() {
        this.board.classList.add('shake');
        setTimeout(() => this.board.classList.remove('shake'), 300);
    }

    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
    }

    playSound(freq, type, duration) {
        if (!this.audioCtx) return;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
        gain.gain.setValueAtTime(0.1, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start();
        osc.stop(this.audioCtx.currentTime + duration);
    }

    updateUI() {
        if (window.app && window.app.ui) {
            window.app.ui.updateStats(this.level, this.score, this.moves);
        }
    }

    getScore() { return this.score; }

    gameOver() {
        const targetScore = this.level * 200;
        if (this.score >= targetScore) {
            if (this.settings.sound) this.playSound(880, 'square', 0.5); // Win sound
            
            // Calculate stars
            let stars = 1;
            if (this.score >= targetScore * 2) stars = 3;
            else if (this.score >= targetScore * 1.5) stars = 2;

            window.app.ui.showSuccess(this.score, stars);
            this.level++;
        } else {
            alert(`Game Over! Final Score: ${this.score}. Try again to reach ${targetScore}!`);
            this.start();
        }
    }
}
