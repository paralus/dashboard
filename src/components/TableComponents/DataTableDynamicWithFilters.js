// TODO: Merge with DataTableDynamic
import React, { useState, useEffect, useRef } from "react";
import { Table } from "@material-ui/core";
import DataTableFooter from "./DataTableFooter";
import DataTableHead from "./DataTableHead";
import DataTableBody from "./DataTableBody";

const DataTableDynamicWithFilters = ({
  columnLabels,
  list,
  count,
  parseRowData,
  handleGetRows,
  refresh,
  getCollapsedRow,
  autoRefresh,
  autoRefreshInterval = 2000,
  disableTableResponsive = false,
  filters = [],
}) => {
  const [page, setPage] = useState(0);
  const [offset, setOffset] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterParams, setFilterParams] = useState([...filters]);
  const taskPoller = useRef(null);
  const timeoutRef = useRef(null);

  useEffect((_) => {
    handleGetRows(rowsPerPage, offset, ...filterParams);
    return () => {
      clearInterval(taskPoller.current);
    };
  }, []);

  useEffect(
    (_) => {
      if (refresh > 0) handleGetRows(rowsPerPage, offset, ...filterParams);
    },
    [refresh]
  );

  const resetList = (rowsPerPage, offset, ...filters) => {
    handleGetRows(rowsPerPage, offset, ...filters);
    if (autoRefresh) {
      clearInterval(taskPoller.current);
      taskPoller.current = setInterval(
        () => handleGetRows(rowsPerPage, offset, ...filters),
        autoRefreshInterval
      );
    }
  };

  useEffect(
    (_) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout((_) => {
        setFilterParams(filters);
        setOffset(0);
        setPage(0);
        resetList(rowsPerPage, 0, ...filters);
      }, 500);
    },
    [...filters]
  );

  useEffect(
    (_) => {
      if (autoRefresh && !taskPoller.current) {
        taskPoller.current = setInterval(
          () => handleGetRows(rowsPerPage, offset, ...filterParams),
          autoRefreshInterval
        );
      }
      if (!autoRefresh) {
        clearInterval(taskPoller.current);
      }
    },
    [autoRefresh]
  );

  const handleChangePage = (event, page) => {
    const offset = Math.abs(page * rowsPerPage);
    setPage(page);
    setOffset(offset);
    resetList(rowsPerPage, offset, ...filterParams);
  };

  const handleChangeRowsPerPage = (event) => {
    setOffset(0);
    setRowsPerPage(event.target.value);
    setPage(0);
    const rowsPerPage = event.target.value;
    resetList(rowsPerPage, 0, ...filterParams);
  };

  return (
    <div className="flex-auto">
      <div
        className={disableTableResponsive ? "" : "table-responsive-material"}
      >
        <Table size="small">
          <DataTableHead columnData={columnLabels} />
          <DataTableBody
            data={list}
            parseRowData={parseRowData}
            columnLabels={columnLabels}
            getCollapsedRow={getCollapsedRow}
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

export default DataTableDynamicWithFilters;
