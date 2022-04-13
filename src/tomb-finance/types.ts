import { BigNumber } from 'ethers';
import ERC20 from './ERC20';

export type ContractName = string;

export interface BankInfo {
  identifier: string;
  name: string;
  poolId: number;
  sectionInUI: number;
  contract: ContractName;
  depositTokenName: ContractName;
  depositTokenNameSpan: string;
  earnTokenName: ContractName;
  sort: number;
  finished: boolean;
  closedForStaking: boolean;
  fee: number;
}

export interface Bank extends BankInfo {
  address: string;
  depositToken: ERC20;
  earnToken: ERC20;
}

export interface Vault {
  poolId: number;
  shareTokenName: string;
  wantTokenName: string;
  poolName: string;
}

export type PoolStats = {
  dailyAPR: string;
  yearlyAPR: string;
  TVL: string;
};

export type TokenStat = {
  tokenInFtm: string;
  priceInDollars: string;
  totalSupply: string;
  circulatingSupply: string;
};

export type LPStat = {
  tokenAmount: string;
  ftmAmount: string;
  priceOfOne: string;
  totalLiquidity: string;
  totalSupply: string;
};

export type AllocationTime = {
  from: Date;
  to: Date;
};

export type VaultPool = {
  id: number;
  name: string;
  want: string;
  wantBalance: BigNumber;
  share: string;
  shareBalance: BigNumber;
  approve: BigNumber;
  pricePerFullShare: BigNumber;
  apy: number;
  tvl: BigNumber
}