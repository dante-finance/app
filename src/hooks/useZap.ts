import { useCallback } from 'react';
import useTombFinance from './useTombFinance';
import { Bank } from '../tomb-finance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useZap = () => {
  const tombFinance = useTombFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleZap = useCallback(
    (zappingToken: string, tokenName: string, amount: string, minAmount: string) => { 
      
      const zapperName = zappingToken === 'TOMB' || zappingToken === 'DANTE' ? 'TombZapper' : 'WFtmZapper';
      const contract = tombFinance.contracts[zapperName];

      handleTransactionReceipt(tombFinance.zapIn(zappingToken, tokenName, amount, minAmount, contract), `Zap ${amount}`);
    }, [tombFinance, handleTransactionReceipt],
  );
  return { onZap: handleZap };
};

export default useZap;
