import React, { useState } from 'react';
import Page from '../../components/Page';
import { Accordion, AccordionSummary } from '@material-ui/core';
import { VaultItemModel } from './VaultsModel';
import { PageBackgroundDefault } from '../../components/PageBackground/PageBackgroundDefault';

const MOCK_DATA: VaultItemModel[] = ['A', 'B', 'C'].map((it) => ({ id: it, label: it } as VaultItemModel));

export default function Vaults(): JSX.Element {
  const [expandedItemID, setExpandedItemID] = useState<VaultItemModel['id']>();

  return (
    <Page>
      <PageBackgroundDefault />

      <h1>Vaults</h1>

      {MOCK_DATA.map((item) => (
        <Accordion
          key={item.id}
          expanded={item.id === expandedItemID}
          onChange={(): void => {
            setExpandedItemID(item.id);
          }}
        >
          <AccordionSummary style={{ color: 'black' }}>{item.label}</AccordionSummary>
          <div style={{ color: 'black' }}>CONTENT OF {item.label}</div>
        </Accordion>
      ))}
    </Page>
  );
}
