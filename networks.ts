export const networks = [
    'https://api.thegraph.com/subgraphs/name/tenderize/tenderize-ethereum',
    'https://api.thegraph.com/subgraphs/name/tenderize/tenderize-arbitrum',
]

export const rpcs = {
    "LPT" : process.env.JSON_RPC_ARBITRUM,
    "GRT" : process.env.JSON_RPC_MAINNET,
    "MATIC" : process.env.JSON_RPC_MAINNET,
    "AUDIO" : process.env.JSON_RPC_MAINNET,
}