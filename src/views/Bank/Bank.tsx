import React, { useEffect } from 'react';
import styled from 'styled-components';

import { useParams } from 'react-router-dom';
import { useWallet } from 'use-wallet';
import { makeStyles } from '@material-ui/core/styles';

import { Box, Button, Card, CardContent, Typography, Grid } from '@material-ui/core';

import PageHeader from '../../components/PageHeader';
import Spacer from '../../components/Spacer';
import UnlockWallet from '../../components/UnlockWallet';
import Harvest from './components/Harvest';
import Stake from './components/Stake';
import useBank from '../../hooks/useBank';
import useStatsForPool from '../../hooks/useStatsForPool';
import useRedeem from '../../hooks/useRedeem';
import { Bank as BankEntity } from '../../tomb-finance';
import useTombFinance from '../../hooks/useTombFinance';

const useStyles = makeStyles((theme) => ({
  gridItem: {
    height: '100%',
    [theme.breakpoints.up('md')]: {
      height: '90px',
    },
  },
  danteBankCard: {
    backgroundColor: 'rgba(104, 76, 172, 0.9)',
  },
}));

const Bank: React.FC = () => {
  useEffect(() => window.scrollTo(0, 0));
  const classes = useStyles();
  const { bankId } = useParams<{ bankId: string }>();
  const bank = useBank(bankId);

  const { account } = useWallet();
  const { onRedeem } = useRedeem(bank);
  const statsOnPool = useStatsForPool(bank);

  console.log(bankId);
  console.log(bank);

  return account && bank ? (
    <>
      <Box>
        <h2
          style={{
            display: 'table',
            padding: '10px',
            backgroundColor: 'rgba(104, 76, 172, 0.9)',
            color: '#FFF',
            margin: '0px auto 40px auto',
          }}
        >
          {bank.name}
        </h2>

        <Grid container justify="center" spacing={3} style={{ marginBottom: '50px' }}>
          <Grid item xs={12} md={2} lg={2} className={classes.gridItem}>
            <Card className={`classes.gridItem`} style={{ backgroundColor: 'rgba(104, 76, 172, 0.9)' }}>
              <CardContent style={{ textAlign: 'center' }}>
                <Typography>APR</Typography>
                <Typography>{bank.closedForStaking ? '0.00' : statsOnPool?.yearlyAPR}%</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={2} lg={2} className={classes.gridItem}>
            <Card className={classes.gridItem} style={{ backgroundColor: 'rgba(104, 76, 172, 0.9)' }}>
              <CardContent style={{ textAlign: 'center' }}>
                <Typography>Daily APR</Typography>
                <Typography>{bank.closedForStaking ? '0.00' : statsOnPool?.dailyAPR}%</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={2} lg={2} className={classes.gridItem}>
            <Card className={classes.gridItem} style={{ backgroundColor: 'rgba(104, 76, 172, 0.9)' }}>
              <CardContent style={{ textAlign: 'center' }}>
                <Typography>TVL</Typography>
                <Typography>${statsOnPool?.TVL}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
      <Box mt={5}>
        <StyledBank>
          <StyledCardsWrapper>
            <StyledCardWrapper>
              <Harvest bank={bank} />
            </StyledCardWrapper>
            <Spacer />
            <StyledCardWrapper>
              <Stake bank={bank} />
            </StyledCardWrapper>
          </StyledCardsWrapper>
          <Spacer size="lg" />
          {bank.depositTokenName.includes('LP') && <LPTokenHelpText bank={bank} />}
          <Spacer size="lg" />
          <div>
            <Button onClick={onRedeem} color="primary" variant="contained">
              Claim & Withdraw
            </Button>
          </div>
          <Spacer size="lg" />
        </StyledBank>
      </Box>
    </>
  ) : !bank ? (
    <BankNotFound />
  ) : (
    <UnlockWallet />
  );
};

const LPTokenHelpText: React.FC<{ bank: BankEntity }> = ({ bank }) => {
  const tombFinance = useTombFinance();

  const spookyUrl: string = 'https://spooky.fi/#/add/';
  let link: string;
  if (bank.depositTokenName === 'DANTE-TOMB-LP') {
    link = spookyUrl + tombFinance.TOMB.address + '/' + tombFinance.DANTE.address;
  } else if (bank.depositTokenName === 'GRAIL-FTM-LP') {
    link = spookyUrl + 'FTM/' + tombFinance.TSHARE.address;
  } else if (bank.depositTokenName === 'DANTE-GRAIL-LP') {
    link = spookyUrl + tombFinance.DANTE.address + '/' + tombFinance.TSHARE.address;
  } else if (bank.depositTokenName === 'DANTE-USDC-LP') {
    link = spookyUrl + tombFinance.DANTE.address + '/0x04068da6c83afcfa0e13ba15a6696662335d5b75';
  }
  return (
    <Card style={{ backgroundColor: 'rgba(104, 76, 172, 0.9)' }}>
      <CardContent>
        <StyledLink href={link} target="_blank">
          <span>{`???? Provide liquidity for ${bank.depositTokenName} on SpookySwap ????`}</span>
        </StyledLink>
      </CardContent>
    </Card>
  );
};

const BankNotFound = () => {
  return (
    <Center>
      <PageHeader icon="????" title="Not Found" subtitle="You've hit a bank just robbed by unicorns." />
    </Center>
  );
};

const StyledBank = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StyledLink = styled.a`
  font-weight: 700;
  font-size: 16px;
  text-decoration: none;
  color: #fff;
`;

const StyledCardsWrapper = styled.div`
  display: flex;
  width: 600px;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`;

const StyledCardWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 80%;
  }
`;

const Center = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export default Bank;
