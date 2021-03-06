import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';

import { List, ListItem, Divider, ListItemText, ListItemAvatar, Avatar } from '@mui/material';

import DeviceWatchDetailDialog from './DeviceWatchDetailDialog';
import Label from '../../../components/Label';

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

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'device',
    numeric: false,
    disablePadding: true,
    label: 'MAC address'
  },
  {
    id: 'dice',
    numeric: false,
    disablePadding: false,
    label: 'Dice'
  },
  {
    id: 'createdAt',
    numeric: false,
    disablePadding: false,
    label: 'Created At'
  },
  {
    id: 'elapsedTime',
    numeric: true,
    disablePadding: false,
    label: 'Elasped Time'
  }
];

function WatchTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">No</TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

WatchTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
};

const WatchTableToolbar = (props) => {
  const { numSelected, count } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity)
        })
      }}
    >
      {numSelected > 0 ? (
        <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1" component="div">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
          Rolls List ({count})
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

WatchTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired
};

export default function DeviceWatchList({ watchList }) {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('elapsedTime');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // watch detail
  const [showDetail, setShowDetail] = React.useState(false);
  const [data, setData] = React.useState({});

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = watchList.map((n) => n.elapsedTime);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (elapsedTime) => selected.indexOf(elapsedTime) !== -1;

  // Avoid a layout jump when reaching the last page with empty watchList.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - watchList.length) : 0;

  return (
    <Box sx={{ width: '100%' }}>
      <DeviceWatchDetailDialog isOpen={showDetail} data={data} device onCloseDialog={() => setShowDetail(false)} />
      <Paper sx={{ width: '100%', mb: 2 }}>
        <WatchTableToolbar numSelected={selected.length} count={watchList.length} />
        <TableContainer>
          <Table sx={{ minWidth: 500 }} aria-labelledby="tableTitle" size={dense ? 'small' : 'medium'}>
            <WatchTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={watchList.length}
            />
            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 watchList.slice().sort(getComparator(order, orderBy)) */}
              {stableSort(watchList, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.elapsedTime);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return [
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row._id}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox" rowSpan={2}>
                        {index + 1}
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row" padding="none">
                        {row.device}
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: '900'}}>[ {row.dice} ]</TableCell>
                      <TableCell align="right">{row.createdAt}</TableCell>
                      <TableCell align="right">
                        <Label
                          variant="ghost"
                          color={
                            (row.elapsedTime > 59 && 'error') ||
                            (row.elapsedTime > 10 && 'warning') ||
                            (row.elapsedTime > 5 && 'primary') ||
                            'success'
                          }
                        >
                          {row.elapsedTime < 1
                            ? 'Just now'
                            : row.elapsedTime >= 1 && row.elapsedTime < 59
                            ? row.elapsedTime + ' minutes ago'
                            : 'long time ago'}
                        </Label>
                      </TableCell>
                    </TableRow>,
                    <TableRow key={`sub-${row._id}`} hover>
                      <TableCell colSpan={5} sx={{ padding: 0 }}>
                        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', padding: 0 }}>
                          {row.results.map((item, i) => (
                            <Box key={i}>
                              <ListItem alignItems="flex-start" sx={{ padding: 0 }}>
                                <ListItemAvatar>
                                  <Avatar alt="Remy Sharp" src={item.coverImg} />
                                </ListItemAvatar>
                                <ListItemText
                                  primary={item.name}
                                  secondary={
                                    <React.Fragment>
                                      <Typography
                                        sx={{ display: 'inline' }}
                                        component="span"
                                        variant="subtitle1"
                                        color="text.primary"
                                      >
                                        {item.result}
                                      </Typography>
                                      {` = ${item.calculation} ??? [${item.equation}]`}
                                    </React.Fragment>
                                  }
                                />
                              </ListItem>
                              <Divider variant="inset" component="li" />
                            </Box>
                          ))}
                        </List>
                      </TableCell>
                    </TableRow>
                  ];
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows
                  }}
                >
                  <TableCell>Hello world</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={watchList.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel control={<Switch checked={dense} onChange={handleChangeDense} />} label="Dense padding" />
    </Box>
  );
}
