import { useCallback, useEffect, useState } from 'react';
import useTombFinance from './useTombFinance';
import useStakedBalanceOnMasonry from './useStakedBalanceOnMasonry';

const useMasonryVersion = () => {
  const [masonryVersion, setMasonryVersion] = useState('latest');
  const tombFinance = useTombFinance();
  const stakedBalance = useStakedBalanceOnMasonry();

  const updateState = useCallback(async () => {
    setMasonryVersion(await tombFinance.fetchMasonryVersionOfUser());
  }, [tombFinance]);

  useEffect(() => {
    if (tombFinance?.isUnlocked) {
      updateState().catch((err) => console.error(err.stack));
    }
  }, [stakedBalance, tombFinance, updateState]);

  return masonryVersion;
};

export default useMasonryVersion;
