import React, { useState, useCallback, useEffect } from 'react';
import Page from '../../components/Page';
import { PageBackgroundDefault } from '../../components/PageBackground/PageBackgroundDefault';
import { Contract, ethers, BigNumber } from 'ethers';
import useTombFinance from '../../hooks/useTombFinance';
import { Box, Button, Grid, Paper, FormControl, Select, MenuItem } from '@material-ui/core';
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
  select: {
    '& ul': {
      backgroundColor: '#FFFFFF',
    },
    '& li': {
      fontSize: 12,
      color: '#000000',
    },
  },
}));

export default function Minting(): JSX.Element {
  const tombFinance = useTombFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const [totalPrice, setTotalPrice] = useState(BigNumber.from(0));
  const [claimTimestampEnd, setClaimTimestampEnd] = useState(Number(0));
  const [revealTimestamp, setRevealTimestamp] = useState(Number(0));
  const [saleStart, setSaleStart] = useState(Number(0));
  const [amount, setAmount] = React.useState(Number(0));

  useEffect(() => {
    (async () => {
      if (tombFinance.myAccount) {
        const contract = tombFinance.contracts['DanteNFT'];
        let num = Number(await contract.claimWhitelist(tombFinance.myAccount));
        setAmount(num);

        let claim = (await contract.claimTimestampEnd()) * 1000;
        setClaimTimestampEnd(claim);
        let reveal = (await contract.revealTimestamp()) * 1000;
        setRevealTimestamp(reveal);

        setSaleStart((await contract.saleStart()) * 1000);
      }
    })();

    return () => {};
  }, [tombFinance.contracts, tombFinance.myAccount]);

  useEffect(() => {
    (async () => {
      const contract = tombFinance.contracts['DanteNFT'];
      let price: BigNumber = await contract.price(amount.toString());
      setTotalPrice(price);
    })();

    return () => {};
  }, [amount, tombFinance.contracts]);

  const classes = useStyles();

  const handleChange = (event: any) => {
    setAmount(Number(event.target.value));
  };

  const handleClaim = useCallback(async () => {
    const contract: Contract = tombFinance.contracts['DanteNFT'];
    handleTransactionReceipt(contract.whitelistMint({ value: totalPrice }), `Claim whitelisted NFTs`);
  }, [handleTransactionReceipt, tombFinance.contracts, totalPrice]);

  const handleBuy = useCallback(
    async (amount: number) => {
      const contract: Contract = tombFinance.contracts['DanteNFT'];
      handleTransactionReceipt(contract.publicMint(amount.toString(), { value: totalPrice }), `Buy NFTs`);
    },
    [handleTransactionReceipt, tombFinance.contracts, totalPrice],
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
        Dante Encounters the Lynx
      </h2>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} style={{ padding: '60px' }}>
          <img style={{ width: '100%' }} src={NFT} alt="grim" />
        </Grid>
        <Grid item xs={12} sm={6} style={{ padding: '60px' }}>
          <Paper className="danteCard">
            <Box p={3}>
              {saleStart > 0 ? (
                /* sale launched! */
                now < claimTimestampEnd ? (
                  /* sale in whitelist phase */
                  amount > 0 ? (
                    <div>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Box textAlign="center">
                            <p style={{ textAlign: 'center' }}>Claim your {amount} NFT</p>
                          </Box>
                        </Grid>
                        <Grid item xs={12}>
                          <Box textAlign="center">
                            <p style={{ textAlign: 'center' }}>Price: {ethers.utils.formatEther(totalPrice)} FTM</p>
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
                    <Box textAlign="center">
                      <p>Address not whitelisted</p>
                    </Box>
                  )
                ) : now < revealTimestamp ? (
                  /* sale in public phase */
                  <div>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Box textAlign="center">
                          <p>Public NFT sale</p>
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Box textAlign="center">
                          <FormControl className={classes.formControl}>
                            <Select
                              MenuProps={{ classes: { paper: classes.select } }}
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
                      </Grid>
                      <Grid item xs={12}>
                        <Box textAlign="center">
                          <p style={{ textAlign: 'center' }}>Price: {ethers.utils.formatEther(totalPrice)} FTM</p>
                        </Box>
                      </Grid>
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
                  </div>
                ) : (
                  /* sale ended */
                  <div>
                    <Box textAlign="center">NFT Sale ended.</Box>
                  </div>
                )
              ) : (
                /* sale not yet started */
                <div>
                  <Box textAlign="center">NFT Sale not yet started.</Box>
                </div>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Page>
  );
}
