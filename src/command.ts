import { writeAccounts } from './account/accounts';

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
