import { createConfig, http } from 'wagmi'
import { mainnet, sepolia, localhost } from 'wagmi/chains'
import { walletConnect, injected, metaMask } from 'wagmi/connectors'

const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || 'your-project-id'

export const config = createConfig({
  chains: [mainnet, sepolia, localhost],
  connectors: [
    injected(),
    metaMask(),
    walletConnect({ projectId }),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [localhost.id]: http('http://localhost:8545'),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
