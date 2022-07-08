// meteors
import { Meteor } from 'meteor/meteor';
import { useQuery } from "@apollo/react-hooks";

import React, { useEffect, useState } from 'react';
import ReactLoading from 'react-loading';
import { useParams, useLocation } from 'react-router-dom';
// material
import { 
  Container, 
  Stack, 
  Typography
} from '@mui/material';

// components
import Page from '../../../components/Page';
import ActionNewForm from './ActionNewForm';

// import queries & mutations
import { actions as actionsQuery, editAction as editActionQuery } from '../../../_queries/Actions.gql';
// ----------------------------------------------------------------------

export default function ActionCreate() {
  const { pathname } = useLocation();
  const { actionId } = useParams();
  const isEdit = pathname.includes('edit');

  const tmpAction = useQuery(editActionQuery, { variables: { _id: actionId } }).data;
  const currentAction = tmpAction && tmpAction.action;

  console.log('currentAction', currentAction);
  return (
    <Page title={isEdit ? 'Update a Action' : 'Create a Action'}>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="flex-start" mb={5}>
          <Typography variant="h4" gutterBottom>
            {isEdit ? 'Update action' : 'Create a new action'}
          </Typography>
        </Stack>
        <ActionNewForm isEdit={isEdit} currentAction={currentAction} />
      </Container>
    </Page>
  );
}
