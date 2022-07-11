import { Roles } from 'meteor/alanning:roles';

// meteor apollo graphql
import { useMutation } from '@apollo/react-hooks';

import * as Yup from 'yup';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Grid,
  Stack,
  Autocomplete,
  Checkbox,
  TextField,
  Avatar,
  ToggleButton,
  IconButton
} from '@mui/material';

import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

// routes
import { PATH_DASHBOARD } from '../../../routes/paths';

// mutations
import { addDevice as addDeviceMutation, updateDevice as updateDeviceMutation } from '../../../_mutations/Devices.gql';

// queries
import { devices as devicesQuery } from '../../../_queries/Devices.gql';

// utils
import stringAvatar from '../../../utils/stringAvatar';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
// ----------------------------------------------------------------------

DeviceNewForm.propTypes = {
  isEdit: PropTypes.bool,
  loggedUser: PropTypes.object,
  currentDevice: PropTypes.object,
  userList: PropTypes.array
};

export default function DeviceNewForm({ isEdit, loggedUser, currentDevice, userList }) {
  const [addDevice] = useMutation(addDeviceMutation);
  const [updateDevice] = useMutation(updateDeviceMutation);

  const [allUsers, setAllUsers] = useState([]);
  const [defaultOwner, setDefalutOwner] = useState({});
  const [followers, setFollowers] = useState([]);
  const [isAdmin, setAdmin] = useState(false);
  const [isOwner, setOwner] = useState(false);
  const [isFollowed, setFollowed] = useState(false);

  const [selected, setSelected] = useState(false);

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const NewSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    mac: Yup.string().required('MAC is required')
  });

  useEffect(() => {
    if (userList) {
      const users = [];
      userList.map((item) => {
        users.push({ ...item });
      });
      setAllUsers([...users]);
    }
  }, [userList]);

  useEffect(() => {
    if (loggedUser && Roles.userIsInRole(loggedUser._id, 'admin')) {
      setAdmin(true);
    }

    if (currentDevice && isEdit && userList.length > 0) {
      const { followerIds, ownerId } = currentDevice;
      const tmpFollowers = [];
      followerIds.map((fId) => {
        userList.map((item) => {
          if (fId === item._id) {
            tmpFollowers.push({ ...item });
          }
        });
      });

      userList.map((item) => {
        if (ownerId === item._id) {
          setDefalutOwner({ ...item });
        }
      });

      setFollowers([...tmpFollowers]);
    }

    if (loggedUser && !isEdit) {
      const { _id, emails, profile } = loggedUser;
      const currentUser = {
        _id,
        email: emails[0].address,
        name: profile.name
      };
      setDefalutOwner(currentUser);
    }

    if (loggedUser && currentDevice && isEdit) {
      const { _id } = loggedUser;
      const { ownerId, followerIds } = currentDevice;

      setFollowed(followerIds.includes(_id));
      setOwner(isEdit && (ownerId === _id || Roles.userIsInRole(_id, 'admin')));
    } else {
      setOwner(true);
    }
  }, [loggedUser, isEdit, currentDevice, userList]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: currentDevice?.name || '',
      mac: currentDevice?.mac || ''
    },
    validationSchema: NewSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const { mac, name } = values;
        const ownerId = defaultOwner._id;
        const followerIds = [];
        followers.map((item) => {
          followerIds.push(item._id);
        });

        const mutation = isEdit ? updateDevice : addDevice;
        const deviceToAddOrUpdate = {
          mac,
          name,
          ownerId,
          followerIds
        };

        if (isEdit) {
          deviceToAddOrUpdate._id = currentDevice._id;
        }

        mutation({
          variables: {
            ...deviceToAddOrUpdate
          },
          refetchQueries: [{ query: devicesQuery }]
        }).then((device) => {
          const isAdded = device.data.addDevice || device.data.updateDevice;
          if (isAdded) {
            enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!', { variant: 'success' });
            navigate(PATH_DASHBOARD.devices);
          } else {
            enqueueSnackbar('Sorry, the device should be unique!', { variant: 'error' });
          }
        });
      } catch (error) {
        console.error(error);
      }
    }
  });

  const handleOwner = (user) => {
    setDefalutOwner(user);
  };

  const handleFollowers = (users) => {
    setFollowers(users);
  };

  const handleSetFollower = () => {
    setSelected(!selected);
    const { _id, emails, profile } = loggedUser;
    let isAdded = false;
    const currentUser = {
      _id,
      email: emails[0].address,
      name: profile.name
    };

    if (!selected) {
      followers.map((item) => {
        if (item._id === _id) isAdded = true;
      });
      if (!isAdded) setFollowers([...followers, currentUser]);
    } else {
      let tmpFollowers = [];
      followers.map((item) => {
        if (item._id !== _id) tmpFollowers.push(item);
      });
      setFollowers(tmpFollowers);
    }
  };

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={{ p: 3 }}>
              <Box sx={{ marginBottom: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <ToggleButton
                  value="check"
                  disabled={isOwner || isFollowed}
                  sx={{ borderRadius: '50%' }}
                  selected={selected}
                  onChange={handleSetFollower}
                >
                  {selected ? <FavoriteIcon color="danger" /> : <FavoriteBorderIcon />}
                </ToggleButton>
              </Box>
              <Stack spacing={3}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    disabled={!isOwner}
                    label="Device Name"
                    {...getFieldProps('name')}
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                  />
                  <TextField
                    fullWidth
                    disabled={!isOwner}
                    label="Device MAC"
                    {...getFieldProps('mac')}
                    error={Boolean(touched.mac && errors.mac)}
                    helperText={touched.mac && errors.mac}
                  />
                </Stack>

                <Grid item xs={12} sm={6} md={9}>
                  {defaultOwner.email && (
                    <Autocomplete
                      disabled={!isOwner}
                      readOnly={!isAdmin}
                      sx={{ width: '100% !important' }}
                      id="checkboxes-tags-demo"
                      options={[...allUsers]}
                      value={defaultOwner}
                      onChange={(event, user) => handleOwner(user)}
                      getOptionLabel={(option) => option.email}
                      isOptionEqualToValue={(option, value) => option._id === value._id}
                      renderOption={(props, option, { selected }) => (
                        <li {...props}>
                          <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={selected}
                          />
                          <Avatar
                            {...stringAvatar(`${option.name.first} ${option.name.last}`)}
                            style={{ marginRight: 8 }}
                          />
                          {option.name.first} {option.name.last}
                        </li>
                      )}
                      style={{ width: 500 }}
                      renderInput={(params) => <TextField {...params} label="Owner" placeholder="Choose owner" />}
                    />
                  )}
                </Grid>
                <Grid item xs={12} sm={6} md={9}>
                  <Autocomplete
                    disabled={!isOwner}
                    sx={{ width: '100% !important' }}
                    multiple
                    limitTags={3}
                    id="checkboxes-tags-demo"
                    value={[...followers]}
                    options={[...allUsers]}
                    disableCloseOnSelect
                    getOptionLabel={(option) => option.email}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    onChange={(event, users) => handleFollowers(users)}
                    renderOption={(props, option, { selected }) => (
                      <li {...props}>
                        <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
                        <Avatar
                          {...stringAvatar(`${option.name.first} ${option.name.last}`)}
                          style={{ marginRight: 8 }}
                        />
                        {option.name.first} {option.name.last}
                      </li>
                    )}
                    style={{ width: 500 }}
                    renderInput={(params) => (
                      <TextField {...params} label="Followers" placeholder="Choose following users" />
                    )}
                  />
                </Grid>

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    loading={isSubmitting}
                    disabled={!isOwner && !selected}
                  >
                    {!isEdit ? 'Create Device' : selected ? 'Submit Request' : 'Save Changes'}
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
