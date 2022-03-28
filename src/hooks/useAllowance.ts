import { useCallback, useEffect, useState } from 'react';
import { useWallet } from 'use-wallet';
import { BigNumber } from 'ethers';
import useInterval from './useInterval';
import ERC20 from '../tomb-finance/ERC20';

const useAllowance = (token: ERC20, spender: string, pendingApproval?: boolean) => {
  const [allowance, setAllowance] = useState<BigNumber>(null);
  const { account } = useWallet();

  const [lastPending, setLastPending] = useState<boolean>(false);

  useInterval(
    () => {
      // Your custom logic here
    },
    // Delay in milliseconds or null to stop it
    1000,
  );

  const fetchAllowance = useCallback(async () => {

    if(lastPending === true && pendingApproval === false) {
      await new Promise(resolve => setTimeout(resolve, 5000));
    }

    const allowance = await token.allowance(account, spender);
    //console.error('fetch allowance', allowance);
    setAllowance(allowance);

    setLastPending(pendingApproval);

    console.error ('pending', pendingApproval);
    console.error ('last', lastPending);
  }, [account, spender, token]);

  useEffect(() => {
    if (account && spender && token) {
      fetchAllowance().catch((err) => console.log(`Failed to fetch allowance: ${err.stack}`));
    }
  }, [account, spender, token, pendingApproval, fetchAllowance]);

  /*useEffect(() => {
    setInterval(() => {dd
      fetchAllowance().catch((err) => console.log(`Failed to fetch allowance: ${err.stack}`));
    }, 1000);
  });*/

  return allowance;
};

export default useAllowance;
