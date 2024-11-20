import { ethers } from 'ethers';
import * as fs from 'fs';
import { roles, passphrase, keystoreDirectory } from '../config/consts';

export async function writeAccounts(mnemonic: string) {
  await generateKeystore(mnemonic);
}

async function generateKeystore(mnemonic: string) {
  for (const index in roles) {
    const role = roles[index];
    const key = mnemonic == null ? mnemonic : ethers.utils.entropyToMnemonic(ethers.utils.randomBytes(16));
    const wallet = ethers.Wallet.fromMnemonic(key);

    const keystore = await wallet.encrypt(passphrase);
    const keystorePath = `${keystoreDirectory}/${role}-${wallet.address}.json`;

    fs.writeFileSync(keystorePath, keystore);
    console.log(`Keystore for ${role} saved at ${keystorePath}`);
  }
}
