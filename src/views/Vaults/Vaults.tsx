import React, { useCallback, useState } from 'react';
import Page from '../../components/Page';
import RegulationsImage from '../../assets/img/home.png';
import { createGlobalStyle } from 'styled-components';
import { Accordion, AccordionSummary } from '@material-ui/core';
import { VaultItemModel } from './VaultsModel';

// TODO default component for background image
const BackgroundImage = createGlobalStyle`
  body, html {
    background: url(${RegulationsImage}) no-repeat !important;
    background-size: cover !important;
  }
`;

const MOCK_DATA: VaultItemModel[] = ['A', 'B', 'C'].map(it => ({ id: it, label: it } as VaultItemModel));

export default function Vaults(): JSX.Element {
  const [expandedItemID, setExpandedItemID] = useState<VaultItemModel['id']>();

  return (
    <Page>
      <BackgroundImage />
      <h1>Vaults</h1>

      {MOCK_DATA.map((item) => (
        <Accordion
          key={item.id}
          expanded={item.id === expandedItemID}
          onChange={(): void => {
            setExpandedItemID(item.id);
          }}>
          <AccordionSummary style={{ color: 'black' }}>
            {item.label}
          </AccordionSummary>
          <div style={{ color: 'black' }}>
            CONTENT OF {item.label}
          </div>
        </Accordion>
      ))}
    </Page>
  );
}
