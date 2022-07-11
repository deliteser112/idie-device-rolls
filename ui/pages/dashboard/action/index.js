import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import ReactLoading from 'react-loading';

// routes
import { PATH_DASHBOARD } from '../../../routes/paths';

// @mui
import { Container, Button } from '@mui/material';

import { useTracker } from 'meteor/react-meteor-data';

// graphql & collections
import ActionsCollection from '../../../../api/Actions/ActionsCollection';
import { useQuery, useMutation } from "@apollo/react-hooks";

// import queries & mutations
import { actions as actionsQuery } from '../../../_queries/Actions.gql';
import { removeAction as removeActionMutation } from '../../../_mutations/Actions.gql';

// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import Iconify from '../../../components/Iconify';

// sections
import ActionList from './ActionList';
// ----------------------------------------------------------------------

export default function Actions() {
  const [removeAction] = useMutation(removeActionMutation);

  const  { loading, data } = useQuery(actionsQuery);

  const { isLoading, actionCount } = useTracker(() => {
    const noDataAvailable = { actionCount: 0 };
    if (!Meteor.user()) {
      return noDataAvailable;
    }
    const handler = Meteor.subscribe('actions');

    if (!handler.ready() || loading) {
      return { ...noDataAvailable, isLoading: true };
    }

    const actionCount = ActionsCollection.find({}).count();

    return { actionCount };
  });
 
  const actions = data && data.actions || [];

  const deleteAction = (_id) => {
    removeAction({
      variables: {
        _id,
      },
      refetchQueries: [{ query: actionsQuery }],
    });
  };

  return (
    <Page title="Action">
      <Container maxWidth="xl">
        <HeaderBreadcrumbs
          heading="Actions"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Actions' }]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.actionCreate}
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              Add Action
            </Button>
          }
        />
        {isLoading ? (
          <ReactLoading className="loading-icons" type="spin" color="grey" height={35} width={35} />
        ) : (
          <ActionList onDelete={(id) => deleteAction(id)} actionList={actions} />
        )}
      </Container>
    </Page>
  );
}
