import { writeAccounts } from './account/accounts';
import { writeConfigs } from './config/config';

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
