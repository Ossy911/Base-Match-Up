import { UI } from './ui.js';
import { Web3 } from './web3.js';
import { Game } from './engine.js';

class App {
    constructor() {
        this.ui = new UI();
        this.web3 = new Web3();
        this.game = new Game();
        this.isGuest = false;
        
        this.init();
    }

    async init() {
        // Initialize Lucide icons
        if (window.lucide) {
            window.lucide.createIcons();
        }

        // Bind UI events
        this.ui.onConnectWallet(async () => {
            this.isGuest = false;
            await this.web3.connect();
            this.updateWeb3State();
        });

        this.ui.onPlayGuest(() => {
            this.isGuest = true;
            this.updateWeb3State();
        });

        this.ui.onSwitchNetwork(async () => {
            await this.web3.switchToBase();
            this.updateWeb3State();
        });

        this.ui.onStartGame(() => {
            const username = this.ui.getUsername();
            if (username && (this.isGuest || (this.web3.isConnected && this.web3.isBaseNetwork))) {
                this.startGame();
            }
        });

        this.ui.onNextLevel(() => {
            this.ui.hideSuccess();
            this.game.start();
        });

        this.ui.onCheckIn(async () => {
            if (this.isGuest) {
                alert('Guest Mode: Please connect your wallet to check-in on-chain!');
                return;
            }
            await this.web3.dailyCheckIn();
        });

        this.ui.onSubmitScore(async () => {
            if (this.isGuest) {
                alert('Guest Mode: Please connect your wallet to submit your score to the blockchain!');
                return;
            }
            const score = this.game.getScore();
            await this.web3.submitScore(score);
        });

        // Periodic network check
        setInterval(() => this.updateWeb3State(), 5000);
        this.updateWeb3State();
    }

    updateWeb3State() {
        const { isConnected, isBaseNetwork, address } = this.web3;
        this.ui.updateWeb3Status(isConnected, isBaseNetwork, address, this.isGuest);
    }

    startGame() {
        this.ui.hideOnboarding();
        this.ui.showGameScreen();
        this.game.start();
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
