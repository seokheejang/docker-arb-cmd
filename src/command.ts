import { writeAccounts } from './account/accounts';

export const genKeystoreFromMnemonicCmd = {
  command: 'gen-keystore',
  describe: 'generate keystore from mnemonic',
  builder: {
    mnemonic: {
      string: true,
      default: '',
      describe: 'mnemonic (see general help)',
    },
  },
  handler: async (argv: any) => {
    await writeAccounts(argv.mnemonic);
  },
};
