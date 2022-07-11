import React from 'react';
import ReactLoading from 'react-loading';
// @mui
import { Container } from '@mui/material';

import { useTracker } from 'meteor/react-meteor-data';

// graphql & collections
import RollsCollection from '../../../../api/Rolls/RollsCollection';
import { useQuery, useMutation } from '@apollo/react-hooks';

// import queries & mutations
import { rolls as rollsQuery } from '../../../_queries/Rolls.gql';
import {
  removeRoll as removeRollMutation,
  removeMultipleRoll as removeMultipleRollMutation
} from '../../../_mutations/Rolls.gql';

// routes
import { PATH_DASHBOARD } from '../../../routes/paths';

// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';

// rolls list
import RollList from './RollList';

// ----------------------------------------------------------------------

export default function Rolls() {
  const [removeRoll] = useMutation(removeRollMutation);
  const [removeMultipleRoll] = useMutation(removeMultipleRollMutation);
  const { loading, data, refetch } = useQuery(rollsQuery);

  const { isLoading, rollCount, rolls } = useTracker(() => {
    const noDataAvailable = { rollCount: 0 };
    if (!Meteor.user()) {
      return noDataAvailable;
    }
    const handler = Meteor.subscribe('rolls');

    if (!handler.ready() || loading) {
      return { ...noDataAvailable, isLoading: true };
    }

    const rollCount = RollsCollection.find({}).count();
    const rolls = RollsCollection.find({}).fetch();

    return { rollCount, rolls };
  });

  const deleteRoll = (_id) => {
    removeRoll({
      variables: {
        _id
      },
      refetchQueries: [{ query: rollsQuery }]
    });
  };

  const handleMultiDelete = (ids) => {
    const _id = ids.toString();
    removeMultipleRoll({
      variables: {
        _id
      },
      refetchQueries: [{ query: rollsQuery }]
    });
  };

  return (
    <Page title="Roll">
      <Container maxWidth="xl">
        <HeaderBreadcrumbs
          heading="Rolls"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: `Rolls(${rollCount})` }]}
        />
        {isLoading ? (
          <ReactLoading className="loading-icons" type="spin" color="grey" height={35} width={35} />
        ) : (
          <RollList
            rollList={rolls ? rolls : []}
            onDelete={(id) => deleteRoll(id)}
            onMultiDelete={(ids) => handleMultiDelete(ids)}
          />
        )}
      </Container>
    </Page>
  );
}
