import { ethers } from 'ethers';

export class WebSocketProvider {
  private provider: ethers.providers.WebSocketProvider;

  constructor(url: string) {
    this.provider = new ethers.providers.WebSocketProvider(url);
  }

  public onNewBlock(callback: (blockNumber: number) => void): void {
    this.provider.on('block', callback);
  }

  public getProvider(): ethers.providers.WebSocketProvider {
    return this.provider;
  }

  public async getBlockNumber(): Promise<number> {
    return await this.provider.getBlockNumber();
  }

  public async getTransaction(txHash: string): Promise<ethers.providers.TransactionResponse> {
    return await this.provider.getTransaction(txHash);
  }

  public async sendTransaction(signer: ethers.Signer, argv: any): Promise<ethers.providers.TransactionResponse> {
    try {
      const txResponse = await signer.sendTransaction({
        to: argv.to,
        value: ethers.utils.parseEther(argv.ethamount),
      });
      return txResponse;
    } catch (error: any) {
      throw new Error(`Transaction failed: ${error.message}`);
    }
  }
}
