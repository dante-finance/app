import { BigNumber } from 'ethers';
import React, { useCallback, useMemo } from 'react';
import { useQuery } from 'react-query';
import useTombFinance from '../../../hooks/useTombFinance';
import { VaultPool } from '../../../tomb-finance/types';
import { VaultsAmountForm } from './VaultsAmountForm';

interface VaultsVaultWithdrawProps {
  vaultContract: VaultPool['contract'];
  shareBalance: BigNumber;
}

export function VaultsVaultWithdraw(props: VaultsVaultWithdrawProps): JSX.Element {
  const { vaultContract, shareBalance } = props;

  const tombFinance = useTombFinance();

  const { data: pricePerShare = BigNumber.from('0') } = useQuery(
    ['vaults', 'sharePrice', vaultContract],
    () => tombFinance.getVaultPricePerFullShare(vaultContract),
    {
      refetchInterval: 10000,
    },
  );

  const handleSubmitRequest = useCallback<React.ComponentProps<typeof VaultsAmountForm>['handleSubmitRequest']>(
    (amount) => {
      return new Promise<void>((resolve, reject) => {
        window.setTimeout(() => {
          console.info('RESOLVE', amount);
          const shouldReject = false;
          if (shouldReject) reject();
          else resolve();
        }, 1000);
      });
    },
    [],
  );

  const maxValue = useMemo(() => {
    return shareBalance.mul(pricePerShare);
  }, [shareBalance, pricePerShare]);

  return (
    <article>
      <VaultsAmountForm
        inputMax={maxValue.toNumber()}
        inputLabel="Withdraw amount"
        inputDesc={<div>Deposited: {maxValue.toString()}</div>}
        submitLabel="Withdraw"
        handleSubmitRequest={handleSubmitRequest}
        onSuccess={() => {}}
        onError={() => {}}
      />
    </article>
  );
}
