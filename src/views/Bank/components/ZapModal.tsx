import React, { useState, useMemo, useEffect } from 'react';

import { Button, Select, MenuItem, InputLabel, Typography, withStyles, TextField, CircularProgress } from '@material-ui/core';
// import Button from '../../../components/Button'
import Modal, { ModalProps } from '../../../components/Modal';
import ModalActions from '../../../components/ModalActions';
import ModalTitle from '../../../components/ModalTitle';
import TokenInput from '../../../components/TokenInput';
import SlippageInput from '../../../components/SlippageInput';
import styled from 'styled-components';

import { getDisplayBalance } from '../../../utils/formatBalance';
import Label from '../../../components/Label';
import useLpStats from '../../../hooks/useLpStats';
import useTokenBalance from '../../../hooks/useTokenBalance';
import useTombFinance from '../../../hooks/useTombFinance';
import { useWallet } from 'use-wallet';
import useApproveZapper, { ApprovalState } from '../../../hooks/useApproveZapper';
import { TOMB_TICKER, TSHARE_TICKER, FTM_TICKER } from '../../../utils/constants';
import { Alert } from '@material-ui/lab';


interface ZapProps extends ModalProps {
  onConfirm: (zapAsset: string, lpName: string, amount: string, minAmount: string) => void;
  zapToken?: string;
  tokenName?: string;
  decimals?: number;
}

const ZapModal: React.FC<ZapProps> = (
  { 
    onConfirm, 
    onDismiss, 
    zapToken = '',
    tokenName = '', 
    decimals = 18 
  }) => {

  const tombFinance = useTombFinance();

  const zapperName = zapToken === 'TOMB' ? 'TombZapper' : 'WFtmZapper';
  const contract = tombFinance.contracts[zapperName];
  
  const wftmBalance = useTokenBalance(tombFinance.FTM);
  const displayWFtmBalance = useMemo(() => getDisplayBalance(wftmBalance), [wftmBalance]);

  const tombBalance = useTokenBalance(tombFinance.TOMB);
  const displayTombBalance = useMemo(() => getDisplayBalance(tombBalance), [tombBalance]);

  const [val, setVal] = useState('');
  
  const [slippage, setSlippage] = useState('1');

  const zappingTokenBalance = zapToken === 'TOMB' ? displayTombBalance : displayWFtmBalance;

  const [estimate, setEstimate] = useState({ token0: '0', token1: '0' });
  
  const [approveZapperStatus, approveZapper] = useApproveZapper(zapToken);

  const tombFtmLpStats = useLpStats('DANTE-TOMB-LP');
  const tShareFtmLpStats = useLpStats('GRAIL-FTM-LP');
  
  const tombLPStats = useMemo(() => (tombFtmLpStats ? tombFtmLpStats : null), [tombFtmLpStats]);
  const tshareLPStats = useMemo(() => (tShareFtmLpStats ? tShareFtmLpStats : null), [tShareFtmLpStats]);
  const ftmAmountPerLP = tokenName.startsWith('DANTE') ? tombLPStats?.ftmAmount : tshareLPStats?.ftmAmount;
  
  /**
   * Checks if a value is a valid number or not
   * @param n is the value to be evaluated for a number
   * @returns
   */
  function isNumeric(n: any) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  const handleChange = async (e: any) => {
    if (e.currentTarget.value === '' || e.currentTarget.value === 0) {
      setVal(e.currentTarget.value);
      setEstimate({ token0: '0', token1: '0' });
    }

    if (!isNumeric(e.currentTarget.value)) return;

    setVal(e.currentTarget.value);
    const estimateZap = await tombFinance.estimateZapIn(zapToken, tokenName, String(e.currentTarget.value), contract);
    setEstimate({ token0: estimateZap[0].toString(), token1: estimateZap[1].toString() });
  };

  const handleSlippageChange = async (e: any) => {
    if (e.currentTarget.value === '' || e.currentTarget.value === 0) {
      setSlippage(e.currentTarget.value);
      setEstimate({ token0: '0', token1: '0' });
    }

    if (!isNumeric(e.currentTarget.value)) return;
    
    setSlippage(e.currentTarget.value);

    if(val === '') return;

    const estimateZap = await tombFinance.estimateZapIn(zapToken, tokenName, val, contract);

    setEstimate({ token0: estimateZap[0].toString(), token1: estimateZap[1].toString() });
  };

  const handleSelectMax = async () => {
    setVal(zappingTokenBalance);
    const estimateZap = await tombFinance.estimateZapIn(zapToken, tokenName, zappingTokenBalance, contract);
    setEstimate({ token0: estimateZap[0].toString(), token1: estimateZap[1].toString() });
  };

  const calcTokenMinAmount = () => {
    return (Number(estimate.token0) / Number(ftmAmountPerLP) - (Number(estimate.token0) / Number(ftmAmountPerLP) / 100) * Number(slippage));
  };

  return (
    <Modal>
      <h2 style={{textAlign: 'center'}}>Zap in {zapToken === 'TOMB' ? 'Dante/Tomb' : 'Grail/Ftm'}</h2>

      <TokenInput
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        value={val}
        max={zappingTokenBalance}
        symbol={zapToken}
      />

      <span>Slippage %</span>

      <SlippageInput
        onChange={handleSlippageChange}
        value={slippage}
      />
      
      <span>Zap estimations:</span>
      <span>{tokenName}: ~{calcTokenMinAmount().toFixed(4)}</span>
      <span>({Number(estimate.token0)} / {Number(estimate.token1)})</span>
      
      <ModalActions>
      {
        approveZapperStatus &&
        (() => {
          if (approveZapperStatus === ApprovalState.PENDING) {
            return <CircularProgress/>
          } else if (approveZapperStatus === ApprovalState.APPROVED) {
            return (
              <Button
                color="default"
                variant="contained"
                onClick={() => { onConfirm(zapToken, tokenName, val, calcTokenMinAmount().toString())}}>Zap</Button>
            )
          } else {
            return (<Button color="default" variant="contained" onClick={() => { approveZapper() }}>Approve</Button>)
          }
        })()
      }
      </ModalActions>

      <StyledActionSpacer />
      <Alert variant="filled" severity="warning">Experimental feature. Use at your own risk!</Alert>
    </Modal>
  );
};

const StyledActionSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`;

export default ZapModal;
