import React, { useEffect, useState } from 'react';
import ReactLoading from 'react-loading';
// @mui
import { Container } from '@mui/material';

import { useTracker } from 'meteor/react-meteor-data';

// graphql & collections
import RollsCollection from '../../../../api/Rolls/RollsCollection';
import { useQuery } from '@apollo/react-hooks';

// import queries
import { devices as devicesQuery } from '../../../_queries/Devices.gql';

// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';

// sections
import DeviceWatchList from './DeviceWatchList';

// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// ----------------------------------------------------------------------

export default function Watch() {
  const [deviceList, setDeviceList] = useState([]);

  const devices = useQuery(devicesQuery).data;

  const { isLoading, tmpRolls } = useTracker(() => {
    const handler = Meteor.subscribe('rolls');
    Meteor.subscribe('devices');

    if (!handler.ready()) {
      return { tmpRolls: [], isLoading: true };
    }

    const tmpRolls = RollsCollection.find({}).fetch() || [];

    return { tmpRolls };
  });

  useEffect(() => {
    if (devices) {
      setDeviceList(devices.devices);
    }
  }, [devices]);

  return (
    <Page title="Watch">
      <Container maxWidth="xl">
        <HeaderBreadcrumbs
          heading="Watch List"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Watch' }]}
        />
        {isLoading ? (
          <ReactLoading className="loading-icons" type={'spin'} color={'grey'} height={30} width={30} />
        ) : (
          <DeviceWatchList rollList={tmpRolls} deviceList={deviceList} />
        )}
      </Container>
    </Page>
  );
}
