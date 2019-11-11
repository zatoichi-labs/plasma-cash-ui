import React, { useState } from 'react';
import { Grid, Form, Dropdown, Input } from 'semantic-ui-react';

import { blake2AsU8a } from '@polkadot/util-crypto';
import { createType } from '@polkadot/types';

import { useSubstrate } from './substrate-lib';
import { TxButton } from './substrate-lib/components';

export default function Transfer (props) {
  const { api, keyring } = useSubstrate();
  const [status, setStatus] = useState(null);
  const { accountPair } = props;

  // Get the list of accounts we possess the private key for
  const keyringOptions = keyring.getPairs().map(account => ({
    key: account.address,
    value: account.address,
    text: account.meta.name.toUpperCase(),
    icon: 'user'
  }));

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
        receiver: createType('AccountId', prevTxn.receiver),
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

  const onChangeReceiver = receiver => {
    setTransaction(prevTxn => {
      let unsignedTxn = createType('UnsignedTransaction', {
        receiver: createType('AccountId', receiver),
        token_id: createType('TokenId', prevTxn.token_id),
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
      <h1>Transfer Token</h1>
      <Form>
        <Form.Field>
          <Input
            onChange={(_, data) => { onChangeToken(data.value) }}
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
              onChangeReceiver(dropdown.value);
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
              params: [transaction],
              tx: api.tx.plasmaCash.transfer
            }}
          />
        </Form.Field>
        <div style={{ overflowWrap: 'break-word' }}>{status}</div>
      </Form>
    </Grid.Column>
  );
}
