import React, { useCallback } from 'react';
import { Box, Button, Grid } from '@material-ui/core';
import { ethers, BigNumber } from 'ethers';
import useHandleTransactionReceipt from '../../../hooks/useHandleTransactionReceipt';
import useTombFinance from '../../../hooks/useTombFinance';

interface MintingSaleLaunchedProps {
  amount: number;
  totalPrice: BigNumber;
}

export function MintingSaleLaunched(props: MintingSaleLaunchedProps) {
  const { amount, totalPrice } = props;

  const tombFinance = useTombFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleClaim = useCallback(async () => {
    const contract = tombFinance.contracts['DanteNFT'];
    handleTransactionReceipt(contract.whitelistMint({ value: totalPrice }), `Claim whitelisted NFTs`);
  }, [handleTransactionReceipt, tombFinance.contracts, totalPrice]);

  /* address not whitelisted */
  if (amount === 0) {
    return (
      <Box textAlign="center">
        <p>Address not whitelisted</p>
      </Box>
    );
  }

  return (
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
          <Button style={{ textAlign: 'center' }} color="default" variant="contained" onClick={handleClaim}>
            Claim
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
}
