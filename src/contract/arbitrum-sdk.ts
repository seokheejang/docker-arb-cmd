import { Erc20Bridger, getArbitrumNetwork, mapL2NetworkToArbitrumNetwork, registerCustomArbitrumNetwork } from '@arbitrum/sdk';
import { SignerProviderUtils } from '@arbitrum/sdk/dist/lib/dataEntities/signerOrProvider';
import { Contract, ethers } from 'ethers';

export const getERC20Bridger = async (l2Network: any, l2provider: any): Promise<any> => {
  const result = mapL2NetworkToArbitrumNetwork(l2Network);
  // register network
  registerCustomArbitrumNetwork(result);
  const resl2Network = await getArbitrumNetwork(l2provider);
  const erc20Bridger = new Erc20Bridger(resl2Network);
  return erc20Bridger;
};
