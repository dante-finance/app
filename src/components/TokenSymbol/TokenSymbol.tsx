import React from 'react';

//Graveyard ecosystem logos
import tombLogo from '../../assets/img/tomb.svg';
import tShareLogo from '../../assets/img/crypto_tomb_share.svg';
import tombLogoPNG from '../../assets/img/crypto_tomb_cash.f2b44ef4.png';
import tShareLogoPNG from '../../assets/img/crypto_tomb_share.bf1a6c52.png';
import tBondLogo from '../../assets/img/crypto_tomb_bond.svg';

import tombFtmLpLogo from '../../assets/img/tomb_ftm_lp.png';
import tshareFtmLpLogo from '../../assets/img/tshare_ftm_lp.png';

import wftmLogo from '../../assets/img/fantom.png';
import usdcLogo from '../../assets/img/USDC.png';
import zooLogo from '../../assets/img/zoo_logo.svg';
import shibaLogo from '../../assets/img/shiba_logo.svg';

import danteLogo from '../../assets/img/dante.svg';
import grailLogo from '../../assets/img/grail.svg';
import dbondLogo from '../../assets/img/dbond.svg';
import danteTombLpLogo from '../../assets/img/dante_tomb.png';
import grailFtmLpLogo from '../../assets/img/grail_fantom.png';
import danteGrailLpLogo from '../../assets/img/dante_grail.svg';
import danteLogoPNG from '../../assets/img/dante_500x500.png';


const logosBySymbol: { [title: string]: string } = {
  //Real tokens
  //=====================
  TOMB: tombLogo,
  TOMBPNG: tombLogoPNG,
  TSHAREPNG: tShareLogoPNG,
  TSHARE: tShareLogo,
  TBOND: tBondLogo,  
  WFTM: wftmLogo,
  USDC: usdcLogo,
  'DANTE-TOMB-LP': danteTombLpLogo,
  'GRAIL-FTM-LP': grailFtmLpLogo,
  'DANTE-GRAIL-LP': danteGrailLpLogo,

  DANTE: danteLogo,
  GRAIL: grailLogo,
  DBOND: dbondLogo,
};

type LogoProps = {
  symbol: string;
  size?: number;
};

const TokenSymbol: React.FC<LogoProps> = ({ symbol, size = 100 }) => {
  if (!logosBySymbol[symbol]) {
    throw new Error(`Invalid Token Logo symbol: ${symbol}`);
  }
  return <img src={logosBySymbol[symbol]} alt={`${symbol} Logo`} width={size} height={size} />;
};

export default TokenSymbol;
