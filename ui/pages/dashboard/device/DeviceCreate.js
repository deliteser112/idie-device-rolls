// meteors
import { Meteor } from 'meteor/meteor';
import { useQuery } from '@apollo/react-hooks';
import { useTracker } from 'meteor/react-meteor-data';

import React from 'react';
import ReactLoading from 'react-loading';
import { useParams, useLocation } from 'react-router-dom';
// material
import { Container, Stack, Typography } from '@mui/material';

// components
import Page from '../../../components/Page';
import DeviceNewForm from './DeviceNewForm';

// import queries
import { deviceUsers as deviceUsersQuery, editDevice as editDeviceQuery } from '../../../_queries/Devices.gql';
// ----------------------------------------------------------------------

export default function DeviceCreate() {
  const { pathname } = useLocation();
  const { deviceId } = useParams();
  const isEdit = pathname.includes('edit');

  const tmpDevice = useQuery(editDeviceQuery, { variables: { _id: deviceId } }).data;
  const currentDevice = tmpDevice && tmpDevice.device;

  const { loading, data } = useQuery(deviceUsersQuery);

  const userList = (data && data.deviceUsers) || [];

  const loggedUser = useTracker(() => Meteor.user());

  return (
    <Page title={isEdit ? 'Update a Device' : 'Create a Device'}>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="flex-start" mb={5}>
          <Typography variant="h4" gutterBottom>
            {isEdit ? 'Update device' : 'Create a new device'}
          </Typography>
        </Stack>
        {loading ? (
          <ReactLoading className="loading-icons" type={'spin'} color={'grey'} height={35} width={35} />
        ) : (
          <DeviceNewForm isEdit={isEdit} loggedUser={loggedUser} currentDevice={currentDevice} userList={userList} />
        )}
      </Container>
    </Page>
  );
}
