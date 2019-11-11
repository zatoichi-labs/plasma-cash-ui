import React, { useState } from 'react';
import { Grid, Form, Input } from 'semantic-ui-react';

import { useSubstrate } from './substrate-lib';
import { TxButton } from './substrate-lib/components';

export default function Deposit (props) {
  const { api } = useSubstrate();
  const [status, setStatus] = useState(null);
  const { accountPair } = props;

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
      <h1>Deposit Token</h1>
      <Form>
        <Form.Field>
          <Input
            onChange={onChange}
            label='Token ID'
            fluid
            placeholder='ID of Token you control'
            state='tokenId'
            type='text'
          />
        </Form.Field>
        <Form.Field>
          <TxButton
            accountPair={accountPair}
            label='Add'
            setStatus={setStatus}
            type='TRANSACTION'
            attrs={{
              params: [tokenId],
              tx: api.tx.plasmaCash.deposit
            }}
          />
        </Form.Field>
        <div style={{ overflowWrap: 'break-word' }}>{status}</div>
      </Form>
    </Grid.Column>
  );
}
