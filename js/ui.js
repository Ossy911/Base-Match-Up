export class UI {
    constructor() {
        this.onboarding = document.getElementById('onboarding');
        this.gameScreen = document.getElementById('game-screen');
        this.usernameInput = document.getElementById('username');
        this.connectBtn = document.getElementById('connect-wallet');
        this.switchBtn = document.getElementById('switch-network');
        this.startBtn = document.getElementById('start-game');
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
        
        this.setupListeners();
    }

    setupListeners() {
        this.usernameInput.addEventListener('input', () => this.validateForm());
    }

    onConnectWallet(callback) {
        this.connectBtn.addEventListener('click', callback);
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

    validateForm() {
        const username = this.usernameInput.value.trim();
        this.startBtn.disabled = !username || this.startBtn.classList.contains('hidden');
    }

    updateWeb3Status(isConnected, isBaseNetwork, address) {
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
    }

    showGameScreen() {
        this.gameScreen.classList.remove('hidden');
    }

    showSuccess(score) {
        this.finalScore.textContent = `Score: ${score}`;
        this.successOverlay.classList.remove('hidden');
        if (window.lucide) window.lucide.createIcons();
    }

    hideSuccess() {
        this.successOverlay.classList.add('hidden');
    }

    updateStats(level, score, moves) {
        this.levelDisplay.textContent = level;
        this.scoreDisplay.textContent = score;
        this.movesDisplay.textContent = moves;
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
