import { Fetcher, Route, Pair, TokenAmount } from '@ac32/spookyswap-sdk';
import { Configuration } from './config';
import { ContractName, TokenStat, AllocationTime, LPStat, Bank, PoolStats } from './types';
import { BigNumber, Contract, ethers } from 'ethers';
import { decimalToBalance } from './ether-utils';
import { TransactionResponse } from '@ethersproject/providers';
import ERC20 from './ERC20';
import { getFullDisplayBalance, getDisplayBalance, getBalance } from '../utils/formatBalance';
import { getDefaultProvider } from '../utils/provider';
import IUniswapV2PairABI from './IUniswapV2Pair.abi.json';
import config, { bankDefinitions } from '../config';
import moment from 'moment';
import { parseUnits } from 'ethers/lib/utils';
import { SPOOKY_ROUTER_ADDR } from '../utils/constants';
import { abi as IUniswapV2Pair } from './IUniswapV2Pair.json';

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
  masonryVersionOfUser?: string;

  DANTETOMB_LP: Contract;
  DANTE: ERC20;
  TSHARE: ERC20;
  TBOND: ERC20;

  FTM: ERC20;
  TOMB: ERC20;
  USDC: ERC20;
  FAME: ERC20;

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
    this.DANTE = new ERC20(deployments.Dante.address, provider, 'DANTE', 18);
    this.TSHARE = new ERC20(deployments.Grail.address, provider, 'GRAIL', 18);
    this.TBOND = new ERC20(deployments.DBond.address, provider, 'DBOND', 18);

    this.TOMB = this.externalTokens['TOMB'];
    this.FTM = this.externalTokens['WFTM'];
    this.USDC = this.externalTokens['USDC'];
    this.FAME = this.externalTokens['FAME'];

    // Uniswap V2 Pair
    this.DANTETOMB_LP = new Contract(externalTokens['DANTE-TOMB-LP'][0], IUniswapV2PairABI, provider);

    this.config = cfg;
    this.provider = provider;
  }
  
  
}
