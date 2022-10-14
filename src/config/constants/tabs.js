import multisignABI from '../abis/multisign.json'
import farmingABI from '../abis/farming.json'
import stakingFactoryABI from '../abis/stakingFactory.json'

export const tabs = [
    {
        address: '0xbd96ae2af4b50540b532d5e492166c7fd3b8b3a5',
        name: 'Multisign Contract',
        abi: multisignABI.abi
    },
    {
        address: '0xf68b8d3fae7feb747cb4dce0a4c91a100b140245',
        name: 'Farming Contract',
        abi: farmingABI.abi
    },
    {
        address: '0x3c1442981f9f14b07a05b4a6fb0c825a8167a8bd',
        name: 'Staking Factory Contract',
        abi: stakingFactoryABI.abi
    },
]