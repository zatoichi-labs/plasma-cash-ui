import React, { useState, createRef } from 'react';
import { Container, Dimmer, Loader, Grid, Sticky } from 'semantic-ui-react';

import 'semantic-ui-css/semantic.min.css';
import { SubstrateContextProvider, useSubstrate } from './substrate-lib';
import { DeveloperConsole } from './substrate-lib/components';

import AccountSelector from './AccountSelector';
import BlockNumber from './BlockNumber';
import TokenQuery from './TokenQuery';
import Events from './Events';
import Extrinsics from './Extrinsics';
import Metadata from './Metadata';
import NodeInfo from './NodeInfo';
import TemplateModule from './TemplateModule';

function Main () {
  const [accountAddress, setAccountAddress] = useState(null);
  const { apiState, keyring, keyringState } = useSubstrate();
  const accountPair =
    accountAddress &&
    keyringState === 'READY' &&
    keyring.getPair(accountAddress);

  const loader = text => (
    <Dimmer active>
      <Loader size='small'>{text}</Loader>
    </Dimmer>
  );

  if (apiState === 'ERROR') return loader('Error connecting to the blockchain');
  else if (apiState !== 'READY') return loader('Connecting to the blockchain');

  if (keyringState !== 'READY') {
    return loader(
      "Loading accounts (please review any extension's authorization)"
    );
  }

  const contextRef = createRef();

  return (
    <div ref={contextRef}>
      <Sticky context={contextRef}>
        <AccountSelector setAccountAddress={setAccountAddress} />
      </Sticky>
      <Container>
        <Grid divided>
          <Grid.Row columns={4} stretched>
            <NodeInfo />
            <Metadata />
            <BlockNumber />
            <BlockNumber finalized />
          </Grid.Row>
          <Grid.Row columns={3} stretched>
            <Extrinsics accountPair={accountPair} />
            <TokenQuery />
            <Events />
          </Grid.Row>
          <Grid.Row>
            <TemplateModule accountPair={accountPair} />
          </Grid.Row>
        </Grid>
        <DeveloperConsole />
      </Container>
    </div>
  );
}

export default function App () {
  return (
    <SubstrateContextProvider>
      <Main />
    </SubstrateContextProvider>
  );
}
