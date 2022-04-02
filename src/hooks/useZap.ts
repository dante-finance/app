import { useCallback } from 'react';
import useTombFinance from './useTombFinance';
import { Bank } from '../tomb-finance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useZap = (router: string) => {
  const tombFinance = useTombFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleZap = useCallback(
    (zappingToken: string, tokenName: string, amount: string, minAmount: string) => { 
      handleTransactionReceipt(tombFinance.zapIn(zappingToken, tokenName, amount, minAmount, tombFinance.contracts[router]), `Zap ${amount}`);
    }, [tombFinance, handleTransactionReceipt],
  );
  return { onZap: handleZap };
};

export default useZap;
