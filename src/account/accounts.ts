import { ethers } from 'ethers';
import * as fs from 'fs';
import * as path from 'path';
import { roles, passphrase, AccountOutputDir } from '../environment';

export async function writeAccounts(mnemonic: string) {
  await generateKeystore(mnemonic);
}

async function generateKeystore(mnemonic: string) {
  const key = mnemonic ? mnemonic : ethers.utils.entropyToMnemonic(ethers.utils.randomBytes(16));
  console.log(`mnemonic: ${key}`);

  for (const index in roles) {
    const role = roles[index];
    const wallet = ethers.Wallet.fromMnemonic(key, "m/44'/60'/0'/0/" + index);

    const keystorePath = path.resolve(AccountOutputDir, `${role}-${wallet.address}.key`);

    const dir = path.dirname(keystorePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const keystore = await wallet.encrypt(passphrase);
    fs.writeFileSync(keystorePath, keystore);
    console.log(`Keystore for ${role} saved at ${keystorePath}`);
  }
}
