import React, { useState, useMemo, useEffect } from 'react';

import { Button, Select, MenuItem, withStyles, CircularProgress } from '@material-ui/core';
import Modal, { ModalProps } from '../../../components/Modal';
import ModalActions from '../../../components/ModalActions';
import TokenInput from '../../../components/TokenInput';
import SlippageInput from '../../../components/SlippageInput';
import styled from 'styled-components';

import { getDisplayBalance } from '../../../utils/formatBalance';
import useLpStats from '../../../hooks/useLpStats';
import useTokenBalance from '../../../hooks/useTokenBalance';
import useTombFinance from '../../../hooks/useTombFinance';
import useApproveZapper, { ApprovalState } from '../../../hooks/useApproveZapper';
import { Alert } from '@material-ui/lab';

interface ZapProps extends ModalProps {
  onConfirm: (zapAsset: string, lpName: string, amount: string, minAmount: string) => void;
  //zapToken?: string;
  tokenName?: string;
  decimals?: number;
}

const ZapModal: React.FC<ZapProps> = ({
  onConfirm,
  onDismiss,
  //zapToken = '',
  tokenName = '',
  decimals = 18,
}) => {
  const tombFinance = useTombFinance();

  const wftmBalance = useTokenBalance(tombFinance.FTM);
  const displayWFtmBalance = useMemo(() => getDisplayBalance(wftmBalance), [wftmBalance]);

  const tombBalance = useTokenBalance(tombFinance.TOMB);
  const displayTombBalance = useMemo(() => getDisplayBalance(tombBalance), [tombBalance]);

  const danteBalance = useTokenBalance(tombFinance.DANTE);
  const displayDanteBalance = useMemo(() => getDisplayBalance(danteBalance), [danteBalance]);

  const grailBalance = useTokenBalance(tombFinance.TSHARE);
  const displayGrailBalance = useMemo(() => getDisplayBalance(grailBalance), [grailBalance]);

  const [val, setVal] = useState('');

  const [slippage, setSlippage] = useState('1.0');

  // if zapping in DANTE-TOMB use default zap token TOMB, else WFTM
  const [zappingToken, setZappingToken] = useState(tokenName.startsWith('DANTE') ? 'TOMB' : 'WFTM');

  const [zappingTokenBalance, setZappingTokenBalance] = useState(displayTombBalance);

  const [estimate, setEstimate] = useState({ token0: '0', token1: '0' });

  const [approveZapperStatus, approveZapper] = useApproveZapper(zappingToken);

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

  const handleChangeAsset = (event: any) => {
    const value = event.target.value;
    setZappingToken(value);

    if (value === 'TOMB') {
      setZappingTokenBalance(displayTombBalance);
      setVal('0');
      setEstimate({ token0: '0', token1: '0' });
      return;
    }
    if (value === 'WFTM') {
      setZappingTokenBalance(displayWFtmBalance);
      setVal('0');
      setEstimate({ token0: '0', token1: '0' });
      return;
    }
    if (value === 'DANTE') {
      setZappingTokenBalance(displayDanteBalance);
      setVal('0');
      setEstimate({ token0: '0', token1: '0' });
      return;
    }
    if (value === 'GRAIL') {
      setZappingTokenBalance(displayGrailBalance);
      setVal('0');
      setEstimate({ token0: '0', token1: '0' });
      return;
    }
  };

  const handleChange = async (e: any) => {
    if (e.currentTarget.value === '' || e.currentTarget.value === 0) {
      setVal(e.currentTarget.value);
      setEstimate({ token0: '0', token1: '0' });
    }

    if (!isNumeric(e.currentTarget.value)) return;

    setVal(e.currentTarget.value);

    const contract =
      tombFinance.contracts[zappingToken === 'TOMB' || zappingToken === 'DANTE' ? 'TombZapper' : 'WFtmZapper'];

    const estimateZap = await tombFinance.estimateZapIn(
      zappingToken,
      tokenName,
      String(e.currentTarget.value),
      contract,
    );
    setEstimate({ token0: estimateZap[0].toString(), token1: estimateZap[1].toString() });
  };

  const handleSlippageChange = async (e: any) => {
    if (e.currentTarget.value === '' || e.currentTarget.value === 0) {
      setSlippage(e.currentTarget.value);
      setEstimate({ token0: '0', token1: '0' });
    }

    if (!isNumeric(e.currentTarget.value)) return;

    setSlippage(e.currentTarget.value);

    if (val === '') return;

    const contract =
      tombFinance.contracts[zappingToken === 'TOMB' || zappingToken === 'DANTE' ? 'TombZapper' : 'WFtmZapper'];

    const estimateZap = await tombFinance.estimateZapIn(zappingToken, tokenName, val, contract);

    setEstimate({ token0: estimateZap[0].toString(), token1: estimateZap[1].toString() });
  };

  const handleSelectMax = async () => {
    setVal(zappingTokenBalance);

    const contract =
      tombFinance.contracts[zappingToken === 'TOMB' || zappingToken === 'DANTE' ? 'TombZapper' : 'WFtmZapper'];

    const estimateZap = await tombFinance.estimateZapIn(zappingToken, tokenName, zappingTokenBalance, contract);
    setEstimate({ token0: estimateZap[0].toString(), token1: estimateZap[1].toString() });
  };

  const calcTokenMinAmount = () => {
    return (
      Number(estimate.token0) / Number(ftmAmountPerLP) -
      (Number(estimate.token0) / Number(ftmAmountPerLP) / 100) * Number(slippage)
    );
  };

  useEffect(() => {
    if (zappingToken === 'TOMB') {
      setZappingTokenBalance(displayTombBalance);
    }
    if (zappingToken === 'WFTM') {
      setZappingTokenBalance(displayWFtmBalance);
    }
    if (zappingToken === 'DANTE') {
      setZappingTokenBalance(displayDanteBalance);
    }
    if (zappingToken === 'GRAIL') {
      setZappingTokenBalance(displayGrailBalance);
    }
  }, [
    zappingToken,
    tombBalance,
    wftmBalance,
    danteBalance,
    grailBalance,
    displayTombBalance,
    displayWFtmBalance,
    displayDanteBalance,
    displayGrailBalance,
  ]);

  return (
    <Modal>
      <h2 style={{ textAlign: 'center' }}>Zap in {tokenName.startsWith('DANTE') ? 'Dante/Tomb' : 'Grail/Ftm'}</h2>

      <StyledActionSpacer />

      <span>Select token</span>

      {tokenName.startsWith('DANTE') ? (
        <>
          <Select
            onChange={handleChangeAsset}
            style={{ color: '#2c2560' }}
            labelId="label"
            id="select"
            value={zappingToken}
          >
            <StyledMenuItem value={'TOMB'}>TOMB</StyledMenuItem>
            <StyledMenuItem value={'DANTE'}>DANTE</StyledMenuItem>
          </Select>
        </>
      ) : (
        <>
          <Select
            onChange={handleChangeAsset}
            style={{ color: '#2c2560' }}
            labelId="label"
            id="select"
            value={zappingToken}
          >
            <StyledMenuItem value={'WFTM'}>WFTM</StyledMenuItem>
            <StyledMenuItem value={'GRAIL'}>GRAIL</StyledMenuItem>
          </Select>
        </>
      )}

      <TokenInput
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        value={val}
        max={zappingTokenBalance}
        symbol={zappingToken}
      />

      <span>Slippage %</span>

      <SlippageInput onChange={handleSlippageChange} value={slippage} />

      <span>Zap estimations:</span>
      <span>
        {tokenName}: ~{calcTokenMinAmount().toFixed(4)}
      </span>
      <span>
        ({Number(estimate.token0)} / {Number(estimate.token1)})
      </span>

      <ModalActions>
        {approveZapperStatus &&
          (() => {
            if (approveZapperStatus === ApprovalState.PENDING) {
              return <CircularProgress />;
            } else if (approveZapperStatus === ApprovalState.APPROVED) {
              return (
                <Button
                  color="default"
                  variant="contained"
                  onClick={() => {
                    onConfirm(zappingToken, tokenName, val, calcTokenMinAmount().toString());
                  }}
                >
                  Zap
                </Button>
              );
            } else {
              return (
                <Button
                  color="default"
                  variant="contained"
                  onClick={() => {
                    approveZapper();
                  }}
                >
                  Approve
                </Button>
              );
            }
          })()}
      </ModalActions>

      <StyledActionSpacer />
      <Alert variant="filled" severity="warning">
        Experimental feature. Use at your own risk!
      </Alert>
    </Modal>
  );
};

const StyledActionSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`;

const StyledMenuItem = withStyles({
  root: {
    backgroundColor: 'white',
    color: '#2c2560',
    '&:hover': {
      backgroundColor: 'grey !important',
      color: '#2c2560',
    },
    selected: {
      backgroundColor: 'black',
    },
  },
})(MenuItem);

export default ZapModal;
