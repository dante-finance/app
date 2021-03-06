import React, { useEffect, useState } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';

import Page from '../../components/Page';
import { PageBackgroundDefault } from '../../components/PageBackground/PageBackgroundDefault';
import useTombFinance from '../../hooks/useTombFinance';

const StyledTableCell = withStyles((theme) => ({
  head: {
    fontSize: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    color: '#2c2560',
    fontWeight: 'bolder',
  },
  body: {
    fontSize: 14,
    color: '#2c2560',
  },
}))(TableCell);
const useStyles = makeStyles((theme) => ({
  gridItem: {
    height: '100%',
    [theme.breakpoints.up('md')]: {
      height: '90px',
    },
  },
}));

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: 'rgb(0,0,0)',
    },
  },
}))(TableRow);

const Regulations = () => {
  const classes = useStyles();
  const tombFinance = useTombFinance();
  const [rows, setRows] = useState(null);

  function createData(epoch, dao, dev, masonry) {
    var sum = (Number(dao) + Number(dev) + Number(masonry)).toFixed(2);
    return { epoch, dao, dev, masonry, sum };
  }

  useEffect(() => {
    if (tombFinance) {
      const thisData = tombFinance.listenForRegulationsEvents();
      thisData.then((elements) => {
        setRows(
          elements
            .reverse()
            .map((element) => createData(element.epoch, element.daoFund, element.devFund, element.masonryFund)),
        );
      });
    }
  }, [tombFinance]);

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
        Regulations
      </h2>

      <TableContainer style={{ marginTop: '40px' }}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">Epoch</StyledTableCell>
              <StyledTableCell align="center">Masonry funding</StyledTableCell>
              <StyledTableCell align="center">DAO funding</StyledTableCell>
              <StyledTableCell align="center">DEV funding</StyledTableCell>
              <StyledTableCell align="center">Total</StyledTableCell>
              <StyledTableCell align="center">Bonds Bought</StyledTableCell>
              <StyledTableCell align="center">Bonds Redeemed</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows?.map((row, index) => (
              <StyledTableRow
                style={index % 2 ? { background: 'rgba(255,255,255,0.9)' } : { background: 'rgba(255,255,255,0.8)' }}
                key={row.epoch}
              >
                <StyledTableCell style={{ color: '#2c2560' }} align="center" component="th" scope="row">
                  {row.epoch}
                </StyledTableCell>
                <StyledTableCell align="center">{row.masonry}</StyledTableCell>
                <StyledTableCell align="center">{row.dao}</StyledTableCell>
                <StyledTableCell align="center">{row.dev}</StyledTableCell>
                <StyledTableCell align="center">{row.sum}</StyledTableCell>
                <StyledTableCell align="center">0</StyledTableCell>
                <StyledTableCell align="center">0</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Page>
  );
};

export default Regulations;
