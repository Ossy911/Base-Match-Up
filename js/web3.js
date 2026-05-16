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
        // Wait for Web3Onboard to load
        if (typeof Onboard === 'undefined') {
            setTimeout(() => this.init(), 100);
            return;
        }

        const injected = injectedWalletsModule();
        const walletConnect = walletConnectModule({
            projectId: PROJECT_ID,
            requiredChains: [BASE_CHAIN_ID]
        });

        this.onboard = Onboard({
            wallets: [injected, walletConnect],
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
                icon: '<svg>...</svg>',
                description: 'Match-3 game on Base'
            }
        });

        // Subscribe to wallet changes
        this.onboard.state.select('wallets').subscribe(wallets => {
            if (wallets && wallets[0]) {
                this.wallet = wallets[0];
                this.address = this.wallet.accounts[0].address;
                this.isConnected = true;
                this.checkNetwork();
            } else {
                this.wallet = null;
                this.address = null;
                this.isConnected = false;
            }
        });
    }

    async connect() {
        if (!this.onboard) return;
        const wallets = await this.onboard.connectWallet();
        if (wallets && wallets[0]) {
            this.isConnected = true;
        }
    }

    async checkNetwork() {
        if (!this.wallet) return;
        const chainId = parseInt(this.wallet.chains[0].id, 16);
        this.isBaseNetwork = chainId === BASE_CHAIN_ID;
    }

    async switchToBase() {
        if (!this.onboard) return;
        await this.onboard.setChain({ chainId: `0x${BASE_CHAIN_ID.toString(16)}` });
    }

    async dailyCheckIn() {
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

            alert(`Daily check-in successful! Hash: ${txHash}`);
        } catch (error) {
            console.error('Check-in failed:', error);
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

            alert(`Score submitted successfully! Hash: ${txHash}`);
        } catch (error) {
            console.error('Score submission failed:', error);
        }
    }
}
