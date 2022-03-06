import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Card, CardActions, CardContent, Typography, Grid } from '@material-ui/core';

import TokenSymbol from '../../components/TokenSymbol';

const CemeteryCard = ({ bank }) => {
  return (
    <Grid item xs={12} md={4} lg={4}>
        <Card className='dantePurgatoryCard' variant="outlined">
          <CardContent>

            <Grid justify="space-between" container>
              <Grid item>
                <h4>{bank.depositTokenNameSpan}</h4>
              </Grid>

              <Grid item style={{padding: '0px'}}>
                <TokenSymbol size={bank.depositTokenName.includes('LP') ? 64 : 50} symbol={bank.depositTokenName} />
              </Grid>
            </Grid>
            <Grid justify="space-between" container style={{marginTop: '10px'}}>
              <Grid item>
                <h5 style={{fontSize: "1em"}}>Deposit: {bank.depositTokenName.toUpperCase()}</h5> 
                <h5 style={{fontSize: "1em"}}>Earn: {bank.earnTokenName}</h5>
              </Grid>

              <Grid item>
                <Button color='primary' size="small" variant="contained" component={Link} to={`/purgatory/${bank.identifier}`}>
                  View
                </Button>
              </Grid>
            </Grid>
            {/*
            <Box style={{ position: 'relative' }}>
              <Box
                style={{
                  position: 'absolute',
                  right: '0px',
                  top: '-5px',
                  height: '48px',
                  width: '48px',
                  
                  alignItems: 'center',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <TokenSymbol size={64} symbol={bank.depositTokenName} />
              </Box>
              <h4 style={{marginBottom: "5px"}}>{bank.depositTokenName}</h4>
              <h5 style={{fontSize: "1em"}}>Deposit: {bank.depositTokenName.toUpperCase()}</h5> 
              <h5 style={{fontSize: "1em"}}>Earn: {bank.earnTokenName}</h5>
            </Box>
              */}
          </CardContent>
        </Card>
    </Grid>
  );
};

export default CemeteryCard;
