import * as fs from 'fs';
import { writeAccounts, printAddress, printPrivateKey, GetWallet } from './account';
import { HttpProvider, WebSocketProvider } from './provider';
import { createL1ERC20Contract, getERC20Bridger, getERC20Contract } from './contract';
import { writeConfigs } from './config/config';
import { writeRedisPriorities, readRedis } from './redis/redis';
import { ethers } from 'ethers';
import { formatEther } from 'ethers/lib/utils';

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

export const redisInitCmd = {
  command: 'redis-init',
  describe: 'init redis priorities',
  builder: {
    redisUrl: {
      string: true,
      describe: 'redis url',
      default: '',
    },
    seqsUrlList: {
      string: true,
      describe: 'other sequencer url list [max: 3]',
      default: '',
    },
  },
  handler: async (argv: any) => {
    await writeRedisPriorities(argv.redisUrl, argv.seqsUrlList);
  },
};

export const redisReadCmd = {
  command: 'redis-read',
  describe: 'read key',
  builder: {
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
      default: '10',
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
    network: {
      string: true,
      describe: 'network json path',
      default: 'l1l2_network.json',
    },
  },
  handler: async (argv: any) => {
    const l1provider = new WebSocketProvider(argv.l1url);
    const l2provider = new WebSocketProvider(argv.l2url);
    const l1wallet = await GetWallet(argv.deployer);
    const l1signer = l1wallet.connect(l1provider.getProvider());
    const tokenAddr = argv.token;
    const l1l2tokenbridge = JSON.parse(fs.readFileSync(argv.network, 'utf8'));
    // map v3 -> v4
    const erc20Bridger = await getERC20Bridger(l1l2tokenbridge.l2Network, l2provider.getProvider());
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
    network: {
      string: true,
      describe: 'network json path',
      default: 'l1l2_network.json',
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
    const l1l2tokenbridge = JSON.parse(fs.readFileSync(argv.network, 'utf8'));

    const tokenContract = await getERC20Contract(argv.token, l1signer);
    const decimals = await tokenContract.decimals();
    const symbolL1 = await tokenContract.symbol();

    const erc20Bridger = await getERC20Bridger(l1l2tokenbridge.l2Network, l2provider.getProvider());

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
    network: {
      string: true,
      describe: 'network json path',
      default: 'l1l2_network.json',
    },
  },
  handler: async (argv: any) => {
    const l1provider = new WebSocketProvider(argv.l1url);
    const l2provider = new WebSocketProvider(argv.l2url);
    const tokenAddr = argv.token;
    const l1l2tokenbridge = JSON.parse(fs.readFileSync(argv.network, 'utf8'));
    // map v3 -> v4
    const erc20Bridger = await getERC20Bridger(l1l2tokenbridge.l2Network, l2provider.getProvider());
    const childErc20Address = await erc20Bridger.getChildErc20Address(tokenAddr, l1provider.getProvider());
    console.log(`${childErc20Address}`);
  },
};

export const bridgeNativeTokenToL3Cmd = {
  command: 'bridge-native-token-to-l3',
  describe: 'bridge native token from l2 to l3',
  builder: {
    amount: {
      string: true,
      describe: 'amount to transfer',
      default: '10',
    },
    from: {
      string: true,
      describe: 'account (see general help)',
      default: 'funnel',
    },
    wait: {
      boolean: true,
      describe: 'wait till l3 has balance of amount',
      default: false,
    },
  },
  handler: async (argv: any) => {
    // const deploydata = JSON.parse(fs.readFileSync(path.join(consts.configpath, 'l3deployment.json')).toString());
    // const inboxAddr = ethers.utils.hexlify(deploydata.inbox);
    // const nativeTokenAddr = ethers.utils.hexlify(deploydata['native-token']);
    // argv.ethamount = '0';
    // await bridgeNativeToken(argv, argv.l2url, argv.l3url, inboxAddr, nativeTokenAddr);
  },
};
