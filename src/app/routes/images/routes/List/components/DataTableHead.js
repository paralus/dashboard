import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from "@material-ui/core";
// import PropTypes from 'prop-types';

const columnData = [
  { id: "name", numeric: false, disablePadding: false, label: "Name" },
  { id: "tags", numeric: false, disablePadding: false, label: "Tags" },
  // { id: 'created_at', numeric: false, disablePadding: false, label: 'Created At' },
  // { id: 'modified_at', numeric: false, disablePadding: false, label: 'Modified At' },
  // { id: 'options', numeric: true, disablePadding: false, label: 'Actions' }
];

export default class DataTableHead extends React.Component {
  // static propTypes = {
  //     numSelected: PropTypes.number.isRequired,
  //     onRequestSort: PropTypes.func.isRequired,
  //     order: PropTypes.string.isRequired,
  //     orderBy: PropTypes.string.isRequired,
  //     rowCount: PropTypes.number.isRequired,
  // };

  createSortHandler = (property) => (event) => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount } =
      this.props;

    return (
      <TableHead>
        <TableRow>
          {columnData.map(
            (column) => (
              <TableCell
                key={column.id}
                id={column.id}
                numeric={column.numeric}
                padding={column.disablePadding ? "none" : "default"}
              >
                <TableSortLabel
                  active={orderBy === column.id}
                  direction={order}
                  onClick={this.createSortHandler(column.id)}
                >
                  {column.label}
                </TableSortLabel>
              </TableCell>
            ),
            this,
          )}
        </TableRow>
      </TableHead>
    );
  }
}
