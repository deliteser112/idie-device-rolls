import React, { useState } from 'react';
import { filter } from 'lodash';
// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  AvatarGroup,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Typography,
  TableContainer,
  TablePagination,
  Tooltip
} from '@mui/material';
// components
import Scrollbar from '../../../components/Scrollbar';
import SearchNotFound from '../../../components/SearchNotFound';
import { TableListHead, TableListToolbar, DeviceTableMoreMenu } from '../../../sections/@dashboard/table';

// routes
import { PATH_DASHBOARD } from '../../../routes/paths';

// utils
import stringAvatar from '../../../utils/stringAvatar';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'mac', label: 'MAC', alignRight: false },
  { id: 'owner', label: 'Owner', alignRight: false },
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'followers', label: 'Followers', alignRight: false },
  { id: '' }
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function DeviceList({ loggedUser, deviceList, onDelete }) {
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = deviceList.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - deviceList.length) : 0;

  const filteredItems = applySortFilter(deviceList, getComparator(order, orderBy), filterName);

  const isItemNotFound = filteredItems.length === 0;

  return (
    <Card>
      <TableListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />
      <Scrollbar>
        <TableContainer sx={{ minWidth: 800 }}>
          <Table>
            <TableListHead
              order={order}
              orderBy={orderBy}
              headLabel={TABLE_HEAD}
              rowCount={deviceList.length}
              numSelected={selected.length}
              onRequestSort={handleRequestSort}
              onSelectAllClick={handleSelectAllClick}
            />
            <TableBody>
              {filteredItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                const { _id, name, mac, owner, followers } = row;
                const isItemSelected = selected.indexOf(name) !== -1;

                return (
                  <TableRow
                    hover
                    key={_id}
                    tabIndex={-1}
                    role="checkbox"
                    selected={isItemSelected}
                    aria-checked={isItemSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, name)} />
                    </TableCell>
                    <TableCell align="left">{mac}</TableCell>
                    <TableCell component="th" scope="row" padding="none">
                      {owner.name && (
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Avatar {...stringAvatar(`${owner.name.first} ${owner.name.last}`)} />
                          <Typography variant="subtitle2" noWrap>
                            {`${owner.name.first} ${owner.name.last}`}
                          </Typography>
                        </Stack>
                      )}
                    </TableCell>
                    <TableCell align="left">{name}</TableCell>
                    <TableCell align="left">
                      {followers.length > 0 ? (
                        <AvatarGroup max={4} sx={{ justifyContent: 'flex-end' }}>
                          {followers.map((item, index) => (
                            <Tooltip key={index} title={`${item.name.first} ${item.name.last}`} placement="top">
                              <Avatar {...stringAvatar(`${item.name.first} ${item.name.last}`)} />
                            </Tooltip>
                          ))}
                        </AvatarGroup>
                      ) : (
                        'No followers'
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <DeviceTableMoreMenu loggedUser={loggedUser} owner={owner} followers={followers} onDelete={() => onDelete(_id)} editLink={`${PATH_DASHBOARD.devices}/${_id}/edit`} macAddr={mac} />
                    </TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>

            {isItemNotFound && (
              <TableBody>
                <TableRow>
                  <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                    <SearchNotFound searchQuery={filterName} />
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>
        </TableContainer>
      </Scrollbar>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={deviceList.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Card>
  );
}
