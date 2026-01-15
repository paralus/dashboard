import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@material-ui/core";
import DataTableFooter from "./DataTableFooter";
import DataTableRowCollapsible from "./DataTableRowCollapsible";
// import DataTableBody from "./DataTableBody";

const DataTableHead = ({ columnData }) => {
  return (
    <TableHead>
      <TableRow>
        <TableCell />
        {columnData.map(
          (column, index) => (
            <TableCell
              key={index}
              id={column.id}
              // padding={column.disablePadding ? "none" : "default"}
              style={{ textAlign: column.label === "Actions" ? "right" : "" }}
            >
              {column.label}
            </TableCell>
          ),
          this,
        )}
      </TableRow>
    </TableHead>
  );
};

const DataTableBody = ({
  data,
  parseRowData,
  columnLabels,
  getCollapsedRow,
}) => {
  return (
    <TableBody>
      {data.map((n, index) => (
        <DataTableRowCollapsible
          key={index}
          rowIndex={index}
          data={n}
          parseRowData={parseRowData}
          getCollapsedRow={getCollapsedRow}
          colSpan={columnLabels.length + 1}
        />
      ))}
    </TableBody>
  );
};

const DataTableDynamicCollapsible = ({
  columnLabels,
  list,
  count,
  parseRowData,
  getCollapsedRow,
  handleGetRows,
  refresh,
}) => {
  const [page, setPage] = useState(0);
  const [offset, setOffset] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect((_) => {
    handleGetRows(rowsPerPage, offset);
  }, []);

  useEffect(
    (_) => {
      if (refresh > 0) handleGetRows(rowsPerPage, offset);
    },
    [refresh],
  );

  const handleChangePage = (event, page) => {
    const offset = Math.abs(page * rowsPerPage);
    setPage(page);
    setOffset(offset);
    handleGetRows(rowsPerPage, offset);
  };
  const handleChangeRowsPerPage = (event) => {
    setOffset(0);
    setRowsPerPage(event.target.value);
    setPage(0);
    const rowsPerPage = event.target.value;
    handleGetRows(rowsPerPage, 0);
  };
  // const handleChangeRowsPerPage = event => {
  //   setRowsPerPage(event.target.value);
  //   setPage(0);
  // };
  // let data = [];
  // if (list) {
  //   if (list.length > rowsPerPage) {
  //     const startIndex = rowsPerPage * page;
  //     const endIndex = startIndex + rowsPerPage;
  //     data = list.slice(startIndex, endIndex);
  //   } else {
  //     data = list;
  //   }
  // }
  return (
    <div className="flex-auto">
      <div className="table-responsive-material">
        <Table size="small">
          <DataTableHead columnData={columnLabels} />
          <DataTableBody
            data={list}
            parseRowData={parseRowData}
            getCollapsedRow={getCollapsedRow}
            columnLabels={columnLabels}
          />
          <DataTableFooter
            count={count}
            rowsPerPage={rowsPerPage}
            page={page}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Table>
      </div>
    </div>
  );
};

export default DataTableDynamicCollapsible;
