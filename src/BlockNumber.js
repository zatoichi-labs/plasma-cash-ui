import React, { useEffect, useState } from 'react';
import { Statistic, Grid, Card, Icon } from 'semantic-ui-react';

import { useSubstrate } from './substrate-lib';

export default function BlockNumber (props) {
  const { api } = useSubstrate();
  const { finalized } = props;
  const [blockNumber, setBlockNumber] = useState(0);
  const [blockNumberTimer, setBlockNumberTimer] = useState(0);

  const [extRoot, setExtRoot] = useState(0);
  const [stateRoot, setStateRoot] = useState(0);

  const bestNumber = finalized
    ? api.derive.chain.bestNumberFinalized
    : api.derive.chain.bestNumber;

  const getHeader = api.rpc.chain.getHeader;

  useEffect(() => {
    let unsubscribeAll = null;

    bestNumber(number => {
      setBlockNumber(number.toNumber());
      setBlockNumberTimer(0);
      getHeader(header => {
        let extRoot = header.extrinsicsRoot.toHex();
        setExtRoot(extRoot.substring(0, 6) + '....' + extRoot.substring(62, 66));
        let stateRoot = header.stateRoot.toHex();
        setStateRoot(stateRoot.substring(0, 6) + '....' + stateRoot.substring(62, 66));
      });
    }).then(unsub => {
      unsubscribeAll = unsub;
    }).catch(console.error);

    return () => unsubscribeAll && unsubscribeAll();
  }, [bestNumber, getHeader]);

  const timer = () => {
    setBlockNumberTimer(time => time + 1);
  };

  useEffect(() => {
    const id = setInterval(timer, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <Grid.Column>
      <Card>
        <Card.Content textAlign='center'>
          <Statistic
            label={(finalized ? 'Finalized' : 'Current') + ' Block Number'}
            value={blockNumber}
          />
        </Card.Content>
        <Card.Content extra>
          <Grid.Column>
            <Grid.Row>
              <Icon name='envelope' /> {extRoot}
            </Grid.Row>
            <Grid.Row>
              <Icon name='save' /> {stateRoot}
            </Grid.Row>
            <Grid.Row>
              <Icon name='time' /> {blockNumberTimer}
            </Grid.Row>
          </Grid.Column>
        </Card.Content>
      </Card>
    </Grid.Column>
  );
}
