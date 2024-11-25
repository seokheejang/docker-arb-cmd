import * as ERC20PresetFixedSupplyArtifact from '@openzeppelin/contracts/build/contracts/ERC20PresetFixedSupply.json';
import * as ERC20 from '@openzeppelin/contracts/build/contracts/ERC20.json';
import { Contract, ContractFactory, ethers } from 'ethers';
import { TOKEN } from '../environment';

export const createL1ERC20Contract = async (deployerWallet: ethers.Wallet, mintToAddr: string): Promise<Contract> => {
  const contractFactory = new ContractFactory(ERC20PresetFixedSupplyArtifact.abi, ERC20PresetFixedSupplyArtifact.bytecode, deployerWallet);
  const contract = await contractFactory.deploy(TOKEN.name, TOKEN.symbol, ethers.utils.parseEther(TOKEN.initialSupply), mintToAddr);
  return contract;
};

export const getERC20Contract = async (token: string, account: ethers.Wallet): Promise<Contract> => {
  const tokenContract = new ethers.Contract(token, ERC20.abi, account);
  return tokenContract;
};
