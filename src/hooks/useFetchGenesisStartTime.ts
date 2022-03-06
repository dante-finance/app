import { useCallback, useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import useTombFinance from './useTombFinance';

const useFetchGenesisStartTime = () => {
  const [timestamp, setTimestamp] = useState(BigNumber.from(0));
  const tombFinance = useTombFinance();

  const fetchTimestampAsync = useCallback(async () => {
    const { DanteRewardPool } = tombFinance.contracts;
    setTimestamp(await DanteRewardPool.poolStartTime());
  }, [tombFinance.contracts]);

  useEffect(() => {
    if (tombFinance) {
      fetchTimestampAsync();
    }
  }, [tombFinance]);

  return timestamp;
};

export default useFetchGenesisStartTime;
