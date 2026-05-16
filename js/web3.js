// Base Network Configuration
const BASE_CHAIN_ID = 8453;
const BUILDER_CODE = 'bc_sjkexp2o';
const ENCODED_BUILDER_STRING = '0x62635f736a6b657870326f0b0080218021802180218021802180218021v';
const PROJECT_ID = '494191a62d02a5a560c5a054238541a7'; // Public placeholder ID

export class Web3 {
    constructor() {
        this.address = null;
        this.isConnected = false;
        this.isBaseNetwork = false;
        this.modal = null;
        this.init();
    }

    async init() {
        // Wait for AppKit to load from index.html
        if (!window.AppKit) {
            setTimeout(() => this.init(), 100);
            return;
        }

        const { createAppKit, EthersAdapter, base } = window.AppKit;

        this.modal = createAppKit({
            adapters: [new EthersAdapter()],
            networks: [base],
            metadata: {
                name: 'Base Match Up',
                description: 'Match-3 game on Base L2',
                url: window.location.origin,
                icons: ['https://avatars.githubusercontent.com/u/37784886']
            },
            projectId: PROJECT_ID,
            features: {
                analytics: true
            }
        });

        // Listen for state changes
        this.modal.subscribeState(state => {
            this.address = this.modal.getAddress();
            this.isConnected = this.modal.getIsConnectedTracker();
            this.checkNetwork();
        });
    }

    async connect() {
        if (!this.modal) return;
        await this.modal.open();
    }

    async checkNetwork() {
        if (!this.modal) return;
        const network = this.modal.getNetwork();
        this.isBaseNetwork = network?.id === BASE_CHAIN_ID;
    }

    async switchToBase() {
        if (!this.modal) return;
        await this.modal.switchNetwork(BASE_CHAIN_ID);
    }

    async dailyCheckIn() {
        if (!this.isConnected || !this.isBaseNetwork) return;

        try {
            const provider = this.modal.getWalletProvider();
            if (!provider) return;

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

            alert(`Daily check-in successful! View on Basescan: https://basescan.org/tx/${txHash}`);
        } catch (error) {
            console.error('Check-in failed:', error);
        }
    }

    async submitScore(score) {
        if (!this.isConnected || !this.isBaseNetwork) return;

        try {
            const provider = this.modal.getWalletProvider();
            if (!provider) return;

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

            alert(`Score submitted successfully! Hash: ${txHash}`);
        } catch (error) {
            console.error('Score submission failed:', error);
        }
    }
}
