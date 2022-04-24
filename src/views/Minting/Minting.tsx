import React, { useState, useCallback, useEffect } from 'react';
import Page from '../../components/Page';
import { PageBackgroundDefault } from '../../components/PageBackground/PageBackgroundDefault';
import { Contract, utils, ethers } from 'ethers';
import { TransactionResponse } from '@ethersproject/providers';
import useTombFinance from '../../hooks/useTombFinance';
import { Box, Button, Grid, Paper, FormControl, Select, InputLabel, MenuItem } from '@material-ui/core';
import useHandleTransactionReceipt from '../../hooks/useHandleTransactionReceipt';
import { makeStyles } from '@material-ui/core/styles';
import NFT from '../../assets/img/nft.png';

const useStyles = makeStyles((theme: any) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function Minting(): JSX.Element {
  const tombFinance = useTombFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const [numWhitelisted, setNumWhitelisted] = useState(Number(0));
  const [claimTimestampEnd, setClaimTimestampEnd] = useState(Number(0));
  const [revealTimestamp, setRevealTimestamp] = useState(Number(0));
  const [saleStart, setSaleStart] = useState(Number(0));

  const fetchNumWhitelisted = useCallback(
    async (contract: Contract) => {
      if (tombFinance.myAccount) {
        let num = Number(await contract.claimWhitelist(tombFinance.myAccount));
        setNumWhitelisted(num);
      }
    },
    [tombFinance.myAccount],
  );

  const fetchTimestampsAsync = useCallback(async (contract: Contract) => {
    let claim = (await contract.claimTimestampEnd()) * 1000;
    setClaimTimestampEnd(claim);

    let reveal = (await contract.revealTimestamp()) * 1000;
    setRevealTimestamp(reveal);
  }, []);

  const fetchSaleOpenAsync = useCallback(async (contract: Contract) => {
    setSaleStart((await contract.saleStart()) * 1000);
  }, []);

  useEffect(() => {
    if (tombFinance) {
      const contract = tombFinance.contracts['DanteNFT'];

      fetchTimestampsAsync(contract);
      fetchNumWhitelisted(contract);

      fetchSaleOpenAsync(contract);
    }
  }, [fetchNumWhitelisted, fetchSaleOpenAsync, fetchTimestampsAsync, tombFinance]);

  const classes = useStyles();
  const [amount, setAmount] = React.useState(Number(0));

  const handleChange = (event: any) => {
    setAmount(Number(event.target.value));
  };

  const handleClaim = useCallback(async () => {
    let contract = tombFinance.contracts['DanteNFT'];
    let price = await contract.price(numWhitelisted.toString());
    handleTransactionReceipt(contract.whitelistMint({ value: price }), `Claim whitelisted NFTs`);
  }, [handleTransactionReceipt, numWhitelisted, tombFinance.contracts]);

  const handleBuy = useCallback(
    async (amount: number) => {
      let contract = tombFinance.contracts['DanteNFT'];
      let price = await contract.price(amount.toString());
      handleTransactionReceipt(contract.publicMint(amount.toString(), { value: price }), `Buy NFTs`);
    },
    [handleTransactionReceipt, tombFinance.contracts],
  );

  const now = Date.now();

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
        Dante Nft Sale
      </h2>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <img style={{ width: '100%' }} src={NFT} alt="grim" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper className="danteCard">
            <Box p={3}>
              {saleStart > 0 ? (
                /* sale launched! */
                now < claimTimestampEnd ? (
                  /* sale in whitelist phase */
                  numWhitelisted > 0 ? (
                    <div>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Box textAlign="center">
                            <p style={{ textAlign: 'center' }}>Claim {numWhitelisted} NFTs</p>
                          </Box>
                        </Grid>
                        <Grid item xs={12}>
                          <Box textAlign="center">
                            <Button
                              style={{ textAlign: 'center' }}
                              color="default"
                              variant="contained"
                              onClick={() => {
                                handleClaim();
                              }}
                            >
                              Claim
                            </Button>
                          </Box>
                        </Grid>
                      </Grid>
                    </div>
                  ) : (
                    /* address not whitelisted */
                    <div>Address not whitelisted</div>
                  )
                ) : now < revealTimestamp ? (
                  /* sale in public phase */
                  <div>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Box textAlign="center">
                          <p>Public sale</p>
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Box textAlign="center">
                          <FormControl className={classes.formControl}>
                            <InputLabel id="amount-select-label">Num</InputLabel>
                            <Select
                              labelId="amount-select-label"
                              id="amount-select"
                              value={amount}
                              onChange={handleChange}
                            >
                              <MenuItem value={1}>1</MenuItem>
                              <MenuItem value={2}>2</MenuItem>
                              <MenuItem value={3}>3</MenuItem>
                              <MenuItem value={4}>4</MenuItem>
                              <MenuItem value={5}>5</MenuItem>
                            </Select>
                          </FormControl>
                        </Box>
                        <Grid item xs={12}>
                          <Box textAlign="center">
                            <Button
                              color="default"
                              variant="contained"
                              onClick={() => {
                                handleBuy(amount);
                              }}
                            >
                              Buy
                            </Button>
                          </Box>
                        </Grid>
                      </Grid>
                    </Grid>
                  </div>
                ) : (
                  /* sale ended */
                  <div>Sale ended</div>
                )
              ) : (
                /* sale not yet started */
                <div>Sale yet to start</div>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Page>
  );
}
