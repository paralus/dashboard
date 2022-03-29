import React, { useState, useEffect, useRef } from "react";
import { Table } from "@material-ui/core";
import RafayNoData from "components/RafayNoData";
import Spinner from "components/Spinner";
import DataTableFooter from "./DataTableFooter";
import DataTableHead from "./DataTableHead";
import DataTableBody from "./DataTableBody";

const DataTableDynamic = ({
  columnLabels,
  list,
  count,
  parseRowData,
  handleGetRows,
  loading = false,
  refresh,
  getCollapsedRow,
  autoRefresh,
  autoRefreshInterval = 2000,
  disableTableResponsive = false,
  order,
  orderBy,
  onRequestSort,
  rowCount,
  customRowsPerPage,
  customPage,
  customHandleChangePage,
  customHandleChangeRowsPerPage,
  isSortEnabled = false,
}) => {
  const [page, setPage] = useState(0);
  const [offset, setOffset] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const taskPoller = useRef(null);

  useEffect((_) => {
    handleGetRows(rowsPerPage, offset);
    return () => {
      clearInterval(taskPoller.current);
    };
  }, []);

  useEffect(
    (_) => {
      if (refresh > 0) handleGetRows(rowsPerPage, offset);
    },
    [refresh]
  );

  useEffect(
    (_) => {
      if (autoRefresh && !taskPoller.current) {
        taskPoller.current = setInterval(
          () => handleGetRows(rowsPerPage, offset),
          autoRefreshInterval
        );
      }
      if (!autoRefresh) {
        clearInterval(taskPoller.current);
      }
    },
    [autoRefresh]
  );

  const resetList = (rowsPerPage, offset) => {
    handleGetRows(rowsPerPage, offset);
    if (autoRefresh) {
      clearInterval(taskPoller.current);
      taskPoller.current = setInterval(
        () => handleGetRows(rowsPerPage, offset),
        autoRefreshInterval
      );
    }
  };

  const handleChangePage = (event, page) => {
    const offset = Math.abs(page * rowsPerPage);
    setPage(page);
    setOffset(offset);
    resetList(rowsPerPage, offset);
  };

  const handleChangeRowsPerPage = (event) => {
    setOffset(0);
    setRowsPerPage(event.target.value);
    setPage(0);
    const rowsPerPage = event.target.value;
    resetList(rowsPerPage, 0);
  };

  return (
    <Spinner hideChildren addHeight loading={loading}>
      {list?.length ? (
        <div className="flex-auto">
          <div
            className={
              disableTableResponsive ? "" : "table-responsive-material"
            }
          >
            <Table size="small">
              <DataTableHead
                columnData={columnLabels}
                order={order}
                orderBy={orderBy}
                onRequestSort={onRequestSort}
                rowCount={rowCount}
                columnLabels={columnLabels}
                isSortEnabled={isSortEnabled}
              />
              <DataTableBody
                data={list}
                parseRowData={parseRowData}
                columnLabels={columnLabels}
                getCollapsedRow={getCollapsedRow}
              />
              <DataTableFooter
                count={count}
                rowsPerPage={customRowsPerPage || rowsPerPage}
                page={customPage || page}
                handleChangePage={customHandleChangePage || handleChangePage}
                handleChangeRowsPerPage={
                  customHandleChangeRowsPerPage || handleChangeRowsPerPage
                }
              />
            </Table>
          </div>
        </div>
      ) : (
        <RafayNoData />
      )}
    </Spinner>
  );
};

export default DataTableDynamic;
