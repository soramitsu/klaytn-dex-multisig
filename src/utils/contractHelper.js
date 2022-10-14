import multisignABI from '../config/abis/multisign.json'
import farmingABI from '../config/abis/farming.json'
import stakingFactoryABI from '../config/abis/stakingFactory.json'
const abiDecoder = require('abi-decoder');
const { caver } = window

export const getMultisigContract = () => {
    return new caver.klay.Contract(
        multisignABI.abi,
        '0xbd96ae2af4b50540b532d5e492166c7fd3b8b3a5'
    )
}

export const getDecoder = () => {
    abiDecoder.addABI(multisignABI.abi)
    abiDecoder.addABI(farmingABI.abi)
    abiDecoder.addABI(stakingFactoryABI.abi)
    return abiDecoder
}