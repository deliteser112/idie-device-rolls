import React, { useEffect, useState } from 'react';
import ReactLoading from 'react-loading';
import { Link as RouterLink } from 'react-router-dom';

// @mui
import { Grid, Button, Container, TableBody, Table, TableContainer } from '@mui/material';

import { useTracker } from 'meteor/react-meteor-data';

// graphql & collections
import DicesCollection from '../../../../api/Dices/DicesCollection';
import { useQuery, useMutation } from '@apollo/react-hooks';

// import queries & mutations
import { deviceUsers as usersQuery } from '../../../_queries/Devices.gql';
import { actions as actionsQuery } from '../../../_queries/Actions.gql';
import { dices as dicesQuery } from '../../../_queries/Dices.gql';

import { removeDice as removeDiceMutation } from '../../../_mutations/Dices.gql';

// routes
import { PATH_DASHBOARD } from '../../../routes/paths';

// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import Iconify from '../../../components/Iconify';
import { DiceCard } from '../../../sections/@dashboard/dice';

// sections
import {
  TableNoData,
} from '../../../sections/@dashboard/table';

// ----------------------------------------------------------------------

export default function Dices() {
  const [removeDice] = useMutation(removeDiceMutation);
  const [users, setUsers] = useState([]);
  const [actions, setActions] = useState([]);

  const [dices, setDices] = useState([]);

  const tmpUsers = useQuery(usersQuery).data;
  const tmpActions = useQuery(actionsQuery).data;

  const { loading, data, refetch } = useQuery(dicesQuery);

  // refetch();

  const { isLoading, diceCount } = useTracker(() => {
    const noDataAvailable = { diceCount: 0 };
    if (!Meteor.user()) {
      return noDataAvailable;
    }
    const handler = Meteor.subscribe('dices');

    if (!handler.ready() || loading) {
      return { ...noDataAvailable, isLoading: true };
    }

    const diceCount = DicesCollection.find({}).count();

    return { diceCount };
  });

  const dicesData = (data && data.dices) || [];

  const deleteDice = (_id) => {
    console.log('ID', _id);
    removeDice({
      variables: {
        _id
      },
      refetchQueries: [{ query: dicesQuery }]
    });
  };

  useEffect(() => {
    if (tmpUsers && tmpActions) {
      const { deviceUsers } = tmpUsers;
      const { actions } = tmpActions;
      setUsers(deviceUsers);
      setActions(actions);
    }
  }, [tmpUsers, tmpActions]);

  useEffect(() => {
    console.log(users, dicesData, actions);
    if (users.length > 0 && dicesData.length > 0 && actions.length > 0) {
      const newDiceArr = [];
      dicesData.map((item) => {
        const { _id, name, did, userId, actionIds, coverImg, createdAt } = item;
        const actionItems = [];
        let owner = {};
        users.map((user) => {
          if (userId === user._id) owner = user;
        });
        actionIds.map((aId) => {
          actions.map((action) => {
            if (aId === action._id) actionItems.push(action);
          });
        });

        const row = {
          _id,
          name,
          did,
          coverImg,
          owner,
          actionItems,
          createdAt
        };

        newDiceArr.push(row);
      });

      setDices(newDiceArr);
    }
  }, [users, actions, dicesData]);
  return (
    <Page title="Dice">
      <Container maxWidth="xl">
        <HeaderBreadcrumbs
          heading="Dices"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Dices' }]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.diceCreate}
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              Add dice
            </Button>
          }
        />
        {isLoading ? (
          <ReactLoading className="loading-icons" type={'spin'} color={'grey'} height={30} width={30} />
        ) : (
          <>
            {dices.length > 0 ? (
              <Grid container spacing={3}>
                {dices.map((dice, index) => (
                  <DiceCard key={dice._id} dice={dice} index={index} onDelete={(id) => deleteDice(id)} />
                ))}
              </Grid>
            ) : (
              <TableContainer>
                <Table>
                  <TableBody>
                    <TableNoData isNotFound />
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </>
        )}
      </Container>
    </Page>
  );
}
