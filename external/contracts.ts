const ethers = require('ethers')
const tenderSwapAbi = require('./abis/tenderSwap.json')
const tenderTokenAbi = require('./abis/tenderToken.json')
import { rpcs } from '../networks'

export async function getTargetPrice (tenderswapAddress, tenderToken, symbol)  {
    const amount = ethers.utils.parseEther('1');
    let provider = new ethers.providers.JsonRpcProvider(rpcs[symbol]);
    const TenderSwap = new ethers.Contract(tenderswapAddress, tenderSwapAbi, provider);
    const dy = await TenderSwap.callStatic.calculateSwap(tenderToken, amount);
    return ethers.utils.formatEther(dy);
}

export async function getTotalSupply (tenderTokenAddress, symbol)  {
    const amount = ethers.utils.parseEther('1');
    let provider = new ethers.providers.JsonRpcProvider(rpcs[symbol]);
    const TenderToken = new ethers.Contract(tenderTokenAddress, tenderTokenAbi, provider);
    const totalSupply = await TenderToken.totalSupply()
    return ethers.utils.formatEther(totalSupply);
}