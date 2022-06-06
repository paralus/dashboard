import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  IconButton,
  Button,
} from "@material-ui/core";

const DataTableFooter = ({
  count,
  rowsPerPage,
  page,
  handleChangePage,
  handleChangeRowsPerPage,
  rowsPerPageOptions,
  showLowCount = false,
}) => {
  if (!showLowCount) {
    if (count <= 10) return null;
  }
  return (
    <TableFooter>
      <TableRow>
        <TablePagination
          count={count}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={rowsPerPageOptions || [10, 25, 50]}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </TableRow>
    </TableFooter>
  );
};

export default DataTableFooter;
