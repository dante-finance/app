import React from 'react';

import { Card, CardContent, Grid } from '@material-ui/core';

import Page from '../../components/Page';
import RegulationsImage from '../../assets/img/home.png';
import { createGlobalStyle } from 'styled-components';

import GrimImg from '../../assets/img/grim.jpg'
import YieldWolfImg from '../../assets/img/yieldwolf.jpg'
import BelugaImg from '../../assets/img/beluga.jpg'

const BackgroundImage = createGlobalStyle`
  body, html {
    background: url(${RegulationsImage}) no-repeat !important;
    background-size: cover !important;
  }
`;

const Autocompounders = () => {
  return (
    <Page>
      <BackgroundImage />

      <h2 style={{display:'table', padding:'10px', backgroundColor: 'rgba(104, 76, 172, 0.9)', color:'rgb(244, 143, 78)', margin: '0px auto 0px auto' }}>Auto-compounders</h2>

      <Grid container spacing={3} style={{marginTop: '20px'}}>
        <Grid item xs={12} sm={2}>
        </Grid>
        <Grid item xs={12} sm={8}>
          <Card className='dantePurgatoryCard' variant="outlined" style={{marginBottom: '0px'}}>
            <CardContent>
              <p style={{color: '#fff', fontSize: '18px'}}>Auto-compounders are used to re-invest profits for you. When you deposit your Dante-Tomb or Grail-Ftm LP tokens in an autocompounder, it will automatically harvest reward tokens and compound interests to boost APY. It also shares gas fees so everyone benefits!</p>
            </CardContent>
          </Card>

          <a href='https://www.grim.finance/' target='_blank' rel="noopener noreferrer">
            <Grid justify="space-between" container style={{marginTop: '20px', backgroundColor:'#000'}}>
              <Grid item>
                <img style={{width: '100px'}} src={GrimImg} alt="grim" />
              </Grid>

              <Grid item style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
              }}>
                <h5 style={{color: '#fff', fontSize: '38px', margin: 0, padding: 0, paddingRight: '40px'}}>GRIM FINANCE</h5>
              </Grid>
            </Grid>
          </a>

          <a href='https://yieldwolf.finance/' target='_blank' rel="noopener noreferrer">
            <Grid justify="space-between" container style={{marginTop: '20px', backgroundColor:'#FFF'}}>
              <Grid item>
                <img style={{width: '100px'}} src={YieldWolfImg} alt="yieldwolf" />
              </Grid>

              <Grid item style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
              }}>
                <h5 style={{color: '#000', fontSize: '38px', margin: 0, padding: 0, paddingRight: '40px'}}>YIELDWOLF FANTOM</h5>
              </Grid>
            </Grid>
          </a>

          <a href='https://app.beluga.fi/' target='_blank' rel="noopener noreferrer">
            <Grid justify="space-between" container style={{marginTop: '20px', backgroundColor:'#000'}}>
              <Grid item>
                <img style={{width: '100px'}} src={BelugaImg} alt="beluga" />
              </Grid>

              <Grid item style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
              }}>
                <h5 style={{color: '#fff', fontSize: '38px', margin: 0, padding: 0, paddingRight: '40px'}}>BELUGA FI</h5>
              </Grid>
            </Grid>
          </a>



        </Grid>
        <Grid item xs={12} sm={2}>
        </Grid>
      </Grid>

      

    

      


      



    </Page>
  );
};

export default Autocompounders;