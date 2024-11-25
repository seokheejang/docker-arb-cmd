import { ethers } from 'ethers';
import * as fs from 'fs';
import * as path from 'path';
import { roles, passphrase, AccountOutputDir } from '../environment';

async function generateKeystore(mnemonic: string) {
  const key = mnemonic ? mnemonic : ethers.utils.entropyToMnemonic(ethers.utils.randomBytes(16));
  console.log(`mnemonic: ${key}`);

  if (!mnemonic) {
    const defaultKeystorePath = path.resolve(AccountOutputDir, `new-mnemonic.txt`);
    fs.writeFileSync(defaultKeystorePath, key);
    console.log(`New Mnemonic saved at ${defaultKeystorePath}`);
  }

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

export async function writeAccounts(mnemonic: string) {
  await generateKeystore(mnemonic);
}

export async function printAddress(keystore: string, pass: string): Promise<string> {
  try {
    const keystoreContent = fs.readFileSync(keystore, 'utf8');
    const wallet = await ethers.Wallet.fromEncryptedJson(keystoreContent, pass);
    return wallet.address.toLowerCase();
  } catch (error: any) {
    throw new Error(`Failed to unlock keystore: ${error.message}`);
  }
}

export async function printPrivateKey(keystore: string, pass: string): Promise<string> {
  try {
    const keystoreContent = fs.readFileSync(keystore, 'utf8');
    const wallet = await ethers.Wallet.fromEncryptedJson(keystoreContent, pass);
    return wallet.privateKey;
  } catch (error: any) {
    throw new Error(`Failed to unlock keystore: ${error.message}`);
  }
}
