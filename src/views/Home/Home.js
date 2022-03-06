import React, { Fragment, useMemo } from 'react';
import Page from '../../components/Page';
import HomeImage from '../../assets/img/home.png';
import CashImage from '../../assets/img/dante.svg';
import Image from 'material-ui-image';
import { createGlobalStyle } from 'styled-components';
import CountUp from 'react-countup';
import CardIcon from '../../components/CardIcon';
import TokenSymbol from '../../components/TokenSymbol';
import LaunchCountdown from '../../components/LaunchCountdown'
import useTombStats from '../../hooks/useTombStats';
import useLpStats from '../../hooks/useLpStats';
import useModal from '../../hooks/useModal';
import useZap from '../../hooks/useZap';
import useBondStats from '../../hooks/useBondStats';
import usetShareStats from '../../hooks/usetShareStats';
import useTotalValueLocked from '../../hooks/useTotalValueLocked';
import useFetchGenesisStartTime from '../../hooks/useFetchGenesisStartTime';
import { Dante as tombTesting, Grail as tShareTesting } from '../../tomb-finance/deployments/deployments.testing.json';
import { Dante as tombProd, Grail as tShareProd } from '../../tomb-finance/deployments/deployments.testing.json';

import MetamaskFox from '../../assets/img/metamask-fox.svg';

import { Box, Button, Card, CardContent, Grid, Paper } from '@material-ui/core';


import ZapModal from '../Bank/components/ZapModal';

import { makeStyles } from '@material-ui/core/styles';
import useTombFinance from '../../hooks/useTombFinance';
import { Alert } from '@material-ui/lab';

const BackgroundImage = createGlobalStyle`
  body {
    background: url(${HomeImage}) no-repeat !important;
    background-size: cover !important;
  }
`;

const useStyles = makeStyles((theme) => ({
  button: {
    [theme.breakpoints.down('415')]: {
      marginTop: '10px',
    },
  },
}));

const Home = () => {
  const classes = useStyles();
  const TVL = useTotalValueLocked();
  const tombFtmLpStats = useLpStats('DANTE-TOMB-LP');
  const tShareFtmLpStats = useLpStats('GRAIL-FTM-LP');
  const tombStats = useTombStats();
  const tShareStats = usetShareStats();
  const tBondStats = useBondStats();
  const tombFinance = useTombFinance();

  let tomb;
  let tShare;
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    tomb = tombTesting;
    tShare = tShareTesting;
  } else {
    tomb = tombProd;
    tShare = tShareProd;
  }

  const buyTombAddress = 'https://spookyswap.finance/swap?outputCurrency=' + tomb.address;
  const buyTShareAddress = 'https://spookyswap.finance/swap?outputCurrency=' + tShare.address;
  const danteGraph = 'https://dexscreener.com/';
  const grailGraph = 'https://dexscreener.com/';

  const tombLPStats = useMemo(() => (tombFtmLpStats ? tombFtmLpStats : null), [tombFtmLpStats]);
  const tshareLPStats = useMemo(() => (tShareFtmLpStats ? tShareFtmLpStats : null), [tShareFtmLpStats]);
  const tombPriceInDollars = useMemo(
    () => (tombStats ? Number(tombStats.priceInDollars).toFixed(2) : null),
    [tombStats],
  );
  const tombPriceInFTM = useMemo(() => (tombStats ? Number(tombStats.tokenInFtm).toFixed(2) : null), [tombStats]);
  const tombCirculatingSupply = useMemo(() => (tombStats ? String(tombStats.circulatingSupply) : null), [tombStats]);
  const tombTotalSupply = useMemo(() => (tombStats ? String(tombStats.totalSupply) : null), [tombStats]);

  const tSharePriceInDollars = useMemo(
    () => (tShareStats ? Number(tShareStats.priceInDollars).toFixed(2) : null),
    [tShareStats],
  );
  const tSharePriceInFTM = useMemo(
    () => (tShareStats ? Number(tShareStats.tokenInFtm).toFixed(2) : null),
    [tShareStats],
  );
  const tShareCirculatingSupply = useMemo(
    () => (tShareStats ? String(tShareStats.circulatingSupply) : null),
    [tShareStats],
  );
  const tShareTotalSupply = useMemo(() => (tShareStats ? String(tShareStats.totalSupply) : null), [tShareStats]);

  const tBondPriceInDollars = useMemo(
    () => (tBondStats ? Number(tBondStats.priceInDollars).toFixed(2) : null),
    [tBondStats],
  );
  const tBondPriceInFTM = useMemo(() => (tBondStats ? Number(tBondStats.tokenInFtm).toFixed(2) : null), [tBondStats]);
  const tBondCirculatingSupply = useMemo(
    () => (tBondStats ? String(tBondStats.circulatingSupply) : null),
    [tBondStats],
  );
  const tBondTotalSupply = useMemo(() => (tBondStats ? String(tBondStats.totalSupply) : null), [tBondStats]);

  const tombLpZap = useZap({ depositTokenName: 'DANTE-TOMB-LP' });
  const tshareLpZap = useZap({ depositTokenName: 'GRAIL-FTM-LP' });

  const [onPresentTombZap, onDissmissTombZap] = useModal(
    <ZapModal
      decimals={18}
      onConfirm={(zappingToken, tokenName, amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        tombLpZap.onZap(zappingToken, tokenName, amount);
        onDissmissTombZap();
      }}
      tokenName={'DANTE-TOMB-LP'}
    />,
  );

  const [onPresentTshareZap, onDissmissTshareZap] = useModal(
    <ZapModal
      decimals={18}
      onConfirm={(zappingToken, tokenName, amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        tshareLpZap.onZap(zappingToken, tokenName, amount);
        onDissmissTshareZap();
      }}
      tokenName={'GRAIL-FTM-LP'}
    />,
  );

  const timestamp = useFetchGenesisStartTime();
  //const timestamp = 1646505295;
  var countDownDate = new Date(timestamp * 1000);
  let genesisStarted = Date.now() > (timestamp * 1000);

  return (
    <Page>
      <BackgroundImage />
      <Grid container spacing={3}>
        {/* Logo */}
        <Grid container item xs={12} sm={4} justify="center">
          {/* <Paper>xs=6 sm=3</Paper> */}
          <Image color="none" style={{ width: '300px', paddingTop: '0px' }} src={CashImage} />
        </Grid>
        {/* Explanation text */}
        <Grid item xs={12} sm={8}>
          <Paper className='danteCard'>
            <Box p={4}>
              <h2>Welcome to Dante Finance</h2>
              <p>Join Dante's epic journey from Inferno to Eden. Dante is a new token pegged to Tomb with future NFT utility.</p>
              <p>Stake your Grail in Eden to earn inflationary Dante rewards or provide liquidity on pairs and start earning today!</p>
              
              {!genesisStarted ? ( <><br/><LaunchCountdown deadline={countDownDate}></LaunchCountdown></> ) : <></>}
            </Box>
          </Paper>
        </Grid>

        <Grid container spacing={3}>
          <Grid item  xs={12} sm={12} justify="center"  style={{ margin: '12px', display: 'flex' }}>
            <Alert variant="filled" severity="warning">
                <b>Please visit our <a target="_blank" href="https://dantefinance.gitbook.io/dantefinance.com/">documentation</a> before purchasing Dante or Grail!</b>
            </Alert>
          </Grid>
        </Grid>

        {/* TVL */}
        <Grid item xs={12} sm={4}>
          <Card className='danteCard'>
            <CardContent align="center">
              <h4>Total Value Locked</h4>
              <CountUp style={{ fontSize: '20px' }} end={TVL} separator="," prefix="$" />
            </CardContent>
          </Card>
        </Grid>

        {/* Wallet */}
        <Grid item xs={12} sm={8}>
          <Card className='danteCard' style={{ height: '100%' }}>
            <CardContent align="center" style={{ marginTop: '2.5%' }}>
              <Button 
                color="primary" 
                href="/eden" 
                variant="contained" 
                style={{ marginRight: '10px' }}>Stake Now</Button>
              <Button 
                href="/purgatory" 
                variant="contained" 
                className={classes.button} 
                style={{ marginRight: '10px' }}>Farm Now</Button>
              <Button
                color="primary"
                target="_blank"
                href={buyTombAddress}
                variant="contained"
                style={{ marginRight: '10px' }}
              >Buy TOMB</Button>
              <Button 
                variant="contained" 
                target="_blank" 
                href={buyTShareAddress} 
                className={classes.button} 
                style={{ marginRight: '10px' }}>Buy GRAIL</Button>
              <Button 
                color="primary"
                variant="contained" 
                target="_blank" 
                href={danteGraph} 
                className={classes.button} 
                style={{ marginRight: '10px' }}>Dante Chart</Button>
              <Button 
                variant="contained" 
                target="_blank" 
                href={grailGraph} 
                className={classes.button}>Grail Chart</Button>
            </CardContent>
          </Card>
        </Grid>

        {/* TOMB */}
        <Grid item xs={12} sm={4}>
          <Card className='danteCard'>
            <CardContent align="center" style={{ position: 'relative' }}>
              <h4>1 Dante</h4>
              <Button
                onClick={() => {
                  tombFinance.watchAssetInMetamask('DANTE');
                }}
                color="primary"
                variant="outlined"
                style={{ position: 'absolute', top: '10px', right: '10px' }}
              >
                +&nbsp;
                <img alt="metamask fox" style={{ width: '20px' }} src={MetamaskFox} />
              </Button>
              <Box mt={2}>
                <TokenSymbol symbol="DANTE" />
              </Box>
              <Box mt={0}>
                <span style={{ fontSize: '40px' }}>=</span>
              </Box>
              <Box mt={0}>
                <span style={{ fontSize: '24px' }}>{tombPriceInFTM ? tombPriceInFTM : '-.--'} Tomb</span>
              </Box>
              <Box>
                <span style={{ fontSize: '16px', alignContent: 'flex-start' }}>
                  ${tombPriceInDollars ? tombPriceInDollars : '-.--'}
                </span>
              </Box>
              <span style={{ fontSize: '12px' }}>
                Market Cap: ${(tombCirculatingSupply * tombPriceInDollars).toFixed(2)} <br />
                Circulating Supply: {tombCirculatingSupply} <br />
                Total Supply: {tombTotalSupply}
              </span>
            </CardContent>
          </Card>
        </Grid>

        {/* TSHARE */}
        <Grid item xs={12} sm={4}>
          <Card className='danteCard'>
            <CardContent align="center" style={{ position: 'relative' }}>
              <h4>1 Grail</h4>
              <Button
                onClick={() => {
                  tombFinance.watchAssetInMetamask('GRAIL');
                }}
                color="primary"
                variant="outlined"
                style={{ position: 'absolute', top: '10px', right: '10px' }}
              >
                +&nbsp;
                <img alt="metamask fox" style={{ width: '20px' }} src={MetamaskFox} />
              </Button>
              <Box mt={2}>
                <TokenSymbol symbol="GRAIL" />
              </Box>
              <Box mt={0}>
                <span style={{ fontSize: '40px' }}>=</span>
              </Box>
              <Box>
                <span style={{ fontSize: '24px' }}>{tSharePriceInFTM ? tSharePriceInFTM : '-.--'} Ftm</span>
              </Box>
              <Box>
                <span style={{ fontSize: '16px' }}>${tSharePriceInDollars ? tSharePriceInDollars : '-.--'}</span>
              </Box>
              <span style={{ fontSize: '12px' }}>
                Market Cap: ${(tShareCirculatingSupply * tSharePriceInDollars).toFixed(2)} <br />
                Circulating Supply: {tShareCirculatingSupply} <br />
                Total Supply: {tShareTotalSupply}
              </span>
            </CardContent>
          </Card>
        </Grid>

        {/* TBOND */}
        <Grid item xs={12} sm={4}>
          <Card className='danteCard'>
            <CardContent align="center" style={{ position: 'relative' }}>
              <h4>1 Dbond</h4>
              <Button
                onClick={() => {
                  tombFinance.watchAssetInMetamask('DBOND');
                }}
                color="primary"
                variant="outlined"
                style={{ position: 'absolute', top: '10px', right: '10px' }}
              >
                +&nbsp;
                <img alt="metamask fox" style={{ width: '20px' }} src={MetamaskFox} />
              </Button>
              <Box mt={2}>
                <TokenSymbol symbol="DBOND" />
              </Box>
              <Box mt={0}>
                <span style={{ fontSize: '40px' }}>=</span>
              </Box>
              <Box>
                <span style={{ fontSize: '24px' }}>{tBondPriceInFTM ? tBondPriceInFTM : '-.--'} Tomb</span>
              </Box>
              <Box>
                <span style={{ fontSize: '16px' }}>${tBondPriceInDollars ? tBondPriceInDollars : '-.--'}</span>
              </Box>
              <span style={{ fontSize: '12px' }}>
                Market Cap: ${(tBondCirculatingSupply * tBondPriceInDollars).toFixed(2)} <br />
                Circulating Supply: {tBondCirculatingSupply} <br />
                Total Supply: {tBondTotalSupply}
              </span>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Card className='danteCard'>
            <CardContent align="center">
              <h4>Dante-Tomb Spooky LP</h4>
              <Box mt={2}>
                <TokenSymbol symbol="DANTE-TOMB-LP" />
              </Box>
              <Box mt={2}>
                <span style={{ fontSize: '24px' }}>
                  {tombLPStats?.tokenAmount ? tombLPStats?.tokenAmount : '-.--'} Dante / {tombLPStats?.ftmAmount ? tombLPStats?.ftmAmount : '-.--'} Tomb
                </span>
              </Box>
              <Box>
                <span style={{ fontSize: '16px' }}>
                  ${tombLPStats?.priceOfOne ? tombLPStats.priceOfOne : '-.--'}<br />
                </span>
                <span style={{ fontSize: '12px' }}>
                  
                  Liquidity: ${tombLPStats?.totalLiquidity ? tombLPStats.totalLiquidity : '-.--'}<br />
                  Total supply: {tombLPStats?.totalSupply ? tombLPStats.totalSupply : '-.--'}
                </span>
              </Box>

            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Card className='danteCard'>
            <CardContent align="center">
              <h4>Grail-Ftm Spooky LP</h4>
              <Box mt={2}>
                <TokenSymbol symbol="GRAIL-FTM-LP" />
              </Box>
              <Box mt={2}>
                <span style={{ fontSize: '24px' }}>
                  {tshareLPStats?.tokenAmount ? tshareLPStats?.tokenAmount : '-.--'} Grail /{' '}
                  {tshareLPStats?.ftmAmount ? tshareLPStats?.ftmAmount : '-.--'} Ftm
                </span>
              </Box>
              <Box>
                <span style={{ fontSize: '16px' }}>
                  ${tshareLPStats?.priceOfOne ? tshareLPStats.priceOfOne : '-.--'}<br />
                </span>
                <span style={{ fontSize: '12px' }}>
                  Liquidity: ${tshareLPStats?.totalLiquidity ? tshareLPStats.totalLiquidity : '-.--'}<br />
                  Total supply: {tshareLPStats?.totalSupply ? tshareLPStats.totalSupply : '-.--'}
                </span>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Page>
  );
};

export default Home;
