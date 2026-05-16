// Base Network Configuration
const BASE_CHAIN_ID = 8453;
const ENCODED_BUILDER_STRING = '0x62635f736a6b657870326f0b0080218021802180218021802180218021v';
const PROJECT_ID = '494191a62d02a5a560c5a054238541a7'; 

export class Web3 {
    constructor() {
        this.address = null;
        this.isConnected = false;
        this.isBaseNetwork = false;
        this.onboard = null;
        this.wallet = null;
        this.init();
    }

    async init() {
        // Wait for Web3-Onboard and its modules to load globally
        if (typeof Onboard === 'undefined' || typeof injectedWallets === 'undefined' || typeof walletConnect === 'undefined') {
            setTimeout(() => this.init(), 100);
            return;
        }

        try {
            const injected = injectedWallets();
            const wc = walletConnect({
                projectId: PROJECT_ID,
                requiredChains: [BASE_CHAIN_ID]
            });

            this.onboard = Onboard({
                wallets: [injected, wc],
                chains: [
                    {
                        id: `0x${BASE_CHAIN_ID.toString(16)}`,
                        token: 'ETH',
                        label: 'Base',
                        rpcUrl: 'https://mainnet.base.org'
                    }
                ],
                appMetadata: {
                    name: 'Base Match Up',
                    icon: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#0052FF"/></svg>',
                    description: 'Match-3 game on Base L2'
                }
            });

            // Subscribe to wallet changes
            this.onboard.state.select('wallets').subscribe(wallets => {
                if (wallets && wallets[0]) {
                    this.wallet = wallets[0];
                    this.address = this.wallet.accounts[0].address;
                    this.isConnected = true;
                    this.checkNetwork();
                    
                    // Update UI if app is initialized
                    if (window.app) window.app.updateWeb3State();
                } else {
                    this.wallet = null;
                    this.address = null;
                    this.isConnected = false;
                }
            });
        } catch (err) {
            console.error('Onboard initialization error:', err);
        }
    }

    async connect() {
        if (!this.onboard) {
            alert('Web3 is still loading, please wait a moment...');
            return;
        }
        try {
            const wallets = await this.onboard.connectWallet();
            if (wallets && wallets[0]) {
                this.isConnected = true;
                this.checkNetwork();
            }
        } catch (err) {
            console.error('Connection error:', err);
        }
    }

    async checkNetwork() {
        if (!this.wallet) return;
        const chainIdHex = this.wallet.chains[0].id;
        const chainId = parseInt(chainIdHex, 16);
        this.isBaseNetwork = chainId === BASE_CHAIN_ID;
    }

    async switchToBase() {
        if (!this.onboard) return;
        try {
            await this.onboard.setChain({ chainId: `0x${BASE_CHAIN_ID.toString(16)}` });
        } catch (err) {
            console.error('Network switch error:', err);
        }
    }

    async dailyCheckIn() {
        if (!this.isConnected || !this.isBaseNetwork || !this.wallet) {
            alert('Please connect to Base network first!');
            return;
        }

        try {
            const provider = this.wallet.provider;
            const tx = {
                from: this.address,
                to: this.address,
                value: '0x0',
                data: ENCODED_BUILDER_STRING,
            };

            const txHash = await provider.request({
                method: 'eth_sendTransaction',
                params: [tx],
            });

            alert(`Daily check-in successful!\nTx Hash: ${txHash}`);
        } catch (error) {
            console.error('Check-in failed:', error);
            alert('Transaction failed or was rejected.');
        }
    }

    async submitScore(score) {
        if (!this.isConnected || !this.isBaseNetwork || !this.wallet) return;

        try {
            const provider = this.wallet.provider;
            const tx = {
                from: this.address,
                to: this.address,
                value: '0x0',
                data: ENCODED_BUILDER_STRING, 
            };

            const txHash = await provider.request({
                method: 'eth_sendTransaction',
                params: [tx],
            });

            alert(`Score submitted successfully!\nTx Hash: ${txHash}`);
        } catch (error) {
            console.error('Score submission failed:', error);
        }
    }
}
