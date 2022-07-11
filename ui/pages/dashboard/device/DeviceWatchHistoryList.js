import * as React from 'react';
import { withStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import Label from '../../../components/Label';

const TableCellStyles = withStyles({
  root: {
    borderBottom: '1px solid rgb(181 206 219)'
  }
})(TableCell);
function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.device}
        </TableCell>
        <TableCell align="right" sx={{ fontWeight: 'bold' }}>[ {row.dice} ]</TableCell>
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
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                History
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Dice Name</TableCell>
                    <TableCell>Calculation</TableCell>
                    <TableCell>Action</TableCell>
                    <TableCell align="right">Result</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.results.map((historyRow, i) => (
                    <TableRow key={i}>
                      <TableCellStyles component="th" scope="row">
                        {historyRow.name}
                      </TableCellStyles>
                      <TableCellStyles>{historyRow.calculation}</TableCellStyles>
                      <TableCellStyles>{historyRow.equation}</TableCellStyles>
                      <TableCellStyles align="right" sx={{ fontWeight: 900, color: 'green' }}>{historyRow.result}</TableCellStyles>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    createdAt: PropTypes.string.isRequired,
    device: PropTypes.string.isRequired,
    dice: PropTypes.string.isRequired,
    elapsedTime: PropTypes.number.isRequired,
    results: PropTypes.arrayOf(
      PropTypes.shape({
        calculation: PropTypes.string.isRequired,
        equation: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        result: PropTypes.string.isRequired
      })
    ).isRequired
  }).isRequired
};

DeviceWatchHistoryList.propTypes = {
  watchList: PropTypes.array
}

export default function DeviceWatchHistoryList({ watchList }) {
  return (
    <TableContainer component={Paper} sx={{ maxHeight: 480 }}>
      <Table stickyHeader aria-label="sticky collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>MAC Address</TableCell>
            <TableCell align="right">Dice</TableCell>
            <TableCell align="right">CreatedAt</TableCell>
            <TableCell align="right">Elasped Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {watchList.length > 0 ? (
            <>
              {watchList.map((row, index) => (
                <Row key={index} row={row} />
              ))}
            </>
          ) : (
            <TableRow>
              <TableCell colSpan={5} align="center">There is no history</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
