import { ChainId, Fetcher, Route, Token, Pair, TokenAmount } from '@ac32/spookyswap-sdk';
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
import { FTM_TICKER, SPOOKY_ROUTER_ADDR, TOMB_TICKER } from '../utils/constants';
import { abi as IUniswapV2Pair } from './IUniswapV2Pair.json'

/**
 * An API module of Tomb Finance contracts.
 * All contract-interacting domain logic should be defined in here.
 */
export class TombFinance {
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

    // Uniswap V2 Pair
    this.DANTETOMB_LP = new Contract(externalTokens['DANTE-TOMB-LP'][0], IUniswapV2PairABI, provider);

    this.config = cfg;
    this.provider = provider;
  }

  /**
   * @param provider From an unlocked wallet. (e.g. Metamask)
   * @param account An address of unlocked wallet account.
   */
  unlockWallet(provider: any, account: string) {
    const newProvider = new ethers.providers.Web3Provider(provider, this.config.chainId);
    this.signer = newProvider.getSigner(0);
    this.myAccount = account;
    for (const [name, contract] of Object.entries(this.contracts)) {
      this.contracts[name] = contract.connect(this.signer);
    }
    const tokens = [this.DANTE, this.TSHARE, this.TBOND, ...Object.values(this.externalTokens)];
    for (const token of tokens) {
      token.connect(this.signer);
    }
    this.DANTETOMB_LP = this.DANTETOMB_LP.connect(this.signer);
    console.log(`🔓 Wallet is unlocked. Welcome, ${account}!`);
    this.fetchMasonryVersionOfUser()
      .then((version) => (this.masonryVersionOfUser = version))
      .catch((err) => {
        console.error(`Failed to fetch masonry version: ${err.stack}`);
        this.masonryVersionOfUser = 'latest';
      });
  }

  get isUnlocked(): boolean {
    return !!this.myAccount;
  }

  //===================================================================
  //===================== GET ASSET STATS =============================
  //===================FROM SPOOKY TO DISPLAY =========================
  //=========================IN HOME PAGE==============================
  //===================================================================

  async getDanteStat(): Promise<TokenStat> {
    const { DanteRewardPool } = this.contracts;
    const supply = await this.DANTE.totalSupply();
    const tombRewardPoolSupply = await this.DANTE.balanceOf(DanteRewardPool.address);

    const tombCirculatingSupply = supply
      .sub(tombRewardPoolSupply);

    const priceofDanteInTomb = Number(await this.getTokenPriceFromPancakeswap(
      this.TOMB,
      this.DANTE,
      this.externalTokens['DANTE-TOMB-LP'].address));

    const tombInUSD = await this.getTOMBPriceInDollars();
    
    const fixed = priceofDanteInTomb.toFixed(2);

    return {
      tokenInFtm: fixed,
      priceInDollars: (priceofDanteInTomb * tombInUSD).toFixed(2),
      totalSupply: getDisplayBalance(supply, this.DANTE.decimal, 0),
      circulatingSupply: getDisplayBalance(tombCirculatingSupply, this.DANTE.decimal, 0),
    };
  }

  /**
   * Get the price in USD of 1 TOMB
   * @returns 
   */
  async getTOMBPriceInDollars(): Promise<number> {
    // how many FTM for a TOMB
    const priceTOMBInWFTM = await this.getTokenPriceFromPancakeswap(
      this.FTM, 
      this.TOMB,
      this.externalTokens['TOMB-FTM-LP'].address);

    // price in USD of 1 FTM
    const priceOfOneWFTMInDollars = await this.getWFTMPriceFromPancakeswap();
    
    // price in USD of 1 TOMB
    return Number(priceTOMBInWFTM) * Number(priceOfOneWFTMInDollars);
  }

  /**
   * Calculates various stats for the requested LP
   * @param name of the LP token to load stats for
   * @returns
   */
  async getLPStat(name: string): Promise<LPStat> {
    const lpToken = this.externalTokens[name];
    
    const lpTokenSupply = getDisplayBalance(await lpToken.totalSupply(), 18);
    
    const token0 = name.startsWith('DANTE') ? this.DANTE : this.TSHARE;

    const token0Amount = getDisplayBalance(await token0.balanceOf(lpToken.address), 18);

    let token1Amount = token0 === this.DANTE ? 
      getDisplayBalance(await this.TOMB.balanceOf(lpToken.address), 18) :
      getDisplayBalance(await this.FTM.balanceOf(lpToken.address), 18);

    const tokenAmountInOneLP = Number(token0Amount) / Number(lpTokenSupply);
    const ftmAmountInOneLP = Number(token1Amount) / Number(lpTokenSupply);
    
    const lpTokenPrice = await this.getLPTokenPrice(lpToken, token0, token0 === this.DANTE);
    const lpTokenPriceFixed = Number(lpTokenPrice).toFixed(2).toString();
    const liquidity = (Number(lpTokenSupply) * Number(lpTokenPrice)).toFixed(2).toString();

    return {
      tokenAmount: tokenAmountInOneLP.toFixed(2).toString(),
      ftmAmount: ftmAmountInOneLP.toFixed(2).toString(),
      priceOfOne: lpTokenPriceFixed,
      totalLiquidity: liquidity,
      totalSupply: Number(lpTokenSupply).toFixed(2).toString(),
    };
  }

  /**
   * Use this method to get price for Tomb
   * @returns TokenStat for TBOND
   * priceInFTM
   * priceInDollars
   * TotalSupply
   * CirculatingSupply (always equal to total supply for bonds)
   */
  async getBondStat(): Promise<TokenStat> {
    const { Treasury } = this.contracts;
    const tombStat = await this.getDanteStat();
    const bondTombRatio = await Treasury.getBondPremiumRate();
    let modifier = 1; // keep to 1 if no bondPremium is to be used
    if (getBalance(bondTombRatio, this.DANTE.decimal) > 0) {
      modifier = getBalance(bondTombRatio, this.DANTE.decimal);
    }
    const bondPriceInFTM = (Number(tombStat.tokenInFtm) * modifier).toFixed(2);
    const priceOfTBondInDollars = (Number(tombStat.priceInDollars) * modifier).toFixed(2);
    const supply = await this.TBOND.displayedTotalSupply();
    return {
      tokenInFtm: bondPriceInFTM,
      priceInDollars: priceOfTBondInDollars,
      totalSupply: supply,
      circulatingSupply: supply,
    };
  }

  /**
   * @returns TokenStat for TSHARE
   * priceInFTM
   * priceInDollars
   * TotalSupply
   * CirculatingSupply (always equal to total supply for bonds)
   */
  async getShareStat(): Promise<TokenStat> {
    const { GrailRewardPool } = this.contracts;

    const supply = await this.TSHARE.totalSupply();

    const priceInFTM = await this.getTokenPriceFromPancakeswap(
      this.FTM,
      this.TSHARE,
      this.externalTokens['GRAIL-FTM-LP'].address);
    
    const rewardPool = await this.TSHARE.balanceOf(GrailRewardPool.address);
    
    const tShareCirculatingSupply = supply.sub(rewardPool);
    const priceOfOneFTM = await this.getWFTMPriceFromPancakeswap();
    const priceOfSharesInDollars = (Number(priceInFTM) * Number(priceOfOneFTM)).toFixed(2);

    return {
      tokenInFtm: priceInFTM,
      priceInDollars: priceOfSharesInDollars,
      totalSupply: getDisplayBalance(supply, this.TSHARE.decimal, 0),
      circulatingSupply: getDisplayBalance(tShareCirculatingSupply, this.TSHARE.decimal, 0),
    };
  }

  async getTombStatInEstimatedTWAP(): Promise<TokenStat> {
    const { SeigniorageOracle, DanteRewardPool } = this.contracts;
    const expectedPrice = await SeigniorageOracle.twap(this.DANTE.address, ethers.utils.parseEther('1'));

    const supply = await this.DANTE.totalSupply();

    const rewardPool = await this.DANTE.balanceOf(DanteRewardPool.address);
    
    const danteCirculatingSupply = supply.sub(rewardPool);
    
    return {
      tokenInFtm: getDisplayBalance(expectedPrice),
      priceInDollars: getDisplayBalance(expectedPrice),
      totalSupply: getDisplayBalance(supply, this.DANTE.decimal, 0),
      circulatingSupply: getDisplayBalance(danteCirculatingSupply, this.DANTE.decimal, 0),
    };
  }

  async getTombPriceInLastTWAP(): Promise<BigNumber> {
    const { Treasury } = this.contracts;
    return Treasury.getDanteUpdatedPrice();
  }

  /**
   * Calculates the TVL, APR and daily APR of a provided pool/bank
   * @param bank
   * @returns
   */
  async getPoolAPRs(bank: Bank): Promise<PoolStats> {
    if (this.myAccount === undefined) return;
    const depositToken = bank.depositToken;
    const poolContract = this.contracts[bank.contract];
    const depositTokenPrice = await this.getDepositTokenPriceInDollars(bank.depositTokenName, depositToken);
    const stakeInPool = await depositToken.balanceOf(bank.address);
    const TVL = Number(depositTokenPrice) * Number(getDisplayBalance(stakeInPool, depositToken.decimal));
    const stat = bank.earnTokenName === 'DANTE' ? await this.getDanteStat() : await this.getShareStat();
    const tokenPerSecond = await this.getTokenPerSecond(
      bank.earnTokenName,
      poolContract,
      bank.depositTokenName,
    );

    const tokenPerHour = tokenPerSecond.mul(60).mul(60);
    const totalRewardPricePerYear =
      Number(stat.priceInDollars) * Number(getDisplayBalance(tokenPerHour.mul(24).mul(365)));
    const totalRewardPricePerDay = Number(stat.priceInDollars) * Number(getDisplayBalance(tokenPerHour.mul(24)));
    const totalStakingTokenInPool =
      Number(depositTokenPrice) * Number(getDisplayBalance(stakeInPool, depositToken.decimal));
    const dailyAPR = (totalRewardPricePerDay / totalStakingTokenInPool) * 100;
    const yearlyAPR = (totalRewardPricePerYear / totalStakingTokenInPool) * 100;
    return {
      dailyAPR: dailyAPR.toFixed(2).toString(),
      yearlyAPR: yearlyAPR.toFixed(2).toString(),
      TVL: TVL.toFixed(2).toString(),
    };
  }

  /**
   * Method to return the amount of tokens the pool yields per second
   * @param earnTokenName the name of the token that the pool is earning
   * @param poolContract the actual contract of the pool
   * @returns
   */
   async getTokenPerSecond(
    earnTokenName: string,
    poolContract: Contract,
    depositTokenName: string,
  ) {
    if (earnTokenName === 'DANTE') {
      const rewardPerSecond = await poolContract.dantePerSecond();

      // calculate reward per second based on deposit token allocation
      switch(depositTokenName){
        case 'DANTE-TOMB-LP':
          return rewardPerSecond.mul(10000).div(20000);
        case 'USDC':
          return rewardPerSecond.mul(4000).div(20000);
        case 'WFTM':
          return rewardPerSecond.mul(4000).div(20000);
        case 'TOMB':
          return rewardPerSecond.mul(2000).div(20000);
        default:
          return 0;
      }
    } else {
      const rewardPerSecond = await poolContract.tSharePerSecond();

      switch(depositTokenName) {
        case 'DANTE-TOMB-LP':
          return rewardPerSecond.mul(29750).div(59500);
        case 'GRAIL-FTM-LP':
          return rewardPerSecond.mul(22000).div(59500);
        case 'DANTE-GRAIL-LP': 
          return rewardPerSecond.mul(7750).div(59500);
        default:
          return 0;
      }
    }
  }

  /**
   * Method to calculate the tokenPrice of the deposited asset in a pool/bank
   * If the deposited token is an LP it will find the price of its pieces
   * @param tokenName
   * @param pool
   * @param token
   * @returns
   */
  async getDepositTokenPriceInDollars(
    tokenName: string, 
    token: ERC20) {

    switch(tokenName)
    {
      case 'WFTM': {
        return await this.getWFTMPriceFromPancakeswap();
      }
      case 'DANTE-TOMB-LP': {
        return await this.getLPTokenPrice(token, this.DANTE, true);
      }
      case 'GRAIL-FTM-LP': {
        return await this.getLPTokenPrice(token, this.TSHARE, false);
      }
      case 'DANTE-GRAIL-LP': {
        return await this.getLPTokenPrice(token, this.DANTE, true);;
      }
      case 'GRAIL': {
        const priceInFTM = await this.getTokenPriceFromPancakeswap(
          this.FTM,
          this.TSHARE,
          this.externalTokens['GRAIL-FTM-LP'].address);

        const ftmInDollars = await this.getWFTMPriceFromPancakeswap();
        
        return (Number(priceInFTM) * Number(ftmInDollars)).toFixed(2);
      }
      case 'TOMB': {
        const priceInFTM = await this.getTokenPriceFromPancakeswap(
          this.FTM,
          this.TOMB,
          this.externalTokens['TOMB-FTM-LP'].address);

        const ftmInDollars = await this.getWFTMPriceFromPancakeswap();
        
        return (Number(priceInFTM) * Number(ftmInDollars)).toFixed(2);
      }
      case 'USDC': {
        return '1';
      }
      default: {
        return '0'
      }
    }
  }

  //===================================================================
  //===================== GET ASSET STATS =============================
  //=========================== END ===================================
  //===================================================================

  async getCurrentEpoch(): Promise<BigNumber> {
    const { Treasury } = this.contracts;
    return Treasury.epoch();
  }

  async getBondOraclePriceInLastTWAP(): Promise<BigNumber> {
    const { Treasury } = this.contracts;
    return Treasury.getBondPremiumRate();
  }

  /**
   * Buy bonds with cash.
   * @param amount amount of cash to purchase bonds with.
   */
  async buyBonds(amount: string | number): Promise<TransactionResponse> {
    const { Treasury } = this.contracts;
    const treasuryDantePrice = await Treasury.getDantePrice();
    return await Treasury.buyBonds(decimalToBalance(amount), treasuryDantePrice);
  }

  /**
   * Redeem bonds for cash.
   * @param amount amount of bonds to redeem.
   */
  async redeemBonds(amount: string): Promise<TransactionResponse> {
    const { Treasury } = this.contracts;
    const priceForDante = await Treasury.getDantePrice();
    return await Treasury.redeemBonds(decimalToBalance(amount), priceForDante);
  }

  async getTotalValueLocked(): Promise<Number> {
    let totalValue = 0;
    for (const bankInfo of Object.values(bankDefinitions)) {
      const pool = this.contracts[bankInfo.contract];
      const token = this.externalTokens[bankInfo.depositTokenName];
      const tokenPrice = await this.getDepositTokenPriceInDollars(bankInfo.depositTokenName, token);
      const tokenAmountInPool = await token.balanceOf(pool.address);
      const value = Number(getDisplayBalance(tokenAmountInPool, token.decimal)) * Number(tokenPrice);
      const poolValue = Number.isNaN(value) ? 0 : value;
      totalValue += poolValue;
    }

    const TSHAREPrice = (await this.getShareStat()).priceInDollars;
    const masonrytShareBalanceOf = await this.TSHARE.balanceOf(this.currentMasonry().address);
    const masonryTVL = Number(getDisplayBalance(masonrytShareBalanceOf, this.TSHARE.decimal)) * Number(TSHAREPrice);

    return totalValue + masonryTVL;
  }

  /**
   * Calculates the price of an LP token
   * Reference https://github.com/DefiDebauchery/discordpricebot/blob/4da3cdb57016df108ad2d0bb0c91cd8dd5f9d834/pricebot/pricebot.py#L150
   * @param lpToken the token under calculation
   * @param token the token pair used as reference (the other one would be FTM in most cases)
   * @param isTomb sanity check for usage of tomb token or tShare
   * @returns price of the LP token
   */
  async getLPTokenPrice(lpToken: ERC20, token: ERC20, isDante: boolean): Promise<string> {
    const totalSupply = getFullDisplayBalance(await lpToken.totalSupply(), lpToken.decimal);
    //Get amount of tokenA
    const tokenSupply = getFullDisplayBalance(await token.balanceOf(lpToken.address), token.decimal);
    const stat = isDante === true ? await this.getDanteStat() : await this.getShareStat();
    const priceOfToken = stat.priceInDollars;
    const tokenInLP = Number(tokenSupply) / Number(totalSupply);
    const tokenPrice = (Number(priceOfToken) * tokenInLP * 2); //We multiply by 2 since half the price of the lp token is the price of each piece of the pair. So twice gives the total
    return tokenPrice.toString();
  }

  async earnedFromBank(
    poolName: ContractName,
    earnTokenName: String,
    poolId: Number,
    account = this.myAccount,
  ): Promise<BigNumber> {
    const pool = this.contracts[poolName];
    try {
      if (earnTokenName === 'DANTE') {
        return await pool.pendingDANTE(poolId, account);
      } else {
        return await pool.pendingShare(poolId, account);
      }
    } catch (err) {
      console.error(`Failed to call earned() on pool ${pool.address}: ${err}`);
      return BigNumber.from(0);
    }
  }

  async stakedBalanceOnBank(poolName: ContractName, poolId: Number, account = this.myAccount): Promise<BigNumber> {
    const pool = this.contracts[poolName];
    try {
      let userInfo = await pool.userInfo(poolId, account);
      return await userInfo.amount;
    } catch (err) {
      console.error(`Failed to call balanceOf() on pool ${pool.address}: ${err}`);
      return BigNumber.from(0);
    }
  }

  /**
   * Deposits token to given pool.
   * @param poolName A name of pool contract.
   * @param amount Number of tokens with decimals applied. (e.g. 1.45 DAI * 10^18)
   * @returns {string} Transaction hash
   */
  async stake(poolName: ContractName, poolId: Number, amount: BigNumber): Promise<TransactionResponse> {
    const pool = this.contracts[poolName];
    return await pool.deposit(poolId, amount);
  }

  /**
   * Withdraws token from given pool.
   * @param poolName A name of pool contract.
   * @param amount Number of tokens with decimals applied. (e.g. 1.45 DAI * 10^18)
   * @returns {string} Transaction hash
   */
  async unstake(poolName: ContractName, poolId: Number, amount: BigNumber): Promise<TransactionResponse> {
    const pool = this.contracts[poolName];
    return await pool.withdraw(poolId, amount);
  }

  /**
   * Transfers earned token reward from given pool to my account.
   */
  async harvest(poolName: ContractName, poolId: Number): Promise<TransactionResponse> {
    const pool = this.contracts[poolName];
    //By passing 0 as the amount, we are asking the contract to only redeem the reward and not the currently staked token
    return await pool.withdraw(poolId, 0);
  }

  /**
   * Harvests and withdraws deposited tokens from the pool.
   */
  async exit(poolName: ContractName, poolId: Number, account = this.myAccount): Promise<TransactionResponse> {
    const pool = this.contracts[poolName];
    let userInfo = await pool.userInfo(poolId, account);
    return await pool.withdraw(poolId, userInfo.amount);
  }

  async fetchMasonryVersionOfUser(): Promise<string> {
    return 'latest';
  }

  currentMasonry(): Contract {
    if (!this.masonryVersionOfUser) {
      //throw new Error('you must unlock the wallet to continue.');
    }
    return this.contracts.Masonry;
  }

  isOldMasonryMember(): boolean {
    return this.masonryVersionOfUser !== 'latest';
  }

  async getTokenPriceFromPancakeswap(
    tokenAERC20: ERC20,
    tokenBERC20: ERC20,
    lpAddress: string): Promise<string> {
    const ready = await this.provider.ready;
    if (!ready) return;
    const { chainId } = this.config;

    const tokenA = await Fetcher.fetchTokenData(chainId, tokenAERC20.address, this.provider);
    const tokenB = await Fetcher.fetchTokenData(chainId, tokenBERC20.address, this.provider);

    try {
      const [reserves0, reserves1] = await new Contract(
        lpAddress, 
        IUniswapV2Pair, 
        this.provider)
        .getReserves();

      const balances = tokenA.sortsBefore(tokenB) ? [reserves0, reserves1] : [reserves1, reserves0];
      const pair = new Pair(new TokenAmount(tokenA, balances[0]), new TokenAmount(tokenB, balances[1]));

      const route = new Route([pair], tokenB);

      return route.midPrice.toFixed(4);
    } catch (err) {
      console.error(`Failed to fetch token price of ${tokenA.symbol}: ${err}`);
    }
  }

  async getWFTMPriceFromPancakeswap(): Promise<string> {

    const { WFTM, USDC } = this.externalTokens;

    return this.getTokenPriceFromPancakeswap(
      USDC,
      WFTM,
      this.externalTokens['USDC-FTM-LP'].address
    );
  }

  //===================================================================
  //===================================================================
  //===================== MASONRY METHODS =============================
  //===================================================================
  //===================================================================

  async getMasonryAPR() {
    const Masonry = this.currentMasonry();
    const latestSnapshotIndex = await Masonry.latestSnapshotIndex();
    const lastHistory = await Masonry.masonryHistory(latestSnapshotIndex);

    const lastRewardsReceived = lastHistory[1];

    const TSHAREPrice = (await this.getShareStat()).priceInDollars;
    const TOMBPrice = (await this.getDanteStat()).priceInDollars;
    const epochRewardsPerShare = lastRewardsReceived / 1e18;

    //Mgod formula
    const amountOfRewardsPerDay = epochRewardsPerShare * Number(TOMBPrice) * 4;
    const masonrytShareBalanceOf = await this.TSHARE.balanceOf(Masonry.address);
    const masonryTVL = Number(getDisplayBalance(masonrytShareBalanceOf, this.TSHARE.decimal)) * Number(TSHAREPrice);
    const realAPR = ((amountOfRewardsPerDay * 100) / masonryTVL) * 365;
    return realAPR;
  }

  /**
   * Checks if the user is allowed to retrieve their reward from the Masonry
   * @returns true if user can withdraw reward, false if they can't
   */
  async canUserClaimRewardFromMasonry(): Promise<boolean> {
    const Masonry = this.currentMasonry();
    return await Masonry.canClaimReward(this.myAccount);
  }

  /**
   * Checks if the user is allowed to retrieve their reward from the Masonry
   * @returns true if user can withdraw reward, false if they can't
   */
  async canUserUnstakeFromMasonry(): Promise<boolean> {
    const Masonry = this.currentMasonry();
    const canWithdraw = await Masonry.canWithdraw(this.myAccount);
    const stakedAmount = await this.getStakedSharesOnMasonry();
    const notStaked = Number(getDisplayBalance(stakedAmount, this.TSHARE.decimal)) === 0;
    const result = notStaked ? true : canWithdraw;
    return result;
  }

  async timeUntilClaimRewardFromMasonry(): Promise<BigNumber> {
    // const Masonry = this.currentMasonry();
    // const mason = await Masonry.masons(this.myAccount);
    return BigNumber.from(0);
  }

  async getTotalStakedInMasonry(): Promise<BigNumber> {
    const Masonry = this.currentMasonry();
    return await Masonry.totalSupply();
  }

  async stakeShareToMasonry(amount: string): Promise<TransactionResponse> {
    if (this.isOldMasonryMember()) {
      throw new Error("you're using old masonry. please withdraw and deposit the TSHARE again.");
    }
    const Masonry = this.currentMasonry();
    return await Masonry.stake(decimalToBalance(amount));
  }

  async getStakedSharesOnMasonry(): Promise<BigNumber> {
    const Masonry = this.currentMasonry();
    if (this.masonryVersionOfUser === 'v1') {
      return await Masonry.getShareOf(this.myAccount);
    }
    return await Masonry.balanceOf(this.myAccount);
  }

  async getEarningsOnMasonry(): Promise<BigNumber> {
    const Masonry = this.currentMasonry();
    if (this.masonryVersionOfUser === 'v1') {
      return await Masonry.getCashEarningsOf(this.myAccount);
    }

    const earned = await Masonry.earned(this.myAccount);
    return earned;
  }

  async withdrawShareFromMasonry(amount: string): Promise<TransactionResponse> {
    const Masonry = this.currentMasonry();
    return await Masonry.withdraw(decimalToBalance(amount));
  }

  async harvestCashFromMasonry(): Promise<TransactionResponse> {
    const Masonry = this.currentMasonry();
    if (this.masonryVersionOfUser === 'v1') {
      return await Masonry.claimDividends();
    }
    return await Masonry.claimReward();
  }

  async exitFromMasonry(): Promise<TransactionResponse> {
    const Masonry = this.currentMasonry();
    return await Masonry.exit();
  }

  async getTreasuryNextAllocationTime(): Promise<AllocationTime> {
    const { Treasury } = this.contracts;
    const nextEpochTimestamp: BigNumber = await Treasury.nextEpochPoint();
    const nextAllocation = new Date(nextEpochTimestamp.mul(1000).toNumber());
    const prevAllocation = new Date(Date.now());

    return { from: prevAllocation, to: nextAllocation };
  }
  /**
   * This method calculates and returns in a from to to format
   * the period the user needs to wait before being allowed to claim
   * their reward from the masonry
   * @returns Promise<AllocationTime>
   */
  async getUserClaimRewardTime(): Promise<AllocationTime> {
    const { Masonry, Treasury } = this.contracts;
    const nextEpochTimestamp = await Masonry.nextEpochPoint(); //in unix timestamp
    const currentEpoch = await Masonry.epoch();
    const mason = await Masonry.masons(this.myAccount);
    const startTimeEpoch = mason.epochTimerStart;
    const period = await Treasury.PERIOD();
    const periodInHours = period / 60 / 60; // 6 hours, period is displayed in seconds which is 21600
    const rewardLockupEpochs = await Masonry.rewardLockupEpochs();
    const targetEpochForClaimUnlock = Number(startTimeEpoch) + Number(rewardLockupEpochs);

    const fromDate = new Date(Date.now());
    if (targetEpochForClaimUnlock - currentEpoch <= 0) {
      return { from: fromDate, to: fromDate };
    } else if (targetEpochForClaimUnlock - currentEpoch === 1) {
      const toDate = new Date(nextEpochTimestamp * 1000);
      return { from: fromDate, to: toDate };
    } else {
      const toDate = new Date(nextEpochTimestamp * 1000);
      const delta = targetEpochForClaimUnlock - currentEpoch - 1;
      const endDate = moment(toDate)
        .add(delta * periodInHours, 'hours')
        .toDate();
      return { from: fromDate, to: endDate };
    }
  }

  /**
   * This method calculates and returns in a from to to format
   * the period the user needs to wait before being allowed to unstake
   * from the masonry
   * @returns Promise<AllocationTime>
   */
  async getUserUnstakeTime(): Promise<AllocationTime> {
    const { Masonry, Treasury } = this.contracts;
    const nextEpochTimestamp = await Masonry.nextEpochPoint();
    const currentEpoch = await Masonry.epoch();
    const mason = await Masonry.masons(this.myAccount);
    const startTimeEpoch = mason.epochTimerStart;
    const period = await Treasury.PERIOD();
    const PeriodInHours = period / 60 / 60;
    const withdrawLockupEpochs = await Masonry.withdrawLockupEpochs();
    const fromDate = new Date(Date.now());
    const targetEpochForClaimUnlock = Number(startTimeEpoch) + Number(withdrawLockupEpochs);
    const stakedAmount = await this.getStakedSharesOnMasonry();
    if (currentEpoch <= targetEpochForClaimUnlock && Number(stakedAmount) === 0) {
      return { from: fromDate, to: fromDate };
    } else if (targetEpochForClaimUnlock - currentEpoch === 1) {
      const toDate = new Date(nextEpochTimestamp * 1000);
      return { from: fromDate, to: toDate };
    } else {
      const toDate = new Date(nextEpochTimestamp * 1000);
      const delta = targetEpochForClaimUnlock - Number(currentEpoch) - 1;
      const endDate = moment(toDate)
        .add(delta * PeriodInHours, 'hours')
        .toDate();
      return { from: fromDate, to: endDate };
    }
  }

  async watchAssetInMetamask(assetName: string): Promise<boolean> {
    const { ethereum } = window as any;
    if (ethereum && ethereum.networkVersion === config.chainId.toString()) {
      let asset;
      let assetUrl;
      if (assetName === 'DANTE') {
        asset = this.DANTE;
        assetUrl = 'https://tomb.finance/presskit/tomb_icon_noBG.png';
      } else if (assetName === 'GRAIL') {
        asset = this.TSHARE;
        assetUrl = 'https://tomb.finance/presskit/tshare_icon_noBG.png';
      } else if (assetName === 'DBOND') {
        asset = this.TBOND;
        assetUrl = 'https://tomb.finance/presskit/tbond_icon_noBG.png';
      }
      await ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: asset.address,
            symbol: asset.symbol,
            decimals: 18,
            image: assetUrl,
          },
        },
      });
    }
    return true;
  }

  /**
   * @returns an array of the regulation events till the most up to date epoch
   */
  async listenForRegulationsEvents(): Promise<any> {
    const { Treasury } = this.contracts;

    const treasuryDaoFundedFilter = Treasury.filters.DaoFundFunded();
    const treasuryDevFundedFilter = Treasury.filters.DevFundFunded();
    const treasuryMasonryFundedFilter = Treasury.filters.MasonryFunded();

    let masonryFundEvents = await Treasury.queryFilter(treasuryMasonryFundedFilter);
    var events: any[] = [];
    masonryFundEvents.forEach(function callback(value, index) {
      events.push({ epoch: index + 1 });
      events[index].masonryFund = getDisplayBalance(value.args[1]);
    });
    let DEVFundEvents = await Treasury.queryFilter(treasuryDevFundedFilter);
    DEVFundEvents.forEach(function callback(value, index) {
      events[index].devFund = getDisplayBalance(value.args[1]);
    });
    let DAOFundEvents = await Treasury.queryFilter(treasuryDaoFundedFilter);
    DAOFundEvents.forEach(function callback(value, index) {
      events[index].daoFund = getDisplayBalance(value.args[1]);
    });
    return events;
  }

  async estimateZapIn(tokenName: string, lpName: string, amount: string): Promise<number[]> {
    const { zapper } = this.contracts;
    const lpToken = this.externalTokens[lpName];
    let estimate;
    if (tokenName === FTM_TICKER) {
      estimate = await zapper.estimateZapIn(lpToken.address, SPOOKY_ROUTER_ADDR, parseUnits(amount, 18));
    } else {
      const token = tokenName === TOMB_TICKER ? this.DANTE : this.TSHARE;
      estimate = await zapper.estimateZapInToken(
        token.address,
        lpToken.address,
        SPOOKY_ROUTER_ADDR,
        parseUnits(amount, 18),
      );
    }
    return [estimate[0] / 1e18, estimate[1] / 1e18];
  }
  async zapIn(tokenName: string, lpName: string, amount: string): Promise<TransactionResponse> {
    const { zapper } = this.contracts;
    const lpToken = this.externalTokens[lpName];
    if (tokenName === FTM_TICKER) {
      let overrides = {
        value: parseUnits(amount, 18),
      };
      return await zapper.zapIn(lpToken.address, SPOOKY_ROUTER_ADDR, this.myAccount, overrides);
    } else {
      const token = tokenName === TOMB_TICKER ? this.DANTE : this.TSHARE;
      return await zapper.zapInToken(
        token.address,
        parseUnits(amount, 18),
        lpToken.address,
        SPOOKY_ROUTER_ADDR,
        this.myAccount,
      );
    }
  }
}
