import multisignABI from '../abis/multisign.json'
import farmingABI from '../abis/farming.json'
import stakingFactoryABI from '../abis/stakingFactory.json'

export const tabs = [
    {
        address: '0xcF00533ad18d86f00d843BEdc105cCa5b5A129CE',
        name: 'Multisign Contract',
        abi: multisignABI.abi
    },
    {
        address: '0x32bE07FB9dBf294c2e92715F562f7aBA02b7443A',
        name: 'Farming Contract',
        abi: farmingABI.abi
    },
    {
        address: '0xeB81FCD447957d2AE1fBE7676A4684442b9aE941',
        name: 'Staking Factory Contract',
        abi: stakingFactoryABI.abi
    },
]