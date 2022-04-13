import { Skeleton } from '@material-ui/lab';
import React from 'react';
import { useQuery } from 'react-query';
import useTombFinance from '../../../hooks/useTombFinance';
import { VaultPool } from '../../../tomb-finance/types';

interface VaultsVaultProps {
  vaultContract: VaultPool['contract'];
}

export function VaultsVault(props: VaultsVaultProps): JSX.Element {
  const { vaultContract } = props;

  const tombFinance = useTombFinance();

  const {
    isLoading,
    error,
    data: vaultInfo,
  } = useQuery(['vaults', 'info', vaultContract], () => tombFinance.getVault(vaultContract));

  if (isLoading) {
    return <Skeleton variant="rect" height={150} />;
  }

  if (error) {
    return <>An error occurred</>;
  }

  return (
    <div style={{ color: 'black' }}>
      <h2>{vaultInfo.name}</h2>
      {/* <VaultsDeposit balance={100} />
      <VaultsWithdraw deposited={100} /> */}
      <pre>{JSON.stringify(vaultInfo, null, 2)}</pre>
    </div>
  );
}
