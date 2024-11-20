import { ethers } from 'ethers';
import * as fs from 'fs';
import * as path from 'path';
import { roles, passphrase, keystoreDirectory } from '../config/consts';

export async function writeAccounts(mnemonic: string) {
  await generateKeystore(mnemonic);
}

async function generateKeystore(mnemonic: string) {
  const key = mnemonic ? mnemonic : ethers.utils.entropyToMnemonic(ethers.utils.randomBytes(16));
  console.log(`mnemonic: ${key}`);

  for (const index in roles) {
    const role = roles[index];
    const wallet = ethers.Wallet.fromMnemonic(key, "m/44'/60'/0'/0/" + index);

    const projectRoot = path.resolve(__dirname, '../../');
    const keystoreDir = path.join(projectRoot, keystoreDirectory);
    const keystorePath = path.resolve(keystoreDir, `${role}-${wallet.address}.keystore`);

    const dir = path.dirname(keystorePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const keystore = await wallet.encrypt(passphrase);
    fs.writeFileSync(keystorePath, keystore);
    console.log(`Keystore for ${role} saved at ${keystorePath}`);
  }
}
