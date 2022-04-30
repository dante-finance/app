import { TransactionResponse } from '@ethersproject/providers';
import { BigNumber } from 'ethers';
import React, { useCallback } from 'react';
import useHandleTransactionReceipt from '../../../hooks/useHandleTransactionReceipt';
import { VaultsAmountForm } from './VaultsAmountForm';

interface VaultsVaultDepositProps {
  wantBalance: BigNumber;
}

export function VaultsVaultDeposit(props: VaultsVaultDepositProps): JSX.Element {
  const { wantBalance: balance } = props;

  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleSubmitRequest = useCallback((amount) => {
    return new Promise<TransactionResponse>((resolve, reject) => {
      window.setTimeout(() => {
        console.info('RESOLVE', amount);
        const shouldReject = true;
        if (shouldReject) reject();
        else resolve({} as TransactionResponse);
      }, 1000);
    });
  }, []);

  const handleSuccess = useCallback(
    (value: TransactionResponse) => {
      handleTransactionReceipt(value, '');
    },
    [handleTransactionReceipt],
  );

  return (
    <article>
      <VaultsAmountForm
        inputMax={balance.toNumber()}
        inputLabel="Deposit amount"
        inputDesc={<div>Balance: {balance.toString()}</div>}
        submitLabel="Deposit"
        handleSubmitRequest={handleSubmitRequest}
        onSuccess={handleSuccess}
        onError={() => {}}
      />
    </article>
  );
}
