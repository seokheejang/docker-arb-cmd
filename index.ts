import { hideBin } from 'yargs/helpers';
import Yargs from 'yargs/yargs';
import { genKeystoreFromMnemonicCmd, printAddressCmd, writeConfigCmd, sendNativeCoinCmd } from './src/command';

async function main() {
  await Yargs(hideBin(process.argv))
    .options({})
    .command(genKeystoreFromMnemonicCmd)
    .command(printAddressCmd)
    .command(writeConfigCmd)
    .command(sendNativeCoinCmd)
    .strict()
    .demandCommand(1, 'a command must be specified')
    .help().argv;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
