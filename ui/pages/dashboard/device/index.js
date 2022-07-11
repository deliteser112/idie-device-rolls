import React, { useState, useEffect } from 'react';
import ReactLoading from 'react-loading';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Button, Container } from '@mui/material';

import { useTracker } from 'meteor/react-meteor-data';

// graphql & collections
import DevicesCollection from '../../../../api/Devices/DevicesCollection';
import { useQuery, useMutation } from '@apollo/react-hooks';

// import queries & mutations
import { devices as devicesQuery, deviceUsers as deviceUsersQuery } from '../../../_queries/Devices.gql';
import { removeDevice as removeDeviceMutation } from '../../../_mutations/Devices.gql';

// routes
import { PATH_DASHBOARD } from '../../../routes/paths';

// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import Iconify from '../../../components/Iconify';

// sections
import DeviceList from './DeviceList';
// ----------------------------------------------------------------------

export default function Device() {
  const [removeDevice] = useMutation(removeDeviceMutation);
  const [devices, setDevices] = useState([]);

  const loggedUser = Meteor.user();

  const deviceUsers = useQuery(deviceUsersQuery).data;
  const users = deviceUsers && deviceUsers.deviceUsers || [];

  const { loading, data } = useQuery(devicesQuery);

  const { isLoading, deviceCount } = useTracker(() => {
    const noDataAvailable = { deviceCount: 0 };
    if (!Meteor.user()) {
      return noDataAvailable;
    }
    const handler = Meteor.subscribe('devices');

    if (!handler.ready() || loading) {
      return { ...noDataAvailable, isLoading: true };
    }

    const deviceCount = DevicesCollection.find({}).count();

    return { deviceCount };
  });

  const devicesData = (data && data.devices) || [];

  const deleteDevice = (_id) => {
    removeDevice({
      variables: {
        _id,
      },
      refetchQueries: [{ query: devicesQuery }],
    });
  };

  useEffect(() => {
    if (users.length > 0 && devicesData.length > 0) {
      const newDeviceArr = [];
      devicesData.map((item) => {
        const { _id, name, mac, ownerId, followerIds } = item;
        const followers = [];
        let owner = {};
        users.map((user) => {
          if (ownerId === user._id) owner = user;
          followerIds.map((fId) => {
            if (fId === user._id) followers.push(user);
          });
        });

        const row = {
          _id,
          name,
          mac,
          owner,
          followers
        };

        newDeviceArr.push(row);
      });

      setDevices(newDeviceArr);
    }
  }, [users, devicesData]);

  return (
    <Page title="Device">
      <Container maxWidth="xl">
        <HeaderBreadcrumbs
          heading="Devices"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Devices' }]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.deviceCreate}
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New Device
            </Button>
          }
        />
        {isLoading ? (
          <ReactLoading className="loading-icons" type="spin" color="grey" height={35} width={35} />
        ) : (
          <DeviceList deviceList={devices} loggedUser={loggedUser} onDelete={(id) => deleteDevice(id)} />
        )}
      </Container>
    </Page>
  );
}
