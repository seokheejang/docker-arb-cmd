import * as fs from 'fs';
import { writeAccounts, printAddress, printPrivateKey, GetWallet } from './account';
import { HttpProvider, WebSocketProvider } from './provider';
import { createL1ERC20Contract, getERC20Bridger, getERC20Contract, getArbOwnerFactory } from './contract';
import { writeConfigs } from './config/config';
import { writeRedisPriorities, readRedis, initRedis } from './redis/redis';
import { ethers } from 'ethers';
import { formatEther } from 'ethers/lib/utils';
import { boolean } from 'yargs';

export const writeConfigCmd = {
  command: 'write-config',
  describe: 'writes config files',
  builder: {
    l3chainId: {
      number: true,
      describe: 'l3 chainid',
      default: 333333,
      demandOption: true,
    },
    l3owner: {
      string: true,
      describe: 'l3 ownder address',
      default: null,
      demandOption: true,
    },
  },
  handler: (argv: any) => {
    writeConfigs(argv);
  },
};

export const genKeystoreFromMnemonicCmd = {
  command: 'gen-keystore',
  describe: 'generate keystore from mnemonic',
  builder: {
    mnemonic: {
      string: true,
      default: null,
      describe: 'mnemonic (see general help)',
    },
  },
  handler: async (argv: any) => {
    if (argv.mnemonic == null) {
      console.log(`mnemonic is null, new generating...`);
    }
    await writeAccounts(argv.mnemonic);
  },
};

export const printAddressCmd = {
  command: 'print-account',
  describe: 'prints the requested address from keystore',
  builder: {
    keystore: {
      string: true,
      describe: 'keystore file (e.g., owner-01-0x333C5BeF3E03af5112285278DF144DF94616Cf3D.key)',
    },
    pass: {
      string: true,
      describe: 'password to unlock the keystore',
      default: null,
    },
    type: {
      string: true,
      describe: "type of information to print ('addr' for address, 'pk' for private key)",
      choices: ['addr', 'pk'],
      default: 'addr',
    },
  },
  handler: async (argv: any) => {
    const { keystore, pass, type } = argv;
    let result: string | undefined;
    if (type === 'addr') {
      result = await printAddress(keystore, pass);
    } else if (type === 'pk') {
      result = await printPrivateKey(keystore, pass);
    } else {
      result = 'null';
    }
    console.log(result);
  },
};

export const redisWriteCmd = {
  command: 'redis-write',
  describe: 'init redis priorities',
  builder: {
    redisUrl: {
      string: true,
      describe: 'redis url',
      default: 'redis://0.0.0.0:6379',
    },
    seqList: {
      string: true,
      describe: 'other sequencer url list (e.g., [ws://172.10.0.1:8548,ws://172.10.0.2:8548,ws://172.10.0.3:8548]',
      default: '',
    },
  },
  handler: async (argv: any) => {
    await writeRedisPriorities(argv.redisUrl, argv.seqList);
  },
};

export const redisReadCmd = {
  command: 'redis-read',
  describe: 'read key',
  builder: {
    redisUrl: {
      string: true,
      describe: 'redis url',
      default: 'redis://0.0.0.0:6379',
    },
    key: {
      string: true,
      describe: 'key to read',
      default: 'coordinator.priorities',
    },
  },
  handler: async (argv: any) => {
    await readRedis(argv.redisUrl, argv.key);
  },
};

export const redisInitCmd = {
  command: 'redis-init',
  describe: 'redis init',
  builder: {
    redisUrl: {
      string: true,
      describe: 'redis url',
      default: 'redis://0.0.0.0:6379',
    },
    init: {
      boolean: true,
      describe: 'last check',
      default: false,
    },
  },
  handler: async (argv: any) => {
    if (argv.init) {
      await initRedis(argv.redisUrl);
    } else {
      console.log(`no action redis-init: ${argv.init}`);
    }
  },
};

export const sendNativeCoinCmd = {
  command: 'send-coin',
  describe: 'sends funds between l1/l2/l3 accounts',
  builder: {
    url: {
      string: true,
      describe: 'provider url (l1/l2/l3)',
    },
    fromkey: {
      string: true,
      describe: 'funnel keystore Or PrivateKey',
      default: 'funnel',
    },
    frompass: {
      string: true,
      describe: 'keystore pass',
      default: 'passphrase',
    },
    to: {
      string: true,
      describe: 'address',
      default: 'funnel',
    },
    ethamount: {
      string: true,
      describe: 'amount to transfer (in eth)',
      default: '0',
    },
    wait: {
      boolean: true,
      describe: 'wait for transaction to complete',
      default: false,
    },
    data: { string: true, describe: 'data' },
  },
  handler: async (argv: any) => {
    const { url, fromkey, frompass, wait } = argv;

    const wsProvider = new WebSocketProvider(url);
    const wallet = await GetWallet(fromkey, frompass);
    const signer = wallet.connect(wsProvider.getProvider());

    const response = await wsProvider.sendTransaction(signer, argv);

    if (wait) {
      const receipt = await response.wait();
      console.log(receipt);
    }
    console.log(response);
    await wsProvider.getProvider().destroy();
  },
};

export const createL1ERC20Cmd = {
  command: 'create-erc20-l1',
  describe: 'creates simple ERC20 on L1',
  builder: {
    l1url: {
      string: true,
      describe: 'l1 provider url',
    },
    deployer: {
      string: true,
      describe: 'deployer private key',
    },
    mintaddr: {
      string: true,
      describe: 'mint to address (see general help)',
    },
  },
  handler: async (argv: any) => {
    const { l1url, deployer, mintaddr } = argv;
    const l1provider = new WebSocketProvider(l1url);
    const deployerWallet = await GetWallet(deployer);
    const deployerSigner = deployerWallet.connect(l1provider.getProvider());

    const contract = await createL1ERC20Contract(deployerSigner, mintaddr);
    await contract.deployTransaction.wait();

    console.log(contract.address);
    await l1provider.getProvider().destroy();
  },
};

export const approveERC20TokenForBridgeCmd = {
  command: 'approve-erc20-for-bridge',
  describe: '',
  builder: {
    l1url: {
      string: true,
      describe: 'l1 provider url',
    },
    l2url: {
      string: true,
      describe: 'l2 provider url',
    },
    token: {
      string: true,
      describe: 'token address',
    },
    deployer: {
      string: true,
      describe: 'account (see general help)',
      default: 'l3owner',
    },
    mode: {
      string: true,
      describe: 'chain mode (e.g. sepolia)',
      default: 'custom',
    },
    network: {
      string: true,
      describe: 'network json path',
      default: null,
    },
  },
  handler: async (argv: any) => {
    const l1provider = new WebSocketProvider(argv.l1url);
    const l2provider = new WebSocketProvider(argv.l2url);
    const l1wallet = await GetWallet(argv.deployer);
    const l1signer = l1wallet.connect(l1provider.getProvider());
    const tokenAddr = argv.token;
    const l1l2tokenbridge = argv.network ? JSON.parse(fs.readFileSync(argv.network, 'utf8')) : null;
    const l2Network = l1l2tokenbridge?.l2Network ?? null;
    // map v3 -> v4
    const erc20Bridger = await getERC20Bridger(argv.mode, l2Network, l2provider.getProvider());
    const approveTx = await erc20Bridger.approveToken({
      erc20ParentAddress: tokenAddr,
      parentSigner: l1signer,
      // amount: // Defaults to max int.
    });
    await approveTx.wait();
    console.log('Success Transaction for Approve Uint64.Max To Gateway');
  },
};

export const depositERC20TokenL1ToL2Cmd = {
  command: 'deposit-erc20-l1-to-l2',
  describe: '',
  builder: {
    l1url: {
      string: true,
      describe: 'l1 provider url',
    },
    l2url: {
      string: true,
      describe: 'l2 provider url',
    },
    token: {
      string: true,
      describe: 'token address',
    },
    deployer: {
      string: true,
      describe: 'deployer l3 owner (see general help)',
      default: 'funnel',
    },
    amount: {
      string: true,
      describe: 'amount to transfer',
      default: '10',
    },
    mode: {
      string: true,
      describe: 'chain mode (e.g. sepolia)',
      default: 'custom',
    },
    network: {
      string: true,
      describe: 'network json path',
      default: null,
    },
  },
  handler: async (argv: any) => {
    const l1provider = new WebSocketProvider(argv.l1url);
    const l2provider = new WebSocketProvider(argv.l2url);
    const l1wallet = await GetWallet(argv.deployer);
    const l1signer = l1wallet.connect(l1provider.getProvider());
    const l2wallet = await GetWallet(argv.deployer);
    const l2signer = l2wallet.connect(l2provider.getProvider());
    const tokenAddr = argv.token;

    const l1l2tokenbridge = argv.network ? JSON.parse(fs.readFileSync(argv.network, 'utf8')) : null;
    const l2Network = l1l2tokenbridge?.l2Network ?? null;
    // map v3 -> v4
    const erc20Bridger = await getERC20Bridger(argv.mode, l2Network, l2provider.getProvider());

    const tokenContract = await getERC20Contract(argv.token, l1signer);
    const decimals = await tokenContract.decimals();
    const symbolL1 = await tokenContract.symbol();

    const amount = ethers.utils.parseUnits(argv.amount, decimals);
    const depositTx = await erc20Bridger.deposit({
      amount,
      erc20ParentAddress: tokenAddr,
      parentSigner: l1signer,
      childProvider: l2provider.getProvider(),
    });
    const depositRec = await depositTx.wait();
    console.log(`Success Transaction for Send Deposit Message To L2 ${formatEther(amount)} ${symbolL1} to ${l1signer.address}`);
    console.log(`Deposit initiated: waiting for L2 retryable (current time: ${new Date().toLocaleString()}) `);
    await depositRec.waitForChildTransactionReceipt(l2provider.getProvider());
    console.log('L2 Deposit Message successful');
    const childErc20Address = await erc20Bridger.getChildErc20Address(tokenAddr, l1provider.getProvider());
    console.log('childErc20Address:', childErc20Address);
    const L2tokenContract = await getERC20Contract(childErc20Address, l2signer);
    const totalSupply = await L2tokenContract.totalSupply();
    const symbol = await L2tokenContract.symbol();
    console.log(`Child Erc20 Contract\`s Total Supply ${formatEther(totalSupply.toString())} ${symbol}`);
  },
};

export const getChildErc20AddressL1ToL2Cmd = {
  command: 'print-ChildERC20-l1-to-l2',
  describe: '',
  builder: {
    l1url: {
      string: true,
      describe: 'l1 provider url',
    },
    l2url: {
      string: true,
      describe: 'l2 provider url',
    },
    token: {
      string: true,
      describe: 'token address',
    },
    mode: {
      string: true,
      describe: 'chain mode (e.g. sepolia)',
      default: 'custom',
    },
    network: {
      string: true,
      describe: 'network json path',
      default: null,
    },
  },
  handler: async (argv: any) => {
    const l1provider = new WebSocketProvider(argv.l1url);
    const l2provider = new WebSocketProvider(argv.l2url);
    const tokenAddr = argv.token;
    const l1l2tokenbridge = argv.network ? JSON.parse(fs.readFileSync(argv.network, 'utf8')) : null;
    const l2Network = l1l2tokenbridge?.l2Network ?? null;
    // map v3 -> v4
    const erc20Bridger = await getERC20Bridger(argv.mode, l2Network, l2provider.getProvider());
    const childErc20Address = await erc20Bridger.getChildErc20Address(tokenAddr, l1provider.getProvider());
    console.log(`${childErc20Address}`);
  },
};

export const bridgeNativeTokenToL3Cmd = {
  command: 'bridge-native-token-to-l3',
  describe: 'bridge native token from l2 to l3',
  builder: {
    l2url: {
      string: true,
      describe: 'l2 provider url',
    },
    l3url: {
      string: true,
      describe: 'l3 provider url',
    },
    amount: {
      string: true,
      describe: 'amount to transfer',
      default: '10',
    },
    deployer: {
      string: true,
      describe: 'deployer l3 owner (see general help)',
      default: 'funnel',
    },
    wait: {
      boolean: true,
      describe: 'wait till l3 has balance of amount',
      default: false,
    },
    deployment: {
      string: true,
      describe: 'l3deployment json path',
      default: 'l3deployment.json',
    },
  },
  handler: async (argv: any) => {
    const deploydata = JSON.parse(fs.readFileSync(argv.deployment, 'utf8'));
    const inboxAddr = ethers.utils.hexlify(deploydata.inbox);
    const nativeTokenAddr = ethers.utils.hexlify(deploydata['native-token']);
    argv.ethamount = '0';
    await bridgeNativeToken(argv, argv.l2url, argv.l3url, inboxAddr, nativeTokenAddr);
  },
};

async function bridgeNativeToken(argv: any, parentChainUrl: string, chainUrl: string, inboxAddr: string, token: string) {
  const l2provider = new WebSocketProvider(parentChainUrl);

  const l2wallet = await GetWallet(argv.deployer);
  const bridgerParentChain = l2wallet.connect(l2provider.getProvider());

  /// approve inbox to use fee token
  const nativeTokenContract = await getERC20Contract(token, bridgerParentChain);

  await (await nativeTokenContract.approve(inboxAddr, ethers.utils.parseEther(argv.amount))).wait();

  argv.to = inboxAddr;
  /// deposit fee token
  const iface = new ethers.utils.Interface(['function depositERC20(uint256 amount)']);
  argv.data = iface.encodeFunctionData('depositERC20', [ethers.utils.parseEther(argv.amount)]);

  await (await l2provider.sendTransaction(bridgerParentChain, argv)).wait();

  await l2provider.getProvider().destroy();

  if (argv.wait) {
    const childProvider = new WebSocketProvider(chainUrl);
    const l3wallet = await GetWallet(argv.deployer);
    const bridger = l3wallet.connect(childProvider.getProvider());
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    while (true) {
      const balance = await bridger.getBalance();
      if (balance.gte(ethers.utils.parseEther(argv.amount))) {
        return;
      }
      await sleep(100);
    }
  }
}

export const transferERC20Cmd = {
  command: 'transfer-erc20',
  describe: 'transfers ERC20 token on L2',
  builder: {
    token: {
      string: true,
      describe: 'token address',
    },
    amount: {
      string: true,
      describe: 'amount to transfer',
    },
    fromkey: {
      string: true,
      describe: 'account (see general help)',
    },
    to: {
      string: true,
      describe: 'address (see general help)',
    },
  },
  handler: async (argv: any) => {
    console.log('transfer-erc20');
    const l2provider = new WebSocketProvider(argv.l2url);
    const l2wallet = await GetWallet(argv.fromkey);
    const l2signer = l2wallet.connect(l2provider.getProvider());
    const tokenContract = await getERC20Contract(argv.token, l2signer);
    const decimals = await tokenContract.decimals();
    await (await tokenContract.transfer(argv.to, ethers.utils.parseUnits(argv.amount, decimals))).wait();
    await l2provider.getProvider().destroy();
  },
};

export const setL3PricePerUnitByOwner = {
  command: 'set-l3-price-per-unit-by-owner',
  describe: '',
  builder: {
    l3url: {
      string: true,
      describe: 'l3 provider url',
    },
    fromkey: {
      string: true,
      describe: 'account (see general help)',
      default: 'l3owner',
    },
  },
  handler: async (argv: any) => {
    console.log('RUN set-l3-price-per-unit-by-owner');
    const l3Provider = new WebSocketProvider(argv.l3url);
    const l3wallet = await GetWallet(argv.fromkey);
    const l3signer = l3wallet.connect(l3Provider.getProvider());
    const arbOwner = await getArbOwnerFactory(l3signer);

    console.log(`Execute Transaction for set L1PricePerUnit zero ...`);
    const setPricePerUnitRes = await arbOwner.setL1PricePerUnit(0, { gasLimit: 50000 });
    const receipt = await setPricePerUnitRes.wait();

    if (receipt.status == 1) {
      console.log(`Success Transaction for set L1PricePerUnit zero!! | hash: ${receipt.transactionHash}`);
    } else {
      throw new Error(`Fail Transaction for set L1PricePerUnit zero :(`);
    }
    await l3Provider.getProvider().destroy();
  },
};
