import React, { useState } from 'react';
import Page from '../../components/Page';
import { Accordion, AccordionSummary } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { VaultPool } from '../../tomb-finance/types';
import useTombFinance from '../../hooks/useTombFinance';
import { useQuery } from 'react-query';
import { PageBackgroundDefault } from '../../components/PageBackground/PageBackgroundDefault';
import { VaultsVault } from './components/VaultsVault';

export default function Vaults(): JSX.Element {
  const [expandedItemID, setExpandedItemID] = useState<VaultPool['contract']>();

  const tombFinance = useTombFinance();

  const { isLoading, data, error } = useQuery(['vaults', 'list'], () => tombFinance.getVaults());

  if (isLoading) {
    return (
      <Page>
        <PageBackgroundDefault />
        <Skeleton variant="rect" height={150} />
        <Skeleton variant="rect" height={150} />
        <Skeleton variant="rect" height={150} />
      </Page>
    );
  }

  if (error) {
    return <>An error occurred</>;
  }

  return (
    <Page>
      <PageBackgroundDefault />

      <h1>Vaults</h1>

      {data.map((vault) => (
        <Accordion
          key={vault.contract}
          expanded={vault.contract === expandedItemID}
          onChange={(): void => {
            if (vault.contract === expandedItemID) {
              setExpandedItemID(null);
            } else {
              setExpandedItemID(vault.contract);
            }
          }}
        >
          <AccordionSummary style={{ color: 'black' }}>
            <h2>{vault.name}</h2>
          </AccordionSummary>
          {vault.contract === expandedItemID && <VaultsVault vaultContract={vault.contract} />}
        </Accordion>
      ))}
    </Page>
  );
}
