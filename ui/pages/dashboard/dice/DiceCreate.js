// meteors
import { Meteor } from 'meteor/meteor';
import { useQuery } from "@apollo/react-hooks";
import { useTracker } from 'meteor/react-meteor-data';

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
import DiceNewForm from './DiceNewForm';

// import queries
import { deviceUsers as usersQuery } from '../../../_queries/Devices.gql';
import { actions as actionsQuery } from '../../../_queries/Actions.gql';
import { editDice as editDiceQuery } from '../../../_queries/Dices.gql';

// ----------------------------------------------------------------------

export default function DiceCreate() {
  const [actionList, setActionList] = useState([]);
  const { pathname } = useLocation();
  const { diceId } = useParams();
  const isEdit = pathname.includes('edit');

  const tmpDice = useQuery(editDiceQuery, { variables: { _id: diceId } }).data;
  const currentDice = tmpDice && tmpDice.dice;

  const actionsData = useQuery(actionsQuery).data;

  useEffect(() => {
    if(actionsData) {
      const { actions } = actionsData;
      setActionList(actions);
    }
  }, [actionsData]);

  const  { loading, data } = useQuery(usersQuery);

  const userList = data && data.deviceUsers || [];

  const loggedUser = useTracker(() => Meteor.user());

  return (
    <Page title={isEdit ? 'Update a Dice' : 'Create a Dice'}>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="flex-start" mb={5}>
          <Typography variant="h4" gutterBottom>
            {isEdit ? 'Update dice' : 'Create a new dice'}
          </Typography>
        </Stack>
        {loading ? <ReactLoading className="loading-icons" type={'bars'} color={'grey'} height={30} width={30} /> : 
          <DiceNewForm isEdit={isEdit} loggedUser={loggedUser} currentDice={currentDice} userList={userList} actionList={actionList} />
        }
      </Container>
    </Page>
  );
}
