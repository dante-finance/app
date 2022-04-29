import { Box, Button, FormControl, Grid, makeStyles, MenuItem, Select, Theme } from '@material-ui/core';
import { BigNumber, ethers } from 'ethers';
import React, { useCallback } from 'react';
import useHandleTransactionReceipt from '../../../hooks/useHandleTransactionReceipt';
import useTombFinance from '../../../hooks/useTombFinance';

const useStyles = makeStyles((theme: Theme) => ({
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

interface MintingSalePublicPhaseProps {
  totalPrice: BigNumber;
  amount: number;
  onAmountChange: (amount: number) => void;
}

export function MintingSalePublicPhase(props: MintingSalePublicPhaseProps): JSX.Element {
  const { totalPrice, amount, onAmountChange } = props;

  const tombFinance = useTombFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const classes = useStyles();

  const handleChange = useCallback<React.ComponentProps<typeof Select>['onChange']>(
    (event) => {
      onAmountChange(Number(event.target.value));
    },
    [onAmountChange],
  );

  const handleBuy = useCallback(async () => {
    const contract = tombFinance.contracts['DanteNFT'];
    handleTransactionReceipt(contract.publicMint(amount.toString(), { value: totalPrice }), `Buy NFTs`);
  }, [amount, handleTransactionReceipt, tombFinance.contracts, totalPrice]);

  return (
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
          <Button color="default" variant="contained" onClick={handleBuy}>
            Buy
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
}
