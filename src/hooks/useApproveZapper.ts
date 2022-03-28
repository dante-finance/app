import { BigNumber, ethers } from 'ethers';
import { useWallet } from 'use-wallet';
import { useCallback, useMemo, useState, useEffect } from 'react';
import { useHasPendingApproval, useTransactionAdder } from '../state/transactions/hooks';
import useAllowance from './useAllowance';
import ERC20 from '../tomb-finance/ERC20';
import { TOMB_ZAPPER_ROUTER_ADDR, WFTM_ZAPPER_ROUTER_ADDR } from '../utils/constants';
import useTombFinance from './useTombFinance';
import useInterval from './useInterval';

const APPROVE_AMOUNT = ethers.constants.MaxUint256;
const APPROVE_BASE_AMOUNT = BigNumber.from('1000000000000000000000000');

export enum ApprovalState {
  UNKNOWN,
  NOT_APPROVED,
  PENDING,
  APPROVED,
}

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
function useApproveZapper(zappingToken: string): [ApprovalState, () => Promise<void>] {
  const tombFinance = useTombFinance();
  const { account } = useWallet();

  let token: ERC20;

  if (zappingToken === 'FTM') token = tombFinance.FTM;
  else if (zappingToken === 'TOMB') token = tombFinance.TOMB;

  const router: string = token === tombFinance.TOMB ? TOMB_ZAPPER_ROUTER_ADDR : WFTM_ZAPPER_ROUTER_ADDR;

  const [pending, setPending] = useState(false);
  const [currentAllowance, setAllowance] = useState<BigNumber>(null);

  useInterval(() => {
      fetchAllowance().catch((err) => console.log(`Failed to fetch allowance: ${err.stack}`));
    },
    // Delay in milliseconds or null to stop it
    currentAllowance != null && currentAllowance.lt(APPROVE_BASE_AMOUNT) && pending === true ? 1000 : null,
  );

  const fetchAllowance = useCallback(async () => {
    const allowance = await token.allowance(account, router);
    setAllowance(allowance);
  }, [account, token]);

  useEffect(() => {
    if (account && token) {
      fetchAllowance().catch((err) => console.log(`Failed to fetch allowance: ${err.stack}`));
    }
  }, [account, token, fetchAllowance]);


  // check the current approval status
  const approvalState: ApprovalState = useMemo(() => {
    if (!currentAllowance) return ApprovalState.UNKNOWN;

    if(pending === true && currentAllowance.gt(0)) {
      setPending(false);
    }

    return currentAllowance.lt(APPROVE_BASE_AMOUNT) ? pending ? ApprovalState.PENDING : ApprovalState.NOT_APPROVED : ApprovalState.APPROVED;
  }, [currentAllowance, pending, token, tombFinance]);

  const addTransaction = useTransactionAdder();

  const approve = useCallback(async (): Promise<void> => {
    if (approvalState !== ApprovalState.NOT_APPROVED) {
      console.error('approve was called unnecessarily');
      return;
    }

    const response = await token.approve(router, APPROVE_AMOUNT);
    
    setPending(true);

    addTransaction(response, {
      summary: `Approve ${token.symbol}`,
      approval: {
        tokenAddress: token.address,
        spender: router,
      },
    });
  }, [approvalState, token, addTransaction]);

  return [approvalState, approve];
}

export default useApproveZapper;
