export class UI {
    constructor() {
        this.onboarding = document.getElementById('onboarding');
        this.gameScreen = document.getElementById('game-screen');
        this.usernameInput = document.getElementById('username');
        this.connectBtn = document.getElementById('connect-wallet');
        this.guestBtn = document.getElementById('play-guest');
        this.switchBtn = document.getElementById('switch-network');
        this.startBtn = document.getElementById('start-game');
        this.openSettingsBtn = document.getElementById('open-settings');
        this.closeSettingsBtn = document.getElementById('close-settings');
        this.quitGameBtn = document.getElementById('quit-game');
        this.settingsOverlay = document.getElementById('settings-overlay');
        
        this.soundSwitch = document.getElementById('setting-sound');
        this.shakeSwitch = document.getElementById('setting-shake');
        this.particlesSwitch = document.getElementById('setting-particles');

        this.networkWarning = document.getElementById('network-warning');
        this.walletSection = document.getElementById('wallet-section');
        this.successOverlay = document.getElementById('success-overlay');
        this.finalScore = document.getElementById('final-score-display');
        this.nextLevelBtn = document.getElementById('next-level-btn');
        
        this.levelDisplay = document.getElementById('level-display');
        this.scoreDisplay = document.getElementById('score-display');
        this.movesDisplay = document.getElementById('moves-display');
        
        this.checkInBtn = document.getElementById('check-in-btn');
        this.submitScoreBtn = document.getElementById('submit-score-btn');
        this.footer = document.querySelector('.app-footer');
        this.tickerContent = document.getElementById('ticker-content');
        
        this.setupListeners();
        this.fetchNews();
    }

    setupListeners() {
        this.usernameInput.addEventListener('input', () => this.validateForm());
        this.openSettingsBtn.addEventListener('click', () => this.showSettings());
        this.closeSettingsBtn.addEventListener('click', () => this.hideSettings());
    }

    onConnectWallet(callback) {
        this.connectBtn.addEventListener('click', callback);
    }

    onPlayGuest(callback) {
        this.guestBtn.addEventListener('click', callback);
    }

    onSwitchNetwork(callback) {
        this.switchBtn.addEventListener('click', callback);
    }

    onStartGame(callback) {
        this.startBtn.addEventListener('click', callback);
    }

    onCheckIn(callback) {
        this.checkInBtn.addEventListener('click', callback);
    }

    onSubmitScore(callback) {
        this.submitScoreBtn.addEventListener('click', callback);
    }

    onNextLevel(callback) {
        this.nextLevelBtn.addEventListener('click', callback);
    }

    onQuitGame(callback) {
        this.quitGameBtn.addEventListener('click', callback);
    }

    onSettingsChange(callback) {
        this.soundSwitch.addEventListener('change', () => callback('sound', this.soundSwitch.checked));
        this.shakeSwitch.addEventListener('change', () => callback('shake', this.shakeSwitch.checked));
        this.particlesSwitch.addEventListener('change', () => callback('particles', this.particlesSwitch.checked));
    }

    validateForm() {
        const username = this.usernameInput.value.trim();
        this.startBtn.disabled = !username || this.startBtn.classList.contains('hidden');
    }

    updateWeb3Status(isConnected, isBaseNetwork, address, isGuest = false) {
        if (isGuest) {
            this.walletSection.classList.add('hidden');
            this.networkWarning.classList.add('hidden');
            this.startBtn.classList.remove('hidden');
            this.validateForm();
            return;
        }

        if (!isConnected) {
            this.walletSection.classList.remove('hidden');
            this.networkWarning.classList.add('hidden');
            this.startBtn.classList.add('hidden');
        } else if (!isBaseNetwork) {
            this.walletSection.classList.add('hidden');
            this.networkWarning.classList.remove('hidden');
            this.startBtn.classList.add('hidden');
        } else {
            this.walletSection.classList.add('hidden');
            this.networkWarning.classList.add('hidden');
            this.startBtn.classList.remove('hidden');
            this.validateForm();
        }
    }

    getUsername() {
        return this.usernameInput.value.trim();
    }

    hideOnboarding() {
        this.onboarding.classList.add('hidden');
        if (this.footer) this.footer.classList.add('hidden');
    }

    showGameScreen() {
        this.gameScreen.classList.remove('hidden');
    }

    showSuccess(score, stars = 1) {
        this.finalScore.textContent = `Score: ${score}`;
        this.successOverlay.classList.remove('hidden');
        
        const starEls = document.querySelectorAll('.star');
        starEls.forEach((s, i) => {
            if (i < stars) s.classList.add('active');
            else s.classList.remove('active');
        });

        if (window.lucide) window.lucide.createIcons();
    }

    hideSuccess() {
        this.successOverlay.classList.add('hidden');
    }

    showSettings() {
        this.settingsOverlay.classList.remove('hidden');
        if (window.lucide) window.lucide.createIcons();
    }

    hideSettings() {
        this.settingsOverlay.classList.add('hidden');
    }

    showOnboarding() {
        this.onboarding.classList.remove('hidden');
        this.gameScreen.classList.add('hidden');
        if (this.footer) this.footer.classList.remove('hidden');
    }

    updateStats(level, score, moves) {
        this.levelDisplay.textContent = level;
        this.scoreDisplay.textContent = score;
        this.movesDisplay.textContent = moves;
    }

    async fetchNews() {
        try {
            // Curated "Opportunity" news from top sources (Static but verified)
            const curatedNews = [
                "🚀 BASE TVL HITS NEW ATH! STAY BASED.",
                "🎁 NEW AIRDROPS TRENDING ON BASE ECOSYSTEM.",
                "🔥 TRENDING: BASE NAME SERVICE (BNS) DOMAINS.",
                "🌐 COINBASE L2 'BASE' TRANSACTION VOLUME SURGING.",
                "💎 BUILD ON BASE: GRANTS AVAILABLE FOR DEVS."
            ];

            // Fetch Trending Projects from CoinGecko (Top aggregator source)
            const response = await fetch('https://api.coingecko.com/api/v3/search/trending');
            const data = await response.json();
            
            const trendingCoins = data.coins.slice(0, 5).map(c => `📈 TRENDING: ${c.item.name} (${c.item.symbol})`);
            
            // Combine and update ticker
            const allNews = [...curatedNews, ...trendingCoins];
            this.updateTicker(allNews);
        } catch (err) {
            console.error('Failed to fetch news:', err);
            // Fallback to curated news if API fails
            this.updateTicker([
                "🚀 BASE TVL HITS NEW ATH! STAY BASED.",
                "🎁 CHECK AIRDROPS ON BASE ECOSYSTEM.",
                "🌐 STAY ON-CHAIN, STAY BASED."
            ]);
        }
    }

    updateTicker(newsItems) {
        if (!this.tickerContent) return;
        this.tickerContent.innerHTML = '';
        newsItems.forEach(item => {
            const span = document.createElement('span');
            span.textContent = item;
            this.tickerContent.appendChild(span);
        });
    }

    notify(message, type = 'info') {
        const container = document.getElementById('notification-container');
        const note = document.createElement('div');
        note.className = `notification ${type}`;
        note.textContent = message;
        container.appendChild(note);
        setTimeout(() => note.remove(), 3000);
    }
}
