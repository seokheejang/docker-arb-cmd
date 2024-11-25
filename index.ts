import { hideBin } from 'yargs/helpers';
import Yargs from 'yargs/yargs';
import {
  genKeystoreFromMnemonicCmd,
  printAddressCmd,
  writeConfigCmd,
  sendNativeCoinCmd,
  createL1ERC20Cmd,
  approveERC20TokenForBridgeCmd,
  depositERC20TokenL1ToL2Cmd,
  getChildErc20AddressL1ToL2Cmd,
  bridgeNativeTokenToL3Cmd,
} from './src/command';

async function main() {
  await Yargs(hideBin(process.argv))
    .options({})
    .command(genKeystoreFromMnemonicCmd)
    .command(printAddressCmd)
    .command(writeConfigCmd)
    .command(sendNativeCoinCmd)
    .command(createL1ERC20Cmd)
    .command(approveERC20TokenForBridgeCmd)
    .command(depositERC20TokenL1ToL2Cmd)
    .command(getChildErc20AddressL1ToL2Cmd)
    .command(bridgeNativeTokenToL3Cmd)
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
