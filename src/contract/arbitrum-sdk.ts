import { Erc20Bridger, getArbitrumNetwork, mapL2NetworkToArbitrumNetwork, registerCustomArbitrumNetwork } from '@arbitrum/sdk';
import { ArbOwner__factory } from '@arbitrum/sdk/dist/lib/abi/factories/ArbOwner__factory';
import { Contract, ethers } from 'ethers';

export const getERC20Bridger = async (mode: string, l2Network: any, l2provider: any): Promise<any> => {
  if (mode == 'custom') {
    const result = mapL2NetworkToArbitrumNetwork(l2Network);
    registerCustomArbitrumNetwork(result);
  }
  // register network
  const resl2Network = await getArbitrumNetwork(l2provider);
  const erc20Bridger = new Erc20Bridger(resl2Network);
  return erc20Bridger;
};

export const getArbOwnerFactory = async (signer: any) => {
  const arbOwner = ArbOwner__factory.connect('0x0000000000000000000000000000000000000070', signer);
  return arbOwner;
};
