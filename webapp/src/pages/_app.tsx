// src/pages/_app.tsx
import { ChakraProvider } from '@chakra-ui/react'
import type { AppProps } from 'next/app'
import { Layout } from '../components/layout'
import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { localhost, hardhat } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import '@rainbow-me/rainbowkit/styles.css'
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'

const { chains, publicClient, webSocketPublicClient } = configureChains(
    [hardhat],
    [publicProvider()]
)

const hardhatChain = {
    id: 31337,
    name: 'Hardhat',
    network: 'local',
    nativeCurrency: {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18,
    },
    rpcUrls: {
        default: 'http://127.0.0.1:8545',
    },
    blockExplorers: {
        default: { name: 'Hardhat', url: 'http://127.0.0.1:8545' },
    },
    testnet: true,
};

const connector = new CoinbaseWalletConnector({
    // @ts-ignore
    chains: [hardhatChain],
    options: {
        appName: 'MemberMe',
        jsonRpcUrl: 'http://127.0.0.1:8545',
    },
})


const { connectors } = getDefaultWallets({
    appName: 'MemberMe',
    projectId: '04d0485e41000977a4ad6c94f489bc7c',
    // @ts-ignore
    chains
})

const config = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
})

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <WagmiConfig config={config}>
            <RainbowKitProvider chains={chains}>
                <ChakraProvider>
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </ChakraProvider>
            </RainbowKitProvider>
        </WagmiConfig>
    )
}

export default MyApp