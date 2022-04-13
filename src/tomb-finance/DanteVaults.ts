import { Fetcher, Route, Pair, TokenAmount } from '@ac32/spookyswap-sdk';
import { Configuration } from './config';
import { BigNumber, Contract, ethers } from 'ethers';
import ERC20 from './ERC20';
import { getDefaultProvider } from '../utils/provider';
import IUniswapV2PairABI from './IUniswapV2Pair.abi.json';
import { VaultPool } from './types';
import { TransactionResponse } from '@ethersproject/providers';

/**
 * An API module of Tomb Finance contracts.
 * All contract-interacting domain logic should be defined in here.
 */
export class DanteVaults {
  myAccount: string;
  provider: ethers.providers.Web3Provider;
  signer?: ethers.Signer;
  config: Configuration;
  contracts: { [name: string]: Contract };
  externalTokens: { [name: string]: ERC20 };

  constructor(cfg: Configuration) {
    const { deployments, externalTokens } = cfg;
    const provider = getDefaultProvider();

    // loads contracts from deployments
    this.contracts = {};
    for (const [name, deployment] of Object.entries(deployments)) {
      this.contracts[name] = new Contract(deployment.address, deployment.abi, provider);
    }

    this.externalTokens = {};
    for (const [symbol, [address, decimal]] of Object.entries(externalTokens)) {
      this.externalTokens[symbol] = new ERC20(address, provider, symbol, decimal);
    }

    this.config = cfg;
    this.provider = provider;
  }

  async getVaults(): Promise<VaultPool[]> {
    return null;
  }

  async deposit(want: BigNumber, vault: number) : Promise<TransactionResponse> {
    return null;
  }

  async depositAll(vault: number) : Promise<TransactionResponse> {
    return null;
  }

  async withdraw(shares: BigNumber, vault: number) : Promise<TransactionResponse> {
    return null;
  }

  async withdrawAll(vault: number) : Promise<TransactionResponse> {
    return null;
  }
}
