import * as Yup from 'yup';
import PropTypes from 'prop-types';
import React from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';

// meteor apollo graphql
import { useMutation } from '@apollo/react-hooks';

// material
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, TextField } from '@mui/material';

// routes
import { PATH_DASHBOARD } from '../../../routes/paths';

// mutations
import { addAction as addActionMutation, updateAction as updateActionMutation } from '../../../_mutations/Actions.gql';
// queries
import { actions as actionsQuery } from '../../../_queries/Actions.gql';
// ----------------------------------------------------------------------

ActionNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentAction: PropTypes.object
};

export default function ActionNewForm({ isEdit, currentAction }) {
  console.log('currentAction:', currentAction);
  const [addAction] = useMutation(addActionMutation);
  const [updateAction] = useMutation(updateActionMutation);

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const NewSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    action: Yup.string().required('Action is required'),
    equation: Yup.string().required('Equation is required')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: currentAction?.name || '',
      action: currentAction?.action || '',
      equation: currentAction?.equation || ''
    },
    validationSchema: NewSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const { action, equation, name } = values;

        const mutation = isEdit ? updateAction : addAction;
        const actionToAddOrUpdate = {
          name,
          action,
          equation
        };

        if (isEdit) {
          actionToAddOrUpdate._id = currentAction._id;
        }

        console.log('actionToAddOrUpdate', actionToAddOrUpdate);
        mutation({
          variables: {
            ...actionToAddOrUpdate
          },
          refetchQueries: [{ query: actionsQuery }]
        }).then((action) => {
          console.log(action);
          const isAdded = action.data.addAction || action.data.updateAction;
          if (isAdded) {
            enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!', { variant: 'success' });
            navigate(PATH_DASHBOARD.actions);
          } else {
            enqueueSnackbar('Sorry, the action should be unique!', { variant: 'error' });
          }
        });
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        setErrors(error);
      }
    }
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Action Name"
                    {...getFieldProps('name')}
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                  />
                  <TextField
                    fullWidth
                    label="Action"
                    {...getFieldProps('action')}
                    error={Boolean(touched.action && errors.action)}
                    helperText={touched.action && errors.action}
                  />
                </Stack>

                <Grid item xs={12} sm={6} md={9}>
                  <TextField
                    fullWidth
                    label="Equation"
                    {...getFieldProps('equation')}
                    error={Boolean(touched.equation && errors.equation)}
                    helperText={touched.equation && errors.equation}
                  />
                </Grid>

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {!isEdit ? 'Create Action' : 'Save Changes'}
                  </LoadingButton>
                </Box>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
