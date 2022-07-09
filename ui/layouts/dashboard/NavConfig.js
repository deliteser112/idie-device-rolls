import React from 'react';
// component
import Iconify from '../../components/Iconify';

import { PATH_DASHBOARD } from '../../routes/paths';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  {
    subheader: 'DASHBOARD',
    items: [
      {
        title: 'dashboard',
        path: `${PATH_DASHBOARD.analytics}`,
        icon: getIcon('eva:pie-chart-2-fill'),
      },
      {
        title: 'documents',
        path: `${PATH_DASHBOARD.documents}`,
        icon: getIcon('gala:file-doc'),
      },
      {
        title: 'devices',
        path: `${PATH_DASHBOARD.devices}`,
        icon: getIcon('ic:twotone-on-device-training'),
      },
      {
        title: 'dices',
        path: `${PATH_DASHBOARD.dices}`,
        icon: getIcon('ion:dice-outline'),
      },
      {
        title: 'watch',
        path: `${PATH_DASHBOARD.watchList}`,
        path: '/dashboard/watch',
        icon: getIcon('la:eye'),
      }
    ],
  },
  {
    subheader: 'Admin',
    items: [
      {
        title: 'users',
        path: `${PATH_DASHBOARD.users}`,
        icon: getIcon('gis:globe-users'),
      },
      {
        title: 'user settings',
        path: `${PATH_DASHBOARD.userSettings}`,
        icon: getIcon('fluent:people-settings-28-regular'),
      },
      {
        title: 'actions',
        path: `${PATH_DASHBOARD.actions}`,
        icon: getIcon('carbon:touch-interaction'),
      },
      {
        title: 'rolls',
        path: `${PATH_DASHBOARD.rolls}`,
        icon: getIcon('fa6-solid:dice'),
      }
    ],
  },
];

export default navConfig;
