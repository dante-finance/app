import { Configuration } from './tomb-finance/config';
import { BankInfo, Vault } from './tomb-finance';

const configurations: { [env: string]: Configuration } = {
  /*development: {
    chainId: 4002,
    networkName: 'Fantom Opera Testnet',
    ftmscanUrl: 'https://testnet.ftmscan.com',
    defaultProvider: 'https://xapi.testnet.fantom.network/lachesis',
    deployments: require('./tomb-finance/deployments/deployments.testing.json'),
    externalTokens: {
      WFTM: ['0x7220838A1434a3DD4E434E6984F46A58B483Df69', 18],
      USDC: ['0x592B22834f4CB9F756D629E56Cfaf79E6dBe1Ee8', 18],
      TOMB: ['0x04F62d3Fe06802069e814880d6E1Dcd186183825', 18],
      'USDC-FTM-LP': ['0x1537435f15d47f5f6c76aa9a3fb94da2e5cab8e6', 18],
      'DANTE-TOMB-LP': ['0x9ac3796cfe6b12d6665a32c3800492d6761fe28f', 18],
      'GRAIL-FTM-LP': ['0x78c7fe92dd16392232a45dd3c5a930f2bd580418', 18],
      'TOMB-FTM-LP': ['0xfda64eedbd9f0ecd8e8932bd6724c529417b6851', 18],
      'DANTE-GRAIL-LP': ['0x521bbc668698999ac18d631002665c66daabef5a', 18]
    },
    baseLaunchDate: new Date('2021-06-02 13:00:00Z'),
    bondLaunchesAt: new Date('2020-12-03T15:00:00Z'),
    masonryLaunchesAt: new Date('2020-12-11T00:00:00Z'),
    refreshInterval: 10000,
  },*/
  development: {
    chainId: 250,
    networkName: 'Fantom Opera',
    ftmscanUrl: 'https://ftmscan.com/',
    defaultProvider: 'https://rpc.ftm.tools/',
    deployments: require('./tomb-finance/deployments/deployments.mainnet.json'),
    externalTokens: {
      WFTM: ['0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83', 18],
      USDC: ['0x04068da6c83afcfa0e13ba15a6696662335d5b75', 6],
      TOMB: ['0x6c021ae822bea943b2e66552bde1d2696a53fbb7', 18],
      FAME: ['0x904f51a2E7eEaf76aaF0418cbAF0B71149686f4A', 18],
      'd-R-DAN-TOM': ['0x6a457e84efec41a4aec0ca0d8357fc05f749ace9', 18],
      'USDC-FTM-LP': ['0x2b4C76d0dc16BE1C31D4C1DC53bF9B45987Fc75c', 18],
      'DANTE-TOMB-LP': ['0xac32e07c25cb18266841ed7035390744cd3b1155', 18],
      'GRAIL-FTM-LP': ['0xf06ea523a86df3bda303967dce59007fd7e85be2', 18],
      'TOMB-FTM-LP': ['0x2A651563C9d3Af67aE0388a5c8F89b867038089e', 18],
      'DANTE-GRAIL-LP': ['0xb8c780a89e8f13414a96d13aa13c523f1a5d36bc', 18],
      'FAME-USDC-LP': ['0x755904c8ccb785366c57bcf883cb25bb00dd100f', 18],
      DANTE: ['0xda763530614fb51dff9673232c8b3b3e0a67bcf2', 18],
      GRAIL: ['0x255861B569D44Df3E113b6cA090a1122046E6F89', 18],
    },
    baseLaunchDate: new Date('2021-06-02 13:00:00Z'),
    bondLaunchesAt: new Date('2020-12-03T15:00:00Z'),
    masonryLaunchesAt: new Date('2020-12-11T00:00:00Z'),
    refreshInterval: 10000,
  },
  /*production: {
    chainId: 4002,
    networkName: 'Fantom Opera Testnet',
    ftmscanUrl: 'https://testnet.ftmscan.com',
    defaultProvider: 'https://xapi.testnet.fantom.network/lachesis',
    deployments: require('./tomb-finance/deployments/deployments.testing.json'),
    externalTokens: {
      WFTM: ['0x7220838A1434a3DD4E434E6984F46A58B483Df69', 18],
      USDC: ['0x592B22834f4CB9F756D629E56Cfaf79E6dBe1Ee8', 18],
      TOMB: ['0x04F62d3Fe06802069e814880d6E1Dcd186183825', 18],
      'USDC-FTM-LP': ['0x1537435f15d47f5f6c76aa9a3fb94da2e5cab8e6', 18],
      'DANTE-TOMB-LP': ['0x9ac3796cfe6b12d6665a32c3800492d6761fe28f', 18],
      'GRAIL-FTM-LP': ['0x78c7fe92dd16392232a45dd3c5a930f2bd580418', 18],
      'TOMB-FTM-LP': ['0xfda64eedbd9f0ecd8e8932bd6724c529417b6851', 18],
      'DANTE-GRAIL-LP': ['0x521bbc668698999ac18d631002665c66daabef5a', 18]
    },
    baseLaunchDate: new Date('2021-06-02 13:00:00Z'),
    bondLaunchesAt: new Date('2020-12-03T15:00:00Z'),
    masonryLaunchesAt: new Date('2020-12-11T00:00:00Z'),
    refreshInterval: 10000,
  }*/
  production: {
    chainId: 250,
    networkName: 'Fantom Opera',
    ftmscanUrl: 'https://ftmscan.com/',
    defaultProvider: 'https://rpc.ftm.tools/',
    deployments: require('./tomb-finance/deployments/deployments.mainnet.json'),
    externalTokens: {
      WFTM: ['0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83', 18],
      USDC: ['0x04068da6c83afcfa0e13ba15a6696662335d5b75', 6],
      TOMB: ['0x6c021ae822bea943b2e66552bde1d2696a53fbb7', 18],
      FAME: ['0x904f51a2E7eEaf76aaF0418cbAF0B71149686f4A', 18],
      'USDC-FTM-LP': ['0x2b4C76d0dc16BE1C31D4C1DC53bF9B45987Fc75c', 18],
      'DANTE-TOMB-LP': ['0xac32e07c25cb18266841ed7035390744cd3b1155', 18],
      'GRAIL-FTM-LP': ['0xf06ea523a86df3bda303967dce59007fd7e85be2', 18],
      'TOMB-FTM-LP': ['0x2A651563C9d3Af67aE0388a5c8F89b867038089e', 18],
      'DANTE-GRAIL-LP': ['0xb8c780a89e8f13414a96d13aa13c523f1a5d36bc', 18],
      'FAME-USDC-LP': ['0x755904c8ccb785366c57bcf883cb25bb00dd100f', 18],
      DANTE: ['0xda763530614fb51dff9673232c8b3b3e0a67bcf2', 18],
      GRAIL: ['0x255861B569D44Df3E113b6cA090a1122046E6F89', 18],
    },
    baseLaunchDate: new Date('2021-06-02 13:00:00Z'),
    bondLaunchesAt: new Date('2020-12-03T15:00:00Z'),
    masonryLaunchesAt: new Date('2020-12-11T00:00:00Z'),
    refreshInterval: 10000,
  },
};

export const bankDefinitions: { [contractName: string]: BankInfo } = {
  /*
  Explanation:
  identifier: unique ID of the card
  name: description of the card
  poolId: the poolId assigned in the contract
  sectionInUI: way to distinguish in which of the pool groups it should be listed
  contract: the contract name which will be loaded from the deployment.environmnet.json
  depositTokenName : the name of the token to be deposited
  earnTokenName: the rewarded token
  finished: will disable the pool on the UI if set to true
  sort: the order of the pool
  */
  WFTMDanteRewardPool: {
    identifier: 'WFTMDanteRewardPool',
    name: 'Earn Dante by WFtm',
    poolId: 0,
    sectionInUI: 0,
    contract: 'DanteRewardPool',
    depositTokenName: 'WFTM',
    depositTokenNameSpan: 'Wrapped Ftm',
    earnTokenName: 'DANTE',
    finished: false,
    sort: 1,
    closedForStaking: false,
    fee: 0.8,
  },
  USDCDanteRewardPool: {
    identifier: 'USDCDanteRewardPool',
    name: 'Earn Dante by USDC',
    poolId: 1,
    sectionInUI: 0,
    contract: 'DanteRewardPool',
    depositTokenName: 'USDC',
    depositTokenNameSpan: 'USDC',
    earnTokenName: 'DANTE',
    finished: false,
    sort: 2,
    closedForStaking: false,
    fee: 0.8,
  },
  TombDanteRewardPool: {
    identifier: 'TombDanteRewardPool',
    name: 'Earn Dante by Tomb',
    poolId: 2,
    sectionInUI: 0,
    contract: 'DanteRewardPool',
    depositTokenName: 'TOMB',
    depositTokenNameSpan: 'Tomb',
    earnTokenName: 'DANTE',
    finished: false,
    sort: 3,
    closedForStaking: false,
    fee: 0.8,
  },
  DanteTombLPDanteRewardPool: {
    identifier: 'DanteTombLPDanteRewardPool',
    name: 'Earn Dante by Dante-Tomb LP',
    poolId: 3,
    sectionInUI: 0,
    contract: 'DanteRewardPool',
    depositTokenName: 'DANTE-TOMB-LP',
    depositTokenNameSpan: 'Dante-Tomb LP',
    earnTokenName: 'DANTE',
    finished: false,
    sort: 4,
    closedForStaking: false,
    fee: 0.8,
  },
  FameDanteRewardPool: {
    identifier: 'FameDanteRewardPool',
    name: 'Earn Dante by Fame',
    poolId: 4,
    sectionInUI: 0,
    contract: 'DanteRewardPool',
    depositTokenName: 'FAME',
    depositTokenNameSpan: 'Fame',
    earnTokenName: 'DANTE',
    finished: false,
    sort: 5,
    closedForStaking: false,
    fee: 0.8,
  },
  DanteTombLPGrailRewardPool: {
    identifier: 'DanteTombLPGrailRewardPool',
    name: 'Earn Grail by Dante-Tomb LP',
    poolId: 0,
    sectionInUI: 2,
    contract: 'GrailRewardPool',
    depositTokenName: 'DANTE-TOMB-LP',
    depositTokenNameSpan: 'Dante-Tomb LP',
    earnTokenName: 'GRAIL',
    finished: false,
    sort: 1,
    closedForStaking: false,
    fee: 0,
  },
  GrailWFTMLPGrailRewardPool: {
    identifier: 'GrailWFTMLPGrailRewardPool',
    name: 'Earn Grail by Grail-Ftm LP',
    poolId: 1,
    sectionInUI: 2,
    contract: 'GrailRewardPool',
    depositTokenName: 'GRAIL-FTM-LP',
    depositTokenNameSpan: 'Grail-Ftm LP',
    earnTokenName: 'GRAIL',
    finished: false,
    sort: 2,
    closedForStaking: false,
    fee: 0,
  },
  /*DanteGrailLPGrailRewardPool: {
    identifier: 'DanteGrailLPGrailRewardPool',
    name: 'Earn Grail by Dante-Grail LP',
    poolId: 2,
    sectionInUI: 2,
    contract: 'GrailRewardPool',
    depositTokenName: 'DANTE-GRAIL-LP',
    depositTokenNameSpan: 'Dante-Grail LP',
    earnTokenName: 'GRAIL',
    finished: false,
    sort: 3,
    closedForStaking: false,
    fee: 0
  }*/
  DanteGrailRewardPool: {
    identifier: 'DanteGrailRewardPool',
    name: 'Earn Grail by Dante',
    poolId: 3,
    sectionInUI: 2,
    contract: 'GrailRewardPool',
    depositTokenName: 'DANTE',
    depositTokenNameSpan: 'Dante',
    earnTokenName: 'GRAIL',
    finished: false,
    sort: 4,
    closedForStaking: false,
    fee: 0,
  },
};

export const vaultDefinitions: { [contractName: string]: Vault } = {
  DanteTombVault: {
    contract: 'DanteTombVault',
    shareTokenName: 'd-R-DAN-TOM',
    wantTokenName: 'DANTE-TOMB-LP',
    poolName: 'Dante-Tomb Vault',
  },
  /*GrailFtmVault: {
    contract: 'GrailFtmVault',
    shareTokenName: 'GRAIL-FTM-RECEIPT',
    wantTokenName: 'GRAIL-FTM-LP',
    poolName: 'Grail-Ftm Vault',
  },*/
};

export default configurations[process.env.NODE_ENV || 'development'];
