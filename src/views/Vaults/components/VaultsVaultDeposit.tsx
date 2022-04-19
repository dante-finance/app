import { BigNumber } from 'ethers';
import React, { useCallback } from 'react';
import { VaultsAmountForm } from './VaultsAmountForm';

interface VaultsVaultDepositProps {
  wantBalance: BigNumber;
}

export function VaultsVaultDeposit(props: VaultsVaultDepositProps): JSX.Element {
  const { wantBalance: balance } = props;

  const handleSubmitRequest = useCallback<React.ComponentProps<typeof VaultsAmountForm>['handleSubmitRequest']>(
    (amount) => {
      return new Promise<void>((resolve, reject) => {
        window.setTimeout(() => {
          console.info('RESOLVE', amount);
          const shouldReject = true;
          if (shouldReject) reject();
          else resolve();
        }, 1000);
      });
    },
    [],
  );

  return (
    <article>
      <VaultsAmountForm
        inputMax={balance.toNumber()}
        inputLabel="Deposit amount"
        inputDesc={<div>Balance: {balance.toString()}</div>}
        submitLabel="Deposit"
        handleSubmitRequest={handleSubmitRequest}
        onSuccess={() => {}}
        onError={() => {}}
      />
    </article>
  );
}
