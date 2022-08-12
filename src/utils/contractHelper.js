import multisignABI from '../config/abis/multisign.json'
import farmingABI from '../config/abis/farming.json'
import stakingFactoryABI from '../config/abis/stakingFactory.json'
const abiDecoder = require('abi-decoder');
const { caver } = window

export const getMultisigContract = () => {
    return new caver.klay.Contract(
        multisignABI.abi,
        '0xcF00533ad18d86f00d843BEdc105cCa5b5A129CE'
    )
}

export const getDecoder = () => {
    abiDecoder.addABI(multisignABI.abi)
    abiDecoder.addABI(farmingABI.abi)
    abiDecoder.addABI(stakingFactoryABI.abi)
    return abiDecoder
}