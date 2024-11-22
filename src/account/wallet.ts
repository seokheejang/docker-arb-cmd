import { ethers } from 'ethers';
import * as fs from 'fs';

export const GetWallet = async (key: string, pass: string): Promise<ethers.Wallet> => {
  const cleanKey = key.startsWith('0x') ? key.slice(2) : key;

  if (cleanKey.length === 64 && /^[0-9a-fA-F]{64}$/.test(cleanKey)) {
    return new ethers.Wallet(key);
  } else {
    // keystore 파일 처리
    const keystoreContent = fs.readFileSync(key, 'utf8');
    return await ethers.Wallet.fromEncryptedJson(keystoreContent, pass);
  }
};
