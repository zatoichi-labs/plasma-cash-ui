import React, { useState } from 'react';
import { Grid, Form, Input } from 'semantic-ui-react';

import { useSubstrate } from './substrate-lib';
import { TxButton } from './substrate-lib/components';

export default function TokenQuery (props) {
  const { api, keyring } = useSubstrate();
  const [status, setStatus] = useState(null);

  // Get the list of accounts we possess the private key for
  const accounts = keyring.getPairs().map(account => ({
    address: account.address,
    name: account.meta.name.toUpperCase(),
  }));

  const initialState = {
    tokenId: '',
  };
  const [formState, setFormState] = useState(initialState);
  const { tokenId } = formState;

  const onChange = (_, data) => {
    setFormState(formState => {
      return {
        ...formState,
        [data.state]: data.value
      };
    });
  };

  const setQueryStatus = status => {
    try {
      let obj = JSON.parse(status);
      if (obj.receiver) {
        let receiver = accounts.filter(account => account.address === obj.receiver);
        // If one and only one account is found with the matching address in our
        // address book, display their name
        if (receiver.length === 1) {
          setStatus("Owner: " + receiver[0].name);
        } else {
          // else, display the address we've received
          setStatus("Owner: " + obj.receiver);
        }
      }
    } catch {
      setStatus("Owner: Unknown!");
    }
  };

  return (
    <Grid.Column>
      <h1>Token Ownership</h1>
      <Form>
        <Form.Field>
          <Input
            onChange={onChange}
            label='Token ID'
            fluid
            placeholder='ID of Token'
            state='tokenId'
            type='text'
            value={tokenId}
          />
        </Form.Field>
        <Form.Field>
          <TxButton
            label='Query'
            setStatus={setQueryStatus}
            type='QUERY'
            attrs={{
              params: [tokenId],
              tx: api.query.plasmaCash.tokens
            }}
          />
        </Form.Field>
        <div style={{ overflowWrap: 'break-word' }}>{status}</div>
      </Form>
    </Grid.Column>
  );
}
