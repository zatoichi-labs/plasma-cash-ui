import React, { useState } from 'react';
import { Grid, Form, Input } from 'semantic-ui-react';

import { useSubstrate } from './substrate-lib';
import { TxButton } from './substrate-lib/components';

export default function Transfer (props) {
  const { api } = useSubstrate();
  const [status, setStatus] = useState(null);
  const { accountPair } = props;

  const [formState, setFormState] = useState({
    tokenId: "",
    receiverId: "",
  });
  const { tokenId, receiverId } = formState;

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
          <Input
            onChange={onChange}
            label='Receiver'
            fluid
            placeholder='ID of Recipient'
            type='text'
          />
        </Form.Field>
        <Form.Field>
          <TxButton
            accountPair={accountPair}
            label='Send'
            setStatus={setStatus}
            type='TRANSACTION'
            attrs={{
              params: [tokenId, receiverId],
              tx: api.tx.plasmaCash.transfer
            }}
          />
        </Form.Field>
        <div style={{ overflowWrap: 'break-word' }}>{status}</div>
      </Form>
    </Grid.Column>
  );
}
