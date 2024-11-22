import { writeAccounts, printAddress, printPrivateKey, GetWallet } from './account';
import { HttpProvider, WebSocketProvider } from './provider';
import { writeConfigs } from './config/config';

export const writeConfigCmd = {
  command: 'write-config',
  describe: 'writes config files',
  builder: {
    sequencer: {
      boolean: true,
      describe: 'sequencer config',
      default: false,
    },
    validator: {
      boolean: true,
      describe: 'validator config',
      default: false,
    },
    poster: {
      boolean: true,
      describe: 'poster config',
      default: false,
    },
    fullnode: {
      boolean: true,
      describe: 'fullnode config',
      default: false,
    },
    archive: {
      boolean: true,
      describe: 'fullnode config',
      default: false,
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
