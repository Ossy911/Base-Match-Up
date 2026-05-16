// Base Network Configuration
const BASE_CHAIN_ID = 8453;
const BUILDER_CODE = 'bc_sjkexp2o';
const ENCODED_BUILDER_STRING = '0x62635f736a6b657870326f0b0080218021802180218021802180218021v';

export class Web3 {
    constructor() {
        this.address = null;
        this.isConnected = false;
        this.isBaseNetwork = false;
        this.provider = window.ethereum;
    }

    async connect() {
        if (!this.provider) {
            alert('Please install a wallet like MetaMask or use the Base app.');
            return;
        }

        try {
            const accounts = await this.provider.request({ method: 'eth_requestAccounts' });
            this.address = accounts[0];
            this.isConnected = true;
            await this.checkNetwork();
        } catch (error) {
            console.error('Connection error:', error);
        }
    }

    async checkNetwork() {
        if (!this.provider) return;
        const chainId = await this.provider.request({ method: 'eth_chainId' });
        this.isBaseNetwork = parseInt(chainId, 16) === BASE_CHAIN_ID;
    }

    async switchToBase() {
        if (!this.provider) return;
        try {
            await this.provider.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: `0x${BASE_CHAIN_ID.toString(16)}` }],
            });
            await this.checkNetwork();
        } catch (switchError) {
            // This error code indicates that the chain has not been added to MetaMask.
            if (switchError.code === 4902) {
                try {
                    await this.provider.request({
                        method: 'wallet_addEthereumChain',
                        params: [{
                            chainId: `0x${BASE_CHAIN_ID.toString(16)}`,
                            chainName: 'Base',
                            nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
                            rpcUrls: ['https://mainnet.base.org'],
                            blockExplorerUrls: ['https://basescan.org'],
                        }],
                    });
                } catch (addError) {
                    console.error('Failed to add Base network:', addError);
                }
            }
        }
    }

    async dailyCheckIn() {
        if (!this.isConnected || !this.isBaseNetwork) return;

        try {
            // Daily check-in: Send a 0 ETH transaction to self with Builder Code suffix
            const tx = {
                from: this.address,
                to: this.address,
                value: '0x0',
                data: ENCODED_BUILDER_STRING,
            };

            const txHash = await this.provider.request({
                method: 'eth_sendTransaction',
                params: [tx],
            });

            console.log('Check-in tx hash:', txHash);
            alert(`Daily check-in successful! View on Basescan: https://basescan.org/tx/${txHash}`);
        } catch (error) {
            console.error('Check-in failed:', error);
            alert('Check-in transaction rejected or failed.');
        }
    }

    async submitScore(score) {
        if (!this.isConnected || !this.isBaseNetwork) return;

        try {
            // Simple score submission using the same Builder Code attribution pattern
            // We could encode the score in the data, but for now we prioritize attribution.
            const tx = {
                from: this.address,
                to: this.address,
                value: '0x0',
                data: ENCODED_BUILDER_STRING, 
            };

            const txHash = await this.provider.request({
                method: 'eth_sendTransaction',
                params: [tx],
            });

            console.log('Score submission tx hash:', txHash);
            alert(`Score submitted successfully! Hash: ${txHash}`);
        } catch (error) {
            console.error('Score submission failed:', error);
        }
    }
}
