import React from 'react';
import { useWallet } from 'use-wallet';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import Bank from '../Bank';
import { Box, Container, Typography, Grid, rgbToHex } from '@material-ui/core';
import UnlockWallet from '../../components/UnlockWallet';
import Page from '../../components/Page';
import CemeteryCard from './CemeteryCard';
import CemeteryImage from '../../assets/img/purgatory.png';
import { createGlobalStyle } from 'styled-components';
import useBanks from '../../hooks/useBanks';
import useFetchGenesisStartTime from '../../hooks/useFetchGenesisStartTime';
import { Alert } from '@material-ui/lab';

const BackgroundImage = createGlobalStyle`
  body {
    background: url(${CemeteryImage}) no-repeat !important;
    background-size: cover !important;
  }
`;

const Cemetery = () => {
  const [banks] = useBanks();
  const { path } = useRouteMatch();
  const { account } = useWallet();
  const activeBanks = banks.filter((bank) => !bank.finished);
  const timestamp = useFetchGenesisStartTime();
  var date = new Date(timestamp * 1000).toUTCString();

  return (
    <Switch>
      <Page>
        <Route exact path={path}>
          <BackgroundImage />
          {!!account ? (
            <Container maxWidth="lg">
              
              <h2 style={{display:'table', padding:'10px', backgroundColor: 'rgba(104, 76, 172, 0.9)', color:'#FFF', margin: '0px auto 0px auto' }}>Purgatory</h2>
              
              <Box mt={5}>
                <div hidden={activeBanks.filter((bank) => bank.sectionInUI === 2).length === 0}>
                  <h4 style={{display:'table', padding:'10px', backgroundColor: 'rgba(104, 76, 172, 0.9)', color:'#FFF', margin: '0px auto 0px auto' }}>
                    Earn Grail by staking liquidity
                  </h4>
                  
                  <Grid container spacing={3} style={{marginTop: '10px', marginBottom: '10px'}}>
                    {activeBanks
                      .filter((bank) => bank.sectionInUI === 2)
                      .map((bank) => (
                        <React.Fragment key={bank.name}>
                          <CemeteryCard bank={bank} />
                        </React.Fragment>
                      ))}
                  </Grid>
                </div>

                <div style={{marginTop: '40px'}} hidden={activeBanks.filter((bank) => bank.sectionInUI === 0).length === 0}>
                  <h4 style={{display:'table', padding:'10px', backgroundColor: 'rgba(104, 76, 172, 0.9)', color:'#FFF', margin: '0px auto 0px auto' }}>Genesis Pools</h4>
                  
                  <Grid container style={{marginTop: '10px'}}>
                    <Grid item md='2'></Grid>
                    <Grid item md='8'>
                      <Alert variant="filled" severity="warning">
                        Pools starting at {date} and will run for 2 days with a 0.8% deposit fee. Please refer to our documentation to understand our protocol's fee model.
                      </Alert>
                    </Grid>
                    <Grid item md='2'></Grid>
                  </Grid>
                  
                  <Grid container spacing={3} style={{marginTop: '15px'}}>
                    {activeBanks
                      .filter((bank) => bank.sectionInUI === 0)
                      .map((bank) => (
                        <React.Fragment key={bank.name}>
                          <CemeteryCard bank={bank} />
                        </React.Fragment>
                      ))}
                  </Grid>
                </div>
              </Box>
            </Container>
          ) : (
            <UnlockWallet />
          )}
        </Route>
        <Route path={`${path}/:bankId`}>
          <BackgroundImage />
          <Bank />
        </Route>
      </Page>
    </Switch>
  );
};

export default Cemetery;
