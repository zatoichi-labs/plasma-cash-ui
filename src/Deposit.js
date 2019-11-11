import React, { useState } from 'react';
import { Grid, Form, Input } from 'semantic-ui-react';

import { blake2AsU8a } from '@polkadot/util-crypto';
import { createType } from '@polkadot/types';

import { useSubstrate } from './substrate-lib';
import { TxButton } from './substrate-lib/components';

export default function Deposit (props) {
  const { api } = useSubstrate();
  const [status, setStatus] = useState(null);
  const { accountPair } = props;

  const defaultTransaction = createType('Transaction', {
      receiver: createType('AccountId', accountPair.address),
      token_id: createType('TokenId', 0),
      prev_blk_num: createType('BlkNum', 0),
      sender: createType('AccountId', accountPair.address),
      signature: createType('Signature', "")
    });
  const [transaction, setTransaction] = useState(defaultTransaction);

  const onChangeToken = token => {
    setTransaction(prevTxn => {
      let unsignedTxn = createType('UnsignedTransaction', {
        receiver: createType('AccountId', accountPair.address),
        token_id: createType('TokenId', token),
        prev_blk_num: createType('BlkNum', prevTxn.prev_blk_num),
      });
      let signature = accountPair.sign(blake2AsU8a(unsignedTxn.toU8a()));
      return createType('Transaction', {
        ...unsignedTxn,
        sender: createType('AccountId', accountPair.address),
        signature: createType('Signature', signature)
      })
    });
  };

  return (
    <Grid.Column>
      <h1>Deposit Token</h1>
      <Form>
        <Form.Field>
          <Input
            onChange={(_, data) => { onChangeToken(data.value) }}
            label='Token ID'
            fluid
            placeholder='ID of Token you control'
            state={transaction.tokenId}
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
              params: [transaction],
              tx: api.tx.plasmaCash.deposit
            }}
          />
        </Form.Field>
        <div style={{ overflowWrap: 'break-word' }}>{status}</div>
      </Form>
    </Grid.Column>
  );
}
