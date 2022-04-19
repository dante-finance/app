import React from 'react';
import { Grid } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { useQuery } from 'react-query';
import useTombFinance from '../../../hooks/useTombFinance';
import { VaultPool } from '../../../tomb-finance/types';
import { VaultsVaultDeposit } from './VaultsVaultDeposit';
import { VaultsVaultWithdraw } from './VaultsVaultWithdraw';

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
    <Grid container spacing={2} style={{ color: 'black', margin: '1rem' }}>
      <Grid item md={6}>
        <VaultsVaultDeposit wantBalance={vaultInfo.wantBalance} />
      </Grid>
      <Grid item md={6}>
        <VaultsVaultWithdraw vaultContract={vaultContract} shareBalance={vaultInfo.shareBalance} />
      </Grid>
    </Grid>
  );
}
