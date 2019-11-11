import React, { useState } from 'react';
import { Grid, Form, Input } from 'semantic-ui-react';

import { useSubstrate } from './substrate-lib';
import { TxButton } from './substrate-lib/components';

export default function TokenQuery (props) {
  const { api } = useSubstrate();
  const [status, setStatus] = useState(null);

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
            setStatus={setStatus}
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
