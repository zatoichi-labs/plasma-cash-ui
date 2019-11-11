import React, { useState } from 'react';
import { Grid, Form, Dropdown, Input } from 'semantic-ui-react';

import { useSubstrate } from './substrate-lib';
import { TxButton } from './substrate-lib/components';

export default function Transfer (props) {
  const { api, keyring } = useSubstrate();
  const [status, setStatus] = useState(null);
  const [receiver, setReceiver] = useState("");
  const { accountPair } = props;

  // Get the list of accounts we possess the private key for
  const keyringOptions = keyring.getPairs().map(account => ({
    key: account.address,
    value: account.address,
    text: account.meta.name.toUpperCase(),
    icon: 'user'
  }));

  const [formState, setFormState] = useState({
    tokenId: "",
  });
  const { tokenId } = formState;

  const onChange = (_, data) =>
    setFormState(formState => ({
        ...formState,
        [data.state]: data.value
      })
    );

  return (
    <Grid.Column>
      <h1>Transfer Token</h1>
      <Form>
        <Form.Field>
          <Input
            onChange={onChange}
            label='Token ID'
            fluid
            placeholder='ID of Token you control'
            type='text'
          />
        </Form.Field>
        <Form.Field>
          <Dropdown
            search
            selection
            clearable
            placeholder="Select Receipient"
            options={keyringOptions}
            onChange={(_, dropdown) => {
              setReceiver(dropdown.value);
            }}
          />
        </Form.Field>
        <Form.Field>
          <TxButton
            accountPair={accountPair}
            label='Send'
            setStatus={setStatus}
            type='TRANSACTION'
            attrs={{
              params: [tokenId, receiver],
              tx: api.tx.plasmaCash.transfer
            }}
          />
        </Form.Field>
        <div style={{ overflowWrap: 'break-word' }}>{status}</div>
      </Form>
    </Grid.Column>
  );
}
