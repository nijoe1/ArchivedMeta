import { Chain } from "wagmi"

export const wallabyChain: Chain = {
    id: 31415,
    name: "Wallaby testnet",
    network: "Wallaby testnet",
    nativeCurrency: {
        name: "Wallaby Chain FIL",
        symbol: "TFIL",
        decimals: 18,
    },
    rpcUrls: {
        default: "https://wallaby.node.glif.io/rpc/v0",
    },
    blockExplorers: {
        default: { name: "explorer", url: "https://explorer.glif.io/?network=wallaby" },
    },
    testnet: true,
}
