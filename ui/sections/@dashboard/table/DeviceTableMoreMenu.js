import React, { useEffect, useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@mui/material';
// component
import Iconify from '../../../components/Iconify';

import ConfirmDialog from '../../../components/ConfirmDialog';
import DeviceWatchDialog from '../../../pages/dashboard/device/DeviceWatchDialog';

// ----------------------------------------------------------------------

export default function DeviceTableMoreMenu({ loggedUser, owner, followers, onDelete, editLink, macAddr }) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deviceDialogOpen, setDeviceDialogOpen] = useState(false);

  const [isFollower, setFollower] = useState(false);

  useEffect(() => {
    if(loggedUser) {
      let isFollower = false;
      followers.map(item => {
        if (item._id === loggedUser._id) isFollower = true;
      })
      if(loggedUser._id === owner._id || isFollower || loggedUser.profile.role === 'admin') setFollower(true);
    }
  }, [loggedUser, followers, owner, isOpen])

  const handleDelete = () => {
    setDialogOpen(true)
  }

  const handleAgree = (isAgree) => {
    setDialogOpen(false);
    setIsOpen(false);
    if(isAgree) onDelete();
  }

  const handleDeviceDialogOpen = () => {
    setDeviceDialogOpen(true);
    setIsOpen(false);
  }

  return (
    <>
      <ConfirmDialog onAgree={handleAgree} isOpen={dialogOpen} title="iDie | Confirm" content="Are you sure to delete this item?" />
      <DeviceWatchDialog isOpen={deviceDialogOpen} macAddr={macAddr} onCloseDialog={() => setDeviceDialogOpen(false)} />
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Iconify icon="eva:more-vertical-fill" width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' },
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {isFollower && 
          <MenuItem sx={{ color: 'text.secondary' }} onClick={handleDeviceDialogOpen} >
            <ListItemIcon>
              <Iconify icon="eva:layers-outline" width={24} height={24} />
            </ListItemIcon>
            <ListItemText primary="History" primaryTypographyProps={{ variant: 'body2' }} />
          </MenuItem>
        }
        <MenuItem sx={{ color: 'text.secondary' }} onClick={handleDelete}>
          <ListItemIcon>
            <Iconify icon="eva:trash-2-outline" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Delete" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>

        <MenuItem component={RouterLink} to={editLink} sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Iconify icon="eva:edit-fill" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Edit" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
      </Menu>
    </>
  );
}
