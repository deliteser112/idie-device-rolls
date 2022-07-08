import React, { useEffect } from 'react';
import ReactLoading from 'react-loading';
// @mui
import { Container, Typography, Stack } from '@mui/material';

import { useTracker } from 'meteor/react-meteor-data';

// graphql & collections
// import { RollsCollection } from '/imports/db/RollsCollection';
import RollsCollection from '../../../../api/Rolls/RollsCollection';
import { useQuery } from '@apollo/react-hooks';

// import queries
import { rolls as rollsQuery } from '../../../_queries/Rolls.gql';

// routes
import { PATH_DASHBOARD } from '../../../routes/paths';

// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import Iconify from '../../../components/Iconify';

// rolls list
// import RollList from './RollList';

// ----------------------------------------------------------------------

export default function Rolls() {
  const { loading, data, refetch } = useQuery(rollsQuery);

  console.log(data);

  // refetch();

  // const { isLoading, rollCount } = useTracker(() => {
  //   const noDataAvailable = { rollCount: 0 };
  //   if (!Meteor.user()) {
  //     return noDataAvailable;
  //   }
  //   const handler = Meteor.subscribe('rolls');

  //   if (!handler.ready() || loading) {
  //     return { ...noDataAvailable, isLoading: true };
  //   }

  //   const rollCount = RollsCollection.find({}).count();

  //   return { rollCount };
  // });

  // const rolls = (data && data.rolls) || [];

  // const deleteRoll = (_id) => {
  //   Meteor.call('rolls.remove', _id);
  //   refetch();
  // };

  // const handleMultiDelete = (ids) => {
  //   console.log('Here is delete', ids);
  //   ids.map((id) => {
  //     Meteor.call('rolls.remove', id);
  //   });
  //   refetch();
  // };

  return (
    <Page title="Roll">
      <Container maxWidth="xl">
        <HeaderBreadcrumbs
          heading="Rolls"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Rolls' }]}
        />
        {/* {isLoading ? (
          <ReactLoading className="loading-icons" type="spin" color="grey" height={15} width={15} />
        ) : (
          <RollList
            rollList={rolls}
            onDelete={(id) => deleteRoll(id)}
            onMultiDelete={(ids) => handleMultiDelete(ids)}
          />
        )} */}
      </Container>
    </Page>
  );
}