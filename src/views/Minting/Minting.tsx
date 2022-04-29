import React, { useState, useEffect, useMemo } from 'react';
import Page from '../../components/Page';
import { PageBackgroundDefault } from '../../components/PageBackground/PageBackgroundDefault';
import { BigNumber } from 'ethers';
import useTombFinance from '../../hooks/useTombFinance';
import { Box, Grid, Paper } from '@material-ui/core';
import NFT from '../../assets/img/nft.png';
import { MintingSaleLaunched } from './components/MintingSaleLaunched';
import { MintingSalePublicPhase } from './components/MintingSalePublicPhase';

function MintingPageLayout(props: { children: React.ReactNode }): JSX.Element {
  return (
    <Page>
      <PageBackgroundDefault />

      <h2
        style={{
          display: 'table',
          padding: '10px',
          backgroundColor: 'rgba(104, 76, 172, 0.9)',
          color: 'rgb(244, 143, 78)',
          margin: '0px auto 0px auto',
        }}
      >
        Dante Encounters the Lynx
      </h2>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} style={{ padding: '60px' }}>
          <img style={{ width: '100%' }} src={NFT} alt="grim" />
        </Grid>
        <Grid item xs={12} sm={6} style={{ padding: '60px' }}>
          <Paper className="danteCard">
            <Box p={3}>{props.children}</Box>
          </Paper>
        </Grid>
      </Grid>
    </Page>
  );
}

export default function Minting(): JSX.Element {
  const [totalPrice, setTotalPrice] = useState(BigNumber.from(0));
  const [claimTimestampEnd, setClaimTimestampEnd] = useState(Number(0));
  const [revealTimestamp, setRevealTimestamp] = useState(Number(0));
  const [saleStart, setSaleStart] = useState(Number(0));
  const [amount, setAmount] = useState(Number(0));

  const tombFinance = useTombFinance();

  const contract = useMemo(() => tombFinance.contracts['DanteNFT'], [tombFinance.contracts]);

  useEffect(() => {
    (async () => {
      if (tombFinance.myAccount) {
        setSaleStart((await contract.saleStart()) * 1000);
      }
    })();
  }, [contract, tombFinance.myAccount]);

  useEffect(() => {
    if (tombFinance.myAccount && saleStart > 0) {
      (async () => {
        let claim = (await contract.claimTimestampEnd()) * 1000;
        setClaimTimestampEnd(claim);

        if (Date.now() < claim) {
          let num = Number(await contract.claimWhitelist(tombFinance.myAccount));
          setAmount(num);
        }
      })();
    }
  }, [claimTimestampEnd, contract, saleStart, tombFinance.myAccount]);

  useEffect(() => {
    if (tombFinance.myAccount && claimTimestampEnd !== 0 && Date.now() > claimTimestampEnd) {
      (async () => {
        let reveal = (await contract.revealTimestamp()) * 1000;
        setRevealTimestamp(reveal);
      })();
    }
  }, [claimTimestampEnd, contract, tombFinance.myAccount]);

  useEffect(() => {
    if (amount > 0) {
      (async () => {
        let price: BigNumber = await contract.price(amount.toString());
        setTotalPrice(price);
      })();
    }
  }, [amount, contract]);

  const now = Date.now();

  if (saleStart === 0) {
    return (
      <MintingPageLayout>
        <Box textAlign="center">NFT Sale not yet started.</Box>
      </MintingPageLayout>
    );
  }

  if (now < claimTimestampEnd) {
    return (
      <MintingPageLayout>
        <MintingSaleLaunched amount={amount} totalPrice={totalPrice} />
      </MintingPageLayout>
    );
  }

  if (now < revealTimestamp) {
    return (
      <MintingPageLayout>
        <MintingSalePublicPhase totalPrice={totalPrice} amount={amount} onAmountChange={setAmount} />
      </MintingPageLayout>
    );
  }

  return (
    <MintingPageLayout>
      <Box textAlign="center">NFT Sale ended.</Box>
    </MintingPageLayout>
  );
}
